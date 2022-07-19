import { Funcionario } from 'App/Models/Funcionario';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User';
export default class extends BaseSeeder {
  public async run () {
    let funcionario = await Funcionario.create({
      id_grupo: 1,
      cpf: "82867151791",
      id_empresa: 1,
      nome : "Administrador",
      id_sexo : 1,
      celular : "7981002233",
      id_funcao : 1
    });

    await User.create({
      id_empresa : 1,
      id_funcionario : funcionario.id_funcionario,
      senha : "L702874$23",
      id_grupo : funcionario.id_grupo
    });
  }
}
