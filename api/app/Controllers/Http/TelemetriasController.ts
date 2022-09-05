
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import { schema } from '@ioc:Adonis/Core/Validator';

const listSchema =  schema.create({
    data_inicial: schema.date(),
    data_final: schema.date()
});
export default class TelemetriasController {

    public async list({response,request,auth}:HttpContextContract)
    {
        await request.validate({schema: listSchema});
        let dados = request.body();
        dados.data_final+= " 23:59:59";
        const query = await Database.from('ml_int_telemetria_kontrow_trips')
                            .join('ml_int_telemetria_kontrow_assets', 'ml_int_telemetria_kontrow_trips.asset_id' , '=' ,'ml_int_telemetria_kontrow_assets.asset_id')
                            .join('ml_int_telemetria_kontrow_drivers','ml_int_telemetria_kontrow_drivers.driver_id','=','ml_int_telemetria_kontrow_trips.drive_id')
                            .join('ml_man_frota','ml_int_telemetria_kontrow_assets.id_veiculo','=','ml_man_frota.id_erp')
                            .select(Database.raw(`
                                ml_int_telemetria_kontrow_trips.id_viagem,
                                ml_int_telemetria_kontrow_drivers.worker_id,
                                ml_int_telemetria_kontrow_drivers.driver_name,
                                ml_int_telemetria_kontrow_trips.fuel_used,
                                ml_int_telemetria_kontrow_assets.description,
                                ml_man_frota.placa,
                                ml_man_frota.prefixo,
                                ml_man_frota.media_consumo as media_consumo_veiculo,
                                (ml_int_telemetria_kontrow_trips.total_mileage / ml_int_telemetria_kontrow_trips.fuel_used) as media_consumo_viagem
                            `)).where(Database.raw(`ml_int_telemetria_kontrow_trips.fuel_used != 0 `))
                            .where('ml_int_telemetria_kontrow_trips.date','>=',dados.data_inicial)
                            .where('ml_int_telemetria_kontrow_trips.date','<=',dados.data_final)
                            .where('ml_int_telemetria_kontrow_drivers.worker_id','=',`${auth.user?.id_funcionario}`)
                            .orderBy('media_consumo_viagem','desc');
        response.json(query);
    }

    public async list_events({response,request,auth}:HttpContextContract)
    {
        await request.validate({schema: schema.create({ data : schema.date() })});
        let dados = request.body();
        const query = await Database.from('ml_int_telemetria_evento_grupo_associa')
                            .join('ml_int_telemetria_evento_grupo','ml_int_telemetria_evento_grupo_associa.id_telemetria_grupo','=','ml_int_telemetria_evento_grupo.id_grupo')
                            .join('ml_int_telemetria_kontrow_evento','ml_int_telemetria_evento_grupo_associa.id_telemetria_evento','=','ml_int_telemetria_kontrow_evento.id_evento')
                            .join('ml_int_telemetria_kontrow_trips','ml_int_telemetria_evento_grupo_associa.id_telemetria_trip','=','ml_int_telemetria_kontrow_trips.id_viagem')
                            .join('ml_int_telemetria_kontrow_assets','ml_int_telemetria_kontrow_trips.asset_id','=','ml_int_telemetria_kontrow_assets.asset_id')
                            .join('ml_man_frota','ml_int_telemetria_kontrow_assets.id_veiculo','=','ml_man_frota.id_veiculo')
                            .select(Database.raw(`
                            ml_int_telemetria_evento_grupo_associa.id_empresa,
                            ml_int_telemetria_evento_grupo_associa.id_empresa_grupo,
                            ml_int_telemetria_evento_grupo_associa.dt_cadastro,
                            ml_int_telemetria_evento_grupo_associa.dt_alteracao,
                            ml_int_telemetria_evento_grupo_associa.id_status,
                            ml_int_telemetria_kontrow_evento.evento,
                            ml_int_telemetria_kontrow_evento.id_evento,
                            ml_int_telemetria_evento_grupo.grupo,
                            ml_int_telemetria_evento_grupo.id_grupo,
                            ml_man_frota.placa,
                            ml_man_frota.prefixo
                            `))
                            .where('ml_int_telemetria_kontrow_trips.worker_id','=',`${auth.user?.id_funcionario}`)
                            .where('ml_int_telemetria_kontrow_trips.date','=',`${dados.data}`);

        response.json(query);
    }
}
