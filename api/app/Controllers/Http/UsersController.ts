 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
 import { schema } from '@ioc:Adonis/Core/Validator';
 import User from 'App/Models/User';
import Funcionario from 'App/Models/Funcionario';
import Empresa from 'App/Models/Empresa';
 const userSchema =  schema.create({
    cpf: schema.string(),
    id_empresa: schema.number(),
    dt_nascimento: schema.date(),
    senha : schema.string()
});

export default class UsersController {

    public async  create({request,response}:HttpContextContract) {
        try {

            await request.validate({schema: userSchema});

            const {cpf, id_empresa, dt_nascimento,senha} = request.body();

            const user_exists = await Funcionario.findBy('cpf',cpf);

            if(user_exists){
                
                response.badRequest({error: "CPF já cadastrado "});

            }
            else{
                let empresa = await Empresa.findBy('id_empresa',id_empresa);

                if(empresa){
                    const id_grupo = empresa.id_grupo;
                    let funcionario = await Funcionario.create({id_empresa,id_grupo,cpf,dt_nascimento});

                    if(funcionario)
                    {
                        let id_funcionario = funcionario.id_funcionario;
                        await User.create({id_empresa,id_funcionario,id_grupo,senha});
                    }
                    response.json({message: "Criado com sucesso"});

                }
                else{
                    response.badRequest({error: "Empresa não Encontrada"});
                }
            }

        } catch (error) {

            response.badRequest(error);

        }
    }
}
