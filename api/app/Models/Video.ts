import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Video extends BaseModel {
  
  static get table () {
    return 'ml_md_video'
  }

  @column({ isPrimary: true })
  public id_video: number

  @column()
  public id_empresa: number

  @column()
  public link : string

  @column()
  public descricao: string

  @column()
  public dt_expiracao : Date

  @column()
  public titulo: string

  @column.dateTime({ autoCreate: true })
  public dt_criacao: DateTime

}
