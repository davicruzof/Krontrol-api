import {
  VeiculoSchemaInsert,
  VeiculoSchemaUpdate,
} from "./../../Schemas/Veiculo";
import { schema } from "@ioc:Adonis/Core/Validator";
import { upload } from "App/Controllers/Http/S3";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Veiculo from "App/Models/Veiculo";
import Empresa from "App/Models/Empresa";
import crypto from "crypto";

export default class VeiculosController {
  public async create({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate({ schema: schema.create(VeiculoSchemaInsert) });

      const dados = request.body();
      const file = request.file("foto");

      let veiculo = await Veiculo.findBy("chassi", dados.chassi);

      if (veiculo) {
        response.badRequest({ error: "Veículo já cadastrado" });
      } else {
        let empresa = await Empresa.findBy("id_empresa", dados.id_empresa);
        let hashImg = crypto.randomBytes(10).toString("hex");
        let filename = `${hashImg}-${file?.clientName}`;
        let s3Object = await upload({
          folder: "fotos_veiculo",
          filename: filename,
          bucket: empresa?.bucket,
          path: filename,
          file: file,
          type: file?.extname,
        });

        await Veiculo.create({
          chassi: dados.chassi,
          id_grupo: dados.id_grupo,
          id_empresa: dados.id_empresa,
          id_garagem: dados.id_garagem,
          id_erp: dados.id_erp,
          prefixo: dados.prefixo,
          placa: dados.placa,
          ano_fabricacao: dados.ano_fabricacao,
          ano_modelo: dados.ano_modelo,
          modelo: dados.modelo,
          media_consumo: dados.media_consumo,
          id_status: dados.id_status,
          id_destinacao: dados.id_destinacao,
          foto: s3Object.Location,
        });
        response.json({ sucess: "Inserido com sucesso" });
      }
    } catch (error) {
      response.badRequest(error.messages);
    }
  }
  public async update({ request, response, auth }) {
    try {
      await request.validate({ schema: schema.create(VeiculoSchemaUpdate) });

      let dados = request.body();

      let veiculo = await Veiculo.findBy("id_veiculo", dados.id_veiculo);
      if (veiculo) {
        veiculo.merge(dados);
        veiculo.save();
        response.json({ sucess: "Atualizado com sucesso" });
      } else {
        response.badRequest({ error: "Veículo não encontrado" });
      }
    } catch (error) {
      response.badRequest(error);
    }
  }
  public async getById({ request, response }: HttpContextContract) {
    const { id_veiculo } = request.body();

    if (id_veiculo) {
      const veiculo = await Veiculo.query().where("id_veiculo", id_veiculo);

      if (veiculo) {
        response.json(veiculo);
      } else {
        response.json({ error: "Veículo não encontrada" });
      }
    } else {
      response.json({ error: "Veículo não encontrada" });
    }
  }
  public async getAll({ response }: HttpContextContract) {
    let veiculos = await Veiculo.query().preload("garagem");
    response.json(veiculos);
  }
}
