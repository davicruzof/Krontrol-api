import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Empresa extends BaseModel {
  static get table () {
    return 'ml_ctr_empresa'
  }

  @column()
  public id_empresa: number

  @column()
  public nomeempresarial: string

  @column()
  public cnpj: string

  @column()
  public logradouro: string

  @column()
  public numero: string

  @column()
  public complemento: string

  @column()
  public cep: string

  @column()
  public bairro: string

  @column()
  public municipio: string

  @column()
  public uf: string

  @column()
  public email: string

  @column()
  public telefone: string

  @column()
  public situacaocadastral: string

  @column()
  public dt_situacaocadastral: Date

  @column()
  public contato: string

  @column()
  public id_grupo: number

  @column()
  public id_usuario: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public dt_cadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
