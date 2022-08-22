import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TelemetriasController {

    public async list({response}:HttpContextContract)
    {
        const query = await Database.from('ml_int_telemetria_kontrow_trips')
                            .join('ml_int_telemetria_kontrow_assets', 'ml_int_telemetria_kontrow_trips.asset_id' , '=' ,'ml_int_telemetria_kontrow_assets.asset_id')
                            .join('ml_int_telemetria_kontrow_drivers','ml_int_telemetria_kontrow_drivers.driver_id','=','ml_int_telemetria_kontrow_trips.drive_id')
                            .join('ml_man_frota','ml_int_telemetria_kontrow_assets.id_veiculo','=','ml_man_frota.id_erp')
                            .select('ml_int_telemetria_kontrow_trips.id_viagem')
                            .select('ml_int_telemetria_kontrow_drivers.worker_id')
                            .select('ml_int_telemetria_kontrow_drivers.driver_name')
                            .select('ml_int_telemetria_kontrow_trips.fuel_used')
                            .select('ml_int_telemetria_kontrow_assets.description')
                            .select('ml_man_frota.placa')
                            .select('ml_man_frota.media_consumo')
                            .select('')
                            .orderBy('fuel_used')
                            .limit(10);
        response.json(query);
    }
}
