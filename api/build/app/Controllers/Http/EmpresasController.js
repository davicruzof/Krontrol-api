"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const Empresa_2 = global[Symbol.for('ioc.use')]("App/Schemas/Empresa");
const S3_1 = global[Symbol.for('ioc.use')]("App/Controllers/Http/S3");
const crypto_1 = __importDefault(require("crypto"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const EnterpriseQuery = [
    "id_empresa",
    "nomeempresarial",
    "cnpj",
    "telefone",
    "situacaocadastral",
    "status",
];
class EmpresasController {
    async create({ request, response }) {
        try {
            let filename = "";
            await request.validate({ schema: Validator_1.schema.create(Empresa_2.EmpresaSchema) });
            const fileLogo = request.file("logo");
            const dados = request.body();
            let cnpj_aux = dados.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
            dados.cnpj = cnpj_aux;
            const empresa = await Empresa_1.default.findBy("cnpj", dados.cnpj);
            if (empresa) {
                response.json({
                    error: "Já existe uma Empresa cadastrada com esse cnpj",
                });
            }
            else {
                let nome_bucket = dados.nomeempresarial
                    .replace(" ", "-")
                    .replace(/\s/g, "")
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase();
                let s3Object;
                await (0, S3_1.createBucket)({ Bucket: nome_bucket });
                if (fileLogo) {
                    let hashImg = crypto_1.default.randomBytes(10).toString("hex");
                    filename = `${hashImg}-${fileLogo.clientName}`;
                    s3Object = await (0, S3_1.upload)({
                        folder: "logo",
                        filename: filename,
                        bucket: nome_bucket,
                        path: filename,
                        file: fileLogo,
                        type: fileLogo.extname,
                    });
                }
                await Empresa_1.default.create({
                    nomeempresarial: dados.nomeempresarial,
                    cnpj: dados.cnpj,
                    logradouro: dados.logradouro,
                    numero: dados.numero,
                    complemento: dados.complemento,
                    cep: dados.cep,
                    bairro: dados.bairro,
                    municipio: dados.municipio,
                    uf: dados.uf,
                    email: dados.email,
                    telefone: dados.telefone,
                    situacaocadastral: dados.situacaocadastral,
                    contato: dados.contato,
                    id_grupo: dados.id_grupo,
                    id_usuario: dados.id_usuario,
                    status: dados.status,
                    background: dados.background,
                    primary_color: dados.primary_color,
                    logo: s3Object.Location,
                    bucket: nome_bucket,
                });
                response.json({ sucess: "Criado com sucesso" });
            }
        }
        catch (error) {
            response.badRequest(new standalone_1.Exception("Erro interno", 404));
        }
    }
    async getAll({ response }) {
        response.json(await Empresa_1.default.query().select(...EnterpriseQuery));
    }
    async getEnterprises({ response }) {
        response.json(await Empresa_1.default.query().select("id_empresa", "nomeempresarial"));
    }
    async getById({ response, request }) {
        const { id_empresa } = request.body();
        if (id_empresa) {
            const empresa = await Empresa_1.default.findBy("id_empresa", id_empresa);
            if (empresa) {
                response.json(empresa);
            }
            else {
                response.json({ error: "Empresa não encontrada" });
            }
        }
        else {
            response.json({ error: "Empresa não encontrada" });
        }
    }
    async getByName({ request, response }) {
        let { nomeempresarial } = request.body();
        if (nomeempresarial) {
            let empresa = await Empresa_1.default.query()
                .select(...EnterpriseQuery)
                .where("nomeempresarial", "LIKE", "%" + nomeempresarial + "%");
            if (empresa) {
                response.json(empresa);
            }
            else {
                response.json({ error: "Empresa não encontrada" });
            }
        }
        else {
            response.json({ error: "Empresa não encontrada" });
        }
    }
    async update({ request, response }) {
        let filename = "";
        await request.validate({ schema: Validator_1.schema.create(Empresa_2.EmpresaSchemaUpdate) });
        const fileLogo = request.file("logo");
        let s3Object;
        let dados = request.body();
        const empresa = await Empresa_1.default.findBy("id_empresa", dados.id_empresa);
        if (dados.cnpj) {
            let cnpj_aux = dados.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
            dados.cnpj = cnpj_aux;
        }
        if (empresa && !empresa?.bucket) {
            let nome_bucket = dados.nomeempresarial
                .replace(" ", "-")
                .replace(/\s/g, "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            await (0, S3_1.createBucket)({ Bucket: nome_bucket });
            empresa.bucket = nome_bucket;
        }
        if (fileLogo) {
            let hashImg = crypto_1.default.randomBytes(10).toString("hex");
            filename = `${hashImg}-${fileLogo.clientName}`;
            s3Object = await (0, S3_1.upload)({
                folder: "logo",
                filename: filename,
                bucket: empresa?.bucket,
                path: filename,
                file: fileLogo,
                type: fileLogo.extname,
            });
            dados.logo = s3Object.Location;
        }
        empresa?.merge(dados).save();
        response.json({ sucess: "Atualizado com sucesso" });
    }
}
exports.default = EmpresasController;
//# sourceMappingURL=EmpresasController.js.map