import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Empresa from 'App/Models/Empresa';
import { EmpresaSchema } from 'App/Schemas/Empresa';
import Drive from '@ioc:Adonis/Core/Drive'

export default class EmpresasController {


    public async create({request, response}:HttpContextContract){
        try {
            //await request.validate({schema: schema.create(EmpresaSchema)});
            const logo = request.file('logo');

            console.log(logo);
            const image =  await logo?.moveToDisk('logos_enterprise/',{},'s3');
            console.log(image);
            return;

            const dados = request.body();
            let cnpj_aux = dados.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            dados.cnpj = cnpj_aux;

            const empresa = await Empresa.findBy('cnpj',dados.cnpj);
            if(empresa){
                response.json({error: "Já existe uma Empresa cadastrada com esse cnpj"});
            }
             else{
                await Empresa.create({
                    nomeempresarial: dados.nome,
                    cnpj: dados.cnpj,
                    logradouro: dados.logradouro,
                    numero: dados.numero,
                    complemento: dados.complemento,
                    cep: dados.cep,
                    bairro: dados.bairro,
                    municipio: dados.municipio,
                    uf : dados.uf,
                    email: dados.email,
                    telefone: dados.telefone,
                    situacaocadastral: dados.situacaocadastral,
                    contato: dados.contato,
                    id_grupo : dados.id_grupo,
                    id_usuario : dados.id_usuario,
                    status: dados.status,
                    background: dados.background,
                    primary_color: dados.primary_color,
                    logo : dados.logo
                });
                response.json({sucess: "Criado com sucesso"});
            }

        } catch (error) {

            response.badRequest(error.messages);
            
        }
    }


    public async getAll({response}:HttpContextContract){

        response.json( 

            await Empresa
            .query()
            .select('id_empresa','nomeempresarial','cnpj','telefone','situacaocadastral','status')
            
        );

    }
    public async getById({response, request}:HttpContextContract){

        const  { id_empresa }    = request.body();

        if(id_empresa){

            const empresa = await Empresa.findBy('id_empresa',id_empresa);

            if(empresa){

                response.json(empresa);

            }
            else {

                response.json({error: "Empresa não encontrada"});

            }
        }
        else{
            response.json({error: "Empresa não encontrada"});
        }
    }
    
    public async getByName({request,response}:HttpContextContract){
        let {nomeempresarial} = request.body();
        if(nomeempresarial){
            let empresa = await Empresa
                        .query()
                        .select('id_empresa','nomeempresarial','cnpj','telefone','situacaocadastral','status')
                        .where('nomeempresarial','LIKE','%'+nomeempresarial)
            if(empresa){
                response.json(empresa);
            }
            else{
                response.json({error: "Empresa não encontrada"});
            }
        }
        else{
            response.json({error: "Empresa não encontrada"});
        }
    }
}   
