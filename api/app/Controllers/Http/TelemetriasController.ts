import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TelemetriasController {

    public async list({response,request,auth}:HttpContextContract)
    {
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
                                ml_man_frota.media_consumo as media_consumo_veiculo,
                                (ml_int_telemetria_kontrow_trips.total_mileage / ml_int_telemetria_kontrow_trips.fuel_used) as media_consumo_viagem
                            `)).where(Database.raw(`ml_int_telemetria_kontrow_trips.fuel_used != 0 `))
                            .where('ml_int_telemetria_kontrow_trips.date','>=',dados.data_inicial)
                            .where('ml_int_telemetria_kontrow_trips.date','<=',dados.data_final)
                            .where('ml_int_telemetria_kontrow_drivers.worker_id','=',`${auth.user?.id_funcionario}`)
                            .orderBy('media_consumo_viagem','desc');
        response.json(query);
    }
}
