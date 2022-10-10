import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User';
export default class extends BaseSeeder {
  public async run () {
    
    await User.create({
      id_empresa : 1,
      id_funcionario : 9142,
      senha : "L702874$23",
      id_grupo: 1
    });
  }
}
