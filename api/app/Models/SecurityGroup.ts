import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SecurityGroup extends BaseModel {
  static get table () {
    return 'ml_perm_grupo'
  }
  @column({ isPrimary: true })
  public id_grupo: number

  @column()
  public nome: string

  @column.dateTime({ autoCreate: true })
  public dt_criacao: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public dt_atualizacao: DateTime
}
