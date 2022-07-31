import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Situacao from './Situacao'
import Sexo from './Sexo'
import Cnh from './Cnh'
import Funcao from './Funcao'

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

  @column({ serializeAs : null })
  public id_funcao: number

  @column({ serializeAs : null })
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

  @column({ serializeAs: null })
  public id_sexo: number

  @column()
  public pis: string

  @column( { serializeAs: null })
  public id_situacao : number

  @belongsTo(() => Situacao {foreignKey : 'id_situacao'})
  public situacao : BelongsTo <typeof Situacao>

  @belongsTo(()=> Sexo {foreignKey : 'id_sexo'})
  public sexo : BelongsTo <typeof Sexo>

  @belongsTo(() => Cnh { foreignKey : 'id_cnh'})
  public cnh : BelongsTo <typeof Cnh> 

  @belongsTo(() => Funcao { foreignKey : 'id_funcao'})
  public funcao : BelongsTo <typeof Funcao> 

}
