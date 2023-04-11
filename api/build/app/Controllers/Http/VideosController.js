"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const S3_1 = global[Symbol.for('ioc.use')]("App/Controllers/Http/S3");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Video_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Video"));
const crypto_1 = __importDefault(require("crypto"));
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class VideosController {
    async upload({ request, response, auth }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({
                    id_empresa: Validator_1.schema.number(),
                    descricao: Validator_1.schema.string(),
                    titulo: Validator_1.schema.string(),
                    video: Validator_1.schema.file(),
                    dt_expiracao: Validator_1.schema.date.nullableAndOptional(),
                }),
            });
            let video = request.file("video");
            let dados = request.body();
            let empresa = await Empresa_1.default.findBy("id_empresa", dados.id_empresa);
            let hashVideo = crypto_1.default.randomBytes(9).toString("hex");
            let filename = `${hashVideo}-${video.clientName}`;
            let s3Object = await (0, S3_1.upload)({
                folder: "videos",
                filename: filename,
                bucket: empresa?.bucket,
                path: filename,
                file: video,
                type: video.extname,
            });
            await Video_1.default.create({
                descricao: dados.descricao,
                link: s3Object.Location,
                titulo: dados.titulo,
                id_empresa: dados.id_empresa,
                dt_expiracao: dados.dt_expiracao,
            });
            response.json({ sucess: "Cadastro feito com sucesso" });
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    async sendToEmployee({ request, response }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({
                    id_video: Validator_1.schema.number(),
                    ids_funcionario: Validator_1.schema.array().members(Validator_1.schema.number()),
                }),
            });
            let dados = request.body();
            await Promise.all(dados.ids_funcionario.map(async (id) => {
                await Database_1.default.connection("pg")
                    .table("ml_fol_md_video_funcionario")
                    .insert({
                    id_video: dados.id_video,
                    id_funcionario: id,
                });
            }));
            response.json({ sucess: "Cadastros realizados" });
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    async getById({ request, response }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({
                    id_video: Validator_1.schema.number(),
                }),
            });
            let id_video = request.body().id_video;
            response.json(await Video_1.default.findBy("id_video", id_video));
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    async getAll({ request, response }) {
        try {
            response.json(await Video_1.default.all());
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    async update({ request, response }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({
                    id_video: Validator_1.schema.number(),
                    id_empresa: Validator_1.schema.number.nullableAndOptional(),
                    descricao: Validator_1.schema.string.nullableAndOptional(),
                    titulo: Validator_1.schema.string.nullableAndOptional(),
                    dt_expiracao: Validator_1.schema.date.nullableAndOptional(),
                }),
            });
            let dados = request.body();
            let video = await Video_1.default.findBy("id_video", dados.id_video);
            if (video) {
                video.merge(dados);
                await video.save();
                response.json({ sucess: "Atualizado com sucesso" });
            }
            else {
                response.badRequest({ error: "Erro interno ou video não encontrado" });
            }
        }
        catch (error) {
            response.badRequest("Erro interno");
        }
    }
    async delete({ request, response }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({
                    id_video: Validator_1.schema.number(),
                }),
            });
            let id_video = request.body().id_video;
            let video = await Video_1.default.findBy("id_video", id_video);
            if (video) {
                await video.delete();
                response.json({ sucess: "Deletado com sucesso" });
            }
            else {
                response.badRequest({ error: "Video não encontrado" });
            }
        }
        catch (error) {
            response.badRequest("Erro interno");
        }
    }
}
exports.default = VideosController;
//# sourceMappingURL=VideosController.js.map