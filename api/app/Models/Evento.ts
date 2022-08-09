/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Evento extends BaseModel {

  static get table () {
    return 'ml_int_telemetria_evento';
  }
  @column({ isPrimary: true })
  public id_evento: number

  @column()
  public id_evento_telemetria : number

  @column()
  public evento : string

  @column()
  public id_empresa_telemetria : number

  @column()
  public id_funcionario_cadastro: number

  @column ()
  public id_funcionario_alteracao:number
  
  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public dt_alteracao: DateTime

  @column()
  public id_status : number
}
