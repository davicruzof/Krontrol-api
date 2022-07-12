import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  static get table () {
    return 'ml_usu_usuario'
  }
  @column({ isPrimary: true })
  public id_usuario: number

  @column()
  public id_empresa: number

  @column()
  public id_funcionario: number

  @column()
  public senha: string

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({autoUpdate: true })
  public dt_inativo: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public id_status: number

  @column()
  public id_grupo: number

  @column()
  public rememberMeToken?: string

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.senha) {
      user.senha = await Hash.make(user.senha)
    }
  }
}
