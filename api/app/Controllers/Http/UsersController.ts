 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
 import { schema } from '@ioc:Adonis/Core/Validator';
 import User from 'App/Models/User';

 const userSchema =  schema.create({
    cpf: schema.string(),
    cd_enterprise: schema.number(),
    date_birth: schema.date(),
    password : schema.string()
});

export default class UsersController {

    public async  create({request,response}:HttpContextContract) {
        try {
            const payload = await request.validate({schema: userSchema});
            const {cpf, cd_enterprise, date_birth,password} = request.all();
            const user_exists = await User.findBy('cpf',cpf);
            if(user_exists){
                response.badRequest({error: "CPF já cadastrado "});
            }
            else{
                const user = await User.create({cpf,cd_enterprise,date_birth, password});
                response.json({user: user.id});
            }

        } catch (error) {

            response.badRequest(error);

        }
    }
}
