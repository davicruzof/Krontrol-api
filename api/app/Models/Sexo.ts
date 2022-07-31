import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Sexo extends BaseModel {

  static get table () {
    return 'ml_fol_funcionario_sexo'
  }

  @column({ isPrimary: true })
  public id_sexo: number

  @column()
  public sexo : string

  @column.dateTime({ serializeAs : null, autoCreate: true })
  public dt_cadastro: DateTime


}
