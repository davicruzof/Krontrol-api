"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pdf_creator_node_1 = __importDefault(require("pdf-creator-node"));
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Funcionario_1 = __importDefault(require("../../Models/Funcionario"));
const S3_1 = global[Symbol.for('ioc.use')]("App/Controllers/Http/S3");
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const log = (step, data) => {
    if (data) {
        Logger_1.default.info(data, `[IncomeReport] ${step}`);
    }
    else {
        Logger_1.default.info(`[IncomeReport] ${step}`);
    }
};
function wantsIncomeReportDbTrace(request) {
    const q = request.qs();
    return (request.input("debug") === "1" ||
        request.input("debug") === true ||
        String(q.debug) === "1");
}
class IncomeReport {
    constructor() {
        this.traceQuery = async (reqId, op, dbTrace, executor) => {
            const t0 = Date.now();
            try {
                const result = await executor();
                const ms = Date.now() - t0;
                let rows;
                if (Array.isArray(result)) {
                    rows = result.length;
                }
                else if (result == null) {
                    rows = 0;
                }
                else {
                    rows = 1;
                }
                const entry = { op, ok: true, rows, ms };
                dbTrace.push(entry);
                log("db ok", { reqId, ...entry });
                return result;
            }
            catch (err) {
                const ms = Date.now() - t0;
                const message = err instanceof Error ? err.message : String(err);
                const entry = {
                    op,
                    ok: false,
                    ms,
                    error: message,
                };
                dbTrace.push(entry);
                Logger_1.default.error({ err, reqId, op, ms }, `[IncomeReport] falha na operação de banco`);
                throw err;
            }
        };
        this.incomeReportRelease = async (ano, empresaId) => {
            return await Database_1.default.connection("pg").rawQuery(`SELECT * FROM public.vw_ml_flp_liberacao_recibos
            where tipo_id = 3
            AND bloqueio_liberacao = false
            AND irpf = '${ano}'
            AND empresa_id = ${empresaId}
            `);
        };
        this.fetchIncomePrincipal = async (ano, cpf) => {
            return await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GLOBUS.ESO_INFORME_PRINCIPAL eip
        WHERE eip.CPF_BENEFICIARIO = '${cpf}'
        and eip.ANO_BASE = '${ano}'
      `);
        };
        this.getIncomeInfos = async (idInformePrincipal) => {
            return await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GLOBUS.ESO_INFORME_RENDTRIB eir
        WHERE eir.ID_INFORME_PRINCIPAL = ${idInformePrincipal}
      `);
        };
        this.getIncomeExemptInfos = async (idInformePrincipal) => {
            return await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GLOBUS.ESO_INFORME_RENDISENTOS eire
        WHERE eire.ID_INFORME_PRINCIPAL = ${idInformePrincipal}
      `);
        };
        this.getIncomeOtherInfos = async (idInformePrincipal) => {
            return await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GLOBUS.ESO_INFORME_TRIBEXCLUSIVA eior
        WHERE eior.ID_INFORME_PRINCIPAL = ${idInformePrincipal}
      `);
        };
        this.getPlrInfos = async (idInformePrincipal) => {
            return await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GLOBUS.ESO_INFORME_OUTROS_ISENTOS eiplr
        WHERE eiplr.ID_INFORME_PRINCIPAL = ${idInformePrincipal}
        and eiplr.DESCRICAO = 'PLR'
      `);
        };
        this.getPlanMedicalInfos = async (idInformePrincipal) => {
            return await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GLOBUS.ESO_INFORME_PLANSAUDE eipm
        WHERE eipm.ID_INFORME_PRINCIPAL = ${idInformePrincipal}
      `);
        };
        this.getPensInfos = async (idInformePrincipal) => {
            return await Database_1.default.connection("oracle").rawQuery(`
        SELECT * FROM GLOBUS.ESO_INFORME_PENSAOALIM eipm
        WHERE eipm.ID_INFORME_PRINCIPAL = ${idInformePrincipal}
      `);
        };
        this.InitPdf = () => {
            return `<!DOCTYPE html>
    <html lang="pt-BR">

    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Rendimentos</title>
    <style>
        body {
        margin: 0;
        padding: 20px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        table {
        width: 100%;
        border-collapse: collapse;
        }

        span {
        font-weight: 500;
        font-size: 14px;
        }

        tr {
        width: 100%;
        }

        hr {
        border: 1px solid #000;
        }
    </style>
    </head>

    <body>`;
        };
        this.templateHeaderInfos = (ano) => {
            const anoCalendario = parseInt(ano, 10);
            const anoCalendarioLabel = Number.isFinite(anoCalendario)
                ? String(anoCalendario)
                : ano;
            const exercicioLabel = Number.isFinite(anoCalendario)
                ? String(anoCalendario + 1)
                : ano;
            return `<table>
        <tr style="width: 100%;">
        <td style="width: 50%; border: 1px solid #000; padding: 4px; font-size: 12px; text-align: center;">
            <div>
                <b>Ministério da Fazenda</b>
            </div>
            <div>
                Secretaria da Receita Federal do Brasil
            </div>
            <div>
                Imposto sobre a Renda da Pessoa Física
            </div>
            <div>
                <b>Exercício de ${exercicioLabel}</b>
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px; font-size: 10px; text-align: center;">
            <div>
                Comprovante de Rendimentos Pagos e de
            </div>
            <div>
                Impostos sobre Renda Retido na Fonte
            </div>
            <div>
                Imposto sobre a Renda da Pessoa Física
            </div>
            <div>
                <b>Ano-calendário ${anoCalendarioLabel}</b>
            </div>
        </td>
        </tr>
    </table>

    <table>
        <tr>
        <td style="border: 1px solid #000; padding: 8px; font-size: 12px; text-align: center;">
            Verifique as condições e o prazo para apresentação da Declaração do Imposto sobre a Renda da Pessoa Física
            para este ano-calendário no sítio da Secretaria da Receita Federal do Brasil na Internet, no endereço
            <a href="https://www.gov.br/receitafederal/pt-br">www.gov.br/receitafederal</a>
        </td>
        </tr>
    </table>`;
        };
        this.templateEnterpriseInfos = (cnpj, enterpriseName) => {
            return `<b style="font-size: 10px;">1. Fonte Pagadora Pessoa Jurídica ou Pessoa Física</b>

    <table>
        <tr style="width: 100%;">
        <td style="width: 40%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            CNPJ: ${cnpj}
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            Empresa: ${enterpriseName}
            </div>
        </td>
        </tr>
    </table>`;
        };
        this.templatePeopleInfos = (cpf, name) => {
            return `<b style="font-size: 10px;">2. Pessoa Física Beneficiária dos Rendimentos</b>

    <table>
        <tr style="width: 100%;">
        <td style="width: 30%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            CPF: ${cpf}
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            Nome Completo: ${name}
            </div>
        </td>
        </tr>
    </table>

    <table style="margin-top: 1px;">
        <tr style="width: 100%;">
        <td style="width: 100%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            Natureza do rendimento
            </div>
        </td>
        </tr>
    </table>`;
        };
        this.templateIncomeInfos = (incomeInfos) => {
            return `<b style="font-size: 10px;">3. Rendimentos Tributáveis, Deduções e Imposto de Renda Retido na Fonte</b>

    <table>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            1. Total dos rendimentos (inclusive férias)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: right; font-size:10px;">
            ${incomeInfos.totalRendimentos}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            2. Contribuição previdenciária oficial
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: right; font-size:10px;">
            ${incomeInfos.contribuiçãoProvidenciariaOficial}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            3. Contribuição a entidades de prev. complementar e a fundos de aposentadoria prog. individual — Fapi (quadro 7)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: right; font-size:10px;">
            ${incomeInfos.contribuiçãoEntidadesPrevComplementar}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            4. Pensão alimentícia (informar beneficiário no quadro 7)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: right; font-size:10px;">
            ${incomeInfos.pensaoAlimenticia}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            5. Imposto sobre a renda retido na fonte
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: right; font-size:10px;">
            ${incomeInfos.impostoRendaRetidoNaFonte}
            </div>
        </td>
        </tr>
    </table>`;
        };
        this.templateIncomeExemptInfos = (incomeExemptInfos) => {
            return `<table>
        <tr>
        <td style="width: 80%;padding: 4px;">
            <b style="font-size: 10px;">4. Rendimentos Isentos e Não Tributáveis</b>
        </td>
        <td style="padding: 4px; text-align: center; font-size: 12px;">
            Valores em reais
        </td>
        </tr>
    </table>

    <table>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            1. Parcela isenta dos proventos de aposentadoria, reserva, reforma e pensão (65 anos ou mais)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeExemptInfos.parcelaIsenta65}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            2. Diárias e ajuda de custo
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeExemptInfos.diariasAjudaCusto}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            3. Pensão e proventos de aposentadoria ou reforma por moléstia grave ou por acidente em serviço
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeExemptInfos.pensaoProventosMoleGrave}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            4. Lucros e dividendos, apurados a partir de 1996, pagos por pessoa jurídica (lucro real, presumido ou arbitrado)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeExemptInfos.lucrosDividendos}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            5. Valores pagos ao titular ou sócio da microempresa ou empresa de pequeno porte, exceto pró-labore, aluguéis ou serviços prestados
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeExemptInfos.valoresPagosTitularMei}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            6. Indenização por rescisão de contrato de trabalho, inclusive a título de PDV, e por acidente de trabalho
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeExemptInfos.indenizacao}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            7. Outros:
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeExemptInfos.outros}
            </div>
        </td>
        </tr>
    </table>`;
        };
        this.templateIncomeOtherInfos = (incomeOtherInfos) => {
            return `<table>
        <tr>
        <td style="width: 80%;padding: 4px;">
            <b style="font-size: 10px;">5. Rendimentos sujeitos a tributação exclusiva (rendimento líquido)</b>
        </td>
        <td style="padding: 4px; text-align: center; font-size: 12px;">
            Valores em reais
        </td>
        </tr>
    </table>

    <table>
        <tr style="width: 100%;">
          <td style="width: 80%; border: 1px solid #000; padding: 4px;">
              <div style="font-size: 10px;">
              1. Décimo terceiro salário
              </div>
          </td>
          <td style="border: 1px solid #000; padding: 8px;">
              <div style="text-align: right; font-size: 10px;">
              ${incomeOtherInfos.decimoTerceiroSalario}
              </div>
          </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            2. Imposto sobre a renda retida na fonte sobre 13º salário
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeOtherInfos.impostoRendaRetidoNaFonteSobre13oSalario}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            3. Outros
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: right; font-size: 10px;">
            ${incomeOtherInfos.outros}
            </div>
        </td>
        </tr>
    </table>`;
        };
        this.templateIncomeReceivedAccumulatedInfos = () => {
            return `<div>
    <b style="font-size: 10px;">6. Rendimentos recebidos acumuladamente — art. 12-A da Lei nº 7.713, de 1988 (sujeito a tributação exclusiva)</b>
  </div>

  <table style="width: 80%; max-width: 80%;">
    <tr style="width: 100%; max-width: 80%;">
      <td style="border: 1px solid #000;">
        <div style="font-size: 10px; display: flex; flex-direction: row; justify-content: space-between;">
          <span style="padding-right: 4px; font-size: 10px;">6.1 Número do processo</span>
          <span>
            <span
              style="font-size: 10px; border-left: 1px solid #000; border-right: 1px solid #000;">
              Quantidade de meses
            </span>
            <span style="padding: 0 4px; font-size: 10px;">0</span>
          </span>
        </div>
      </td>
    </tr>
    <tr style="width: 100%;">
      <td style="width: 100%; border: 1px solid #000;">
        <div style="font-size: 10px;">
          Natureza do processo:
        </div>
      </td>
    </tr>
  </table>`;
        };
        this.InformationComplementariesInfos = (plr, planMedicalInfosData, pensInfosData) => {
            let medicalInfos = this.medicalInfos(planMedicalInfosData);
            let pensInfos = this.informationPensInfos(pensInfosData);
            return `<div>
        <b style="font-size: 10px;">7. Informações complementares</b>
    </div>

    <div style="min-height: 100px; border: 1px solid #000; margin: 2px;">
      <div style="font-size: 10px; margin: 4px 4px 0 4px;">
        Rendimentos isentos outros:
      </div>
      <div style="font-size: 10px; margin: 0 4px 4px 4px;">
        Participação nos lucros ou resultados (PLR): ${plr}
      </div>

      <div>${medicalInfos}</div>
      <div>${pensInfos}</div>
    </div>`;
        };
        this.medicalInfos = (medicalInfosData) => {
            let medicalInfos = "";
            if (medicalInfosData && medicalInfosData.length > 0) {
                const byOperadora = new Map();
                for (const item of medicalInfosData) {
                    const key = `${item.CNPJ_OPERADORA}|${item.NOME_OPERADORA}`;
                    const list = byOperadora.get(key);
                    if (list) {
                        list.push(item);
                    }
                    else {
                        byOperadora.set(key, [item]);
                    }
                }
                medicalInfos = medicalInfos + "<table>";
                for (const items of byOperadora.values()) {
                    const head = items[0];
                    medicalInfos =
                        medicalInfos +
                            `
            <tr>
              <td colspan="3" style="font-size: 8px;">Operadora: ${head.CNPJ_OPERADORA} - ${head.NOME_OPERADORA}</td>
            </tr>
            <tr>
              <td colspan="3" style="font-size: 8px;">valor pago no ano referente aos dependentes:</td>
            </tr>
            <tr>
              <td style="font-size: 8px;">CPF</td>
              <td style="font-size: 8px;">NOME</td>
              <td style="font-size: 8px;">VALOR</td>
            </tr>
          `;
                    for (const item of items) {
                        medicalInfos =
                            medicalInfos +
                                `
          <tr>
            <td style="font-size: 8px;">${item.CPF_DEPENDENTE}</td>
            <td style="font-size: 8px;">${item.NOME_DEPENDENTE}</td>
            <td style="font-size: 8px;">${this.formattedCurrency(+item.VALOR_SAUDE_DEPENDENTE)}</td>
          </tr>
        `;
                    }
                }
                medicalInfos = medicalInfos + `</table>`;
            }
            return medicalInfos;
        };
        this.informationPensInfos = (pensInfosData) => {
            let complementar = "";
            if (pensInfosData.length > 0) {
                complementar =
                    complementar +
                        `<table>
      <tr>
        <td style="font-size: 8px;">Dados dos alimentandos:</td>
      </tr>
      <tr>
        <td style="font-size: 8px;">CPF</td>
        <td style="font-size: 8px;">NOME</td>
        <td style="font-size: 8px;">VALOR</td>
      </tr>
      `;
                pensInfosData.map((item) => {
                    if (item) {
                        complementar =
                            complementar +
                                `
              <tr style="width: 100%;">
                <td style="font-size: 8px;">${item.CPF_ALIMENTANDO}</td>
                <td style="font-size: 8px;">${item.NOME_ALIMENTANDO}</td>
                <td style="font-size: 8px;">${this.formattedCurrency(+item.VALOR_PENSAO)}</td>
              </tr>
          `;
                    }
                });
                complementar = complementar + `</table>`;
            }
            return complementar;
        };
        this.responsibleForTheInformation = (responsible) => {
            return `<b style="font-size: 14px; display: block; margin-top: 16px;">8. Responsável pelas informações</b>

        <table>
            <tr style="width: 100%;">
            <td style="width: 40%; border: 1px solid #000; padding: 8px;">
                <div style="font-size: 10px;">
                Nome: ${responsible}
                </div>
            </td>
            <td style="width: 20%; border: 1px solid #000; padding: 8px;">
                <div style="font-size: 10px;">
                Data: &nbsp;/&nbsp;/
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

        </html>`;
        };
        this.formattedCurrency = (value) => {
            if (value == null || value === "") {
                return "0,00";
            }
            let n;
            if (typeof value === "number") {
                n = value;
            }
            else {
                const s = String(value).trim();
                n = Number(s);
                if (Number.isNaN(n) && /,/.test(s)) {
                    n = Number(s.replace(/\./g, "").replace(",", "."));
                }
            }
            if (Number.isNaN(n)) {
                return "0,00";
            }
            return n.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });
        };
    }
    async IncomeReport({ request, response, auth }) {
        const reqId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        const dbTrace = [];
        const withTrace = (body) => wantsIncomeReportDbTrace(request)
            ? { ...body, reqId, db: dbTrace }
            : body;
        try {
            const ano = request.params().ano;
            log("request iniciada", {
                reqId,
                ano,
                method: request.method(),
                url: request.url(),
            });
            if (!ano) {
                log("validação falhou: ano ausente", { reqId });
                response.badRequest(withTrace({ error: "Ano é obrigatório" }));
                return;
            }
            if (!auth.user) {
                log("validação falhou: usuário não autenticado", { reqId });
                response.badRequest(withTrace({ error: "Usuário não encontrado" }));
                return;
            }
            log("contexto usuário", {
                reqId,
                id_funcionario: auth.user.id_funcionario,
                id_empresa: auth.user.id_empresa,
            });
            const incomeReportRelease = await this.incomeReportRelease(ano, auth.user.id_empresa);
            if (incomeReportRelease.rows.length == 0) {
                response.badRequest({
                    error: "Empresa não liberou para gerar o recibo",
                });
                return;
            }
            const funcionario = await this.traceQuery(reqId, "pg.funcionario", dbTrace, () => Funcionario_1.default.findBy("id_funcionario", auth.user?.id_funcionario));
            log("buscando informe principal e empresa (parallel)", { reqId, ano });
            const [incomeGetData, enterprise] = await Promise.all([
                this.traceQuery(reqId, "oracle.ESO_INFORME_PRINCIPAL", dbTrace, () => this.fetchIncomePrincipal(ano, funcionario?.cpf ?? "")),
                this.traceQuery(reqId, "pg.empresa", dbTrace, () => Empresa_1.default.findBy("id_empresa", auth.user?.id_empresa)),
            ]);
            if (!incomeGetData?.length) {
                log("informe principal sem linhas", {
                    reqId,
                    cpfPreenchido: Boolean(funcionario?.cpf?.length),
                });
                response.badRequest(withTrace({
                    error: "Nenhum informe principal encontrado no Oracle para este CPF/ano",
                }));
                return;
            }
            const idInforme = incomeGetData[0].ID;
            const [incomes, incomeReceivedExemptInfos, incomeOtherInfos, plrInfos, planMedicalInfos, pensInfos,] = await Promise.all([
                this.traceQuery(reqId, "oracle.ESO_INFORME_RENDTRIB", dbTrace, () => this.getIncomeInfos(idInforme)),
                this.traceQuery(reqId, "oracle.ESO_INFORME_RENDISENTOS", dbTrace, () => this.getIncomeExemptInfos(idInforme)),
                this.traceQuery(reqId, "oracle.ESO_INFORME_TRIBEXCLUSIVA", dbTrace, () => this.getIncomeOtherInfos(idInforme)),
                this.traceQuery(reqId, "oracle.ESO_INFORME_OUTROS_ISENTOS", dbTrace, () => this.getPlrInfos(idInforme)),
                this.traceQuery(reqId, "oracle.ESO_INFORME_PLANSAUDE", dbTrace, () => this.getPlanMedicalInfos(idInforme)),
                this.traceQuery(reqId, "oracle.ESO_INFORME_PENSAOALIM", dbTrace, () => this.getPensInfos(idInforme)),
            ]);
            const requiredRows = [
                { name: "ESO_INFORME_RENDTRIB", rows: incomes },
                { name: "ESO_INFORME_RENDISENTOS", rows: incomeReceivedExemptInfos },
                { name: "ESO_INFORME_TRIBEXCLUSIVA", rows: incomeOtherInfos },
                { name: "ESO_INFORME_OUTROS_ISENTOS (PLR)", rows: plrInfos },
            ];
            const missing = requiredRows.find((r) => !r.rows?.length);
            if (missing) {
                log("consulta obrigatória retornou vazio", {
                    reqId,
                    tabela: missing.name,
                });
                response.badRequest(withTrace({
                    error: `Sem dados em ${missing.name} para o informe ${idInforme}`,
                }));
                return;
            }
            const incomesData = {
                totalRendimentos: this.formattedCurrency(incomes[0].TOTAL_RENDIMENTOS),
                contribuiçãoProvidenciariaOficial: this.formattedCurrency(incomes[0].CONTRIB_PREVID_OFICIAL),
                contribuiçãoEntidadesPrevComplementar: this.formattedCurrency(incomes[0].CONTRIB_PREVID_COMPL_FAPI),
                pensaoAlimenticia: this.formattedCurrency(incomes[0].PENSAO_ALIMENTICIA),
                impostoRendaRetidoNaFonte: this.formattedCurrency(incomes[0].IRRF_RETIDO),
            };
            const incomeReceivedExemptInfosData = {
                parcelaIsenta65: this.formattedCurrency(incomeReceivedExemptInfos[0].PARCELA_ISENTA_65),
                diariasAjudaCusto: this.formattedCurrency(incomeReceivedExemptInfos[0].DIARIAS_AJUDA_CUSTO),
                pensaoProventosMoleGrave: this.formattedCurrency(incomeReceivedExemptInfos[0].PENSAO_PROVENTOS_MOLE_GRAVE),
                lucrosDividendos: this.formattedCurrency(incomeReceivedExemptInfos[0].LUCROS_DIVIDENDOS),
                valoresPagosTitularMei: this.formattedCurrency(incomeReceivedExemptInfos[0].VALORES_PAGOS_TITULAR_MEI),
                indenizacao: this.formattedCurrency(incomeReceivedExemptInfos[0].INDENIZACAO),
                outros: this.formattedCurrency(incomeReceivedExemptInfos[0].OUTROS_ISENTOS),
            };
            const incomeOtherInfosData = {
                decimoTerceiroSalario: this.formattedCurrency(incomeOtherInfos[0].DECIMO_TERCEIRO),
                impostoRendaRetidoNaFonteSobre13oSalario: this.formattedCurrency(incomeOtherInfos[0].IRRF_RETIDO_13),
                outros: this.formattedCurrency(incomeOtherInfos[0].OUTROS_EXCLUSIVOS),
            };
            const templatePdf = this.InitPdf() +
                this.templateHeaderInfos(ano) +
                this.templateEnterpriseInfos(enterprise?.cnpj ?? "", enterprise?.nomeempresarial ?? "") +
                this.templatePeopleInfos(funcionario?.cpf ?? "", funcionario?.nome ?? "") +
                this.templateIncomeInfos(incomesData) +
                this.templateIncomeExemptInfos(incomeReceivedExemptInfosData) +
                this.templateIncomeOtherInfos(incomeOtherInfosData) +
                this.templateIncomeReceivedAccumulatedInfos() +
                this.InformationComplementariesInfos(this.formattedCurrency(plrInfos[0].VALOR), planMedicalInfos, pensInfos) +
                this.responsibleForTheInformation(enterprise?.responsavel_irpf ?? "");
            log("HTML do PDF montado", {
                reqId,
                templateLengthChars: templatePdf.length,
            });
            log("gerando PDF", { reqId });
            const pdfTemp = await this.generatePdf(templatePdf);
            log("PDF gerado em disco", {
                reqId,
                filename: pdfTemp.filename,
            });
            log("enviando PDF para S3", { reqId, id_empresa: auth.user?.id_empresa });
            const file = await (0, S3_1.uploadPdfEmpresa)(pdfTemp.filename, auth.user?.id_empresa);
            log("upload S3 concluído", {
                reqId,
                ok: !!file,
                location: file?.Location,
            });
            if (file) {
                fs_1.default.unlink(pdfTemp.filename, () => { });
                log("request concluída com sucesso", { reqId });
                response.json(withTrace({ pdf: file.Location }));
            }
            else {
                log("upload S3 retornou vazio", { reqId });
                response.badRequest(withTrace({ error: "Falha ao enviar PDF (S3 não retornou arquivo)" }));
            }
        }
        catch (error) {
            Logger_1.default.error({ err: error, reqId }, `[IncomeReport] erro na request`);
            response.badRequest(withTrace({ error: "Nenhum dado encontrado", result: error }));
        }
    }
    async generatePdf(template) {
        const options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm",
            type: "pdf",
        };
        const filename = `informe_rendimentos_${Date.now()}.pdf`;
        const dir = "./pdfsTemp";
        await fs_1.default.promises.mkdir(dir, { recursive: true });
        const filepath = `${dir}/${filename}`;
        const document = {
            html: template,
            data: {},
            path: filepath,
        };
        return await pdf_creator_node_1.default.create(document, options);
    }
}
exports.default = IncomeReport;
//# sourceMappingURL=IncomeReport.js.map