import  Empresa  from 'App/Models/Empresa';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Funcionario from '../../Models/Funcionario';
import FuncionarioArea from 'App/Models/FuncionarioArea';
import { FuncionarioSchemaInsert } from 'App/Schemas/Funcionario';
import Database from '@ioc:Adonis/Lucid/Database';

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

    public async getById({request,response}:HttpContextContract){
        const  { id_funcionario }    = request.body();

        if(id_funcionario){

            const funcionario = await Funcionario
                                    .query()
                                    .preload('cnh')
                                    .preload('funcao')
                                    .preload('sexo')
                                    .preload('situacao')
                                    .where('id_funcionario',id_funcionario);

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

    public async getAll ({response,auth}:HttpContextContract){

        let funcionarios = await Funcionario
            .query()
            .select('id_funcionario')
            .select('nome')
            .select('ml_fol_funcionario_funcao.funcao')
            .where('ml_fol_funcionario.id_empresa','=',auth.user?.id_empresa)
            .where('ml_fol_funcionario.id_situacao','=',1)
            .leftJoin('ml_fol_funcionario_funcao','ml_fol_funcionario_funcao.id_funcao_erp','=','ml_fol_funcionario.id_funcao_erp')

        response.json( funcionarios);
    }   

    public async addArea ({request,response}:HttpContextContract){

        const arrayArea = request.body().area;
        const id_funcionario = request.body().id_funcionario;
        const funcionario_dados = await Funcionario.findBy('id_funcionario',id_funcionario); 
        if(id_funcionario && arrayArea){

            arrayArea.forEach( async element =>  {
                await FuncionarioArea.create({
                    id_funcionario : id_funcionario,
                    id_empresa : funcionario_dados?.id_empresa,
                    id_area : element,
                });
            });
            response.json({sucess: "Cadastro Realizado"});
        }
    }
    public async getDepartamentsbyFuncionario(id_funcionario:number){
        const areas = await FuncionarioArea.query().select('')
    }



}
