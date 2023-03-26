"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Veiculo_1 = require("./../../Schemas/Veiculo");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const S3_1 = global[Symbol.for('ioc.use')]("App/Controllers/Http/S3");
const Veiculo_2 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Veiculo"));
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const crypto_1 = __importDefault(require("crypto"));
class VeiculosController {
    async create({ request, response, auth }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(Veiculo_1.VeiculoSchemaInsert) });
            const dados = request.body();
            const file = request.file("foto");
            let veiculo = await Veiculo_2.default.findBy("chassi", dados.chassi);
            if (veiculo) {
                response.badRequest({ error: "Veículo já cadastrado" });
            }
            else {
                let empresa = await Empresa_1.default.findBy("id_empresa", dados.id_empresa);
                let hashImg = crypto_1.default.randomBytes(10).toString("hex");
                let filename = `${hashImg}-${file?.clientName}`;
                let s3Object = await (0, S3_1.upload)({
                    folder: "fotos_veiculo",
                    filename: filename,
                    bucket: empresa?.bucket,
                    path: filename,
                    file: file,
                    type: file?.extname,
                });
                await Veiculo_2.default.create({
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
        }
        catch (error) {
            response.badRequest(error.messages);
        }
    }
    async update({ request, response, auth }) {
        try {
            await request.validate({ schema: Validator_1.schema.create(Veiculo_1.VeiculoSchemaUpdate) });
            let dados = request.body();
            let veiculo = await Veiculo_2.default.findBy("id_veiculo", dados.id_veiculo);
            if (veiculo) {
                veiculo.merge(dados);
                veiculo.save();
                response.json({ sucess: "Atualizado com sucesso" });
            }
            else {
                response.badRequest({ error: "Veículo não encontrado" });
            }
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    async getById({ request, response }) {
        const { id_veiculo } = request.body();
        if (id_veiculo) {
            const veiculo = await Veiculo_2.default.query().where("id_veiculo", id_veiculo);
            if (veiculo) {
                response.json(veiculo);
            }
            else {
                response.json({ error: "Veículo não encontrada" });
            }
        }
        else {
            response.json({ error: "Veículo não encontrada" });
        }
    }
    async getAll({ response }) {
        let veiculos = await Veiculo_2.default.query().preload("garagem");
        response.json(veiculos);
    }
}
exports.default = VeiculosController;
//# sourceMappingURL=VeiculosController.js.map