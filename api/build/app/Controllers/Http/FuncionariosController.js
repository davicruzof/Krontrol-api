"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const ConfirmarPdf_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ConfirmarPdf"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Funcionario_1 = __importDefault(require("../../Models/Funcionario"));
const pdf_creator_node_1 = __importDefault(require("pdf-creator-node"));
const fs_1 = __importDefault(require("fs"));
const S3_1 = global[Symbol.for('ioc.use')]("App/Controllers/Http/S3");
const FuncionarioArea_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/FuncionarioArea"));
const Funcionario_2 = global[Symbol.for('ioc.use')]("App/Schemas/Funcionario");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const ConfirmaFichaPonto_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ConfirmaFichaPonto"));
const crypto_1 = __importDefault(require("crypto"));
const template_1 = global[Symbol.for('ioc.use')]("App/templates/pdf/template");
const Funcao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Funcao"));
const GlobalController_1 = __importDefault(require("./GlobalController"));
class FuncionariosController {
    async create({ request, response }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create(Funcionario_2.FuncionarioSchemaInsert),
            });
            const fotoPerfil = request.file("foto_perfil");
            const dados = request.body();
            let s3Object;
            let empresa = await Empresa_1.default.findBy("id_empresa", dados.id_empresa);
            if (!empresa) {
                return response.badRequest({ error: "Empresa não encontrada" });
            }
            let funcionario = await Funcionario_1.default.findBy("cpf", dados.cpf);
            if (funcionario) {
                response.badRequest({ error: "Este cpf já possui cadastro" });
            }
            else {
                if (fotoPerfil) {
                    let hashImg = crypto_1.default.randomBytes(10).toString("hex");
                    let filename = `${hashImg}-${fotoPerfil.clientName}`;
                    s3Object = await (0, S3_1.upload)({
                        folder: "logo",
                        filename: filename,
                        bucket: empresa.bucket,
                        path: filename,
                        file: fotoPerfil,
                        type: fotoPerfil.extname,
                    });
                }
                await Funcionario_1.default.create({
                    id_grupo: dados.id_grupo,
                    cpf: dados.cpf,
                    id_empresa: dados.id_empresa,
                    registro: dados.registro,
                    nome: dados.nome,
                    id_sexo: dados.id_sexo,
                    celular: dados.celular,
                    id_funcao_erp: dados.id_funcao,
                    dt_nascimento: dados.dt_nascimento,
                    email: dados.email,
                    cnh_emissao: dados.cnh_emissao,
                    id_cnh: dados.id_cnh,
                    foto_url: s3Object.Location,
                });
                response.json({ sucess: "Criado com sucesso" });
            }
        }
        catch (error) {
            response.badRequest(error.messages);
        }
    }
    async getById({ request, response }) {
        const { id_funcionario } = request.body();
        if (id_funcionario) {
            const funcionario = await Database_1.default.connection("pg")
                .query()
                .from("ml_fol_funcionario")
                .select("*")
                .leftJoin("ml_fol_funcionario_situacao", "ml_fol_funcionario_situacao.id_situacao", "=", "ml_fol_funcionario.id_situacao")
                .leftJoin("ml_fol_funcionario_funcao", "ml_fol_funcionario_funcao.id_funcao_erp", "=", "ml_fol_funcionario.id_funcao_erp")
                .where("ml_fol_funcionario.id_funcionario", id_funcionario);
            if (funcionario[0]) {
                let funcionario_erp = await Database_1.default.connection("oracle").rawQuery(`
                            SELECT CODFUNC FROM globus.vw_ml_flp_funcionario
                            WHERE id_funcionario_erp = '${funcionario[0].id_funcionario_erp}'
                        `);
                const global = new GlobalController_1.default();
                const departments = global.getDepartments(id_funcionario);
                funcionario[0].codfunc = funcionario_erp[0].CODFUNC;
                funcionario[0].departamentos = departments;
                response.json(funcionario);
            }
            else {
                response.json({ error: "Funcionário não encontrada" });
            }
        }
        else {
            response.json({ error: "Funcionário não encontrada" });
        }
    }
    async getAll({ response, auth }) {
        if (auth.user) {
            let funcionarios = await Database_1.default.from("ml_fol_funcionario")
                .select("id_funcionario")
                .select("cpf")
                .select("nome")
                .select("registro")
                .select("ml_fol_funcionario_funcao.funcao")
                .where("ml_fol_funcionario.id_empresa", "=", auth.user.id_empresa)
                .where("ml_fol_funcionario.id_situacao", "=", 1)
                .leftJoin("ml_fol_funcionario_funcao", "ml_fol_funcionario_funcao.id_funcao_erp", "=", "ml_fol_funcionario.id_funcao_erp");
            response.json(funcionarios);
        }
        else {
            response.json({ error: "Usuário inválido" });
        }
    }
    async addArea({ request, response }) {
        const arrayArea = request.body().area;
        const id_funcionario = request.body().id_funcionario;
        const funcionario_dados = await Funcionario_1.default.findBy("id_funcionario", id_funcionario);
        if (id_funcionario && arrayArea) {
            let deleta = await FuncionarioArea_1.default.query()
                .where("id_funcionario", "=", id_funcionario)
                .delete();
            if (deleta) {
                arrayArea.forEach(async (element) => {
                    await FuncionarioArea_1.default.create({
                        id_funcionario: id_funcionario,
                        id_empresa: funcionario_dados?.id_empresa,
                        id_area: element,
                    });
                });
                response.json({ sucess: "Cadastro Realizado" });
            }
        }
        else if (id_funcionario) {
            await FuncionarioArea_1.default.query()
                .where("id_funcionario", "=", id_funcionario)
                .delete();
            response.json({ sucess: "Alteração realizada" });
        }
    }
    async removeArea({ request, response }) {
        const arrayArea = request.body().area;
        const id_funcionario = request.body().id_funcionario;
        await Promise.all(arrayArea.forEach(async (element) => {
            let areaFunc = await FuncionarioArea_1.default.query()
                .select("*")
                .where("id_funcionario", "=", id_funcionario)
                .andWhere("id_area", "=", element)
                .limit(1);
            if (areaFunc[0]) {
                await areaFunc[0].delete();
            }
        }));
        response.json({ sucess: "Area(s) removidas com sucesso" });
    }
    async updateProfile({ request, response, auth }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create(Funcionario_2.updateProfileFuncionario),
            });
            let dados = request.body();
            let funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (funcionario) {
                funcionario.merge(dados);
                funcionario.save();
                response.json({ sucess: "Atualizado com sucesso" });
            }
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    async checkByCpf({ request, response }) {
        await request.validate({
            schema: Validator_1.schema.create({
                cpf: Validator_1.schema.string(),
                id_empresa: Validator_1.schema.number(),
            }),
        });
        let dados = request.body();
        let funcionario = await Funcionario_1.default.query()
            .select("id_funcionario")
            .select("cpf")
            .select("nome")
            .select("celular")
            .select("dt_nascimento")
            .where("cpf", "=", dados.cpf)
            .where("id_empresa", "=", dados.id_empresa)
            .first();
        if (funcionario) {
            let usuario = await User_1.default.findBy("id_funcionario", funcionario.id_funcionario);
            if (!usuario) {
                response.json({ error: "Usuário não encontrado" });
            }
            response.json(funcionario);
        }
        else {
            response.json({ return: "CPF não encontrado" });
        }
    }
    async EventsReceiptFormByFuncionario({ request, auth, response, }) {
        try {
            let dados = request.all();
            if (dados.data) {
                let funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
                let query = await Database_1.default.connection("oracle").rawQuery(`
                                    SELECT DISTINCT
                                    to_char(competficha, 'DD-MM-YYYY') as COMPETFICHA,
                                    CODINTFUNC,
                                    to_char(VALORFICHA, 'FM999G999G999D90', 'nls_numeric_characters='',.''') AS VALORFICHA,
                                    REFERENCIA,
                                    NOMEFUNC,
                                    DESCEVEN,
                                    RSOCIALEMPRESA,
                                    INSCRICAOEMPRESA,
                                    DESCFUNCAO,
                                    CIDADEFL,
                                    IESTADUALFL,
                                    ENDERECOFL,
                                    NUMEROENDFL,
                                    COMPLENDFL,
                                    TIPOEVEN
                                    FROM  globus.vw_flp_fichaeventosrecibo hol
                                WHERE
                                hol.codintfunc = ${funcionario?.id_funcionario_erp} and to_char(competficha, 'YYYY-MM') = '${dados.data}'
                                order by hol.tipoeven desc,hol.desceven
                                `);
                let empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
                let pdfTemp = await this.generatePdf(this.tratarDadosEvents(query, empresa), template_1.templateDotCard);
                let file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
                if (file) {
                    fs_1.default.unlink(pdfTemp.filename, () => { });
                    response.json({ pdf: file.Location });
                }
            }
            else {
                response.badRequest({ error: "data is required" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async dotCard({ request, auth, response }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({ data: Validator_1.schema.date({ format: 'yyyy-mm' }) }),
            });
            let dados = request.body();
            let data = dados.data.split('-');
            const lastDay = new Date(data[0], data[1] + 1, 0);
            const firstDay = new Date(data[0], data[1], 1);
            console.log(lastDay);
            if (dados.data) {
                let funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
                let query = await Database_1.default.connection("oracle").rawQuery(`
                                  select distinct
                                    func.id_funcionario_erp,
                                    func.chapafunc CHAPA,
                                    func.codfunc CODFUNC,
                                    lin.codigolinhamin LINHA,
                                    car.prefixoveic prefixo,
                                    oco.descocorr,
                                    replace(to_char(pon.entradigit,'DD/MM/YYYY'),'30/12/1899','FOLGA') DATA_OPERACAO,
                                    replace(to_char(pon.entradigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') JORNADA_INICIO,
                                    replace(to_char(pon.intidigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') REFEICAO_INICIO,
                                    replace(to_char(pon.intfdigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') REFEICAO_FIM,
                                    replace(to_char(pon.saidadigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') JORNADA_FIM,
                                    to_char(pon.competdigit,'DD/MM/YYYY') COMPETENCIA,
                                    pon.usudigit DIGITADO_POR,
                                    to_char(pon.dtdigit,'DD/MM/YYYY') DATA_DIGITACAO
                                from
                                    globus.frq_digitacaomovimento pon
                                    inner join globus.vw_ml_flp_funcionario func on pon.codintfunc = func.id_funcionario_erp
                                    inner join globus.frq_ocorrencia oco on pon.codocorr = oco.codocorr
                                    left join globus.frt_cadveiculos car on pon.codigoveic = car.codigoveic
                                    left join globus.bgm_cadlinhas lin on pon.codintlinha = lin.codintlinha
                                    WHERE
                                        pon.dtdigit BETWEEN to_date('${firstDay.toLocaleDateString()}','DD/MM/YYYY') and to_date('${lastDay.toLocaleDateString()}','DD/MM/YYYY')
                                        and func.id_funcionario_erp= '${funcionario?.id_funcionario_erp}'
                                    order by DATA_DIGITACAO ASC
                                    `);
                await Promise.all(query.map(async (element) => {
                    element["CONFIRMADO"] = "";
                    const confirma = await this.getConfirmaFichaPonto(element.DATA_OPERACAO, auth.user?.id_funcionario).then(function (data) {
                        return data;
                    });
                    element.CONFIRMADO = confirma;
                }));
                response.json(query);
            }
            else {
                response.json({ error: "data is required" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async getFuncionario(id, campos = "*") {
        let query = await Database_1.default.connection("pg").rawQuery(`
                        SELECT ${campos}
                        FROM ml_fol_funcionario
                        WHERE id_funcionario = ${id}
                        LIMIT 1
                    `);
        return query.rows[0];
    }
    async getConfirmaFichaPonto(data, id_funcionario) {
        let query = await Database_1.default.connection("pg").rawQuery(`
                        SELECT id
                        FROM ml_usu_confirma_ficha_ponto
                        WHERE id_funcionario = ${id_funcionario} and to_char(dt_referencia, 'YYYY-MM-DD HH24:MI:SS') = '${data}'
                    `);
        if (query.rows.length > 0) {
            return true;
        }
        else
            return false;
    }
    async confirmDotCard({ request, auth, response, }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({
                    data: Validator_1.schema.date({
                        format: "yyyy-MM-dd HH:mm:ss",
                    }),
                }),
            });
            let data = request.body().data;
            if (!(await this.getConfirmaFichaPonto(data, auth.user?.id_funcionario))) {
                if (auth.user) {
                    let funcionario = await this.getFuncionario(auth.user?.id_funcionario, "id_funcionario_erp");
                    await ConfirmaFichaPonto_1.default.create({
                        id_funcionario: auth.user?.id_funcionario,
                        id_funcionario_erp: funcionario.id_funcionario_erp,
                        dt_referencia: data,
                    });
                    response.json({ sucess: "Confirmado com sucesso " });
                }
            }
            else {
                response.json({ error: " Data já confirmada" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async inactivate({ auth, response }) {
        try {
            let funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (funcionario) {
                funcionario.id_situacao = 5;
                await funcionario.save();
                response.json({ sucess: true });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async deleteAccount({ request, response }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({ id_funcionario: Validator_1.schema.number() }),
            });
            let dados = request.body();
            let funcionario = await Funcionario_1.default.findBy("id_funcionario", dados.id_funcionario);
            if (funcionario) {
                if (funcionario.id_situacao == 5) {
                    await funcionario.delete();
                    let user = await User_1.default.findBy("id_funcionario", dados.id_funcionario);
                    if (user) {
                        await user.delete();
                    }
                    response.json({ sucess: "true" });
                }
                else {
                    response.json({ error: "Exclusão não permitida" });
                }
            }
            else {
                response.json({ error: "Funcionário não encontrado" });
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async generatePdf(dados, template) {
        try {
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                type: "pdf",
            };
            const filename = Math.random() + "_doc" + ".pdf";
            var document = {
                html: template,
                data: {
                    dados: dados,
                },
                path: "./pdfsTemp/" + filename,
            };
            let file = pdf_creator_node_1.default
                .create(document, options)
                .then((res) => {
                return res;
            })
                .catch((error) => {
                return error;
            });
            return await file;
        }
        catch (error) { }
    }
    tratarDadosEvents(dados, dados_empresa) {
        let dadosTemp = {
            cabecalho: {
                logo: dados_empresa.logo,
                telefone: dados_empresa.telefone,
                nomeEmpresa: dados[0].RSOCIALEMPRESA,
                inscricaoEmpresa: dados[0].INSCRICAOEMPRESA,
                matricula: dados[0].chapa,
                nome: dados[0].NOMEFUNC,
                funcao: dados[0].DESCFUNCAO,
                competencia: dados[0].COMPETFICHA,
                endereco: {
                    rua: dados[0].ENDERECOFL,
                    cidade: dados[0].CIDADEFL,
                    estado: dados[0].IESTADUALFL,
                    numero: dados[0].NUMEROENDFL,
                    complemento: dados[0].COMPLENDFL,
                },
            },
            totais: {
                DESCONTOS: 0,
                PROVENTOS: 0,
                LIQUIDO: 0,
            },
            bases: {
                BASE_FGTS_FOLHA: 0,
                BASE_INSS_FOLHA: 0,
                FGTS_FOLHA: 0,
                BASE_IRRF_FOLHA: 0,
            },
            descricao: new Array(),
        };
        dados.forEach((element) => {
            if (element.DESCEVEN == "BASE FGTS FOLHA") {
                dadosTemp.bases.BASE_FGTS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "FGTS FOLHA") {
                dadosTemp.bases.FGTS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "BASE IRRF FOLHA") {
                dadosTemp.bases.BASE_IRRF_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "BASE INSS FOLHA") {
                dadosTemp.bases.BASE_INSS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "TOTAL DE DESCONTOS") {
                dadosTemp.totais.DESCONTOS = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "TOTAL DE PROVENTOS") {
                dadosTemp.totais.PROVENTOS = element.VALORFICHA;
            }
            else if (element.TIPOEVEN != "B") {
                if (element.VALORFICHA[0] == ",") {
                    element.VALORFICHA = "0" + element.VALORFICHA;
                }
                dadosTemp.descricao.push(element);
            }
        });
        dadosTemp.totais.LIQUIDO = dadosTemp.totais.PROVENTOS - dadosTemp.totais.DESCONTOS;
        return dadosTemp;
    }
    async dotCardPdf({ request, response, auth }) {
        try {
            let dados = request.body();
            if (dados.data) {
                let funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
                let queryFuncao = await Funcao_1.default.findBy("id_funcao_erp", funcionario?.id_funcao_erp);
                let query = await Database_1.default.connection("oracle").rawQuery(`
                                    select distinct
                                    fun.id_funcionario_erp, fun.chapafunc chapa,
                                    to_char(df.dtdigit,'DD-MM-YYYY') as data_movimento, oco.descocorr ocorrencia,
                                    REPLACE(replace(to_char(df.entradigit,'HH24:MI:SS'),'00:00:00','FOLGA'),'10/11/2022 00:00:00','ATESTADO')  as entrada, replace(to_char(df.intidigit,'HH24:MI:SS'),'00:00:00','FOLGA')  as I_INI,
                                    replace(to_char(df.intfdigit,'HH24:MI:SS'),'00:00:00','FOLGA')  as I_FIM, replace(to_char(df.saidadigit,'HH24:MI:SS'),'00:00:00','FOLGA')  as SAIDA,
                                    lin.codigolinha linha, df.servicodigit as tabela,df.codocorr,
                                    df.normaldm as normal,CAST(df.extradm AS NUMBER(6,2)) as extra,
                                     df.excessodm exces, df.outradm outra, df.adnotdm a_not, df.extranotdm, (df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm) as totalf,
                                    bh.competencia bh_competencia, bh.credito,bh.debito,bh.saldoanterior,bh.valorpago
                                    from globus.frq_digitacaomovimento df
                                    inner join globus.vw_ml_flp_funcionario fun on df.codintfunc = fun.id_funcionario_erp
                                    left join globus.vw_bancohoras bh on df.codintfunc = bh.codintfunc
                                    left join globus.frq_ocorrencia oco on df.codocorr = oco.codocorr
                                    left join globus.bgm_cadlinhas lin on df.codintlinha = lin.codintlinha
                                    where
                                       to_char(df.dtdigit,'MM/YYYY') = to_char(bh.competencia,'MM/YYYY')
                                       and df.tipodigit='F' AND
                                                                       id_funcionario_erp = '${funcionario?.id_funcionario_erp}'  and to_char(df.dtdigit, 'YYYY-MM') = '${dados.data}'
                                                                   order by  DATA_MOVIMENTO
                                `);
                let empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
                let pdfTemp = await this.generatePdf(this.tratarDadosDotCard(query, empresa, funcionario, dados.data, queryFuncao), template_1.fichaPonto);
                let confirmacao = await ConfirmarPdf_1.default.query()
                    .select("*")
                    .where("id_funcionario", "=", `${funcionario?.id_funcionario}`)
                    .andWhere("data_pdf", "=", `${dados.data}`);
                let file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
                if (file) {
                    fs_1.default.unlink(pdfTemp.filename, () => { });
                    response.json({
                        pdf: file.Location,
                        confirmado: confirmacao[0] ? true : false,
                    });
                }
            }
            else {
                response.badRequest({ error: "data is required" });
            }
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    tratarDadosDotCard(dados, dados_empresa, funcionario, data, queryFuncao) {
        let dadosTemp = {
            cabecalho: {
                logo: dados_empresa.logo,
                nomeEmpresa: dados_empresa.nomeempresarial,
                cnpj: dados_empresa.cnpj,
                nome: funcionario.nome,
                funcao: queryFuncao.funcao,
                competencia: data,
                endereco: dados_empresa.logradouro,
                periodo: data.split("").reverse().join(""),
            },
            rodape: {
                saldoAnterior: dados[0].SALDOANTERIOR.toFixed(2),
                credito: dados[0].CREDITO.toFixed(2),
                debito: dados[0].DEBITO.toFixed(2),
                valorPago: dados[0].VALORPAGO.toFixed(2),
            },
            dadosDias: new Array(),
        };
        dados.forEach((element) => {
            element.TOTALF = element.TOTALF.toFixed(2);
            element.EXCES = element.EXCES.toFixed(2);
            element.EXTRA = element.EXTRA.toFixed(2);
            element.OUTRA = element.OUTRA.toFixed(2);
            dadosTemp.dadosDias.push(element);
        });
        return dadosTemp;
    }
    async confirmPdf({ request, response, auth }) {
        try {
            const foto = request.file("foto");
            const data = request.body().data_pdf;
            if (foto && data) {
                let hashImg = crypto_1.default.randomBytes(10).toString("hex");
                let filename = `${hashImg}-${foto.clientName}`;
                let empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
                let s3Object = await (0, S3_1.upload)({
                    folder: "confirmaPdf",
                    filename: filename,
                    bucket: empresa?.bucket,
                    path: filename,
                    file: foto,
                    type: foto.extname,
                });
                await ConfirmarPdf_1.default.create({
                    id_funcionario: auth.user?.id_funcionario,
                    foto: s3Object.Location,
                    data_pdf: data,
                });
                response.json({ sucess: "Confirmado com sucesso!" });
            }
            else {
                response.badRequest({ error: "Foto e data são requeridos" });
            }
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    async getVideos({ response, auth }) {
        try {
            let dados = await Database_1.default.connection("pg").rawQuery(`
                SELECT * FROM ml_fol_md_video_funcionario video_func
                        INNER JOIN ml_md_video video ON(video_func.id_video = video.id_video)
                        WHERE video_func.id_funcionario = '${auth.user?.id_funcionario}'
                                AND to_char(video.dt_expiracao,'YYYY-MM-DD') >= to_char(CURRENT_DATE,'YYYY-MM-DD')
            `);
            response.json(dados.rows);
        }
        catch (error) {
            response.badRequest(error);
        }
    }
    async confirmarVideo({ request, response, auth, }) {
        try {
            await request.validate({
                schema: Validator_1.schema.create({
                    id_video: Validator_1.schema.string(),
                }),
            });
            let dados = request.body();
            await Database_1.default.connection("pg")
                .table("ml_video_confirmed")
                .returning("id_video_confirmed")
                .insert({
                id_funcionario: auth.user?.id_funcionario,
                id_video: dados.id_video,
            });
            response.json({ sucess: "Confirmado com sucesso" });
        }
        catch (error) {
            response.badRequest("Erro interno");
        }
    }
}
exports.default = FuncionariosController;
//# sourceMappingURL=FuncionariosController.js.map