 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
 import { schema } from '@ioc:Adonis/Core/Validator';
import SecurityGroup from 'App/Models/SecurityGroup';


 export const GrupoSchema = {
    nome : schema.string(),
}
export default class SecuritiesController {


    public async create({request,response}:HttpContextContract){
        
        await request.validate({ schema: schema.create(GrupoSchema)});

        let dados = request.body();
        
        await SecurityGroup.create({nome : dados.nome});
        response.json({sucess : "Criado com sucesso"});

    }


    public async getById({request,response}:HttpContextContract){

        await request.validate({ schema: schema.create({ id_grupo : schema.number()})});
        let dados = request.body();
        return await SecurityGroup.findBy('id_grupo',dados.id_grupo);
    }

    public async getAll({response}:HttpContextContract){
        
        return await SecurityGroup.all();
    }

    public async update({request,response}:HttpContextContract){

        await request.validate({ schema: schema.create({ id_grupo : schema.number(), nome : schema.string()})});
        let dados = request.body();
        let grupo = await SecurityGroup.findBy('id_grupo',dados.id_grupo);

        if(grupo){
            grupo.merge(dados);
            await grupo.save();
            response.json({sucess : "Atualizado com sucesso"});
        } else{
            response.json({error: "Grupo não encontrado"});
        }
    }

}
