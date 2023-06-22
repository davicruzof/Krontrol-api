import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

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
  public justificativa: string;

  @column()
  public dt_resposta: string;

  @column()
  public id_status_leitura: number;

  @column()
  public respondido_por: number;

  @column()
  public url_documento: string;
}
