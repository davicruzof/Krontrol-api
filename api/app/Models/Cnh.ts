import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Cnh extends BaseModel {

  static get table () {
    return 'ml_fol_funcionario_cnh'
  }

  @column({ isPrimary: true })
  public id_cnh: number

  @column()
  public categoria : string

  @column.dateTime({ serializeAs: null, autoCreate: true })
  public dt_cadastro: DateTime

}
