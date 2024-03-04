"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.default = Env_1.default.rules({
    HOST: Env_1.default.schema.string({ format: 'host' }),
    PORT: Env_1.default.schema.number(),
    APP_KEY: Env_1.default.schema.string(),
    APP_NAME: Env_1.default.schema.string(),
    DRIVE_DISK: Env_1.default.schema.enum(['local']),
    NODE_ENV: Env_1.default.schema.enum(['development', 'production', 'test']),
    PG_HOST: Env_1.default.schema.string({ format: 'host' }),
    PG_PORT: Env_1.default.schema.number(),
    PG_USER: Env_1.default.schema.string(),
    PG_PASSWORD: Env_1.default.schema.string.optional(),
    PG_DB_NAME: Env_1.default.schema.string(),
    AWS_ACCESS_KEY_ID: Env_1.default.schema.string(),
    AWS_SECRET_ACCESS_KEY: Env_1.default.schema.string(),
    AWS_S3_BUCKET: Env_1.default.schema.string(),
    AWS_REGION: Env_1.default.schema.string(),
    ORACLE_HOST: Env_1.default.schema.string({ format: 'host' }),
    ORACLE_PORT: Env_1.default.schema.number(),
    ORACLE_USER: Env_1.default.schema.string(),
    ORACLE_PASSWORD: Env_1.default.schema.string.optional(),
    ORACLE_DB_NAME: Env_1.default.schema.string(),
    DATALBUS_API_LOGIN: Env_1.default.schema.string(),
    DATALBUS_API_PASSWORD: Env_1.default.schema.string(),
});
//# sourceMappingURL=env.js.map