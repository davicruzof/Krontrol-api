import { S3Client } from "@aws-sdk/client-s3";
import AWS from "aws-sdk";
import Env from "@ioc:Adonis/Core/Env";

const REGION = Env.get("S3_REGION");

export const s3Client = new S3Client({
  region: REGION,
});

AWS.config.update({ region: REGION });
export const s3connection = new AWS.S3();
