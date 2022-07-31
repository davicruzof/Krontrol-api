import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Situacao extends BaseModel {
  static get table () {
    return 'ml_fol_funcionario_situacao'
  }

  @column({ isPrimary: true })
  public id_situacao: number

  @column()
  public situacao : string

  @column.dateTime({ serializeAs: null , autoCreate: true })
  public dt_cadastro: DateTime
}
