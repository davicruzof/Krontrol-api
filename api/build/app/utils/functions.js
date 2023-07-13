"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarAno = exports.isValidDate = exports.sleep = void 0;
function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000")
        return false;
    for (let i = 1; i <= 9; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11))
        Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)))
        return false;
    Soma = 0;
    for (let i = 1; i <= 10; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11))
        Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11)))
        return false;
    return true;
}
exports.default = TestaCPF;
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function isValidDate(dateString) {
    let date = new Date(dateString);
    return !isNaN(date.getTime());
}
exports.isValidDate = isValidDate;
function validarAno(ano) {
    if (isNaN(ano)) {
        return false;
    }
    ano = parseInt(ano);
    if (ano < 1000 || ano > 9999) {
        return false;
    }
    if ((ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0) {
        return true;
    }
    return false;
}
exports.validarAno = validarAno;
//# sourceMappingURL=functions.js.map