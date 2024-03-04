import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class MotivoSolicitacao extends BaseModel {
  static get table() {
    return "ml_ctr_programa_area_modulo_motivo";
  }

  @column({ isPrimary: true })
  public id: number;

  @column()
  public motivo: string;

  @column()
  public modulo_id: number;

  @column()
  public empresa_id: number;

  @column()
  public informar_data: boolean;
}
