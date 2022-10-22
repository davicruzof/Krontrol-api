
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import Hash from '@ioc:Adonis/Core/Hash';
import User from 'App/Models/User';
import  Funcionario  from 'App/Models/Funcionario';
import Database from '@ioc:Adonis/Lucid/Database';
import { afterUpdate } from '@ioc:Adonis/Lucid/Orm';
const loginSchema =  schema.create({
    cpf: schema.string(),
    id_empresa: schema.number(),
    senha : schema.string()
});

const changePassword =  schema.create({
    senha_atual : schema.string(),
    senha_nova : schema.string()
});
export default class AuthController {

    public async login({request,response,auth}:HttpContextContract){
        try {
             await request.validate({schema: loginSchema});
             const { cpf,id_empresa,senha } = request.body();

             const funcionario = await Funcionario
               .query()
               .where('cpf',cpf)
               .where('id_empresa',id_empresa)
               .where('id_situacao',1)
               .first()
            
               //Verify password
                if(funcionario){
                    const usuario = await User
                    .query()
                    .where('id_funcionario',funcionario.id_funcionario)
                    .where('id_empresa',funcionario.id_empresa)
                    .first()
                    if(usuario){
                        if (!(await Hash.verify(usuario.senha, senha))) {
                            return response.unauthorized({error:"Dados inválidos"})
                          }
                          else{
                            const token =  await auth.use('api').generate(usuario);
                            return token;
                          }
                    }
                }
                else{
                    response.json({error: "Dados inválidos"});
                }
          } catch (error) {
            response.badRequest(error.messages);
          }
    }

    public async logout({auth}:HttpContextContract){

        if(auth){
            await auth.logout();
        }

    }

    public async me({auth, response}:HttpContextContract){

        let dadosFuncionario = await Database
                    .connection('pg')
                    .rawQuery(`
                        SELECT
                        usu.id_usuario,
                        usu.id_status,
                        func.id_funcionario,
                        func.id_grupo,
                        func.id_empresa,
                        func.nome,
                        func.cpf,
                        func.celular,
                        func.email,
                        func.cnh_validade,
                        func.dt_nascimento
                        FROM ml_fol_funcionario func
                            INNER JOIN ml_usu_usuario usu ON (usu.id_funcionario = func.id_funcionario)
                        WHERE func.id_funcionario = ${auth.user?.id_funcionario}`);
        let departamentos = await Database.connection('pg').rawQuery(`
            SELECT fa.id_area,ar.area 
            FROM ml_ctr_funcionario_area fa INNER JOIN ml_ctr_programa_area ar ON (fa.id_area = ar.id_area)
            WHERE fa.id_funcionario = ${auth.user?.id_funcionario}
        `);
        let user = dadosFuncionario.rows[0];
        return  response.json({
            user,
            departamentos: departamentos.rows
        });

    }

    public async change({auth,request,response}:HttpContextContract){

        try {
            
            await request.validate({schema : changePassword});
            let dados = request.body();

            if ( await Hash.verify(auth.user?.senha, dados.senha_atual)){
                auth.user.senha = dados.senha_nova;
                auth.user.save();

                response.json({sucess: 'Senha Atualizada com sucesso'});
            } else {
                response.badRequest({error:'Dados inválidos'});
            }
            
            
        } catch (error) {
            response.json(error);
        }
    }
}
