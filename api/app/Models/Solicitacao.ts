import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Solicitacao extends BaseModel {
  static get table () {
    return 'ml_sac_solicitacao'
  }

  @column({ isPrimary: true })
  public id_solicitacao: number

  @column()
  public id_empresa_grupo: number

  @column()
  public id_empresa: number

  @column()
  public id_funcionario: number

  @column()
  public id_evento: number

  @column()
  public id_area: number

  @column()
  public id_modulo: number

  @column()
  public id_programa: number

  @column()
  public justificativa: string

  @column()
  public status: string

  @column()
  public id_parecer: number

  @column()
  public parecer: string

  @column.dateTime({})
  public dt_analise: DateTime

  @column()
  public id_funcionario_analise: number

  @column.dateTime()
  public dt_finalizada: DateTime

  @column()
  public id_funcionario_finalizada: number

  @column()
  public id_avaliacao: number

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({autoUpdate: true, autoCreate : true})
  public dt_atualizacao : DateTime

}
