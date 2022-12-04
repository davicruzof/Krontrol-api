import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SecurityGroupUser extends BaseModel {
  static get table () {
    return 'ml_usu_usuario_grupo'
  }
  @column({ isPrimary: true })
  public id_usuario_grupo: number

  @column()
  public id_grupo: number

  @column()
  public id_empresa: number

  @column()
  public id_usuario: number

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public dt_atualizacao: DateTime
}
