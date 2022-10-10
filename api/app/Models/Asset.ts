import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Asset extends BaseModel {
  static get table () {
    return 'ml_int_telemetria_kontrow_assets'
  }
  @column({ isPrimary: true })
  public id_ativos: number

  @column()
  public asset_id: number
  
  @column()
  public id_empresa_grupo: number

  @column()
  public id_empresa: number

  @column()
  public id_veiculo: number

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column()
  public id_funcionario_cadastro: number

  @column.dateTime({ autoUpdate: true  })
  public dt_alteracao: DateTime

  @column()
  public id_funcionario_alteracao: number

  @column()
  public ativo: boolean

  @column()
  public manufacturer_descr: string

  @column()
  public description: string

  @column()
  public id_grupo: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
