import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ConfirmarPdf extends BaseModel {

  static get table () {
    return 'ml_pdf_confirmed'
  }


  @column({ isPrimary: true })
  public id_pdf_confirmed: number

  @column()
  public id_funcionario : number

  @column()
  public foto: string

  @column()
  public data_pdf : string

  @column.dateTime({ autoCreate: true })
  public data_cadastro: DateTime

}
