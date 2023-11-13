import { column, BaseModel } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class AppVersion extends BaseModel {
  static get table() {
    return "ml_app_version";
  }
  @column({ isPrimary: true })
  public id: number;

  @column()
  public id_funcionario: number;

  @column()
  public app_version: string;

  @column()
  public so: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoUpdate: true })
  public updated_at: DateTime;

  @column()
  public id_empresa: number;
}
