"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3connection = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const REGION = Env_1.default.get("S3_REGION");
exports.s3Client = new client_s3_1.S3Client({
    region: REGION,
});
aws_sdk_1.default.config.update({ region: REGION });
exports.s3connection = new aws_sdk_1.default.S3();
//# sourceMappingURL=aws-sdk.js.map