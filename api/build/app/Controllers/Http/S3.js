"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPdfEmpresa = exports.upload = exports.createBucket = void 0;
const aws_sdk_1 = require("../../../libs/aws-sdk");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const Empresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Empresa"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const createBucket = async (params) => {
    try {
        const data = await aws_sdk_1.s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: params.Bucket }));
    }
    catch (error) {
        return (new standalone_1.Exception(error));
    }
};
exports.createBucket = createBucket;
const upload = async (params) => {
    await params.file.moveToDisk('files', {
        name: params.filename
    });
    const buffer = fs_1.default.createReadStream('tmp/uploads/files/' + params.filename);
    let putObjectPromise = aws_sdk_1.s3connection.upload({
        Bucket: params.bucket,
        Key: params.folder + '/' + params.path,
        ACL: 'public-read',
        Body: buffer,
        ContentType: params.type
    }).promise().then(function (data) {
        return data;
    });
    return await putObjectPromise;
};
exports.upload = upload;
const uploadPdfEmpresa = async (filepath, id_empresa) => {
    let buffer = fs_1.default.createReadStream(filepath);
    let empresa = await Empresa_1.default.findBy('id_empresa', id_empresa);
    if (empresa) {
        let putObjectPromise = aws_sdk_1.s3connection.upload({
            Bucket: empresa.bucket,
            Key: 'pdfs/' + Math.random() + '_doc' + '.pdf',
            ACL: 'public-read',
            Body: buffer,
            ContentType: '.pdf'
        }).promise().then(function (data) {
            return data;
        });
        return await putObjectPromise;
    }
};
exports.uploadPdfEmpresa = uploadPdfEmpresa;
//# sourceMappingURL=S3.js.map