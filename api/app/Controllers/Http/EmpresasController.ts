
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Empresa from 'App/Models/Empresa';
import { EmpresaSchema, EmpresaSchemaUpdate } from 'App/Schemas/Empresa';
import { createBucket, upload } from 'App/Controllers/Http/S3';
import crypto from 'crypto';
export default class EmpresasController {


    public async create({request, response}:HttpContextContract){
        try {
            let filename = "";

            await request.validate({schema: schema.create(EmpresaSchema)});
            
            const fileLogo = request.file('logo');

            const dados = request.body();
            let cnpj_aux = dados.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            dados.cnpj = cnpj_aux;

            const empresa = await Empresa.findBy('cnpj',dados.cnpj);

            if(empresa){
                
                response.json({error: "Já existe uma Empresa cadastrada com esse cnpj"});

            }
             else{
                let nome_bucket = dados.nomeempresarial.replace(' ','-').replace(/\s/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                let s3Object;
                await createBucket({Bucket : nome_bucket});

                if(fileLogo){
                    let hashImg =  crypto.randomBytes(10).toString('hex');
                    filename = `${hashImg}-${fileLogo.clientName}`;

                          s3Object = 
                           await upload({
                                folder : 'logo',
                                filename : filename,
                                bucket: nome_bucket,
                                path: filename,
                                file: fileLogo,
                                type: fileLogo.extname
                            });
                }

                //console.log(s3Object);
                await Empresa.create({
                    nomeempresarial: dados.nomeempresarial,
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
                    logo : s3Object.Location,
                    bucket: nome_bucket
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

    public async getEnterprises({response}:HttpContextContract){
        response.json(
            await Empresa
                    .query()
                    .select('id_empresa','nomeempresarial')
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
                        .where('nomeempresarial','LIKE','%'+nomeempresarial+'%')
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

    public async update ({request,response}:HttpContextContract){
        let filename = "";
            await request.validate({schema: schema.create(EmpresaSchemaUpdate)});
            
            const fileLogo = request.file('logo');
            let s3Object;
            let dados = request.body();
            const empresa = await Empresa.findBy('id_empresa',dados.id_empresa);

            if(dados.cnpj){
                let cnpj_aux = dados.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                dados.cnpj = cnpj_aux;
            }

            if(empresa && !empresa?.bucket){

                let nome_bucket = dados.nomeempresarial.replace(' ','-').replace(/\s/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                await createBucket({Bucket : nome_bucket});
                empresa.bucket = nome_bucket;

            }
            if(fileLogo){
                let hashImg =  crypto.randomBytes(10).toString('hex');
                filename = `${hashImg}-${fileLogo.clientName}`;

                      s3Object = 
                       await upload({
                            folder : 'logo',
                            filename : filename,
                            bucket: empresa?.bucket,
                            path: filename,
                            file: fileLogo,
                            type: fileLogo.extname
                        });
                dados.logo = s3Object.Location;
            }
            empresa?.merge(dados).save();
            response.json({sucess: 'Atualizado com sucesso'});
    }
}   
