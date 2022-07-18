import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Empresa from 'App/Models/Empresa';


const EmpresaSchema =  schema.create({
    nomeempresarial: schema.string(),
    cnpj: schema.string(),
    logradouro: schema.string(),
    uf : schema.string(),
    id_grupo : schema.number()
});


export default class EmpresasController {


    public async create({request, response}:HttpContextContract){
        try {
            await request.validate({schema: EmpresaSchema});

            const dados = request.body();
            let cnpj_aux = dados.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            dados.cnpj = cnpj_aux;

            const empresa = await Empresa.findBy('cnpj',dados.cnpj);
            if(empresa){
                response.json({error: "Já existe uma Empresa cadastrada com esse cnpj"});
            }
             else{
                await Empresa.create({
                nomeempresarial : dados.nomeempresarial,
                cnpj : dados.cnpj,
                logradouro : dados.logradouro,
                uf : dados.uf,
                id_grupo : dados.id_grupo
                });
                response.json({sucess: "Criado com sucesso"});
            }

        } catch (error) {

            response.badRequest(error.messages);
            
        }
    }


}   
