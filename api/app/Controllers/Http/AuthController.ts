
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import Hash from '@ioc:Adonis/Core/Hash';
import User from 'App/Models/User';
import  Funcionario  from 'App/Models/Funcionario';
const loginSchema =  schema.create({
    cpf: schema.string(),
    id_empresa: schema.number(),
    senha : schema.string()
});
export default class AuthController {

    public async login({request,response,auth}:HttpContextContract){
        try {
             await request.validate({schema: loginSchema});
             const { cpf,id_empresa,senha } = request.body();

             const funcionario = await Funcionario
               .query()
               .where('cpf',cpf)
               .where('id_empresa',id_empresa)
               .where('id_situacao',1)
               .first()
            
               //Verify password
                if(funcionario){
                    const usuario = await User
                    .query()
                    .where('id_funcionario',funcionario.id_funcionario)
                    .where('id_empresa',funcionario.id_empresa)
                    .first()
                    if(usuario){
                        if (!(await Hash.verify(usuario.senha, senha))) {
                            return response.unauthorized({error:"Dados inválidos"})
                          }
                          else{
                            const token =  await auth.use('api').generate(usuario);
                            return token;
                          }
                    }
                }
                else{
                    response.json({error: "Dados inválidos"});
                }
          } catch (error) {
            response.badRequest(error.messages);
          }
    }

    public async logout({auth}:HttpContextContract){

        if(auth){
            await auth.logout();
        }

    }
    public async me({auth, response}:HttpContextContract){

        const funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);

        return  response.json({
            user:auth.user,
            funcionario
        });

    }
}
