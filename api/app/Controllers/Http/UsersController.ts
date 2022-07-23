import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import Funcionario from 'App/Models/Funcionario';
import { UserSchemaInsert } from '../../Schemas/User';

export default class UsersController {

    public async  create({request,response}:HttpContextContract) {
        try {

            await request.validate({schema: schema.create(UserSchemaInsert)});
            
            const dados = request.body();

            const funcionario = await Funcionario.findBy('cpf',dados.cpf);

            if(funcionario){
                
                User.create({
                    id_empresa : dados.id_empresa,
                    id_funcionario : funcionario.id_funcionario,
                    senha : dados.senha,
                    id_grupo : funcionario.id_grupo
                });
                response.json({sucess:"Usuário cadastrado"});

            }
            else{
                response.badRequest({error: "Funcionário não cadastrado"});
            }

        } catch (error) {

            response.badRequest(error.messages);

        }
    }
}
