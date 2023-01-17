import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ConfirmarVideo extends BaseModel {

  static get table () {
    return 'ml_video_confirmed'
  }


  @column({ isPrimary: true })
  public id_video_confirmed: number

  @column()
  public id_funcionario : number

  @column()
  public foto: string

  @column()
  public data_pdf : Date

  @column.dateTime({ autoCreate: true })
  public data_cadastro: DateTime

}
