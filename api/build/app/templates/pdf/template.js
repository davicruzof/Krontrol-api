"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fichaPonto = exports.templateDotCard = void 0;
exports.templateDotCard = `
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Holerite</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            min-width: 58mm;
        }
    </style>
</head>

<body>
    <table>
        <tr>
            <th></th>
            <th></th>
            <th>
                <img src='{{ dados.cabecalho.logo }} ' />
            </th>
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            <th>
                <span>{{dados.cabecalho.nomeEmpresa}}</span>
            </th>
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            <th>
                <span>
                    ENDEREÇO: {{dados.cabecalho.endereco.rua}} - Nº {{dados.cabecalho.endereco.numero}} - {{dados.cabecalho.endereco.cidade}}
                </span>
            </th>
            <th></th>
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            <th>
                <span>
                    {{#ifCond dados.cabecalho.endereco.estado "!=" 'ISENTO'}}
                        ESTADO: {{ dados.cabecalho.endereco.estado }}
                    {{/ifCond}}
                </span>
            </th>
            <th></th>
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            <th>
                <span>
                    FONE: {{dados.cabecalho.telefone}} - CNPJ: CNPJ: {{dados.cabecalho.inscricaoEmpresa}}
                </span>
            </th>
            <th></th>
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th></th>
            <th>
                <span>
                    DEMONSTRATIVO DE PAGAMENTO
                </span>
            </th>
            <th></th>
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th>
                <span>
                    REFERÊNCIA: {{dados.cabecalho.competencia}}
                </span>
            </th>
            <th></th>
            <th></th>
        </tr>
    </table>

    <table>
        <tr>
            <td>
                <b>Matricula</b>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <b>Nome</b>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <b>Função</b>
            </td>
        </tr>
        <tr>
            <td>
                <span>{{dados.cabecalho.matricula}}</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <span>{{dados.cabecalho.nome}}</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <span>{{dados.cabecalho.funcao}}</span>
            </td>
        </tr>
    </table>

    <table style="width: 100%">
        <tr>
            <th style="
                    border: 1px solid black;
                    width: 40%;">
                Descrição
            </th>
            <th style="
                    border: 1px solid black;
                    width: 20%;">
                Referência
            </th>
            <th style="
                    border: 1px solid black;
                    width: 20%;">
                Vencimentos
            </th>
            <th style="
                    border: 1px solid black;
                    width: 20%;">
                Descontos
            </th>
        </tr>
        {{#each dados.descricao}}
            <tr>
                <td style="
                        border: 1px solid black;
                        width: 40%;"><span>{{this.DESCEVEN}}</span>
                </td>
                <td
                    align="right"
                    style="
                        border: 1px solid black;
                        width: 20%;">
                        <span>
                        {{#ifCond this.REFERENCIA "!=" '0'}}
                            {{this.REFERENCIA}}
                        {{/ifCond}}
                        </span>
                </td>
                <td
                    align="right"
                    style="
                        border: 1px solid black;
                        width: 20%;">
                        <span>
                        {{#ifCond this.TIPOEVEN "!=" 'D'}}
                            {{this.VALORFICHA}}
                        {{/ifCond}}
                        </span>
                </td>
                <td
                    align="right"
                    style="
                        border: 1px solid black;
                        width: 20%;">
                        <span>
                        {{#ifCond this.TIPOEVEN "==" 'D' }}
                            {{this.VALORFICHA}}
                        {{/ifCond}}
                        </span>
                </td>
            </tr>
        {{/each}}

        <tr>
            <th style="width: 40%; border: 1px solid black; ">
                Total
            </th>
            <td
                style="
                    border: 1px solid black;
                    width: 20%;">
                --
            </td>
            <td
                align="right"
                style="
                    border: 1px solid black;
                    width: 20%;">
                {{dados.totais.PROVENTOS}}
            </td>
            <td
                align="right"
                style="
                    border: 1px solid black;
                    width: 20%;">
                {{dados.totais.DESCONTOS}}
            </td>
        </tr>

    </table>

    <table style="width: 100%; margin-top: 5%;">
        <tr>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                Base FGTS
            </th>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                FGTS
            </th>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                Base IRRF
            </th>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                Base INSS
            </th>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                LIQUIDO
            </th>
        </tr>
        <tr>
            <td
                align="right"
                style="
                        border: 1px solid black;
                        width: 20%;">
                {{ dados.bases.BASE_FGTS_FOLHA }}
            </td>
            <td
                align="right"
                style="
                        border: 1px solid black;
                        width: 20%;">
                {{dados.bases.FGTS_FOLHA}}
            </td>
            <td
                align="right"
                 style="
                        border: 1px solid black;
                        width: 20%;">
                {{dados.bases.BASE_IRRF_FOLHA}}
            </td>
            <td
            align="right"
                style="
                        border: 1px solid black;
                        width: 20%;">
                {{dados.bases.BASE_INSS_FOLHA}}
            </td>
            <td
                align="right"
                style="
                        border: 1px solid black;
                        width: 20%;">
                {{dados.totais.LIQUIDO}}
            </td>
        </tr>
    </table>

</body>

</html>
`;
exports.fichaPonto = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ponto</title>
    <style>
        body {
            padding: 0;
            margin: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        table {
            width: 100%;
        }

        span {
            font-weight: 500;
            font-size: 14px;
            padding: 1em;
            padding-right: 0.5em;
            padding-left: 0;
        }

        tr td {
            width: 9%;
        }

        tr td:first-child {
            width: 20%;
        }


        tr {
            width: 100%;
            display: block;
            border-bottom: 1px dashed #000;
        }
    </style>
</head>

<span>
    <span>
        LISTAGEM DE MOVIMENTOS DA FREQUÊNCIA REFERENTE A {{dados.cabecalho.competencia}}
    </span>
    <hr size="1" style="border:1px dashed #000;">
    <div>
        <span>EMPRESA: </span><span>{{dados.cabecalho.nomeEmpresa}}</span>
    </div>
    <div>
        <span>ENDEREÇO: </span><span>{{dados.cabecalho.endereco}}</span>
    </div>
    <div>
        <span>CNPJ: </span><span>{{dados.cabecalho.cnpj}}</span>
    </div>
    <hr size="1" style="border:1px dashed #000;">
    <div>
        <span>FUNCIONÁRIO: </span><span>{{dados.cabecalho.ID_FUNCIONARIO_ERP}} - {{dados.cabecalho.nome}}</span>
    </div>
    <div>
        <span>FUNÇÃO: </span><span>{{dados.cabecalho.funcao}}</span>
    </div>
    <hr size="1" style="border:1px dashed #000;">
    <table style="margin-bottom: 20px;">
        <tr>
            <td style="width:12%;" >Data </td>
            <td style="width:7%;padding-left: 4px;" >Entrada </td>
            <td style="width:7%;padding-left: 8px;">I. Ini.</td>
            <td style="width:7%;">I. Fim </td>
            <td style="width:6%;">Saída </td>
            <td style="width:8%;padding-left: 16px;">Normal </td>
            <td style="width:7%;padding-left: 4px;">Extra </td>
            <td style="width:7%;padding-left: 8px;">A.N </td>
            <td style="width:9%;">Debito </td>
            <td style="width:9%;">Credito </td>
            <td style="width:6%;">Outra </td>
            <td style="width:15%;">Ocorrência </td>
        </tr>

        {{#each dados.dadosDias}}
            <tr>
                <td style="width:12%;">{{this.DT_EXIBICAO}} </td>
                <td style="width:7%;padding-left: 4px;">{{this.ENTRADA}} </td>
                <td style="width:7%;padding-left: 8px;">{{this.I_INI}} </td>
                <td style="width:7%;padding-left: 4px;">{{this.I_FIM}} </td>
                <td style="width:6%;padding-left: 4px;">{{this.SAIDA}} </td>
                <td style="width:8%;padding-left: 8px;">{{this.NORMAL}} </td>
                <td style="width:7%;padding-left: 8px;"> {{this.EXTRA}} </td>
                <td style="width:7%;padding-left: 8px;">{{this.A_NOT}} </td>
                <td style="width:9%;">{{this.BD_DEBITO}} </td>
                <td style="width:9%;">{{this.BH_CREDITO}} </td>
                <td style="width:6%;">{{this.OUTRA}} </td>
                <td style="width:15%; font-size: 10px;">{{this.OCORRENCIA}}</td>
            </tr>
        {{/each}}
    </table>

    <table style="margin-top: 10px;" >
        <tr style="border: none; display: table-row;">
            <td align="left" style="width: 80%;">EVENTO</td>
            <td alignt="right" style="width: 20%;">HR/DIA</td>
        </tr>
        {{#each dados.resumo}}
            <tr>
                <td align="left" style="width: 80%;">{{this.EVENTO}}</td>
                <td alignt="right" style="width: 20%;">{{this.HR_DIA}}</td>
            </tr>
        {{/each}}
    </table>

    <hr size="1" style="border:1px dashed #000;">

    <table >
        <tr style="border: none; display: table-row;">
            <td style="width: 25%;"><b>*** BANCO DE HORAS ***</b></td>
            <td style="width: 25%;">
                COMPETÊNCIA: {{dados.cabecalho.competencia}}
            </td>
            <td style="width: 25%;">
                SALDO ANTERIOR: {{dados.rodape.saldoAnterior}}
            </td>
            <td style="width: 25%;">
                SALDO ATUAL: {{dados.rodape.saldoAtual}}
            </td>
        </tr>
        <tr style="border: none;display: table-row">
            <td style="width: 25%;"><span><b></b></span></td>
            <td style="width: 25%;">CREDITO: {{dados.rodape.credito}}</td>
            <td style="width: 25%;">DEBITO: {{dados.rodape.debito}}</td>
            <td style="width: 25%;">VALOR PAGO: {{dados.rodape.valorPago}}</td>
        </tr>
    </table>
    </body>
</html>
`;
//# sourceMappingURL=template.js.map