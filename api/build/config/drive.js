"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const config_1 = require("@adonisjs/core/build/config");
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
exports.default = (0, config_1.driveConfig)({
    disk: Env_1.default.get('DRIVE_DISK'),
    disks: {
        local: {
            driver: 'local',
            visibility: 'public',
            root: Application_1.default.tmpPath('uploads'),
            serveFiles: true,
            basePath: '/uploads',
        },
        s3: {
            driver: 's3',
            visibility: 'public',
            key: Env_1.default.get('AWS_ACCESS_KEY_ID'),
            secret: Env_1.default.get('AWS_SECRET_ACCESS_KEY'),
            region: Env_1.default.get('AWS_REGION'),
            bucket: Env_1.default.get('AWS_S3_BUCKET')
        },
    },
});
//# sourceMappingURL=drive.js.map