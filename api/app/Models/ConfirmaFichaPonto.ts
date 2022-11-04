import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ConfirmaFichaPonto extends BaseModel {

  static get table () {
    return 'ml_usu_confirma_ficha_ponto'
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public id_funcionario: number

  @column()
  public id_funcionario_erp: number

  @column()
  public confirma: string

  @column.dateTime()
  public dt_referencia: DateTime

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

}
