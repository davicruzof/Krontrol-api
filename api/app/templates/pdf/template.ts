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
    <hr size="1" style="border:1px dashed #000;">
    <span>
        LISTAGEM DE MOVIMENTOS DA FREQUÊNCIA REFERENTE A {{dados.periodo}}
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
            <td style= "width:20%;" > Data </td>
            <td style= "width:10%;" > Entrada </td>
            <td align="center" style= "width:10%;"> I. Ini.</td>
            <td align="center" style= "width:10%;"> I. Fim </td>
            <td align="center" style= "width:10%;"> Saída </td>
            <td align="center" style= "width:10%;"> Linha </td>
            <td style= "width:6%;"> Normal </td>
            <td> Extra </td>
            <td> Excess </td>
            <td> Outra </td>
            <td> Total </td>
        </tr>

        {{#each dados.dadosDias}}
            <tr>
                <td style= "width:20%; align:center;">{{this.DATA_MOVIMENTO}}</td>
                <td style= "width:10%;">{{this.ENTRADA}}</td>
                <td style= "width:10%;">{{this.I_INI}}</td>
                <td style= "width:10%;">{{this.I_FIM}}</td>
                <td style= "width:10%;">{{this.SAIDA}}</td>
                <td style= "width:10%;">{{this.LINHA}}</td>
                <td style= "width:7%;">{{this.NORMAL}}</td>
                <td>{{this.EXTRA}}</td>
                <td>{{this.EXCES}}</td>
                <td>{{this.OUTRA}}</td>
                <td>{{this.TOTALF}}</td>
            </tr>
        {{/each}}
    </table>

    <hr size="1" style="border:1px dashed #000;">

    <table>
        <tr style="border: none; display: table-row;">
            <td style="width: 25%;"><b>*** BANCO DE HORAS ***</b></td>
            <td style="width: 25%;">
                COMPETÊNCIA: {{dados.cabecalho.data}}
            </td>
            <td style="width: 25%;">
                SALDO ANTERIOR: {{dados.rodape.saldoAnterior}}
            </td>
            <td style="width: 25%;">
                SALDO ATUAL: {{dados.rodape.saldoAnterior + dados.rodape.credito - dados.rodape.debito - dados.rodape.valorPago}}
            </td>
        </tr>
        <tr style="border: none;display: table-row">
            <td style="width: 25%;"><span><b></b></span></td>
            <td style="width: 25%;">CREDITO: {{dados.rodape.credito}}</td>
            <td style="width: 25%;">DEBITO: {{dados.rodape.debito}}</td>
            <td style="width: 25%;">VALOR PAGO: {{dados.rodape.valorPago}}</td>
        </tr>
    </table>
    <hr size="1" style="border:1px dashed #000;">


    </body>

</html>
`