"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateFERIAS = void 0;
exports.templateFERIAS = `
<!DOCTYPE html>
<html>
    
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    <tr style="width: 100%;" height="20%">
        <td style="width: 50%; border: 1px solid #000; padding: 8px;">
            <center>
                <h1>RECIBO DE FÉRIAS E ABONO</h1>
                </center>
        </td>
    </tr>
    </table>
    <table>
    <tr style="width: 100%;">
        <td style="width: 30%; border: 1px solid #000; padding: 0px;">
            <center>
                <h4><b>EMPRESA</b></h4>
                </center>
        </td>
    </tr>
    </table>
    <table style="width: 100%; border: 1px solid #000; padding: 8px;">
        <tr >
            <td>
                <div style="padding: 3px;">
                    NOME....................:  <b>TESTE</b>
                </div>
                <div style="padding: 3px;">
                    ENDEREÇO....................:  <b>TESTE</b>
                </div>
                <div style="padding: 3px;">
                    MUNICÍPIO....................:  <b>TESTE</b>
                </div>
                <div style="padding: 3px;">
                    CGC/MF N....................:  <b>TESTE</b>
                </div>
            </td>
            <td >
                <div style="padding: 3px;">
                    CÓDIGO:  <b>002</b>
                </div>
                <div style="padding: 3px;">
                    <b>95</b>
                </div>
                <div style="padding: 3px;">
                    ATIVIDADE:  <b>002</b>
                </div>
            </td>
        </tr>
    </table>
    <table>
        <tr style="width: 100%;">
            <td style="width: 30%; border: 1px solid #000; padding: 0px;">
                <center>
                    <h4><b>EMPREGADO</b></h4>
                    </center>
            </td>
        </tr>
    </table>
    <table style="width: 100%; border: 1px solid #000; padding: 8px;">
        <tr >
            <td>
                <div style="padding: 3px;">
                    NOME....................:  <b>TESTE</b>
                </div>
                <div style="padding: 3px;">
                    DATA ADMISSÃO....................:  <b>10/12/2022 </b> &nbsp;&nbsp;&nbsp;&nbsp;  NUM. CTPS: <b>48</b>
                </div>
                <div style="padding: 3px;">
                    CARGO....................:  <b>MOTORISTA</b>
                </div>
                <div style="padding: 3px;">
                    NUM. CHAPA....................:  <b>10/12/2022 </b> </b> &nbsp;&nbsp;&nbsp;&nbsp;  SALÁRIO BASE: R$ <b>48</b>
                </div>
                <div style="padding: 3px;">
                    AQUISITIVO....................:  <b>10/12/2022 </b>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    A
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <b>10/12/2022</b>
                </div>
                <div style="padding: 3px;">
                    GOZO....................:  <b>10/12/2022 </b>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    A
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <b>10/12/2022</b>
                </div>
            </td>
            <td >
                <div style="padding: 3px;">
                    CÓDIGO:  <b>002</b>
                </div>
                <div style="padding: 3px;">
                    SÉRIE:  <b>00182</b>
                </div>
                <div style="padding: 3px;">
                    &nbsp;
                </div>
                <div style="padding: 3px;">
                    FALTAS NO PERIODO:  <b>0</b>
                </div>
                <div style="padding: 3px;">
                    &nbsp;
                </div>
                <div style="padding: 3px;">
                    &nbsp;
                </div>
            </td>
        </tr>
    </table>
    <table style="width: 100%; border: 1px solid #000; padding: 0px;">
        <tr style="width: 100%;">
            <td style="width: 30%; border: 1px solid #000; padding: 0px;">
                <center>
                    <h4><b>DESCRIÇÃO</b></h4>
                    </center>
            </td>
            <td style="width: 15%; border: 1px solid #000; padding: 0px;">
                <center>
                    <h4><b>REFERÊNCIA</b></h4>
                    </center>
            </td>
            <td style="width: 27%; border: 1px solid #000; padding: 0px;">
                <center>
                    <h4><b>MÊS 03/2022</b></h4>
                    </center>
            </td>
            <td style="width: 27%; border: 1px solid #000; padding: 0px;">
                <center>
                    <h4><b>MÊS 04/2022</b></h4>
                    </center>
            </td>
        </tr>
        <tr>
            <td style="border-right: 1px solid #000; padding: 0px;">
                ASDAS
            </td>
            <td style="border-right: 1px solid #000; padding: 0px;">
                ASDAS
            </td>
            <td style="border-right: 1px solid #000; padding: 0px;">
                ASDAS
            </td>
            <td >
                ASDAS
            </td>
        </tr>
        <tr>
            <td >
                TOTAL
            </td>
            <td >
            </td>
            <td style="border-bottom: 1px solid #000; padding: 0px;">
               3.703,27 
            </td>
            <td >
            </td>
        </tr>
        <tr>
            <td >
                LIQUIDO
            </td>
            <td >
            </td>
            <td>
            </td>
            <td style="border-bottom: 1px solid #000; padding: 0px;">
                3.703,27 
            </td>
        </tr>
    </table>
    <table style="width: 100%; border: 1px solid #000; padding: 8px;">
        <tr >
            <td style="width: 100%;">
                DECLARO QUE RECEBI DAVIA {{NOME_EMPRESA}}
                A IMPORTÂNCIA DE R$ {{TOTAL}}, REFERENTE A 30 DIAS DE FERIAS E {TOTAL_DIAS_ABONO}, SE FOR O CASO, A QUE FIZ JUZ NA FORMA DA LEI, RELATIVA AO PERÍODO DE [AQUISITIVO]  Ã
                [AQUISITIVO],  A FIM DE GOZÁ-LA NO PERÍODO DE [GOZO] A [GOZO].
    
                    PARA QUE SE PRODUZA OS EFEITOS LEGAIS, FIRMO O PRESENTE, DANDO PLENA QUITAÇÃO DO VALOR ORA RECEBIDO
            </td>
        </tr>
        <tr>
            <td style="width: 30%; padding-top: 5%;">
                <b>
                    NOTA: O ABONO DE FÉRIAS NÃO É
                    CONSIDERADO REMUNERADO PARA FINS
                    TRABALHISTAS
                </b>
            </td>
            <td style="width: 70%;">
                SÃO PAULO, [DATA]
            </td>
        </tr>
        <tr>
            <td style="width: 50%;">
                
            </td>
            <td style="width: 70%;">
                ___________________________________________________
            </td>
        </tr>
        <tr>
            <td style="width: 50%;">
                
            </td>
            <td style="width: 70%;">
                <center>
                    EMPREGADO
                </center>
            </td>
        </tr>
        <tr>
            <td style="width: 50%;">
                
            </td>
            <td style="width: 70%;">
                ___________________________________________________
            </td>
        </tr>
        <tr>
            <td style="width: 50%;">
                
            </td>
            <td style="width: 70%;">
                <center>
                    [nome-empresa]
                </center>
            </td>
        </tr>

    </table>

</body>
</html>
`;
//# sourceMappingURL=template-ferias.js.map