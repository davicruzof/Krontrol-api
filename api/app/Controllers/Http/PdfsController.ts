import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PdfsController {

    public async upload({request,response}:HttpContextContract) {
        const files = request.files('files');
        return files;
    }
}
