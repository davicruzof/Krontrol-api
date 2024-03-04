export const templateDECIMO = `
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
                    FONE: {{dados.cabecalho.telefone}} - CNPJ: {{dados.cabecalho.inscricaoEmpresa}}
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
                    DEMONSTRATIVO DÉCIMO TERCEIRO SALÁRIO
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
                        width: 10%;"><span>{{this.CODEVENTO}} - {{this.DESCEVEN}}</span>
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
                Base FGTS 13º Salário
            </th>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                FGTS 13º Salário
            </th>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                Base IRRF 13º Salário
            </th>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                Base INSS 13º Salário
            </th>
            <th style="
                        border: 1px solid black;
                        width: 20%;">
                LIQUIDO 13º Salário
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
