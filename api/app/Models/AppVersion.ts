import { column, BaseModel } from "@ioc:Adonis/Lucid/Orm";

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
}
