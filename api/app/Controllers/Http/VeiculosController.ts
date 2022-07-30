
import { VeiculoSchemaInsert } from './../../Schemas/Veiculo';
import { schema } from '@ioc:Adonis/Core/Validator';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Veiculo from 'App/Models/Veiculo';

export default class VeiculosController {


    public async create({request, response, auth}:HttpContextContract){
        try {
            await request.validate({schema: schema.create(VeiculoSchemaInsert)});

            const dados = request.body();

            let veiculo = await Veiculo.findBy('chassi',dados.chassi);

            if(!veiculo){
                response.badRequest({error: "Veículo já cadastrado"});
            }
            else{
                Veiculo.create({
                    chassi : dados.chassi,
                    id_grupo : dados.id_grupo,
                    id_empresa : dados.id_empresa,
                    id_garagem : dados.id_garagem,
                    id_erp : dados.id_erp,
                    prefixo : dados.prefixo,
                    placa : dados.placa,
                    ano_fabricacao : dados.ano_fabricacao,
                    ano_modelo : dados.ano_modelo,
                    modelo : dados.modelo,
                    media_consumo : dados.media_consumo,
                    id_status : dados.id_status,
                    id_destinacao : dados.id_destinacao
                });
                response.json({sucess: "Inserido com sucesso"});
            }
        } catch (error) {
            response.badRequest(error.messages);
        }
    }

    public async getById({request,response}:HttpContextContract){
        const  { id_veiculo }    = request.body();

        if(id_veiculo){

            const veiculo = await Veiculo.findBy('id_veiculo',id_veiculo);

            if(veiculo){

                response.json(veiculo);

            }
            else {

                response.json({error: "Veículo não encontrada"});

            }
        }
        else{
            response.json({error: "Veículo não encontrada"});
        }
    }
    public async getAll({response}:HttpContextContract){
        response.json( await Veiculo.all() );
    }


}
