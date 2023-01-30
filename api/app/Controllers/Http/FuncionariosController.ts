import Empresa from 'App/Models/Empresa';
import ConfirmarPdf from 'App/Models/ConfirmarPdf';
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
import Funcao from 'App/Models/Funcao';
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
                                    .leftJoin("ml_fol_funcionario_situacao","ml_fol_funcionario_situacao.id_situacao","=","ml_fol_funcionario.id_situacao")
                                    .leftJoin("ml_fol_funcionario_funcao","ml_fol_funcionario_funcao.id_funcao_erp","=","ml_fol_funcionario.id_funcao_erp")
                                    .where("ml_fol_funcionario.id_funcionario",id_funcionario);

            if(funcionario[0]){
                let funcionario_erp = await Database.connection('oracle')
                        .rawQuery(`
                            SELECT CODFUNC FROM globus.vw_ml_flp_funcionario 
                            WHERE id_funcionario_erp = '${funcionario[0].id_funcionario_erp}'
                        `);
                funcionario[0].codfunc = funcionario_erp[0].CODFUNC;
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
                                  select distinct
                                    func.id_funcionario_erp,
                                    func.chapafunc CHAPA,
                                    func.codfunc CODFUNC,
                                    lin.codigolinhamin LINHA,
                                    car.prefixoveic prefixo,
                                    oco.descocorr,
                                    replace(to_char(pon.entradigit,'DD/MM/YYYY'),'30/12/1899','FOLGA') DATA_OPERACAO,
                                    replace(to_char(pon.entradigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') JORNADA_INICIO,
                                    replace(to_char(pon.intidigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') REFEICAO_INICIO,
                                    replace(to_char(pon.intfdigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') REFEICAO_FIM,
                                    replace(to_char(pon.saidadigit,'DD/MM/YYYY HH24:MI'),'30/12/1899 00:00','FOLGA') JORNADA_FIM,
                                    to_char(pon.competdigit,'DD/MM/YYYY') COMPETENCIA,
                                    pon.usudigit DIGITADO_POR,
                                    to_char(pon.dtdigit,'DD/MM/YYYY') DATA_DIGITACAO
                                from
                                    globus.frq_digitacaomovimento pon
                                    inner join globus.vw_ml_flp_funcionario func on pon.codintfunc = func.id_funcionario_erp
                                    inner join globus.frq_ocorrencia oco on pon.codocorr = oco.codocorr
                                    left join globus.frt_cadveiculos car on pon.codigoveic = car.codigoveic
                                    left join globus.bgm_cadlinhas lin on pon.codintlinha = lin.codintlinha
                                    WHERE 
                                        pon.dtdigit BETWEEN to_date('01/${dados.data}','DD/MM/YYYY') and to_date('31/${dados.data}','DD/MM/YYYY')
                                        and func.id_funcionario_erp= '${funcionario?.id_funcionario_erp}'
                                    order by DATA_DIGITACAO ASC
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
                let queryFuncao = await Funcao.findBy('id_funcao_erp',funcionario?.id_funcao_erp);
                //return await ConfirmarVideo.query().select('*').where('id_funcionario','=',`${funcionario?.id_funcionario}`).andWhere('data_pdf','=',`${dados.data.split("").reverse().join("").replace('-','/')}`);

                let query = await Database
                                    .connection('oracle')
                                    .rawQuery(`
                                    select distinct
                                    fun.id_funcionario_erp, fun.chapafunc chapa,
                                    to_char(df.dtdigit,'YYYY-MM-DD') as data_movimento, oco.descocorr ocorrencia,
                                    REPLACE(replace(to_char(df.entradigit,'HH24:MI:SS'),'00:00:00','FOLGA'),'10/11/2022 00:00:00','ATESTADO')  as entrada, replace(to_char(df.intidigit,'HH24:MI:SS'),'00:00:00','FOLGA')  as I_INI, 
                                    replace(to_char(df.intfdigit,'HH24:MI:SS'),'00:00:00','FOLGA')  as I_FIM, replace(to_char(df.saidadigit,'HH24:MI:SS'),'00:00:00','FOLGA')  as SAIDA,
                                    lin.codigolinha linha, df.servicodigit as tabela,df.codocorr,
                                    df.normaldm as normal,CAST(df.extradm AS NUMBER(6,2)) as extra,
                                     df.excessodm exces, df.outradm outra, df.adnotdm a_not, df.extranotdm, (df.normaldm + df.extradm + df.excessodm + df.outradm + df.adnotdm + df.extranotdm) as totalf, 
                                    bh.competencia bh_competencia, bh.credito,bh.debito,bh.saldoanterior,bh.valorpago
                                    from globus.frq_digitacaomovimento df 
                                    inner join globus.vw_ml_flp_funcionario fun on df.codintfunc = fun.id_funcionario_erp 
                                    left join globus.vw_bancohoras bh on df.codintfunc = bh.codintfunc
                                    left join globus.frq_ocorrencia oco on df.codocorr = oco.codocorr
                                    left join globus.bgm_cadlinhas lin on df.codintlinha = lin.codintlinha
                                    where     
                                       to_char(df.dtdigit,'MM/YYYY') = to_char(bh.competencia,'MM/YYYY')
                                       and df.tipodigit='F' AND
                                                                       id_funcionario_erp = '${funcionario?.id_funcionario_erp}'  and to_char(df.dtdigit, 'YYYY-MM') = '${dados.data}'
                                                                   order by  DATA_MOVIMENTO
                                `);
                
                let empresa = await Empresa.findBy('id_empresa',auth.user?.id_empresa);
                let pdfTemp = await this.generatePdf(this.tratarDadosDotCard(query,empresa,funcionario,dados.data,queryFuncao),fichaPonto);
                let confirmacao = await ConfirmarPdf.query().select('*').where('id_funcionario','=',`${funcionario?.id_funcionario}`).andWhere('data_pdf','=',`${dados.data}`);

                let file =  await uploadPdfEmpresa(pdfTemp.filename, auth.user?.id_empresa);

                if(file){
                    fs.unlink(pdfTemp.filename,()=>{});
                    response.json({
                        pdf : file.Location,
                        confirmado : confirmacao[0] ? true : false
                    });
                }

            } else{
                response.badRequest({error: "data is required"});
            }
        } catch (error) {
            response.badRequest(error);
        }
    }

    private tratarDadosDotCard(dados,dados_empresa,funcionario,data,queryFuncao){

        let dadosTemp = {
                cabecalho : {
                    logo: dados_empresa.logo,
                    nomeEmpresa : dados_empresa.nomeempresarial,
                    cnpj : dados_empresa.cnpj,
                    nome :funcionario.nome,
                    funcao : queryFuncao.funcao,
                    competencia : data,
                    endereco : dados_empresa.logradouro,
                    periodo : data.split("").reverse().join("")
                },
                rodape : {
                    saldoAnterior : dados[0].SALDOANTERIOR.toFixed(2),
                    credito : dados[0].CREDITO.toFixed(2),
                    debito : dados[0].DEBITO.toFixed(2),
                    valorPago : dados[0].VALORPAGO.toFixed(2)
                },
                dadosDias : new Array()
            }
        dados.forEach(element => {
            element.TOTALF = element.TOTALF.toFixed(2);  
            element.EXCES = element.EXCES.toFixed(2);  
            element.EXTRA = element.EXTRA.toFixed(2);
            element.OUTRA = element.OUTRA.toFixed(2);  
            dadosTemp.dadosDias.push(element);
        });
        return dadosTemp;
    }

    public async confirmPdf({request,response,auth}:HttpContextContract) {

        try {
            const foto = request.file('foto');
            const data = request.body().data_pdf;

            if(foto && data){
                let hashImg =  crypto.randomBytes(10).toString('hex');
                let filename = `${hashImg}-${foto.clientName}`;
                let empresa = await Empresa.findBy('id_empresa',auth.user?.id_empresa);
                let s3Object = 
                await upload({
                     folder : 'confirmaPdf',
                     filename : filename,
                     bucket: empresa?.bucket,
                     path: filename,
                     file: foto,
                     type: foto.extname
                 });

                await ConfirmarPdf.create({
                    id_funcionario : auth.user?.id_funcionario,
                    foto : s3Object.Location,
                    data_pdf : data
                });

                response.json({sucess : "Confirmado com sucesso!"});

            } else {
                response.badRequest({error: "Foto e data são requeridos"});
            }
        } catch (error) {
            response.badRequest(error);
        }
    }
}
