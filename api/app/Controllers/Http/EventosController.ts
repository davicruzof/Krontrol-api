 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
 import { schema } from '@ioc:Adonis/Core/Validator';
 import { EventoSchemaInsert,EventoSchemaUpdate } from 'App/Schemas/Evento';
 import Evento from 'App/Models/Evento';



export default class EventosController {


    public async create({request,response, auth}:HttpContextContract){
    
        try {

            await request.validate({schema: schema.create(EventoSchemaInsert)});
            const dados = request.all();

            await Evento.create({
                id_evento: dados.id_evento,
                id_evento_telemetria : dados.id_evento_telemetria,
                evento : dados.evento,
                id_empresa_telemetria : dados.id_empresa_telemetria,
                id_funcionario_cadastro : auth.user?.id_funcionario
            });

            response.json({sucess: 'Criado com sucesso!'});

        } catch (error) {
            response.json(error);
        }
    
    }

    public async getAll({response}: HttpContextContract){

        let eventos = await Evento.all();
        response.json({
            eventos
        });
    }

    public async update({request,response,auth}:HttpContextContract){
        try {

            await request.validate({schema: schema.create(EventoSchemaUpdate)});

            const dados = request.body();

            const evento = await Evento.findBy('id_evento',dados.id_evento);

            if(evento){

                await evento.merge({
                    id_evento : dados.id_evento,
                    id_evento_telemetria : dados.id_evento_telemetria,
                    evento :  dados.evento,
                    id_empresa_telemetria : dados.id_empresa_telemetria,
                    id_funcionario_alteracao : auth.user?.id_funcionario,
                    id_status : dados.id_status
                }).save();
            }
            
        } catch (error) {
            response.json(error);
        }
    }


}
