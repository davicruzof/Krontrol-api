import  Empresa  from 'App/Models/Empresa';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Funcionario from '../../Models/Funcionario';
import FuncionarioArea from 'App/Models/FuncionarioArea';
import { FuncionarioSchemaInsert, updateProfileFuncionario } from 'App/Schemas/Funcionario';
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
                    id_funcao_erp : dados.id_funcao
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

            const funcionario = await Database.connection('pg').query()
                                    .from("ml_fol_funcionario")
                                    .select("*")
                                    .innerJoin("ml_fol_funcionario_situacao","ml_fol_funcionario_situacao.id_situacao","=","ml_fol_funcionario.id_situacao")
                                    .innerJoin("ml_fol_funcionario_funcao","ml_fol_funcionario_funcao.id_funcao_erp","=","ml_fol_funcionario.id_funcao_erp")
                                    .where("ml_fol_funcionario.id_funcionario",id_funcionario);

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

        let funcionarios = await Database.from('ml_fol_funcionario')
            .select('id_funcionario')
            .select('cpf')
            .select('nome')
            .select('registro')
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

    public async updateProfile({request,response,auth}:HttpContextContract){

        try {
            await request.validate({schema: schema.create(updateProfileFuncionario)});
            
            let dados = request.body();

            let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);

            if(funcionario){
                funcionario.merge(dados);
                funcionario.save();

                response.json({sucess: "Atualizado com sucesso"});
            }

        } catch (error) {
            response.badRequest(error);
        }
    }

    public async checkByCpf({request,response}){

        await request.validate({schema: schema.create({ cpf: schema.string(), id_empresa : schema.number() })});

        let dados = request.body();

        let funcionario = await Funcionario.query().where('cpf','=',dados.cpf).where('id_empresa','=',dados.id_empresa);

        if(funcionario.length > 0){
            response.json({return : true});
        }
        else {
            response.json({return : false});
        }

    }

    public async EventsReceiptFormByFuncionario({request,auth,response}:HttpContextContract){

        try {
            let dados = request.all();

            if(dados.data){
    
                let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);

                let query = await Database
                                    .connection('oracle')
                                    .rawQuery(`
                                    SELECT * FROM  globus.vw_flp_fichaeventosrecibo 
                                    WHERE codintfunc = ${funcionario?.id_funcionario_erp} and to_char(competficha, 'YYYY-MM-DD') = '${dados.data}' `);
        
                response.json(query);
    
            } else{
                response.json({error: 'data is required'});
            }

        } catch (error) {
            response.json(error);
        }
    }


}
