import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Informativo extends BaseModel {

  static get table () {
    return 'ml_sac_informativo_visualizacao'
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public empresa_id : number

  @column()
  public funcionario_id : number

  @column()
    public informativo_id : number

  @column()
  public funcionario_cadastro_id : number

  @column()
  public funcionario_alteracao_id : number

  @column()
  public status_id : number

  @column()
   public dt_leitura : any
  
  @column()
  public dt_cadastro: Date
  
  @column()
  public dt_alteracao: Date
}
