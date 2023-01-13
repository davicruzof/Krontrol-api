import  Empresa  from 'App/Models/Empresa';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Funcionario from '../../Models/Funcionario';
import pdf from 'pdf-creator-node';
import fs,{ unlink } from 'fs';
import {uploadPdfEmpresa,upload } from 'App/Controllers/Http/S3';
import FuncionarioArea from 'App/Models/FuncionarioArea';
import { FuncionarioSchemaInsert, updateProfileFuncionario } from 'App/Schemas/Funcionario';
import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import ConfirmaFichaPonto from 'App/Models/ConfirmaFichaPonto';
import crypto from 'crypto';
import { fichaPonto, templateDotCard } from 'App/templates/pdf/template';
export default class FuncionariosController {

    public async create({request,response}:HttpContextContract){
        try {
            await request.validate({schema: schema.create(FuncionarioSchemaInsert)});
            const fotoPerfil = request.file('foto_perfil');
            const dados = request.body();
            let s3Object;
            let empresa = await Empresa.findBy('id_empresa',dados.id_empresa);
            if(!empresa){
                return response.badRequest({error: "Empresa não encontrada"});
            }
            let funcionario = await Funcionario.findBy('cpf',dados.cpf);

            if(funcionario){

                response.badRequest({error:"Este cpf já possui cadastro"});
            
            }
            else{

                if(fotoPerfil){
                    let hashImg =  crypto.randomBytes(10).toString('hex');
                    let filename = `${hashImg}-${fotoPerfil.clientName}`;

                          s3Object = 
                           await upload({
                                folder : 'logo',
                                filename : filename,
                                bucket: empresa.bucket,
                                path: filename,
                                file: fotoPerfil,
                                type: fotoPerfil.extname
                            });
                }
                await Funcionario.create({
                    id_grupo: dados.id_grupo,
                    cpf: dados.cpf,
                    id_empresa: dados.id_empresa,
                    registro : dados.registro,
                    nome : dados.nome,
                    id_sexo : dados.id_sexo,
                    celular : dados.celular,
                    id_funcao_erp : dados.id_funcao,
                    dt_nascimento : dados.dt_nascimento,
                    email : dados.email,
                    cnh_emissao : dados.cnh_emissao,
                    id_cnh : dados.id_cnh,
                    foto_url : s3Object.Location
                });
                response.json({sucess: "Criado com sucesso"});
            }

        } catch (error) {

            response.badRequest(error.messages);
            
        }
    }

    public async getById({request,response}:HttpContextContract){
        const  { id_funcionario }    = request.body();

        if(id_funcionario){

            const funcionario = await Database.connection('pg').query()
                                    .from("ml_fol_funcionario")
                                    .select("*")
                                    .innerJoin("ml_fol_funcionario_situacao","ml_fol_funcionario_situacao.id_situacao","=","ml_fol_funcionario.id_situacao")
                                    .innerJoin("ml_fol_funcionario_funcao","ml_fol_funcionario_funcao.id_funcao_erp","=","ml_fol_funcionario.id_funcao_erp")
                                    .where("ml_fol_funcionario.id_funcionario",id_funcionario);

            if(funcionario){

                response.json(funcionario);

            }
            else {

                response.json({error: "Funcionário não encontrada"});

            }
        }
        else{
            response.json({error: "Funcionário não encontrada"});
        }
    }

    public async getAll ({response,auth}:HttpContextContract){

        let funcionarios = await Database.from('ml_fol_funcionario')
            .select('id_funcionario')
            .select('cpf')
            .select('nome')
            .select('registro')
            .select('ml_fol_funcionario_funcao.funcao')
            .where('ml_fol_funcionario.id_empresa','=',auth.user?.id_empresa)
            .where('ml_fol_funcionario.id_situacao','=',1)
            .leftJoin('ml_fol_funcionario_funcao','ml_fol_funcionario_funcao.id_funcao_erp','=','ml_fol_funcionario.id_funcao_erp')

        response.json( funcionarios);
    }   

