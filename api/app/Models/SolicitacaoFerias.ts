import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class SolicitacaoFerias extends BaseModel {
  static get table() {
    return "ml_fol_parametro";
  }

  @column({ isPrimary: true })
  public id: number;

  @column()
  public id_empresa: number;

  @column()
  public dt_inicio_pedido: Date;

  @column()
  public dt_fim_pedido: Date;

  @column()
  public dt_inicio_gozo: Date;

  @column()
  public dt_fim_gozo: Date;

  @column()
  public id_funcionario_cadastro: number;

  @column()
  public id_funcionario_alteracao: number;

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime;

  @column.dateTime({ autoUpdate: true })
  public dt_alteracao: DateTime;
}
