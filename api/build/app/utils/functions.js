"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
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
//# sourceMappingURL=functions.js.map