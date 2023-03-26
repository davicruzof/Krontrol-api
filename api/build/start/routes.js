"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('api/status', async () => {
    return { status: 'api is only' };
});
Route_1.default.group(() => {
    Route_1.default.group(() => {
        Route_1.default.get('/getEnterprises', 'EmpresasController.getEnterprises').middleware('auth');
        Route_1.default.post('/login', 'AuthController.login');
        Route_1.default.post('/logout', 'AuthController.logout').middleware('auth');
        Route_1.default.get('/me', 'AuthController.me').middleware('auth');
    }).prefix('/auth');
    Route_1.default.group(() => {
        Route_1.default.post('/create', 'UsersController.create');
    }).prefix('/user');
    Route_1.default.group(() => {
        Route_1.default.get('/', 'EmpresasController.getAll');
        Route_1.default.post('/create', 'EmpresasController.create');
        Route_1.default.post('/getById', 'EmpresasController.getById');
        Route_1.default.post('/getByName', 'EmpresasController.getByName');
        Route_1.default.put('/update', 'EmpresasController.update');
    }).prefix('/enterprises').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/create', 'FuncionariosController.create').middleware('auth');
        Route_1.default.post('/getById', 'FuncionariosController.getById').middleware('auth');
        Route_1.default.get('/getAll', 'FuncionariosController.getAll').middleware('auth');
        Route_1.default.post('/add-area', 'FuncionariosController.addArea').middleware('auth');
        Route_1.default.post('/remove-area', 'FuncionariosController.removeArea').middleware('auth');
        Route_1.default.post('/updateProfile', 'FuncionariosController.updateProfile').middleware('auth');
        Route_1.default.post('/checkByCpf', 'FuncionariosController.checkByCpf');
        Route_1.default.post('/eventsReceiptForm', 'FuncionariosController.EventsReceiptFormByFuncionario').middleware('auth');
        Route_1.default.post('/dotCardPdf', 'FuncionariosController.dotCardPdf').middleware('auth');
        Route_1.default.post('/dotCard', 'FuncionariosController.dotCard').middleware('auth');
        Route_1.default.post('/confirmDotCard', 'FuncionariosController.confirmDotCard').middleware('auth');
        Route_1.default.post('/inactivate', 'FuncionariosController.inactivate').middleware('auth');
        Route_1.default.post('/deleteAccount', 'FuncionariosController.deleteAccount').middleware('auth');
        Route_1.default.post('/confirmPdf', 'FuncionariosController.confirmPdf').middleware('auth');
        Route_1.default.get('/getVideos', 'FuncionariosController.getVideos').middleware('auth');
        Route_1.default.get('/confirmVideo', 'FuncionariosController.confirmVideo').middleware('auth');
    }).prefix('/employee');
    Route_1.default.group(() => {
        Route_1.default.post('/create', 'VeiculosController.create');
        Route_1.default.post('/getById', 'VeiculosController.getById');
        Route_1.default.get('/getAll', 'VeiculosController.getAll');
        Route_1.default.put('/update', 'VeiculosController.update');
    }).prefix('/vehicle').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/create', 'EventosController.create');
        Route_1.default.get('/getAll', 'EventosController.getAll');
        Route_1.default.put('/update', 'EventosController.update');
    }).prefix('/event').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/create', 'GruposController.create');
        Route_1.default.get('/getAll', 'GruposController.getAll');
        Route_1.default.put('/update', 'GruposController.update');
        Route_1.default.post('/getByName', 'GruposController.getByName');
    }).prefix('/group').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/create', 'GrupoEventosController.create');
        Route_1.default.post('/getById', 'GrupoEventosController.getById');
        Route_1.default.get('/getAll', 'GrupoEventosController.getAll');
        Route_1.default.put('/update', 'GrupoEventosController.update');
    }).prefix('/group_event').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/get_list', 'TelemetriasController.list');
        Route_1.default.post('/list_events', 'TelemetriasController.list_events');
    }).prefix('/telemetria').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/upload', 'PdfsController.upload');
        Route_1.default.post('getConfirmedsById', 'PdfsController.getConfirmedsById');
        Route_1.default.get('getAllConfirmeds', 'PdfsController.getAllConfirmeds');
    }).prefix('/pdfs').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/list', 'EscalasController.list');
    }).prefix('/scale').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.get('/list', 'DepartamentosController.list');
        Route_1.default.post('/list_area_departamento', 'DepartamentosController.list_area_departamento');
    }).prefix('/departaments').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/create', 'SolicitacoesController.create');
        Route_1.default.post('/getById', 'SolicitacoesController.getById');
        Route_1.default.post('/list', 'SolicitacoesController.list');
        Route_1.default.post('/listByUser', 'SolicitacoesController.listByUser');
        Route_1.default.put('/update', 'SolicitacoesController.update');
    }).prefix('/requests').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/change', 'AuthController.change').middleware('auth');
        Route_1.default.post('/recovery', 'AuthController.recovery');
    }).prefix('/password');
    Route_1.default.group(() => {
        Route_1.default.group(() => {
            Route_1.default.post('/create', 'SecuritiesController.createGroup');
            Route_1.default.get('/getAll', 'SecuritiesController.getAllGroups');
            Route_1.default.post('/getById', 'SecuritiesController.getGroupById');
            Route_1.default.put('/update', 'SecuritiesController.updateGroup');
        }).prefix('/group');
        Route_1.default.group(() => {
            Route_1.default.post('/create', 'SecuritiesController.createGroupUser');
            Route_1.default.get('/getAll', 'SecuritiesController.getAllGroupsUser');
            Route_1.default.post('/getById', 'SecuritiesController.getGroupUserById');
            Route_1.default.get('/getByUser', 'SecuritiesController.getGroupUserByIdUser');
            Route_1.default.put('/update', 'SecuritiesController.updateGroupUser');
        }).prefix('groupUser');
    }).prefix('/security').middleware('auth');
    Route_1.default.group(() => {
        Route_1.default.post('/upload', 'VideosController.upload');
        Route_1.default.post('/sendToEmployee', 'VideosController.sendToEmployee');
        Route_1.default.post('/getById', 'VideosController.getById');
        Route_1.default.get('/getAll', 'VideosController.getAll');
        Route_1.default.put('/update', 'VideosController.update');
        Route_1.default.delete('/delete', 'VideosController.delete');
    }).prefix('/video');
}).prefix('/api');
//# sourceMappingURL=routes.js.map