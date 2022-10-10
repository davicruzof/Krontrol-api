import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Funcao extends BaseModel {

  static get table () {
    return 'ml_fol_funcionario_funcao'
  }

  @column({ isPrimary: true })
  public id_funcao: number

  @column()
  public id_empresa_grupo : number

  @column()
  public id_empresa : number

  @column()
  public funcao : string

  @column({ serializeAs : null})
  public id_funcionario_cadastro : number

  @column({ serializeAs : null})
  public id_funcionario_alteracao : number

  @column()
  public id_funcao_erp : number

  @column.dateTime({ serializeAs : null, autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({ serializeAs : null, autoCreate: true, autoUpdate: true })
  public dt_alteracao: DateTime
}
