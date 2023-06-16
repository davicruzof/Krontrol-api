import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { String } from "aws-sdk/clients/batch";

export default class SolicitacaoResposta extends BaseModel {
  static get table() {
    return "ml_sac_solicitacao_resposta";
  }

  @column({ isPrimary: true })
  public id: number;

  @column()
  public id_solicitacao: number;

  @column()
  public id_funcionario_resposta: number;

  @column()
  public justificativa: String;

  @column()
  public dt_resposta: String;

  @column()
  public id_status_leitura: number;

  @column()
  public respondido_por: number;

  @column()
  public url_documento: string;
}
