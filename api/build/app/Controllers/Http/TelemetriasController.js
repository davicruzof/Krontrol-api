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
                let dados = await Database_1.default.connection('pg').rawQuery(`
          select distinct  
          count(evento) qtd_evento, evento
          from vw_ml_bi_kontrow_score sco
          where
            to_char(sco.time,'YYYY-MM-DD') between '${data_inicial}' AND '${data_final}'
            and sco.registro='${funcionario?.registro}'
            and sco.id_empresa_grupo = 2
          group by  evento 
        `);
                let km_rodados = await Database_1.default.connection('pg').rawQuery(`
          select distinct  
          avg(cast(km_rodado as numeric)) km_rodado
          from vw_ml_bi_kontrow_score sco
          where
            to_char(sco.time,'YYYY-MM-DD') between '${data_inicial}' AND '${data_final}'
            and sco.registro='${funcionario?.registro}'
            and sco.id_empresa_grupo = 2
          group by  sco.registro 
        `);
                let score = await Database_1.default.connection('pg').rawQuery(`
          select distinct  
          count(evento) total
          from vw_ml_bi_kontrow_score sco
          where
          to_char(sco.time,'YYYY-MM-DD') between '${data_inicial}' AND '${data_final}'
            and sco.registro='${funcionario?.registro}'
            and sco.id_empresa_grupo = 2
          group by  sco.registro 
        `);
                let total_eventos = await Database_1.default.connection('pg').rawQuery(`
        select distinct count(evento) score,
          (select count(*) from ml_int_telemetria_evento_score where id_empresa_grupo = 2 ) total_evento
          from 
            vw_ml_bi_kontrow_score sco
          where 
            sco.registro='${funcionario?.registro}' and
            to_char(sco.time,'YYYY-MM-DD') between '${data_inicial}' AND '${data_final}'
            and sco.id_empresa_grupo = 2
          group by evento
      `);
                response.json({
                    funcionario: {
                        registro: funcionario?.registro
                    },
                    events: dados.rows,
                    score: score.rows[0],
                    distance: km_rodados.rows[0],
                    total: {
                        total_evento: total_eventos.rows[0].total_evento
                    }
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