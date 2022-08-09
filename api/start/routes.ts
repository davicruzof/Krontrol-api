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
    Route.get('/getEnterprises','EmpresasController.getEnterprises');
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
    Route.post('/create','FuncionariosController.create');
    Route.post('/getById','FuncionariosController.getById');
    Route.get('/getAll','FuncionariosController.getAll');
  }).prefix('/employee').middleware('auth');

  //Rotas Veiculos
  Route.group(()=>{
    Route.post('/create','VeiculosController.create');
    Route.post('/getById','VeiculosController.getById');
    Route.get('/getAll','VeiculosController.getAll');
  }).prefix('/vehicle').middleware('auth');

  //Rotas Eventos
  Route.group(()=>{
    Route.post('/create','EventosController.create');
    Route.get('/getAll','EventosController.getAll');
    Route.get('/getById','EventosController.getById');
  }).prefix('/event').middleware('auth');

  //Rotas Grupos
  Route.group(()=>{
    Route.post('/create','GruposController.create');
    Route.get('/getAll','GruposController.getAll');
    //Route.post('/getById','GruposController.getById');
    Route.post('/getByName','GruposController.getByName');
  }).prefix('/group');

  // Rotas Grupos Eventos
  Route.group(()=>{

    Route.post('/getById','GrupoEventosController.getById');
    Route.post('/getAll','GrupoEventosController.getAll');

  }).prefix('/group_event');


}).prefix('/api');
