import  Empresa  from 'App/Models/Empresa';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Funcionario from '../../Models/Funcionario';
import { FuncionarioSchemaInsert } from 'App/Schemas/Funcionario';

export default class FuncionariosController {

    public async create({request,response}:HttpContextContract){
        try {
            await request.validate({schema: schema.create(FuncionarioSchemaInsert)});

            const dados = request.body();
            if(!(await Empresa.findBy('id_empresa',dados.id_empresa))){
                return response.badRequest({error: "Empresa não encontrada"});
            }
            let funcionario = await Funcionario.findBy('cpf',dados.cpf);

            if(funcionario){

                response.badRequest({error:"Este cpf já possui cadastro"});
            
            }
            else{
                await Funcionario.create({
                    id_grupo: dados.id_grupo,
                    cpf: dados.cpf,
                    id_empresa: dados.id_empresa,
                    nome : dados.nome,
                    id_sexo : dados.id_sexo,
                    celular : dados.celular,
                    id_funcao : dados.id_funcao
                });
                response.json({sucess: "Criado com sucesso"});
            }

        } catch (error) {

            response.badRequest(error.messages);
            
        }
    }

    public async edit({request,response}:HttpContextContract){

    }

    public async getById({request,response}:HttpContextContract){
        const  { id_funcionario }    = request.body();

        if(id_funcionario){

            const funcionario = await Funcionario.findBy('id_funcionario',id_funcionario);

            if(funcionario){

                response.json(funcionario);

            }
            else {

                response.json({error: "Funcionário não encontrada"});

            }
        }
        else{
            response.json({error: "Funcionário não encontrada"});
        }
    }


}
