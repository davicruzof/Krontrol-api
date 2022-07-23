import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Funcionario extends BaseModel {
  static get table () {
    return 'ml_fol_funcionario'
  }
  @column({ isPrimary: true })
  public id_funcionario: number

  @column()
  public id_grupo: number

  @column()
  public id_empresa: number

  @column()
  public nome: string

  @column()
  public registro: string

  @column()
  public id_funcionario_erp: number

  @column()
  public id_funcao: number

  @column()
  public id_cnh: number

  @column()
  public cpf: string

  @column()
  public celular: string

  @column()
  public email: number

  @column()
  public rfid: string

  @column()
  public dt_admissao: Date

  @column()
  public dt_demissao: Date

  @column()
  public cnh_emissao: number

  @column()
  public cnh_validade: Date

  @column()
  public id_funcionario_alteracao: number

  @column.dateTime({autoUpdate: true})
  public dt_alteracao: DateTime
  
  @column()
  public dt_nascimento: Date

  @column()
  public id_sexo: number

  @column()
  public pis: string

}
