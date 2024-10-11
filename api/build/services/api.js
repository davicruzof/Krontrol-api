"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "https://datalbus.com.br:8000/api/v2";
const api = axios_1.default.create({
    baseURL: BASE_URL,
});
exports.default = api;
//# sourceMappingURL=api.js.map