import { DateTime } from 'luxon'
import { BaseModel, BelongsTo,belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Garagem from './Garagem'

export default class Veiculo extends BaseModel {
  static get table () {
    return 'ml_man_frota'
  }
  @column({ isPrimary: true })
  public id_veiculo: number

  @column()
  public id_grupo: number

  @column()
  public id_empresa: number

  @column()
  public id_garagem: number

  @column()
  public id_erp: number

  @column()
  public prefixo: string

  @column()
  public placa: string

  @column()
  public ano_fabricacao: Date

  @column()
  public ano_modelo: Date

  @column()
  public media_consumo: number

  @column()
  public id_status: number

  @column()
  public id_destinacao: number

  @column()
  public chassi : string

  @column()
  public modelo : string

  @column()
  public foto : string

  @column.dateTime({ autoUpdate: true})
  public dt_alteracao : DateTime
  
  @column()
  public id_funcionario_alteracao : number

  @column.dateTime({autoCreate: true})
  public dt_cadastro : DateTime

  @column()
  public id_funcionario_cadastro : number

  @belongsTo(() => Garagem ,{ foreignKey : 'id_garagem'})
  public garagem : BelongsTo <typeof Garagem> 
}
