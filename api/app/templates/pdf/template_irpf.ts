export const templateIRPF = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Rendimentos</title>
    <style>
        body {
        padding: 0;
        margin: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        padding: 30px;
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

        tr {
        width: 100%;
        }

        hr {
        border: 1px solid #000;
        }
    </style>
    </head>

    <body>

    <table>
        <tr style="width: 100%;">
        <td style="width: 50%; border: 1px solid #000; padding: 4px; font-size: 12px;">
            <center>
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
                <b>Exercício de {{dados.iprf.EXERCICIO}}</b>
            </div>
            </center>
        </td>
        <td style="border: 1px solid #000; padding: 4px; font-size: 12px;">
            <center>
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
                <b>Ano-calendário {{dados.iprf.ANO}}</b>
            </div>
            </center>
        </td>
        </tr>
    </table>

    <table>
        <tr>
        <td style="border: 1px solid #000; padding: 8px; font-size: 12px;">
            <center>
            Verifique as condições e o prazo para aprensentação da Declaração do Imposto sobre a Renda da Pessoa Física
            para
            </center>
            <center>
            este ano-calendário no sítio daSecretaria da da Receita Federal do Brasil na Internet, no endereço
            <www.receita.fazenda.gov.br>
            </center>
        </td>
        </tr>
    </table>

    <b style="font-size: 10px;">1. Fonte Pagadora Pessoa Jurídica ou Pessoa Física</b>

    <table>
        <tr style="width: 100%;">
        <td style="width: 40%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            CNPJ: {{dados.iprf.CNPJ_EMPRESA}}
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            Empresa: {{dados.iprf.NOME_EMPRESA}}
            </div>
        </td>
        </tr>
    </table>

    <b style="font-size: 10px;">2. Pessoa Física Beneficiária dos Rendimentos</b>

    <table>
        <tr style="width: 100%;">
        <td style="width: 30%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            CPF: {{dados.iprf.CPF}}
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            Nome Completo: {{dados.iprf.NOME}}
            </div>
        </td>
        </tr>
    </table>
    <table>
        <tr style="width: 100%;">
        <td style="width: 100%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            Natureza do rendimento
            </div>
        </td>
        <td />
        </tr>
    </table>

    <b style="font-size: 10px;">3. Rendimentos Tributáveis, Deduções e Imposto de renda Retido na Fonte</b>

    <table>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            1.Total dos rendimentos(Inclusive férias)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: end; font-size:10px;">
            {{dados.iprf.VLR_RENDIMENTO}}
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
            <div style="text-align: end; font-size:10px;">
            {{dados.iprf.VLR_CPO}}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            3. Contribuição a entidades de prev. complementar e a fundos de aposentadoria prog. individual - Fapi (quadro
            7)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: end; font-size:10px;">
            R$: 0,00
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            4. Pensão Alimentícia(Informar beneficiário no quadro 7)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 8px;">
            <div style="text-align: end; font-size:10px;">
            {{dados.iprf.VLR_PENSAO_ALIM}}
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
            <div style="text-align: end; font-size:10px;">
            {{dados.iprf.VLR_IMP_RETIDO}}
            </div>
        </td>
        </tr>
    </table>

    <table>
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
            1. Parcela Isenta dos proventos de aposentadoria, reserva, reforma e pensão (65 anos ou mais)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: end; font-size: 10px;">
            R$: 0,00
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
            <div style="text-align: end; font-size: 10px;">
            R$: 0,00
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            3. Pensão e proventos de aposentadoria ou reforma por moléstia grave proventos de aposentadoria ou reforma por
            acidente
            em serviço
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: end; font-size: 10px;">
            R$: 0,00
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            4. Lucros e dividendos, apurados a partir de 1996, pago por pessoa jurídica(lucro real, presumido ou
            arbitrado)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: end; font-size: 10px;">
            R$: 0,00
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            5. Valores pagos ao titular ou sócio da microempresa ou empresa de pequeno porte, exceto pro labore, aluguéis
            ou
            serviços prestados
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: end; font-size: 10px;">
            R$: 0,00
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
            <div style="text-align: end; font-size: 10px;">
            {{dados.iprf.VLR_INDENIZACAO}}
            </div>
        </td>
        </tr>
        <tr style="width: 100%;">
        <td style="width: 80%; border: 1px solid #000; padding: 4px;">
            <div style="font-size: 10px;">
            7. Outros:(CLÁUSULA 3ª DA CCT;)
            </div>
        </td>
        <td style="border: 1px solid #000; padding: 4px;">
            <div style="text-align: end; font-size: 10px;">
            {{dados.iprf.VLR_DEDMP}}
            </div>
        </td>
        </tr>
    </table>

    <table>
        <tr>
        <td style="width: 80%;padding: 4px;">
            <b style="font-size: 10px;">5. Rendimentos sujeitos a Tributação Exclusiva(rendimento líquido)</b>
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
              <div style="text-align: end; font-size: 10px;">
              {{dados.iprf.VLR_DEC13}}
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
            <div style="text-align: end; font-size: 10px;">
            {{dados.iprf.VLR_DECIMO}}
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
            <div style="text-align: end; font-size: 10px;">
            {{dados.iprf.VLR_OUTROS}}
            </div>
        </td>
        </tr>
    </table>

    <div>
        <b style="font-size: 10px;">6. Rendimentos recebidos acumuladamente - art.12-a da lei no.7.713, de 1988 (sujeito a tributacão exclusiva)</b>
    </div>

    <div>
        <b style="font-size: 10px;">7. Informações complementares</b>
    </div>

    <div style="min-height: 100px; border: 1px solid #000; margin: 2px">
      <div style="font-size: 10px;">
        Rendimentos isentos outros:
      </div>
      <div style="font-size: 10px; margin-left: 4px;">
        - Abono pecuniário: {{dados.iprf.PECUNIARIO}}
      </div>
      <div style="font-size: 10px;">
        Participação nos lucros ou resultados (PLR): {{dados.iprf.PLR}}
      </div>
      <div style="font-size: 10px;">
        Titular
      </div>


      <div>
        {{dados.titular}}
      </div>

      <div style="font-size: 10px;">
        Dependentes
      </div>




      {{dados.iprf.INF_COMPL}}
    </div>

    <b style="font-size: 14px;">8. RESPONSAVEL PELAS INFORMACOES</b>

    <table>
        <tr style="width: 100%;">
        <td style="width: 40%; border: 1px solid #000; padding: 8px;">
            <div style="font-size: 10px;">
            Nome: {{dados.iprf.RESPONSAVEL}}
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
