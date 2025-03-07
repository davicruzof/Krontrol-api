"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const Funcionario_1 = __importDefault(require("../../Models/Funcionario"));
const pdf_creator_node_1 = __importDefault(require("pdf-creator-node"));
const fs_1 = __importDefault(require("fs"));
const S3_1 = global[Symbol.for('ioc.use')]("App/Controllers/Http/S3");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const template_1 = global[Symbol.for('ioc.use')]("App/templates/pdf/template");
const AppVersion_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/AppVersion"));
const template_irpf_1 = global[Symbol.for('ioc.use')]("App/templates/pdf/template_irpf");
const templateDecimo_1 = global[Symbol.for('ioc.use')]("App/templates/pdf/templateDecimo");
class Receipts {
    constructor() {
        this.isMonthFreedom = async (id_empresa, id_pdf, mes) => {
            const liberacaoPdf = await Database_1.default.connection("pg").rawQuery(`SELECT * FROM public.vw_ml_flp_liberacao_recibos
            where tipo_id = ${id_pdf}
            AND bloqueio_liberacao = false
            AND mes_liberado = '${mes}'
            AND empresa_id = ${id_empresa}
            `);
            return liberacaoPdf?.rows.length > 0 ? true : false;
        };
        this.formattedCurrency = (value) => {
            if (value == null) {
                return "0,00";
            }
            let valorFormatado = value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });
            return valorFormatado;
        };
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
                matricula: dados[0].registro,
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
                LIQUIDO_PLR: 0,
                PLR: 0,
            },
            bases: {
                BASE_FGTS_FOLHA: 0,
                BASE_INSS_FOLHA: 0,
                FGTS_FOLHA: 0,
                BASE_IRRF_FOLHA: 0,
                BASE_IRRF_PLR: 0,
            },
            descricao: new Array(),
        };
        dados.forEach((element) => {
            if (element.DESCEVEN == "LIQUIDO DE PLR") {
                dadosTemp.totais.LIQUIDO_PLR = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "BASE IRRF PLR") {
                dadosTemp.bases.BASE_IRRF_PLR = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "PLR") {
                dadosTemp.totais.PLR = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "BASE FGTS FOLHA") {
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
            else if (element.DESCEVEN == "LIQUIDO DA FOLHA" ||
                element.DESCEVEN == "LIQUIDO DA FOLHA COMPL") {
                dadosTemp.totais.LIQUIDO = element.VALORFICHA;
            }
            else if (element.TIPOEVEN != "B") {
                if (element.VALORFICHA[0] == ",") {
                    element.VALORFICHA = "0" + element.VALORFICHA;
                }
                element.VALORFICHA = element.VALORFICHA.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                });
                if (element.REFERENCIA != "") {
                    element.REFERENCIA = element.REFERENCIA.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                    });
                }
                dadosTemp.descricao.push(element);
            }
        });
        return dadosTemp;
    }
    tratarDadosEventsDecimo(dados, dados_empresa) {
        let dadosTemp = {
            cabecalho: {
                logo: dados_empresa.logo,
                telefone: dados_empresa.telefone,
                nomeEmpresa: dados[0].RSOCIALEMPRESA,
                inscricaoEmpresa: dados[0].INSCRICAOEMPRESA,
                matricula: dados[0].registro,
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
            if (element.DESCEVEN == "BASE FGTS 13 SALARIO") {
                dadosTemp.bases.BASE_FGTS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "FGTS 13 SALARIO") {
                dadosTemp.bases.FGTS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "BASE IRRF 13 SALARIO") {
                dadosTemp.bases.BASE_IRRF_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "BASE INSS 13 SALARIO") {
                dadosTemp.bases.BASE_INSS_FOLHA = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "TOTAL DE DESCONTOS") {
                dadosTemp.totais.DESCONTOS = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "TOTAL DE PROVENTOS") {
                dadosTemp.totais.PROVENTOS = element.VALORFICHA;
            }
            else if (element.DESCEVEN == "LIQUIDO DO 13 SALARIO") {
                dadosTemp.totais.LIQUIDO = element.VALORFICHA;
            }
            else if (element.TIPOEVEN != "B") {
                if (element.VALORFICHA[0] == ",") {
                    element.VALORFICHA = "0" + element.VALORFICHA;
                }
                element.VALORFICHA = element.VALORFICHA.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                });
                if (element.REFERENCIA != "") {
                    element.REFERENCIA = element.REFERENCIA.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                    });
                }
                dadosTemp.descricao.push(element);
            }
        });
        return dadosTemp;
    }
    async payStubPdfGenerator({ request, auth, response, }) {
        try {
            const dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({ error: "data is required" });
            }
            const [year, month] = dados.data.split("-");
            const competencia = `${month}/${year}`;
            const liberacaoPdf = await this.isMonthFreedom(auth.user?.id_empresa, 2, competencia);
            if (!liberacaoPdf) {
                return response.badRequest({
                    error: "Empresa não liberou para gerar o recibo",
                });
            }
            const funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!funcionario) {
                return response.badRequest({ error: "funcionario não encontrado!" });
            }
            const appUpdate = await AppVersion_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!appUpdate) {
                return response.badRequest({ error: "app desatualizado" });
            }
            let payStub = await Database_1.default.connection("oracle").rawQuery(`
                                    SELECT DISTINCT
                                    to_char(competficha, 'MM-YYYY') as COMPETFICHA,
                                    CODEVENTO,
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
                                hol.codintfunc = ${funcionario?.id_funcionario_erp} and to_char(competficha, 'MM/YYYY') = '${competencia}'
                                and hol.TIPOFOLHA = 1
                                and hol.CODEVENTO NOT IN(15511)
                                and hol.CODEVENTO NOT IN(15512)
                                and hol.CODEVENTO NOT IN(15513)
                                and hol.TIPOEVEN NOT IN('C')
                                order by hol.tipoeven desc,hol.codevento asc
                                `);
            const empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            if (!empresa) {
                return response.badRequest({ error: "Erro ao pegar empresa!" });
            }
            payStub[0].registro = funcionario?.registro;
            const pdfTemp = await this.generatePdf(this.tratarDadosEvents(payStub, empresa), template_1.templateDotCard);
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (!file || !file.Location) {
                return response.badRequest({ error: "Erro ao gerar url do pdf!" });
            }
            fs_1.default.unlink(pdfTemp.filename, () => { });
            response.json({ pdf: file.Location });
        }
        catch (error) {
            response.json(error);
        }
    }
    async payStubAuxPdfGenerator({ request, auth, response, }) {
        try {
            const dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({ error: "data is required" });
            }
            const [year, month] = dados.data.split("-");
            const competencia = `${month}/${year}`;
            const liberacaoPdf = await this.isMonthFreedom(auth.user?.id_empresa, 5, competencia);
            if (!liberacaoPdf) {
                return response.badRequest({
                    error: "Empresa não liberou para gerar o recibo",
                });
            }
            const funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!funcionario) {
                return response.badRequest({ error: "funcionario não encontrado!" });
            }
            const appUpdate = await AppVersion_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!appUpdate) {
                return response.badRequest({ error: "app desatualizado" });
            }
            let payStub = await Database_1.default.connection("oracle").rawQuery(`
                                    SELECT DISTINCT
                                    to_char(competficha, 'MM-YYYY') as COMPETFICHA,
                                    CODEVENTO,
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
                                hol.codintfunc = ${funcionario?.id_funcionario_erp} and to_char(competficha, 'MM/YYYY') = '${competencia}'
                                and hol.TIPOFOLHA = 4
                                and hol.CODEVENTO NOT IN(15511)
                                and hol.CODEVENTO NOT IN(15512)
                                and hol.CODEVENTO NOT IN(15513)
                                order by hol.tipoeven desc,hol.codevento asc
                                `);
            const empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            if (!empresa) {
                return response.badRequest({ error: "Erro ao pegar empresa!" });
            }
            payStub[0].registro = funcionario?.registro;
            const pdfTemp = await this.generatePdf(this.tratarDadosEvents(payStub, empresa), template_1.templateDotCard);
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (!file || !file.Location) {
                return response.badRequest({ error: "Erro ao gerar url do pdf!" });
            }
            fs_1.default.unlink(pdfTemp.filename, () => { });
            response.json({ pdf: file.Location });
        }
        catch (error) {
            response.json(error);
        }
    }
    async plrPdfGenerator({ request, auth, response, }) {
        try {
            const dados = request.body();
            if (!dados.data || !auth.user) {
                return response.badRequest({ error: "data is required" });
            }
            const [year, month] = dados.data.split("-");
            const competencia = `${month}/${year}`;
            const liberacaoPdf = await this.isMonthFreedom(auth.user?.id_empresa, 6, competencia);
            if (!liberacaoPdf) {
                return response.badRequest({
                    error: "Empresa não liberou para gerar o recibo",
                });
            }
            const funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!funcionario) {
                return response.badRequest({ error: "funcionario não encontrado!" });
            }
            const appUpdate = await AppVersion_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!appUpdate) {
                return response.badRequest({ error: "app desatualizado" });
            }
            let payStub = await Database_1.default.connection("oracle").rawQuery(`
                                    SELECT DISTINCT
                                    to_char(competficha, 'MM-YYYY') as COMPETFICHA,
                                    CODEVENTO,
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
                                hol.codintfunc = ${funcionario?.id_funcionario_erp} and to_char(competficha, 'MM/YYYY') = '${competencia}'
                                and hol.TIPOFOLHA = 7
                                and hol.CODEVENTO NOT IN(15511)
                                and hol.CODEVENTO NOT IN(15512)
                                and hol.CODEVENTO NOT IN(15513)
                                order by hol.tipoeven desc,hol.codevento asc
                                `);
            const empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            if (!empresa) {
                return response.badRequest({ error: "Erro ao pegar empresa!" });
            }
            payStub[0].registro = funcionario?.registro;
            const pdfTemp = await this.generatePdf(this.tratarDadosEvents(payStub, empresa), template_1.templatePayStubPlr);
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (!file || !file.Location) {
                return response.badRequest({ error: "Erro ao gerar url do pdf!" });
            }
            fs_1.default.unlink(pdfTemp.filename, () => { });
            response.json({ pdf: file.Location });
        }
        catch (error) {
            response.json(error);
        }
    }
    async decimoPdfGenerator({ request, auth, response, }) {
        try {
            let ano = request.params().ano;
            if (!ano) {
                response.badRequest({ error: "Ano é obrigatório" });
                return;
            }
            if (!auth.user) {
                response.badRequest({ error: "Usuário não encontrado" });
                return;
            }
            const competencia = `12/${ano}`;
            const liberacaoPdf = await this.isMonthFreedom(auth.user?.id_empresa, 4, competencia);
            if (!liberacaoPdf) {
                return response.badRequest({
                    error: "Empresa não liberou para gerar o recibo",
                });
            }
            const funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!funcionario) {
                return response.badRequest({ error: "funcionario não encontrado!" });
            }
            const appUpdate = await AppVersion_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            if (!appUpdate) {
                return response.badRequest({ error: "app desatualizado" });
            }
            const idErpAnterior = funcionario?.id_funcionario_erp_anterior ?? "";
            let payStub = await Database_1.default.connection("oracle").rawQuery(`
                                    SELECT DISTINCT
                                    to_char(competficha, 'MM-YYYY') as COMPETFICHA,
                                    CODEVENTO,
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
                                hol.codintfunc in ('${funcionario?.id_funcionario_erp}', '${idErpAnterior}') and to_char(competficha, 'MM/YYYY') = '${competencia}'
                                and hol.TIPOFOLHA = 5
                                and hol.CODEVENTO NOT IN(15511)
                                and hol.CODEVENTO NOT IN(15512)
                                and hol.CODEVENTO NOT IN(15513)
                                order by hol.tipoeven desc,hol.codevento asc
                                `);
            const empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            if (!empresa) {
                return response.badRequest({ error: "Erro ao pegar empresa!" });
            }
            payStub[0].registro = funcionario?.registro;
            const pdfTemp = await this.generatePdf(this.tratarDadosEventsDecimo(payStub, empresa), templateDecimo_1.templateDECIMO);
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (!file || !file.Location) {
                return response.badRequest({ error: "Erro ao gerar url do pdf!" });
            }
            fs_1.default.unlink(pdfTemp.filename, () => { });
            response.json({ pdf: file.Location });
        }
        catch (error) {
            response.json(error);
        }
    }
    async IncomeTax({ request, response, auth }) {
        try {
            let ano = request.params().ano;
            if (!ano) {
                response.badRequest({ error: "Ano é obrigatório" });
                return;
            }
            if (!auth.user) {
                response.badRequest({ error: "Usuário não encontrado" });
                return;
            }
            const liberacaoPdf = await Database_1.default.connection("pg").rawQuery(`SELECT * FROM public.vw_ml_flp_liberacao_recibos
            where tipo_id = 3
            AND bloqueio_liberacao = false
            AND irpf = '${ano}'
            AND empresa_id = ${auth.user.id_empresa}
            `);
            if (liberacaoPdf.rows.length == 0) {
                response.badRequest({
                    error: "Empresa não liberou para gerar o recibo",
                });
                return;
            }
            const funcionario = await Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario);
            const idErpAnterior = funcionario?.id_funcionario_erp_anterior ?? "";
            const dadosIRPF = await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GUDMA.VW_ML_FLP_IRPF
        WHERE ID_FUNCIONARIO_ERP in ('${funcionario?.id_funcionario_erp}', '${idErpAnterior}')
        AND ANO = '${ano}'
      `);
            if (!dadosIRPF || dadosIRPF.length == 0) {
                response.badRequest({ error: "Nenhum dado encontrado" });
                return;
            }
            const empresa = await Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa);
            dadosIRPF[0].CNPJ_EMPRESA = empresa?.cnpj;
            dadosIRPF[0].NOME_EMPRESA = empresa?.nomeempresarial;
            dadosIRPF[0].RESPONSAVEL = empresa?.responsavel_irpf;
            const dadosIRPFDecimo = await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GUDMA.VW_ML_FLP_IRPF_DECIMO
        WHERE ID_FUNCIONARIO_ERP in ('${funcionario?.id_funcionario_erp}', '${idErpAnterior}')
        AND ANO_REFERENCIA = '${ano}'
      `);
            if (dadosIRPFDecimo.length > 0) {
                dadosIRPF[0].VLR_DECIMO = this.formattedCurrency(dadosIRPFDecimo?.[0].VALOR);
            }
            else {
                dadosIRPF[0].VLR_DECIMO = this.formattedCurrency(0);
            }
            dadosIRPF[0].VLR_DEC13 = this.formattedCurrency(dadosIRPF[0].VLR_DEC13);
            dadosIRPF[0].VLR_RENDIMENTO = this.formattedCurrency(dadosIRPF[0].VLR_RENDIMENTO);
            dadosIRPF[0].VLR_CPO = this.formattedCurrency(dadosIRPF[0].VLR_CPO);
            dadosIRPF[0].VLR_PENSAO_ALIM = this.formattedCurrency(dadosIRPF[0].VLR_PENSAO_ALIM);
            dadosIRPF[0].VLR_IMP_RETIDO = this.formattedCurrency(dadosIRPF[0].VLR_IMP_RETIDO);
            dadosIRPF[0].VLR_INDENIZACAO = this.formattedCurrency(dadosIRPF[0].VLR_INDENIZACAO);
            dadosIRPF[0].VLR_OUTROS = this.formattedCurrency(dadosIRPF[0].VLR_OUTROS);
            dadosIRPF[0].VLR_ASSMEDICA = this.formattedCurrency(dadosIRPF[0].VLR_ASSMEDICA);
            dadosIRPF[0].VLR_ODONTO = this.formattedCurrency(dadosIRPF[0].VLR_ODONTO);
            dadosIRPF[0].VLR_DEDMP = this.formattedCurrency(dadosIRPF[0].VLR_DEDMP);
            const dadosIRPFPrecuniario = await Database_1.default.connection("oracle")
                .rawQuery(`
        SELECT * FROM GUDMA.VW_ML_IRPF_PECUNIARIO
        WHERE ID_FUNCIONARIO_ERP in ('${funcionario?.id_funcionario_erp}', '${idErpAnterior}')
        AND ANO_CALENDARIO = '${ano}'
      `);
            if (dadosIRPFPrecuniario && dadosIRPFPrecuniario.length > 0) {
                dadosIRPF[0].PECUNIARIO = this.formattedCurrency(dadosIRPFPrecuniario?.[0].VLR_PECUNIARIO);
            }
            else {
                dadosIRPF[0].PECUNIARIO = this.formattedCurrency(0);
            }
            const dadosIRPFPLR = await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GUDMA.VW_ML_IRPF_PLR
        WHERE ID_FUNCIONARIO_ERP in ('${funcionario?.id_funcionario_erp}', '${idErpAnterior}')
        AND ANO_CALENDARIO = '${ano}'
      `);
            if (dadosIRPFPLR && dadosIRPFPLR.length > 0) {
                dadosIRPF[0].PLR = this.formattedCurrency(dadosIRPFPLR?.[0].VLR_PLR);
            }
            else {
                dadosIRPF[0].PLR = this.formattedCurrency(0);
            }
            const dadosIRPASSMEDTIT = await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GUDMA.VW_ML_IRPF_ASSMED_TIT
        WHERE ID_FUNCIONARIO_ERP in ('${funcionario?.id_funcionario_erp}', '${idErpAnterior}')
        AND ANO_CALENDARIO = '${ano}'
      `);
            let med = "";
            if (dadosIRPASSMEDTIT && dadosIRPASSMEDTIT.length > 0) {
                dadosIRPASSMEDTIT.map((item) => {
                    const valor = this.formattedCurrency(+item.ASSMED_TIT);
                    med =
                        med +
                            `
              <div style="margin-top: 4px; margin-left: 8px;">
                <div style="font-size: 10px;">
                  Operadora: ${item.OPERADORA}
                </div>
                <div style="font-size: 10px; margin-left: 4px;">
                  Valor: ${valor}
                </div>
              </div>
            `;
                });
            }
            const dadosIRPASSMEDDEP = await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GUDMA.VW_ML_IRPF_ASSMED_DEP
        WHERE ID_FUNCIONARIO_ERP in ('${funcionario?.id_funcionario_erp}', '${idErpAnterior}')
        AND ANO_CALENDARIO = '${ano}'
      `);
            let medDep = "";
            if (dadosIRPASSMEDDEP && dadosIRPASSMEDDEP.length > 0) {
                medDep = `<div style="font-size: 10px; margin-top: 8px; margin-left: 4px;">
            Dependentes
          </div>`;
                dadosIRPASSMEDDEP.map((item) => {
                    const valor = this.formattedCurrency(+item.ASSMED_DEP);
                    medDep =
                        medDep +
                            `
            <div style="margin-top: 4px; margin-left: 8px;">
              <div style="font-size: 10px;">
                Operadora: ${item.OPERADORA}
              </div>
              <div style="font-size: 10px; margin-left: 4px;">
                CPF: ${item.CPF} NOME: ${item.DEPENDENTE} Valor: ${valor}
              </div>
            </div>
          `;
                });
            }
            let complementar = "";
            if (dadosIRPF[0]?.INF_COMPL && dadosIRPF[0]?.INF_COMPL !== "null") {
                const aux = dadosIRPF[0].INF_COMPL.split("Pens:");
                aux.map((item) => {
                    if (item) {
                        complementar =
                            complementar +
                                `
            <div style="margin-top: 4px; margin-left: 8px;">
              <div style="font-size: 10px;">
                Pens: ${item}
              </div>
            </div>
          `;
                    }
                });
            }
            const templateMont = `
          <div>
            ${med}
          </div>

          ${medDep}

          <div>
            ${complementar}
          </div>
        </div>

        <b style="font-size: 14px; margin-top: 16px;">8. RESPONSAVEL PELAS INFORMACOES</b>

        <table>
            <tr style="width: 100%;">
            <td style="width: 40%; border: 1px solid #000; padding: 8px;">
                <div style="font-size: 10px;">
                Nome: ${empresa?.responsavel_irpf}
                </div>
            </td>
            <td style="width: 20%; border: 1px solid #000; padding: 8px;">
                <div style="font-size: 10px;">
                Data: / /
                </div>
            </td>
            <td style="border: 1px solid #000; padding: 8px;">
                <div style="font-size: 10px;">
                Assinatura:
                </div>
            </td>
            </tr>
        </table>

        </body>

        </html>
    `;
            const pdfTemp = await this.generatePdf({
                iprf: dadosIRPF[0],
            }, template_irpf_1.templateIRPF + templateMont);
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            if (file) {
                fs_1.default.unlink(pdfTemp.filename, () => { });
                response.json({ pdf: file.Location });
            }
        }
        catch (error) {
            response.badRequest({ error: "Nenhum dado encontrado", result: error });
        }
    }
}
exports.default = Receipts;
//# sourceMappingURL=Receipts.js.map