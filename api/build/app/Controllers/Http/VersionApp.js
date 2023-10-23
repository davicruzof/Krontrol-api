"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class VersionApp {
    constructor() {
        this.versionApp = async ({ response }) => {
            const versions = await Database_1.default.connection("pg").rawQuery("SELECT * FROM public.version_app");
            return response.json(versions.rows[0]);
        };
    }
}
exports.default = VersionApp;
//# sourceMappingURL=VersionApp.js.map