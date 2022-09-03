
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class GrupoEvento extends BaseModel {

  static get table () {
    return 'ml_int_telemetria_evento_grupo_associa'
  }

  @column({ isPrimary: true })
  public id_associacao: number

  @column()
  public id_empresa_grupo : number

  @column()
  public id_empresa : number

  @column()
  public id_telemetria_grupo: number

  @column()
  public id_telemetria_evento: number

  @column()
  public id_funcionario_cadastro: number

  @column()
  public id_funcionario_alteracao: number

  @column()
  public id_status : number

  @column()
  public id_telemetria_trip : number

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public dt_alteracao: DateTime
}
