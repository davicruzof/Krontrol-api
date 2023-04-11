import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { upload } from "App/Controllers/Http/S3";
import { schema } from "@ioc:Adonis/Core/Validator";
import Video from "App/Models/Video";
import crypto from "crypto";
import Empresa from "App/Models/Empresa";
import Database from "@ioc:Adonis/Lucid/Database";

export default class VideosController {
  public async upload({ request, response, auth }) {
    try {
      await request.validate({
        schema: schema.create({
          id_empresa: schema.number(),
          descricao: schema.string(),
          titulo: schema.string(),
          video: schema.file(),
          dt_expiracao: schema.date.nullableAndOptional(),
        }),
      });

      let video = request.file("video");
      let dados = request.body();
      let empresa = await Empresa.findBy("id_empresa", dados.id_empresa);
      let hashVideo = crypto.randomBytes(9).toString("hex");
      let filename = `${hashVideo}-${video.clientName}`;

      let s3Object = await upload({
        folder: "videos",
        filename: filename,
        bucket: empresa?.bucket,
        path: filename,
        file: video,
        type: video.extname,
      });

      await Video.create({
        descricao: dados.descricao,
        link: s3Object.Location,
        titulo: dados.titulo,
        id_empresa: dados.id_empresa,
        dt_expiracao: dados.dt_expiracao,
      });

      response.json({ sucess: "Cadastro feito com sucesso" });
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async sendToEmployee({ request, response }) {
    try {
      await request.validate({
        schema: schema.create({
          id_video: schema.number(),
          ids_funcionario: schema.array().members(schema.number()),
        }),
      });

      let dados = request.body();

      await Promise.all(
        dados.ids_funcionario.map(async (id) => {
          await Database.connection("pg")
            .table("ml_fol_md_video_funcionario")
            .insert({
              id_video: dados.id_video,
              id_funcionario: id,
            });
        })
      );
      response.json({ sucess: "Cadastros realizados" });
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async getById({ request, response }: HttpContextContract) {
    try {
      await request.validate({
        schema: schema.create({
          id_video: schema.number(),
        }),
      });
      let id_video = request.body().id_video;

      response.json(await Video.findBy("id_video", id_video));
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async getAll({ request, response }: HttpContextContract) {
    try {
      response.json(await Video.all());
    } catch (error) {
      response.badRequest(error);
    }
  }

  public async update({ request, response }) {
    try {
      await request.validate({
        schema: schema.create({
          id_video: schema.number(),
          id_empresa: schema.number.nullableAndOptional(),
          descricao: schema.string.nullableAndOptional(),
          titulo: schema.string.nullableAndOptional(),
          dt_expiracao: schema.date.nullableAndOptional(),
        }),
      });
      let dados = request.body();
      let video = await Video.findBy("id_video", dados.id_video);
      if (video) {
        video.merge(dados);
        await video.save();
        response.json({ sucess: "Atualizado com sucesso" });
      } else {
        response.badRequest({ error: "Erro interno ou video não encontrado" });
      }
    } catch (error) {
      response.badRequest("Erro interno");
    }
  }

  public async delete({ request, response }) {
    try {
      await request.validate({
        schema: schema.create({
          id_video: schema.number(),
        }),
      });
      let id_video = request.body().id_video;
      let video = await Video.findBy("id_video", id_video);
      if (video) {
        await video.delete();
        response.json({ sucess: "Deletado com sucesso" });
      } else {
        response.badRequest({ error: "Video não encontrado" });
      }
    } catch (error) {
      response.badRequest("Erro interno");
    }
  }
}
