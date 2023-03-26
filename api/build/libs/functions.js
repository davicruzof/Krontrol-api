"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.date_is_valid = void 0;
function date_is_valid(data) {
    const data_atual = new Date();
    const data_aux = new Date(data);
    if (data_aux >= data_atual)
        return false;
    else
        return true;
}
exports.date_is_valid = date_is_valid;
function formatDate(date, format) {
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        aa: date.getFullYear().toString().slice(-2),
        aaaa: date.getFullYear()
    };
    return format.replace(/mm|dd|aa|aaaa/gi, matched => map[matched]);
}
exports.formatDate = formatDate;
//# sourceMappingURL=functions.js.map