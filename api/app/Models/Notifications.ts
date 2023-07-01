import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Notifications extends BaseModel {
  static get table() {
    return "ml_notifications";
  }

  @column({ isPrimary: true })
  public id: number;

  @column()
  public id_funcionario: number;

  @column()
  public message: string;

  @column()
  public read: boolean;

  @column()
  public type: number;

  @column()
  public created_at: string;
}
