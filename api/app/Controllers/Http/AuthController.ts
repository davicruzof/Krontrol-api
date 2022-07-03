import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import Hash from '@ioc:Adonis/Core/Hash';
import User from 'App/Models/User';

const loginSchema =  schema.create({
    cpf: schema.string(),
    cd_enterprise: schema.number(),
    password : schema.string()
});

const logoutSchema =  schema.create({
    token: schema.string()
});

export default class AuthController {

    public async login({request,response,auth}:HttpContextContract){
        try {
             const payload = await request.validate({schema: loginSchema});
             const { cpf,cd_enterprise,password } = request.all();
             console.log("aqui");
             const user = await User
               .query()
               .where('cpf',cpf)
               .where('cd_enterprise',cd_enterprise)
               .where('status','ATIVO')
               .first()
   
               //Verify password
                if(user){
                    if (!(await Hash.verify(user.password, password))) {
                        return response.unauthorized({error:"Senha incorreta"})
                      }
                      else{
                        return await auth.use('api').generate(user, { expiresIn:"1 day" })
                      }
                }
                else{
                    response.json({error: "Usuário não encontrado"});
                }
          } catch (error) {
            response.badRequest(error.messages);
          }
    }

    public async logout({auth,response}:HttpContextContract){

        if(auth){
            await auth.logout();
        }
        else{
            response.json({error:"Token não encontrado"});
        }
    }
    public async me({auth, response}:HttpContextContract){
        return await response.json({user:auth.user});
    }
}
