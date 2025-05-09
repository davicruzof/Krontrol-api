"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const databaseConfig = {
    connection: Env_1.default.get("DB_CONNECTION"),
    connections: {
        pg: {
            client: "pg",
            connection: {
                host: Env_1.default.get("PG_HOST"),
                port: Env_1.default.get("PG_PORT"),
                user: Env_1.default.get("PG_USER"),
                password: Env_1.default.get("PG_PASSWORD", ""),
                database: Env_1.default.get("PG_DB_NAME"),
                ssl: {
                    rejectUnauthorized: false,
                },
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: true,
        },
        oracle: {
            client: "oracledb",
            connection: {
                user: Env_1.default.get("ORACLE_USER"),
                password: Env_1.default.get("ORACLE_PASSWORD"),
                host: Env_1.default.get("ORACLE_HOST"),
                port: Env_1.default.get("ORACLE_PORT"),
                database: Env_1.default.get("ORACLE_DB_NAME"),
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: true,
            debug: true,
        },
    },
};
exports.default = databaseConfig;
//# sourceMappingURL=database.js.map