import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User';
export default class extends BaseSeeder {
  public async run () {
    await User.create({
      cpf: '96328072783', //CPF gerado  
      cd_enterprise: 1,
      password: 'admin1234',
    });
  }
}
