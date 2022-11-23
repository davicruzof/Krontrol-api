
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import Funcionario from 'App/Models/Funcionario';
import { UserSchemaInsert } from '../../Schemas/User';
import  {date_is_valid}  from '../../../libs/functions';
export default class UsersController {

    public async  create({request,response}:HttpContextContract) {
        try {

            await request.validate({schema: schema.create(UserSchemaInsert)});

            const dados = request.body();
            
            if(!date_is_valid(dados.dt_nascimento)){
                response.badRequest({error: "Data Inválida"});
                return;
            }

            const funcionario = await Funcionario
            .query()
            .where('cpf',dados.cpf)
            .where('id_empresa',dados.id_empresa)
            .where('id_situacao',1)
            .first()
            if(funcionario){
                const usuario = await User.findBy('id_funcionario',funcionario.id_funcionario)
                if(usuario){
                    response.json({sucess:"Usuário já cadastrado"});
                }
                else{
                    await User.create({
                        id_empresa : dados.id_empresa,
                        id_funcionario : funcionario.id_funcionario,
                        senha : dados.senha,
                        id_grupo : funcionario.id_grupo,
                        email : dados.email,
                        telefone : dados.telefone
                    });
                    response.json({sucess:"Usuário cadastrado"});
                }

            }
            else{
                response.badRequest({error: "Funcionário não cadastrado"});
            }

        } catch (error) {

            response.badRequest(error.messages);

        }
    }
}
