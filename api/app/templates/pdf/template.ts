export const templateDotCard = `
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
                Vencimentos
            </th>
            <th style="
                    border: 1px solid black; 
                    width: 20%;">
                Referência
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
                <td style="
                        border: 1px solid black; 
                        width: 20%;">
                        <span>
                        {{#ifCond this.TIPOEVEN "!=" 'D'}}
                            {{this.VALORFICHA}}
                        {{/ifCond}}
                        </span>
                </td>
                <td style="
                        border: 1px solid black; 
                        width: 20%;">
                        <span>
                        {{#ifCond this.REFERENCIA "!=" '0'}}
                            {{this.REFERENCIA}}
                        {{/ifCond}}
                        </span>
                </td>
                <td style="
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
            <td style="
                    border: 1px solid black; 
                    width: 20%;">
                {{dados.totais.PROVENTOS}}
            </td>
            <td style="
                    border: 1px solid black; 
                    width: 20%;">
                --
            </td>
            <td style="
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
                        width: 25%;">
                Base FGTS
            </th>
            <th style="
                        border: 1px solid black; 
                        width: 25%;">
                FGTS
            </th>
            <th style="
                        border: 1px solid black; 
                        width: 25%;">
                Base IRRF
            </th>
            <th style="
                        border: 1px solid black; 
                        width: 25%;">
                Base INSS
            </th>
        </tr>
        <tr>
            <td style="
                        border: 1px solid black; 
                        width: 25%;">
                {{ dados.bases.BASE_FGTS_FOLHA }}
            </td>
            <td style="
                        border: 1px solid black; 
                        width: 25%;">
                {{dados.bases.FGTS_FOLHA}}
            </td>
            <td style="
                        border: 1px solid black; 
                        width: 25%;">
                {{dados.bases.BASE_IRRF_FOLHA}}
            </td>
            <td style="
                        border: 1px solid black; 
                        width: 25%;">
                {{dados.bases.BASE_INSS_FOLHA}}
            </td>
        </tr>
    </table>

</body>

</html>
`

export const fichaPonto = `
!DOCTYPE html>
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
    <hr size="1" style="border:1px dashed #000;">
    <span>
        LISTAGEM DE MOVIMENTOS DA FREQUÊNCIA REFERENTE AO PERÍODO DE: 01/MM/AAAA a 30/MM/AAAA
    </span>
    <hr size="1" style="border:1px dashed #000;">
    <div>
        <span>EMPRESA: </span><span>[Nome da empresa]</span>
    </div>
    <div>
        <span>ENDEREÇO: </span><span>[Endereço da empresa]</span>
    </div>
    <div>
        <span>CNPJ: </span><span>[CNPJ da empresa]</span>
    </div>
    <hr size="1" style="border:1px dashed #000;">
    <div>
        <span>FUNCIONÁRIO: </span><span>[Chapa funcionário] - [Nome do funcionário]</span>
    </div>
    <div>
        <span>FUNÇÃO: </span><span>[Função do funcionário]</span>
    </div>
    <hr size="1" style="border:1px dashed #000;">
    <table style="margin-bottom: 20px;">
        <tr>
            <td>Data</td>
            <td>Entrada</td>
            <td>I. Ini.</td>
            <td>I. Fim</td>
            <td>Saída</td>
            <td>Linha</td>
            <td>Normal</td>
            <td>Extra</td>
            <td>Excess</td>
            <td>Outra</td>
            <td>Total</td>
        </tr>



        <tr>
            <td>01/11/2022 TER</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>0532</td>
            <td>Normal</td>
            <td>Extra</td>
            <td>Excess</td>
            <td>Outra</td>
            <td>Total</td>
        </tr>

        <tr>
            <td>02/11/2022 QUA</td>
            <td>Folga</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>

        <tr>
            <td>03/11/2022 QUI</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>0532</td>
            <td>Normal</td>
            <td>Extra</td>
            <td>Excess</td>
            <td>Outra</td>
            <td>Total</td>
        </tr>
        <tr>
            <td>04/11/2022 SEX</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>05:32</td>
            <td>0532</td>
            <td>Normal</td>
            <td>Extra</td>
            <td>Excess</td>
            <td>Outra</td>
            <td>Total</td>
        </tr>

        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total</td>
            <td>Total</td>
            <td>Total</td>
            <td>Total</td>
            <td>Total</td>
        </tr>

    </table>

    <hr size="1" style="border:1px dashed #000;">

    <table>
        <tr style="border: none; display: table-row;">
            <td style="width: 25%;"><b>*** BANCO DE HORAS ***</b></td>
            <td style="width: 25%;">
                COMPETÊNCIA: 11/2022
            </td>
            <td style="width: 25%;">
                SALDO ANTERIOR: 0,00
            </td>
            <td style="width: 25%;">
                SALDO ATUAL: 0,00
            </td>
        </tr>
        <tr style="border: none;display: table-row">
            <td style="width: 25%;"><span><b></b></span></td>
            <td style="width: 25%;">CREDITO: 1,44</td>
            <td style="width: 25%;">DEBITO: 0,00</td>
            <td style="width: 25%;">VALOR PAGO: 0,00</td>
        </tr>
    </table>
    <hr size="1" style="border:1px dashed #000;">


    </body>

</html>
`