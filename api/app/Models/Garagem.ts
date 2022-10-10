import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Garagem extends BaseModel {

  static get table () {
    return 'ml_ctr_empresa_garagem'
  }

  @column({ isPrimary: true })
  public id_garagem: number

  @column()
  public id_empresa: number

  @column()
  public id_grupo: number

  @column()
  public garagem: string

  @column({ serializeAs : null})
  public id_usuario_cadastro: number

  @column({ serializeAs : null})
  public id_usuario_alteracao: number

  @column.dateTime({ serializeAs : null, autoCreate: true, autoUpdate: true })
  public dt_alteracao: DateTime
}
