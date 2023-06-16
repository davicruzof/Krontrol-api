import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Trip extends BaseModel {
  static get table() {
    return "ml_int_telemetria_kontrow_trips";
  }
  @column({ isPrimary: true })
  public id_viagem: number;

  @column()
  public id: number;

  @column()
  public worker_id: number;

  @column()
  public driver_name: string;

  @column()
  public asset_id: number;

  @column()
  public engine_hours: number;

  @column()
  public date: DateTime;

  @column()
  public end_drive: DateTime;

  @column()
  public mileage: number;

  @column()
  public drive_duration: DateTime;

  @column()
  public total_mileage: number;

  @column()
  public fuel_used: number;

  @column()
  public start_latitude: number;

  @column()
  public start_longitude: number;

  @column()
  public end_latitude: number;

  @column()
  public end_longitude: number;

  @column()
  public log_gps_processed: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public id_grupo: number;

  @column()
  public id_empresa: number;

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime;

  @column()
  public id_funcionario_cadastro: number;
}
