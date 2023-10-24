"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template_Ficha_Ponto = void 0;
exports.Template_Ficha_Ponto = `
<!DOCTYPE html>
<html lang="pt-br">

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
        <span>EMPRESA: {{dados.cabecalho.nomeEmpresa}}</span>
    </div>
    <div>
        <span>ENDEREÇO: {{dados.cabecalho.endereco}}</span>
    </div>
    <div>
        <span>CNPJ: {{dados.cabecalho.cnpj}}</span>
    </div>
    <hr size="1" style="border:1px dashed #000;">
    <div>
        <span>FUNCIONÁRIO: {{dados.cabecalho.nome}}</span>
    </div>
    <div>
        <span>FUNÇÃO: {{dados.cabecalho.funcao}}</span>
    </div>
    <hr size="1" style="border:1px dashed #000;">
    <table style="margin-bottom: 20px;">
        <tr>
            <td style="width:12%;">Data </td>
            <td style="width:7%;">Entrada </td>
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

    <table style="margin-top: 10px;">
        <tr style="border: none; display: table-row;">
            <td align="left">EVENTO</td>
            <td alignt="right">HR/DIA</td>
        </tr>
        {{#each dados.resumo}}
        <tr style="border: none; display: table-row;">
            <td align="left">{{this.EVENTO}}</td>
            <td alignt="right">{{this.HR_DIA}}</td>
        </tr>
        {{/each}}
    </table>

    <hr size="1" style="border:1px dashed #000;">

    <table>
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
//# sourceMappingURL=template_ficha_ponto.js.map