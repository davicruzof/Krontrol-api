import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {upload } from 'App/Controllers/Http/S3';
import { schema } from '@ioc:Adonis/Core/Validator';
import Video from 'App/Models/Video';
import crypto from 'crypto';
import Empresa from 'App/Models/Empresa';

export default class VideosController {


    public async upload({request,response}){

        try {

            await request.validate({schema: schema.create({
                id_empresa : schema.number(),
                descricao : schema.string(),
                video : schema.file({extnames : ['mp4','mov']})
            })});

            let dados = request.body();
            let empresa = await Empresa.findBy('id_empresa',dados.id_empresa);
            let hashVideo =  crypto.randomBytes(999).toString('hex');
            let filename = `${hashVideo}-${dados.video.clientName}`;

            let s3Object = 
                await upload({
                    folder : 'videos',
                    filename : filename,
                    bucket: empresa?.bucket,
                    path: filename,
                    file: dados.video,
                    type: dados.video.extname
                });

            await Video.create({
                descricao : dados.descricao,
                link : s3Object.Location,
                id_empresa : dados.id_empresa
            });

            response.json({sucess : "Cadastro feito com sucesso"});

        } catch (error) {
            response.badRequest(error);
        }


    }

}
