import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { schema } from "@ioc:Adonis/Core/Validator";

const listSchema = schema.create({
  data_inicial: schema.date(),
  data_final: schema.date(),
});
export default class TelemetriasController {
  public async list({ response, request, auth }: HttpContextContract) {
    await request.validate({ schema: listSchema });
    let dados = request.body();
    dados.data_final += " 23:59:59";
    const query = await Database.from("ml_int_telemetria_kontrow_trips")
      .join(
        "ml_int_telemetria_kontrow_assets",
        "ml_int_telemetria_kontrow_trips.asset_id",
        "=",
        "ml_int_telemetria_kontrow_assets.asset_id"
      )
      .join(
        "ml_int_telemetria_kontrow_drivers",
        "ml_int_telemetria_kontrow_drivers.driver_id",
        "=",
        "ml_int_telemetria_kontrow_trips.drive_id"
      )
      .join(
        "ml_man_frota",
        "ml_int_telemetria_kontrow_assets.id_veiculo",
        "=",
        "ml_man_frota.id_erp"
      )
      .select(
        Database.raw(`
                                ml_int_telemetria_kontrow_trips.id_viagem,
                                ml_int_telemetria_kontrow_drivers.worker_id,
                                ml_int_telemetria_kontrow_drivers.driver_name,
                                ml_int_telemetria_kontrow_trips.fuel_used,
                                ml_int_telemetria_kontrow_assets.description,
                                ml_man_frota.placa,
                                ml_man_frota.prefixo,
                                ml_man_frota.media_consumo as media_consumo_veiculo,
                                (ml_int_telemetria_kontrow_trips.total_mileage / ml_int_telemetria_kontrow_trips.fuel_used) as media_consumo_viagem
                            `)
      )
      .where(Database.raw(`ml_int_telemetria_kontrow_trips.fuel_used != 0 `))
      .where("ml_int_telemetria_kontrow_trips.date", ">=", dados.data_inicial)
      .where("ml_int_telemetria_kontrow_trips.date", "<=", dados.data_final)
      .where(
        "ml_int_telemetria_kontrow_drivers.worker_id",
        "=",
        `${auth.user?.id_funcionario}`
      )
      .orderBy("media_consumo_viagem", "desc");
    response.json(query);
  }

  public async list_events({ response, request, auth }: HttpContextContract) {
    await request.validate({ schema: schema.create({ data: schema.date() }) });
    let dados = request.body();
    dados.data += " 00:00:00";

    let query = await Database.from("ml_int_telemetria_evento_grupo_associa")
      .join(
        "ml_int_telemetria_evento_grupo",
        "ml_int_telemetria_evento_grupo_associa.id_telemetria_grupo",
        "=",
        "ml_int_telemetria_evento_grupo.id_grupo"
      )
      .join(
        "ml_int_telemetria_kontrow_evento",
        "ml_int_telemetria_evento_grupo_associa.id_telemetria_evento",
        "=",
        "ml_int_telemetria_kontrow_evento.id_evento"
      )
      .join(
        "ml_int_telemetria_kontrow_trips",
        "ml_int_telemetria_evento_grupo_associa.id_telemetria_trip",
        "=",
        "ml_int_telemetria_kontrow_trips.id_viagem"
      )
      .join(
        "ml_int_telemetria_kontrow_drivers",
        "ml_int_telemetria_kontrow_drivers.driver_id",
        "=",
        "ml_int_telemetria_kontrow_trips.drive_id"
      )
      .select(
        Database.raw(`
                                distinct ml_int_telemetria_evento_grupo.id_grupo,
                                ml_int_telemetria_evento_grupo.grupo
                            `)
      )
      .where(
        "ml_int_telemetria_kontrow_drivers.worker_id",
        "=",
        `${auth.user?.id_funcionario}`
      )
      .where("ml_int_telemetria_kontrow_trips.date", ">=", `${dados.data}`);

    await Promise.all(
      query.map(async (element) => {
        element["events"] = [];
        const event = await this.get_events(
          auth.user?.id_funcionario,
          element.id_grupo,
          dados.data
        ).then(function (data) {
          return data;
        });
        element.events = event;
      })
    );

    response.json(query);
  }

  public async get_events(user_id, id_grupo, data) {
    let events = await Database.from("ml_int_telemetria_evento_grupo_associa")
      .join(
        "ml_int_telemetria_evento_grupo",
        "ml_int_telemetria_evento_grupo_associa.id_telemetria_grupo",
        "=",
        "ml_int_telemetria_evento_grupo.id_grupo"
      )
      .join(
        "ml_int_telemetria_kontrow_evento",
        "ml_int_telemetria_evento_grupo_associa.id_telemetria_evento",
        "=",
        "ml_int_telemetria_kontrow_evento.id_evento"
      )
      .join(
        "ml_int_telemetria_kontrow_trips",
        "ml_int_telemetria_evento_grupo_associa.id_telemetria_trip",
        "=",
        "ml_int_telemetria_kontrow_trips.id_viagem"
      )
      .join(
        "ml_int_telemetria_kontrow_drivers",
        "ml_int_telemetria_kontrow_drivers.driver_id",
        "=",
        "ml_int_telemetria_kontrow_trips.drive_id"
      )
      .select(
        Database.raw(`
                        ml_int_telemetria_kontrow_evento.id_evento,
                        ml_int_telemetria_kontrow_evento.evento
                    `)
      )
      .where("ml_int_telemetria_kontrow_drivers.worker_id", "=", `${user_id}`)
      .where("ml_int_telemetria_evento_grupo.id_grupo", "=", `${id_grupo}`)
      .where("ml_int_telemetria_kontrow_trips.date", ">=", `${data}`);

    return events;
  }
}
