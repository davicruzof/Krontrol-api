"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const functions_1 = global[Symbol.for('ioc.use')]("App/utils/functions");
const Funcionario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcionario"));
const formato_data = "YYYY-MM-DD";
const listSchema = Validator_1.schema.create({
    data_inicial: Validator_1.schema.date(),
    data_final: Validator_1.schema.date(),
});
class TelemetriasController {
    async list({ response, request, auth }) {
        await request.validate({ schema: listSchema });
        let dados = request.body();
        dados.data_final += " 23:59:59";
        const query = await Database_1.default.from("ml_int_telemetria_kontrow_trips")
            .join("ml_int_telemetria_kontrow_assets", "ml_int_telemetria_kontrow_trips.asset_id", "=", "ml_int_telemetria_kontrow_assets.asset_id")
            .join("ml_int_telemetria_kontrow_drivers", "ml_int_telemetria_kontrow_drivers.driver_id", "=", "ml_int_telemetria_kontrow_trips.drive_id")
            .join("ml_man_frota", "ml_int_telemetria_kontrow_assets.id_veiculo", "=", "ml_man_frota.id_erp")
            .select(Database_1.default.raw(`
                                ml_int_telemetria_kontrow_trips.id_viagem,
                                ml_int_telemetria_kontrow_drivers.worker_id,
                                ml_int_telemetria_kontrow_drivers.driver_name,
                                ml_int_telemetria_kontrow_trips.fuel_used,
                                ml_int_telemetria_kontrow_assets.description,
                                ml_man_frota.placa,
                                ml_man_frota.prefixo,
                                ml_man_frota.media_consumo as media_consumo_veiculo,
                                (ml_int_telemetria_kontrow_trips.total_mileage / ml_int_telemetria_kontrow_trips.fuel_used) as media_consumo_viagem
                            `))
            .where(Database_1.default.raw(`ml_int_telemetria_kontrow_trips.fuel_used != 0 `))
            .where("ml_int_telemetria_kontrow_trips.date", ">=", dados.data_inicial)
            .where("ml_int_telemetria_kontrow_trips.date", "<=", dados.data_final)
            .where("ml_int_telemetria_kontrow_drivers.worker_id", "=", `${auth.user?.id_funcionario}`)
            .orderBy("media_consumo_viagem", "desc");
        response.json(query);
    }
    async list_events({ response, request, auth }) {
        await request.validate({ schema: Validator_1.schema.create({ data: Validator_1.schema.date() }) });
        let dados = request.body();
        dados.data += " 00:00:00";
        let query = await Database_1.default.from("ml_int_telemetria_evento_grupo_associa")
            .join("ml_int_telemetria_evento_grupo", "ml_int_telemetria_evento_grupo_associa.id_telemetria_grupo", "=", "ml_int_telemetria_evento_grupo.id_grupo")
            .join("ml_int_telemetria_kontrow_evento", "ml_int_telemetria_evento_grupo_associa.id_telemetria_evento", "=", "ml_int_telemetria_kontrow_evento.id_evento")
            .join("ml_int_telemetria_kontrow_trips", "ml_int_telemetria_evento_grupo_associa.id_telemetria_trip", "=", "ml_int_telemetria_kontrow_trips.id_viagem")
            .join("ml_int_telemetria_kontrow_drivers", "ml_int_telemetria_kontrow_drivers.driver_id", "=", "ml_int_telemetria_kontrow_trips.drive_id")
            .select(Database_1.default.raw(`
                                distinct ml_int_telemetria_evento_grupo.id_grupo,
                                ml_int_telemetria_evento_grupo.grupo
                            `))
            .where("ml_int_telemetria_kontrow_drivers.worker_id", "=", `${auth.user?.id_funcionario}`)
            .where("ml_int_telemetria_kontrow_trips.date", ">=", `${dados.data}`);
        await Promise.all(query.map(async (element) => {
            element["events"] = [];
            const event = await this.get_events(auth.user?.id_funcionario, element.id_grupo, dados.data).then(function (data) {
                return data;
            });
            element.events = event;
        }));
        response.json(query);
    }
    async get_events(user_id, id_grupo, data) {
        let events = await Database_1.default.from("ml_int_telemetria_evento_grupo_associa")
            .join("ml_int_telemetria_evento_grupo", "ml_int_telemetria_evento_grupo_associa.id_telemetria_grupo", "=", "ml_int_telemetria_evento_grupo.id_grupo")
            .join("ml_int_telemetria_kontrow_evento", "ml_int_telemetria_evento_grupo_associa.id_telemetria_evento", "=", "ml_int_telemetria_kontrow_evento.id_evento")
            .join("ml_int_telemetria_kontrow_trips", "ml_int_telemetria_evento_grupo_associa.id_telemetria_trip", "=", "ml_int_telemetria_kontrow_trips.id_viagem")
            .join("ml_int_telemetria_kontrow_drivers", "ml_int_telemetria_kontrow_drivers.driver_id", "=", "ml_int_telemetria_kontrow_trips.drive_id")
            .select(Database_1.default.raw(`
                        ml_int_telemetria_kontrow_evento.id_evento,
                        ml_int_telemetria_kontrow_evento.evento
                    `))
            .where("ml_int_telemetria_kontrow_drivers.worker_id", "=", `${user_id}`)
            .where("ml_int_telemetria_evento_grupo.id_grupo", "=", `${id_grupo}`)
            .where("ml_int_telemetria_kontrow_trips.date", ">=", `${data}`);
        return events;
    }
    async score({ request, response, auth }) {
        try {
            const queryParams = request.qs();
            if ((0, functions_1.isValidDate)(queryParams.data_inicial) && (0, functions_1.isValidDate)(queryParams.data_final)) {
                let funcionario = await Funcionario_1.default.findBy('id_funcionario', auth.user?.id_funcionario);
                const data_inicial = queryParams.data_inicial;
                const data_final = queryParams.data_final;
                let abs = await Database_1.default.connection('pg').rawQuery(`
          SELECT COUNT(events_trip.*) as sum_abs
          FROM ml_int_telemetria_trips trips
          INNER JOIN ml_int_telemetria_subtrips subtrips ON (subtrips.trip_id = trips.drive_id)
          INNER JOIN ml_int_telemetria_events_trip events_trip ON (events_trip.asset_id::int = trips.asset_id)
          WHERE events_trip.event_type_id = 32
          AND subtrips.worker_id = ${funcionario?.id_funcionario_erp}
          and TO_CHAR(trips.date,'YYYY-MM-DD') >= '${data_inicial}' AND TO_CHAR(trips.date,'YYYY-MM-DD') <= '${data_final}'
        `);
                let acceleration = await Database_1.default.connection('pg').rawQuery(`
          SELECT COUNT(events_trip.*) as sum_acceleration
          FROM ml_int_telemetria_trips trips
          INNER JOIN ml_int_telemetria_subtrips subtrips ON (subtrips.trip_id = trips.drive_id)
          INNER JOIN ml_int_telemetria_events_trip events_trip ON (events_trip.asset_id::int = trips.asset_id)
          WHERE events_trip.event_type_id = 21
          AND subtrips.worker_id = ${funcionario?.id_funcionario_erp}
          and TO_CHAR(trips.date,'YYYY-MM-DD') >= '${data_inicial}' AND TO_CHAR(trips.date,'YYYY-MM-DD') <= '${data_final}'
        `);
                let braking = await Database_1.default.connection('pg').rawQuery(`
          SELECT COUNT(events_trip.*) as sum_braking
          FROM ml_int_telemetria_trips trips
          INNER JOIN ml_int_telemetria_subtrips subtrips ON (subtrips.trip_id = trips.drive_id)
          INNER JOIN ml_int_telemetria_events_trip events_trip ON (events_trip.asset_id::int = trips.asset_id)
          WHERE events_trip.event_type_id = 22
          AND subtrips.worker_id = ${funcionario?.id_funcionario_erp}
          and TO_CHAR(trips.date,'YYYY-MM-DD') >= '${data_inicial}' AND TO_CHAR(trips.date,'YYYY-MM-DD') <= '${data_final}'
        `);
                let sharp_turn = await Database_1.default.connection('pg').rawQuery(`
        SELECT COUNT(events_trip.*) as sum_sharp_turn
          FROM ml_int_telemetria_trips trips
          INNER JOIN ml_int_telemetria_subtrips subtrips ON (subtrips.trip_id = trips.drive_id)
          INNER JOIN ml_int_telemetria_events_trip events_trip ON (events_trip.asset_id::int = trips.asset_id)
          WHERE events_trip.event_type_id IN (54,55)
          AND subtrips.worker_id = ${funcionario?.id_funcionario_erp}
          and TO_CHAR(trips.date,'YYYY-MM-DD') >= '${data_inicial}' AND TO_CHAR(trips.date,'YYYY-MM-DD') <= '${data_final}'
        `);
                let speed_up = await Database_1.default.connection('pg').rawQuery(`
        SELECT COUNT(events_trip.*) as sum_speed_up
          FROM ml_int_telemetria_trips trips
          INNER JOIN ml_int_telemetria_subtrips subtrips ON (subtrips.trip_id = trips.drive_id)
          INNER JOIN ml_int_telemetria_events_trip events_trip ON (events_trip.asset_id::int = trips.asset_id)
          WHERE events_trip.event_type_id IN (5,10)
          AND subtrips.worker_id = ${funcionario?.id_funcionario_erp}
          and TO_CHAR(trips.date,'YYYY-MM-DD') >= '${data_inicial}' AND TO_CHAR(trips.date,'YYYY-MM-DD') <= '${data_final}'
        `);
                let distance_sum = await Database_1.default.connection('pg').rawQuery(`
        SELECT COUNT(events_trip.*) as sum_speed_up,subtrips.driver_name, subtrips.worker_id, trips.line_name, SUM(trips.total_mileage::numeric) as distance
          FROM ml_int_telemetria_trips trips
          INNER JOIN ml_int_telemetria_subtrips subtrips ON (subtrips.trip_id = trips.drive_id)
          INNER JOIN ml_int_telemetria_events_trip events_trip ON (events_trip.asset_id::int = trips.asset_id)
          WHERE events_trip.event_type_id IN (63,44)
          AND subtrips.worker_id = ${funcionario?.id_funcionario_erp}
          and TO_CHAR(trips.date,'YYYY-MM-DD') >= '${data_inicial}' AND TO_CHAR(trips.date,'YYYY-MM-DD') <= '${data_final}'
          GROUP BY subtrips.driver_name,subtrips.worker_id,trips.line_name
        `);
                const { sum_abs } = abs.rows[0];
                const { sum_acceleration } = acceleration.rows[0];
                const { sum_braking } = braking.rows[0];
                const { sum_sharp_turn } = sharp_turn.rows[0];
                const { sum_speed_up } = speed_up.rows[0];
                let driver_name;
                let line_name;
                let distance;
                let worker_id;
                if (distance_sum.rows[0]) {
                    ({ driver_name } = distance_sum.rows[0]);
                    ({ line_name } = distance_sum.rows[0]);
                    ({ distance } = distance_sum.rows[0]);
                    ({ worker_id } = distance_sum.rows[0]);
                }
                const total_score = sum_abs + sum_acceleration + sum_braking + sum_sharp_turn + sum_speed_up;
                response.json({
                    total_score: total_score,
                    distance: distance,
                    abs: sum_abs,
                    acceleration: sum_acceleration,
                    braking: sum_braking,
                    sharp_turn: sum_sharp_turn,
                    speed_up: sum_speed_up,
                    driver_name: driver_name,
                    worker_id: worker_id,
                    line_name: line_name,
                    mkbe: distance / total_score
                });
            }
            else {
                response.badRequest({ error: "Período não informado ou data inválida." });
            }
        }
        catch (error) {
            console.log(error);
            response.badRequest({ error: 'Erro interno' });
        }
    }
    async consultarDadosTelemetria(campos, idEvents, data_inicial, data_final) {
        let retorno = await Database_1.default.connection('pg').rawQuery(`
      SELECT COUNT(events_trip.*) as total
        FROM ml_int_telemetria_trips trips
        INNER JOIN ml_int_telemetria_subtrips subtrips ON (subtrips.trip_id = trips.drive_id)
        INNER JOIN ml_int_telemetria_events_trip events_trip ON (events_trip.trip_id = trips.id_trip)
        WHERE events_trip.event_type_id IN (${idEvents})
        and TO_CHAR(trips.date,'YYYY-MM-DD') >= '${data_inicial}' AND TO_CHAR(trips.date,'YYYY-MM-DD') <= '${data_final}'
    `);
        return retorno;
    }
}
exports.default = TelemetriasController;
//# sourceMappingURL=TelemetriasController.js.map