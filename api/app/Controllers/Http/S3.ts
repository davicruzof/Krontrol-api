import { s3Client, s3connection } from '../../../libs/aws-sdk';
import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
export  const createBucket = async (params) =>{
    try{
        
        const data = await s3Client.send(
            new CreateBucketCommand({Bucket:params.Bucket})
        );
        //return data;
    }
    catch(error){
        console.log(error);
    }
}

export const upload = async (params) =>{

    await params.file.moveToDisk('files',{
      name: params.filename
    });
      const buffer = fs.createReadStream('tmp/uploads/files/'+params.filename);

        s3connection.upload({

        Bucket : params.bucket,
        Key : params.folder+'/'+params.path,
        ACL : 'public-read',
        Body : buffer,
        ContentType: params.type

      },(error,data)=>{
      if(error){
        console.log(error);
      }
      else {
         //console.log(data);
         fs.unlinkSync('tmp/uploads/files/'+params.filename);
         //const infoFile = data;
        }
    })


}