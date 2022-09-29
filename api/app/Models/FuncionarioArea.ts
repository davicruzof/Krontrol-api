import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class FuncionarioArea extends BaseModel {
  static get table () {
    return 'ml_ctr_funcionario_area'
  }
  @column({ isPrimary: true })
  public id_funcionario_area: number

  @column()
  public id_funcionario: number

  @column()
  public id_empresa: number

  @column()
  public id_area: number

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public dt_atualizacao: DateTime
}
