/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('api/status', async () => {
  return { status: 'api is only' }
})

Route.group(()=>{
  //Route.post('/teste','TestesController.criarbucket');
  //Rotas Autenticação
  Route.group(()=>{
    Route.get('/getEnterprises','EmpresasController.getEnterprises').middleware('auth');
    Route.post('/login', 'AuthController.login');
	  Route.post('/logout', 'AuthController.logout').middleware('auth');
    Route.get('/me','AuthController.me').middleware('auth');
  }).prefix('/auth');


  //Rotas Usuario
  Route.group(()=>{
    Route.post('/create','UsersController.create');
  }).prefix('/user');

  //Rotas Empresa
  Route.group(()=>{
    Route.get('/','EmpresasController.getAll');
    Route.post('/create','EmpresasController.create');
    Route.post('/getById','EmpresasController.getById');
    Route.post('/getByName','EmpresasController.getByName');
    Route.put('/update','EmpresasController.update')
  }).prefix('/enterprises').middleware('auth');

  //Rotas Funcionario
  Route.group(()=>{
    Route.post('/create','FuncionariosController.create').middleware('auth');
    Route.post('/getById','FuncionariosController.getById').middleware('auth');
    Route.get('/getAll','FuncionariosController.getAll').middleware('auth');
    Route.post('/add-area','FuncionariosController.addArea').middleware('auth');
    Route.post('/remove-area','FuncionariosController.removeArea').middleware('auth');
    Route.post('/updateProfile','FuncionariosController.updateProfile').middleware('auth');
    Route.post('/checkByCpf','FuncionariosController.checkByCpf');
    Route.post('/eventsReceiptForm','FuncionariosController.EventsReceiptFormByFuncionario').middleware('auth');
    Route.post('/dotCardPdf','FuncionariosController.dotCardPdf').middleware('auth');
    Route.post('/dotCard','FuncionariosController.dotCard').middleware('auth');
    Route.post('/confirmDotCard','FuncionariosController.confirmDotCard').middleware('auth');
    Route.post('/inactivate','FuncionariosController.inactivate').middleware('auth');
    Route.post('/deleteAccount','FuncionariosController.deleteAccount').middleware('auth');
    Route.post('/confirmPdf','FuncionariosController.confirmPdf').middleware('auth');
    Route.get('/getVideos','FuncionariosController.getVideos').middleware('auth');
  }).prefix('/employee');

  //Rotas Veiculos
  Route.group(()=>{
    Route.post('/create','VeiculosController.create');
    Route.post('/getById','VeiculosController.getById');
    Route.get('/getAll','VeiculosController.getAll');
    Route.put('/update','VeiculosController.update');
  }).prefix('/vehicle').middleware('auth');

  //Rotas Eventos
  Route.group(()=>{
    Route.post('/create','EventosController.create');
    Route.get('/getAll','EventosController.getAll');
    Route.put('/update','EventosController.update');
  }).prefix('/event').middleware('auth');

  //Rotas Grupos
  Route.group(()=>{
    Route.post('/create','GruposController.create');
    Route.get('/getAll','GruposController.getAll');
    Route.put('/update','GruposController.update');
    Route.post('/getByName','GruposController.getByName');
  }).prefix('/group').middleware('auth');

  // Rotas Grupos Eventos
  Route.group(()=>{
    Route.post('/create','GrupoEventosController.create');
    Route.post('/getById','GrupoEventosController.getById');
    Route.get('/getAll','GrupoEventosController.getAll');
    Route.put('/update','GrupoEventosController.update');
  }).prefix('/group_event').middleware('auth');

  // Rotas telemetria
  Route.group(()=>{

    Route.post('/get_list','TelemetriasController.list');
    Route.post('/list_events','TelemetriasController.list_events');

  }).prefix('/telemetria').middleware('auth');

  // Rotas PDF
  Route.group(()=>{
    Route.post('/upload','PdfsController.upload');
    Route.post('getConfirmedsById','PdfsController.getConfirmedsById');
    Route.get('getAllConfirmeds','PdfsController.getAllConfirmeds');
  }).prefix('/pdfs').middleware('auth');

  //Rotas da escala
  Route.group(()=>{

    Route.post('/list','EscalasController.list');

  }).prefix('/scale').middleware('auth');

  //Rotas departamentos
  Route.group(()=>{

    Route.get('/list','DepartamentosController.list');
    Route.post('/list_area_departamento','DepartamentosController.list_area_departamento');
  
  }).prefix('/departaments').middleware('auth');

  //Rotas Solicitações
  Route.group(()=>{

    Route.post('/create','SolicitacoesController.create');
    Route.post('/getById','SolicitacoesController.getById');
    Route.post('/list','SolicitacoesController.list');
    Route.post('/listByUser','SolicitacoesController.listByUser')
    Route.put('/update','SolicitacoesController.update');

  }).prefix('/requests').middleware('auth');

  //Rotas de atualização e recuperação de senha
  Route.group(()=>{

    Route.post('/change','AuthController.change').middleware('auth');
    Route.post('/recovery','AuthController.recovery');

  }).prefix('/password');


  //Rotas de Grupos de segurança
  Route.group(()=>{

    Route.group(()=>{

      Route.post('/create','SecuritiesController.createGroup');
      Route.get('/getAll','SecuritiesController.getAllGroups');
      Route.post('/getById','SecuritiesController.getGroupById');
      Route.put('/update','SecuritiesController.updateGroup');

    }).prefix('/group');

    Route.group(()=>{

      Route.post('/create','SecuritiesController.createGroupUser');
      Route.get('/getAll','SecuritiesController.getAllGroupsUser');
      Route.post('/getById','SecuritiesController.getGroupUserById');
      Route.get('/getByUser','SecuritiesController.getGroupUserByIdUser');
      Route.put('/update','SecuritiesController.updateGroupUser');

    }).prefix('groupUser');

  }).prefix('/security').middleware('auth');


  Route.group(()=>{
    Route.post('/upload','VideosController.upload');
    Route.post('/sendToEmployee','VideosController.sendToEmployee');
    
  }).prefix('/video');

}).prefix('/api');
