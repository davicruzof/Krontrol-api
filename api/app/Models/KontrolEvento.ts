import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class KontrolEvento extends BaseModel {
  static get table () {
    return 'ml_int_telemetria_kontrow_evento'
  }
  @column({ isPrimary: true })
  public id_evento: number

  @column()
  public id_empresa_grupo: number

  @column()
  public id_empresa: number
  
  @column()
  public id_evento_kontrow: number

  @column()
  public evento: string

  @column()
  public id_funcionario_cadastro: number

  @column()
  public id_funcionario_alteracao: number

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public dt_alteracao: DateTime
}