    public async addArea ({request,response}:HttpContextContract){

        const arrayArea = request.body().area;
        const id_funcionario = request.body().id_funcionario;
        const funcionario_dados = await Funcionario.findBy('id_funcionario',id_funcionario); 
        if(id_funcionario && arrayArea){

            arrayArea.forEach( async element =>  {
                await FuncionarioArea.create({
                    id_funcionario : id_funcionario,
                    id_empresa : funcionario_dados?.id_empresa,
                    id_area : element,
                });
            });
            response.json({sucess: "Cadastro Realizado"});

        }
    }

    public async removeArea ({request,response}:HttpContextContract){
        const arrayArea = request.body().area;
        const id_funcionario = request.body().id_funcionario;


        await Promise.all(

            arrayArea.forEach( async (element) => {
             let areaFunc = await FuncionarioArea.query().select('*').where('id_funcionario','=',id_funcionario).andWhere('id_area','=',element).limit(1);
             console.log(areaFunc);
                if(areaFunc[0]){
                    await areaFunc[0].delete();
                }
            })
        );
        response.json({sucess: 'Area(s) removidas com sucesso'});
    }

    public async getDepartamentsbyFuncionario(id_funcionario:number){
        const areas = await FuncionarioArea.query().select('')
    }

    public async updateProfile({request,response,auth}:HttpContextContract){

        try {
            await request.validate({schema: schema.create(updateProfileFuncionario)});
            
            let dados = request.body();

            let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);

            if(funcionario){
                funcionario.merge(dados);
                funcionario.save();

                response.json({sucess: "Atualizado com sucesso"});
            }

        } catch (error) {
            response.badRequest(error);
        }
    }

    public async checkByCpf({request,response}){

        await request.validate({schema: schema.create({ cpf: schema.string(), id_empresa : schema.number() })});

        let dados = request.body();

        let funcionario = await Funcionario
                                .query()
                                .select('id_funcionario')
                                .select('cpf')
                                .select('nome')
                                .select('celular')
                                .select('dt_nascimento')
                                .where('cpf','=',dados.cpf)
                                .where('id_empresa','=',dados.id_empresa).first();

        if(funcionario){
            let usuario = await User.findBy('id_funcionario',funcionario.id_funcionario);
            if(!usuario){
                response.json({error: 'Usuário não encontrado'});
            }
            response.json(funcionario);
        }
        else {
            response.json({return : 'CPF não encontrado'});
        }

    }

    public async EventsReceiptFormByFuncionario({request,auth,response}:HttpContextContract){

        try {
            let dados = request.all();

            if(dados.data){
    
                let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);

                let query = await Database
                                    .connection('oracle')
                                    .rawQuery(`
                                    SELECT DISTINCT 
                                    to_char(competficha, 'DD-MM-YYYY') as COMPETFICHA,
                                    CODINTFUNC,
                                    to_char(VALORFICHA, 'FM999G999G999D90', 'nls_numeric_characters='',.''') AS VALORFICHA,
                                    REFERENCIA,
                                    NOMEFUNC,
                                    DESCEVEN,
                                    RSOCIALEMPRESA,
                                    INSCRICAOEMPRESA,
                                    DESCFUNCAO,
                                    CIDADEFL,
                                    IESTADUALFL,
                                    ENDERECOFL,
                                    NUMEROENDFL,
                                    COMPLENDFL,
                                    TIPOEVEN
                                    FROM  globus.vw_flp_fichaeventosrecibo hol 
                                WHERE 
                                hol.codintfunc = ${funcionario?.id_funcionario_erp} and to_char(competficha, 'YYYY-MM') = '${dados.data}'
                                order by hol.tipoeven desc,hol.desceven 
                                `);
                
                let empresa = await Empresa.findBy('id_empresa',auth.user?.id_empresa);
                
                let pdfTemp = await this.generatePdf(this.tratarDadosEvents(query,empresa),templateDotCard);

                let file =  await uploadPdfEmpresa(pdfTemp.filename, auth.user?.id_empresa);

                if(file){
                    fs.unlink(pdfTemp.filename,()=>{});
                    response.json({pdf : file.Location});
                }
    
            } else{
                response.badRequest({error: 'data is required'});
            }

        } catch (error) {
            response.json(error);
        }
    }

    public async dotCard({request,auth,response}:HttpContextContract){

        try {
            let dados = request.body();

            if(dados.data){ 
    
                let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);

                let query = await Database
                                    .connection('oracle')
                                    .rawQuery(`
                                    SELECT
                                    DISTINCT
                                    pon.ID_FUNCIONARIO_ERP,
                                    pon.LINHA,
                                    pon.PREFIXO,
                                    pon.DESCOCORR,
                                    TO_CHAR (pon.DATA_OPERACAO + 3/24, 'DD-MM-YYYY HH24:MI:SS') AS DATA_OPERACAO,
                                    TO_CHAR (pon.JORNADA_INICIO + 3/24, 'DD-MM-YYYY HH24:MI:SS') AS JORNADA_INICIO,
                                    TO_CHAR (pon.REFEICAO_INICIO + 3/24, 'DD-MM-YYYY HH24:MI:SS') AS REFEICAO_INICIO,
                                    TO_CHAR (pon.REFEICAO_FIM + 3/24, 'DD-MM-YYYY HH24:MI:SS') AS REFEICAO_FIM,
                                    TO_CHAR (pon.JORNADA_FIM + 3/24, 'DD-MM-YYYY HH24:MI:SS') AS JORNADA_FIM,
                                    TO_CHAR (pon.COMPETENCIA , 'DD-MM-YYYY HH24:MI:SS') AS COMPETENCIA,
                                    TO_CHAR (pon.DATA_DIGITACAO  , 'DD-MM-YYYY HH24:MI:SS') AS DATA_DIGITACAO,
                                    pon.DIGITADO_POR
                                    FROM 
                                    GLOBUS.VW_ML_FRQ_FICHAPONTO pon
                                    WHERE pon.id_funcionario_erp = ${funcionario?.id_funcionario_erp} and to_char(pon.data_operacao, 'YYYY-MM') = '${dados.data}' 
                                    ORDER BY DATA_OPERACAO
                                    `);



                await Promise.all(
                    query.map( async element => {
                        element["CONFIRMADO"] = "";
                        const confirma =  await this.getConfirmaFichaPonto(element.DATA_OPERACAO,auth.user?.id_funcionario).then(function(data) {
                            return data;
                        });
                        element.CONFIRMADO = confirma;
                    })
                );
                
                
                response.json(query);
    
            } else{
                response.json({error: 'data is required'});
            }

        } catch (error) {
            response.json(error);
        }
    }

    private async getFuncionario( id: number , campos = "*"){

        let query = await Database
                    .connection('pg')
                    .rawQuery(`
                        SELECT ${campos} 
                        FROM ml_fol_funcionario
                        WHERE id_funcionario = ${id}
                        LIMIT 1
                    `);
        return query.rows[0];
    }

    private async getConfirmaFichaPonto(data,id_funcionario){

        let query = await Database
                    .connection('pg')
                    .rawQuery(`
                        SELECT id 
                        FROM ml_usu_confirma_ficha_ponto
                        WHERE id_funcionario = ${id_funcionario} and to_char(dt_referencia, 'YYYY-MM-DD HH24:MI:SS') = '${data}'
                    `);

            if(query.rows.length > 0 ){
                return true;
            }
            else return false;
    }

    public async confirmDotCard({request,auth,response}:HttpContextContract){

        try {
            await request.validate({schema: schema.create({ data: schema.date({
                format: 'yyyy-MM-dd HH:mm:ss',
              }) })});
            let data = request.body().data;

            if( ! await this.getConfirmaFichaPonto(data,auth.user?.id_funcionario)){
                if(auth.user){
                    let funcionario = await this.getFuncionario(auth.user?.id_funcionario,'id_funcionario_erp');
    
                     await ConfirmaFichaPonto.create({
                        id_funcionario : auth.user?.id_funcionario,
                        id_funcionario_erp : funcionario.id_funcionario_erp,
                        dt_referencia : data
                    });
    
                    response.json({sucess : "Confirmado com sucesso "});
                }
            }
            else{
                response.json({error : " Data já confirmada"});
            }

        } catch (error) {
            response.json(error);
        }
    }

    public async inactivate({auth,response}:HttpContextContract){

        try {

            let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);
            if(funcionario){
                funcionario.id_situacao = 5;
                await funcionario.save();
                response.json({sucess : true});
            }

        } catch (error) {
            response.json(error);
        }
    }

    public async deleteAccount({request,response}){
        
        try {
            await request.validate({schema: schema.create({ id_funcionario : schema.number() })});
            let dados = request.body();
            let funcionario = await Funcionario.findBy('id_funcionario',dados.id_funcionario);
            if(funcionario){
                if(funcionario.id_situacao == 5){

                    await funcionario.delete();
                    let user = await User.findBy('id_funcionario',dados.id_funcionario);
                    if(user){
                        await user.delete();
                    }
                    response.json({sucess: "true"});
                } else{
                    response.json({error:"Exclusão não permitida"});
                }
            } else{
                response.json({error:"Funcionário não encontrado"});
            }
        } catch (error) {
            response.json(error);
        }

    }

    private async generatePdf(dados,template){

        try {
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                type : "pdf"
            };
            const filename = Math.random() + '_doc' + '.pdf';
            var document = {
                html: template,
                data: {
                  dados: dados,
                },
                path: "./pdfsTemp/" + filename,
                
              };
    
            let file = pdf
                    .create(document, options)
                    .then((res) => {
                        return res;
                    })
                    .catch((error) => {
                        return error;
                    });
            return await file;

        } catch (error) {
            console.log(error);
        }

    }

    private tratarDadosEvents(dados,dados_empresa){

        let dadosTemp = {
                cabecalho : {
                    logo: dados_empresa.logo,
                    telefone: dados_empresa.telefone,
                    nomeEmpresa : dados[0].RSOCIALEMPRESA,
                    inscricaoEmpresa : dados[0].INSCRICAOEMPRESA,
                    matricula : dados[0].CODINTFUNC,
                    nome : dados[0].NOMEFUNC,
                    funcao : dados[0].DESCFUNCAO,
                    competencia : dados[0].COMPETFICHA,
                    endereco : {
                        rua : dados[0].ENDERECOFL,
                        cidade: dados[0].CIDADEFL,
                        estado: dados[0].IESTADUALFL,
                        numero: dados[0].NUMEROENDFL,
                        complemento: dados[0].COMPLENDFL
                    }
                },
                totais : {
                    DESCONTOS : 0,
                    PROVENTOS : 0
                },
                bases : {
                    BASE_FGTS_FOLHA : 0,
                    BASE_INSS_FOLHA : 0,
                    FGTS_FOLHA : 0,
                    BASE_IRRF_FOLHA : 0,
                },
                descricao : new Array()
            }
        dados.forEach(element => {

            if(element.DESCEVEN == 'BASE FGTS FOLHA'){
                dadosTemp.bases.BASE_FGTS_FOLHA = element.VALORFICHA;
            }
            else if(element.DESCEVEN == 'FGTS FOLHA'){
                dadosTemp.bases.FGTS_FOLHA = element.VALORFICHA;
            }
            else if(element.DESCEVEN == 'BASE IRRF FOLHA'){
                dadosTemp.bases.BASE_IRRF_FOLHA = element.VALORFICHA;
            }
            else if(element.DESCEVEN == 'BASE INSS FOLHA'){
                dadosTemp.bases.BASE_INSS_FOLHA = element.VALORFICHA;
            }
            else if(element.DESCEVEN == 'TOTAL DE DESCONTOS'){
                dadosTemp.totais.DESCONTOS = element.VALORFICHA;
            }
            else if(element.DESCEVEN == 'TOTAL DE PROVENTOS'){
                dadosTemp.totais.PROVENTOS = element.VALORFICHA;
            }
            else if(element.TIPOEVEN != 'B' ){
                if(element.VALORFICHA[0] == ','){
                    element.VALORFICHA = '0'+ element.VALORFICHA;
                }
                dadosTemp.descricao.push(element);
            }
        });
        //console.log(dadosTemp);
        return dadosTemp;
    }

    public async dotCardPdf({request,response,auth}:HttpContextContract){
        try {
            let dados = request.body();
            if(dados.data){

                let funcionario = await Funcionario.findBy('id_funcionario',auth.user?.id_funcionario);

                let query = await Database
                                    .connection('oracle')
                                    .rawQuery(`
                                    SELECT DISTINCT 
                                    ID_FUNCIONARIO_ERP,
                                    CHAPA,
                                    to_char(DATA_MOVIMENTO,'DD/MM/YYYY') AS DATA_MOVIMENTO,
                                    OCORRENCIA,
                                    ENTRADA,
                                    I_INI,
                                    I_FIM,
                                    SAIDA,
                                    LINHA,
                                    TABELA,
                                    CODOCORR,
                                    NORMAL,
                                    EXCES,
                                    OUTRA,
                                    A_NOT,
                                    EXTRANOTDM,
                                    CREDITO,
                                    DEBITO,
                                    SALDOANTERIOR,
                                    VALORPAGO,
                                    to_char(TOTAL, 'FM999G999G999D90') AS TOTALF
                                    FROM  GUDMA.VW_ML_FRQ_ESPELHODEHORAS esp
                                WHERE 
                                esp.id_funcionario_erp = ${auth.user?.id_funcionario}  and to_char(esp.data_movimento, 'YYYY-MM') = '${dados.data}'
                                order by DATA_MOVIMENTO
                                `);
//${funcionario?.id_funcionario_erp}
                let empresa = await Empresa.findBy('id_empresa',auth.user?.id_empresa);
                let pdfTemp = await this.generatePdf(this.tratarDadosDotCard(query,empresa,funcionario,dados.data),fichaPonto);

                let file =  await uploadPdfEmpresa(pdfTemp.filename, auth.user?.id_empresa);

                if(file){
                    fs.unlink(pdfTemp.filename,()=>{});
                    response.json({pdf : file.Location});
                }

            } else{
                response.badRequest({error: "data is required"});
            }
        } catch (error) {
            response.badRequest(error);
        }
    }
    private tratarDadosDotCard(dados,dados_empresa,funcionario,data){

        let dadosTemp = {
                cabecalho : {
                    logo: dados_empresa.logo,
                    nomeEmpresa : dados_empresa.nome,
                    cnpj : dados_empresa.cnpj,
                    nome :funcionario.nome,
                    funcao : funcionario.funcao,
                    competencia : data,
                    endereco : dados_empresa.endereco,
                    data : data
                },
                rodape : {
                    saldoAnterior : dados[0].SALDOANTERIOR,
                    credito : dados[0].CREDITO,
                    debito : dados[0].DEBITO,
                    valorPago : dados[0].VALORPAGO
                },
                dadosDias : new Array()
            }
        dados.forEach(element => {
                dadosTemp.dadosDias.push(element);
        });
        //console.log(dadosTemp);
        return dadosTemp;
    }

}
