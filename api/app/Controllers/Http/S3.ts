import { s3Client, s3connection } from "../../../libs/aws-sdk";
import { CreateBucketCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import Empresa from "App/Models/Empresa";
import { Exception } from "@adonisjs/core/build/standalone";

export const createBucket = async (params) => {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: params.Bucket }));
  } catch (error) {
    return new Exception(error);
  }
};

export const upload = async (params) => {
  await params.file.moveToDisk("files", {
    name: params.filename,
  });
  const buffer = fs.createReadStream("tmp/uploads/files/" + params.filename);

  let putObjectPromise = s3connection
    .upload({
      Bucket: params.bucket,
      Key: params.folder + "/" + params.path,
      ACL: "public-read",
      Body: buffer,
      ContentType: params.type,
    })
    .promise()
    .then(function (data) {
      return data;
    });

  return await putObjectPromise;
};

export const uploadPdfEmpresa = async (filepath, id_empresa) => {
  let buffer = fs.createReadStream(filepath);
  let empresa = await Empresa.findBy("id_empresa", id_empresa);
  if (empresa) {
    let putObjectPromise = s3connection
      .upload({
        Bucket: empresa.bucket,
        Key: "pdfs/" + Math.random() + "_doc" + ".pdf",
        ACL: "public-read",
        Body: buffer,
        ContentType: ".pdf",
      })
      .promise()
      .then(function (data) {
        return data;
      });
    return await putObjectPromise;
  }
};
