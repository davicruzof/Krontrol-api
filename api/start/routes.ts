import Route from "@ioc:Adonis/Core/Route";

Route.get("api/status", async () => {
  return { status: "api is only" };
});

Route.group(() => {
  //Route.post('/teste','TestesController.criarbucket');
  //Rotas Autenticação
  Route.group(() => {
    Route.get(
      "/getEnterprises",
      "EmpresasController.getEnterprises"
    ).middleware("auth");
    Route.post("/login", "AuthController.login");
    Route.post("/signIn", "SignInController.login");
    Route.post("/logout", "AuthController.logout").middleware("auth");
    Route.get("/me", "AuthController.me").middleware("auth");
  }).prefix("/auth");

  //Rotas Usuario
  Route.group(() => {
    Route.post("/create", "UsersController.create");
  }).prefix("/user");

  //VersionApp
  Route.group(() => {
    Route.get("/", "VersionApp.versionApp");
  }).prefix("/versionApp");

  //Rotas Empresa
  Route.group(() => {
    Route.get("/", "EmpresasController.getAll");
    Route.post("/create", "EmpresasController.create");
    Route.post("/getById", "EmpresasController.getById");
    Route.post("/getByName", "EmpresasController.getByName");
    Route.put("/update", "EmpresasController.update");
  })
    .prefix("/enterprises")
    .middleware("auth");

  //Rotas Funcionario
  Route.group(() => {
    Route.post("/create", "FuncionariosController.create").middleware("auth");
    Route.post("/getById", "FuncionariosController.getById").middleware("auth");
    Route.get("/getAll", "FuncionariosController.getAll").middleware("auth");
    Route.get(
      "/irpf-avaiables",
      "FuncionariosController.irpfAvaiables"
    ).middleware("auth");
    Route.get(
      "/vacation-pdf/:competencia",
      "FuncionariosController.vacation"
    ).middleware("auth");
    Route.post("/add-area", "FuncionariosController.addArea").middleware(
      "auth"
    );
    Route.post("/remove-area", "FuncionariosController.removeArea").middleware(
      "auth"
    );
    Route.post(
      "/updateProfile",
      "FuncionariosController.updateProfile"
    ).middleware("auth");
    Route.post("/checkByCpf", "FuncionariosController.checkByCpf");
    Route.post("/dotCard", "FuncionariosController.dotCard").middleware("auth");
    Route.post(
      "/confirmDotCard",
      "FuncionariosController.confirmDotCard"
    ).middleware("auth");
    Route.post("/inactivate", "FuncionariosController.inactivate").middleware(
      "auth"
    );
    Route.post(
      "/deleteAccount",
      "FuncionariosController.deleteAccount"
    ).middleware("auth");
    Route.post("/confirmPdf", "FuncionariosController.confirmPdf").middleware(
      "auth"
    );
    Route.get("/getVideos", "FuncionariosController.getVideos").middleware(
      "auth"
    );
    Route.post(
      "/confirmVideo",
      "FuncionariosController.confirmarVideo"
    ).middleware("auth");
    Route.get(
      "/vacationNotice",
      "FuncionariosController.avisoFerias"
    ).middleware("auth");
    Route.get("/params", "FuncionariosController.getParams").middleware("auth");
  }).prefix("/employee");

  //Rotas Recibos
  Route.group(() => {
    Route.post(
      "/dotCardPdfGenerator",
      "Receipts.dotCardPdfGenerator"
    ).middleware("auth");
    Route.post(
      "/payStubPdfGenerator",
      "Receipts.payStubPdfGenerator"
    ).middleware("auth");
    Route.post(
      "/payStubAuxPdfGenerator",
      "Receipts.payStubAuxPdfGenerator"
    ).middleware("auth");
    Route.post(
      "/EventsReceiptFormByFuncionario",
      "Receipts.EventsReceiptFormByFuncionario"
    ).middleware("auth");
    Route.get("/incomeTax/:ano", "Receipts.IncomeTax").middleware("auth");
    Route.get("/decimoPdf/:ano", "Receipts.decimoPdfGenerator").middleware(
      "auth"
    );
  }).prefix("/receipts");

  Route.group(() => {
    Route.post(
      "/dotCardPdfGenerator",
      "DotCardPdf.dotCardPdfGenerator"
    ).middleware("auth");
  }).prefix("/DotCardPdf");

  Route.group(() => {
    Route.post("/version", "VersionApp.create").middleware("auth");
  }).prefix("/AppVersion");

  Route.group(() => {
    Route.get("/", "InformativosController.getInformativos").middleware("auth");
    Route.get(
      "/notify",
      "InformativosController.getInformativosNotify"
    ).middleware("auth");
    Route.put("/", "InformativosController.updateInformativo").middleware(
      "auth"
    );
  }).prefix("/informativos");

  //Rotas Veiculos
  Route.group(() => {
    Route.post("/create", "VeiculosController.create");
    Route.post("/getById", "VeiculosController.getById");
    Route.get("/getAll", "VeiculosController.getAll");
    Route.put("/update", "VeiculosController.update");
  })
    .prefix("/vehicle")
    .middleware("auth");

  //Rotas Eventos
  Route.group(() => {
    Route.post("/create", "EventosController.create");
    Route.get("/getAll", "EventosController.getAll");
    Route.put("/update", "EventosController.update");
  })
    .prefix("/event")
    .middleware("auth");

  //Rotas Grupos
  Route.group(() => {
    Route.post("/create", "GruposController.create");
    Route.get("/getAll", "GruposController.getAll");
    Route.put("/update", "GruposController.update");
    Route.post("/getByName", "GruposController.getByName");
  })
    .prefix("/group")
    .middleware("auth");

  // Rotas Grupos Eventos
  Route.group(() => {
    Route.post("/create", "GrupoEventosController.create");
    Route.post("/getById", "GrupoEventosController.getById");
    Route.get("/getAll", "GrupoEventosController.getAll");
    Route.put("/update", "GrupoEventosController.update");
  })
    .prefix("/group_event")
    .middleware("auth");

  // Rotas telemetria
  Route.group(() => {
    Route.post("/get_list", "TelemetriasController.list");
    Route.post("/list_events", "TelemetriasController.list_events");
    Route.get("/score", "TelemetriasController.score");
  })
    .prefix("/telemetria")
    .middleware("auth");

  // Rotas PDF
  Route.group(() => {
    Route.post("/upload", "PdfsController.upload");
    Route.post("getConfirmedsById", "PdfsController.getConfirmedsById");
    Route.get("getAllConfirmeds", "PdfsController.getAllConfirmeds");
  })
    .prefix("/pdfs")
    .middleware("auth");

  //Rotas da escala
  Route.group(() => {
    Route.post("/list", "EscalasController.list");
    Route.get("/list/:data", "EscalasController.getList");
  })
    .prefix("/scale")
    .middleware("auth");

  //Rotas departamentos
  Route.group(() => {
    Route.get("/list", "DepartamentosController.list");
    Route.post(
      "/list_area_departamento",
      "DepartamentosController.list_area_departamento"
    );
  })
    .prefix("/departaments")
    .middleware("auth");

  //Outras rotas
  Route.group(() => {
    Route.get("/position", "OthersController.getPositions");
    Route.post("/searchVehicle", "OthersController.searchVehicle");
  })
    .prefix("/others")
    .middleware("auth");

  //Rotas Solicitações
  Route.group(() => {
    Route.post("/create", "SolicitacoesController.create");
    Route.post("/getById", "SolicitacoesController.getById");
    Route.post("/list", "SolicitacoesController.list");
    Route.post("/listByUser", "SolicitacoesController.listByUser");
    Route.put("/update", "SolicitacoesController.update");
    Route.get("/getParameter", "SolicitacoesController.getParameter");
    Route.post("/getMotivos", "SolicitacoesController.getMotivos");
  })
    .prefix("/requests")
    .middleware("auth");

  //Rotas Notificações
  Route.group(() => {
    Route.post("/create", "NotificationsController.create");
    Route.put("/update", "NotificationsController.updateReadNotifications");
    Route.get(
      "/getNotificationsByUser",
      "NotificationsController.getNotificationsByUser"
    );
  })
    .prefix("/notifications")
    .middleware("auth");

  // Rotas Chat Solicitacoes
  Route.group(() => {
    Route.post("/create", "SolicitacoesRespostasController.create");
    Route.post("/getMessages", "SolicitacoesRespostasController.getById");
  })
    .prefix("/requestsChat")
    .middleware("auth");

  //Rotas de atualização e recuperação de senha
  Route.group(() => {
    Route.post("/change", "AuthController.change").middleware("auth");
    Route.post("/recovery", "AuthController.recovery");
  }).prefix("/password");

  //Rotas de Grupos de segurança
  Route.group(() => {
    Route.group(() => {
      Route.post("/create", "SecuritiesController.createGroup");
      Route.get("/getAll", "SecuritiesController.getAllGroups");
      Route.post("/getById", "SecuritiesController.getGroupById");
      Route.put("/update", "SecuritiesController.updateGroup");
    }).prefix("/group");

    Route.group(() => {
      Route.post("/create", "SecuritiesController.createGroupUser");
      Route.get("/getAll", "SecuritiesController.getAllGroupsUser");
      Route.post("/getById", "SecuritiesController.getGroupUserById");
      Route.get("/getByUser", "SecuritiesController.getGroupUserByIdUser");
      Route.put("/update", "SecuritiesController.updateGroupUser");
    }).prefix("groupUser");
  })
    .prefix("/security")
    .middleware("auth");

  //Rotas Video
  Route.group(() => {
    Route.post("/upload", "VideosController.upload");
    Route.post("/sendToEmployee", "VideosController.sendToEmployee");
    Route.post("/getById", "VideosController.getById");
    Route.get("/getAll", "VideosController.getAll");
    Route.put("/update", "VideosController.update");
    Route.delete("/delete", "VideosController.delete");
  }).prefix("/video");
}).prefix("/api");

Route.group(() => {
  Route.group(() => {
    Route.get(
      "/getEnterprises",
      "EmpresasController.getEnterprises"
    ).middleware("auth");
    Route.post("/login", "AuthController.login");
    Route.post("/signIn", "SignInController.login");
    Route.post("/logout", "AuthController.logout").middleware("auth");
    Route.get("/me", "AuthController.me").middleware("auth");
  }).prefix("/auth");

  //Rotas Usuario
  Route.group(() => {
    Route.post("/create", "UsersController.create");
  }).prefix("/user");

  //VersionApp
  Route.group(() => {
    Route.get("/", "VersionApp.versionApp");
  }).prefix("/versionApp");

  //Rotas Empresa
  Route.group(() => {
    Route.get("/", "EmpresasController.getAll");
    Route.post("/create", "EmpresasController.create");
    Route.post("/getById", "EmpresasController.getById");
    Route.post("/getByName", "EmpresasController.getByName");
    Route.put("/update", "EmpresasController.update");
  })
    .prefix("/enterprises")
    .middleware("auth");

  Route.post("/employee/checkByCpf", "FuncionariosController.checkByCpf");

  //Rotas Funcionario
  Route.group(() => {
    Route.post("/create", "FuncionariosController.create");
    Route.post("/getById", "FuncionariosController.getById");
    Route.get("/getAll", "FuncionariosController.getAll");
    Route.get("/irpf-avaiables", "FuncionariosController.irpfAvaiables");
    Route.get("/vacation-pdf/:competencia", "FuncionariosController.vacation");
    Route.post("/add-area", "FuncionariosController.addArea");
    Route.post("/remove-area", "FuncionariosController.removeArea");
    Route.post("/updateProfile", "FuncionariosController.updateProfile");
    Route.post("/dotCard", "FuncionariosController.dotCard");
    Route.post("/confirmDotCard", "FuncionariosController.confirmDotCard");
    Route.post("/inactivate", "FuncionariosController.inactivate");
    Route.post("/deleteAccount", "FuncionariosController.deleteAccount");
    Route.post("/confirmPdf", "FuncionariosController.confirmPdf");
    Route.get("/getVideos", "FuncionariosController.getVideos");
    Route.post("/confirmVideo", "FuncionariosController.confirmarVideo");
    Route.get("/vacationNotice", "FuncionariosController.avisoFerias");
    Route.get("/params", "FuncionariosController.getParams");
  })
    .prefix("/employee")
    .middleware("auth");

  //Rotas Recibos
  Route.group(() => {
    Route.post("/payStubPdfGenerator", "Receipts.payStubPdfGenerator");
    Route.post("/payStubAuxPdfGenerator", "Receipts.payStubAuxPdfGenerator");
    Route.post(
      "/EventsReceiptFormByFuncionario",
      "Receipts.EventsReceiptFormByFuncionario"
    );
    Route.get("/incomeTax/:ano", "Receipts.IncomeTax");
    Route.get("/decimoPdf/:ano", "Receipts.decimoPdfGenerator");
    Route.post("/pointRecord", "PointRecord.pointRecordGenerator");
    Route.post("/payStubPlr", "Receipts.plrPdfGenerator");
  })
    .prefix("/receipts")
    .middleware("auth");

  Route.group(() => {
    Route.post(
      "/dotCardPdfGenerator",
      "PointRecord.pointRecordGenerator"
    ).middleware("auth");
  }).prefix("/DotCardPdf");

  Route.group(() => {
    Route.post("/version", "VersionApp.create").middleware("auth");
  }).prefix("/AppVersion");

  Route.group(() => {
    Route.get("/", "InformativosController.getInformativos");
    Route.get("/notify", "InformativosController.getInformativosNotify");
    Route.put("/", "InformativosController.updateInformativo");
  })
    .prefix("/informativos")
    .middleware("auth");

  //Rotas Veiculos
  Route.group(() => {
    Route.post("/create", "VeiculosController.create");
    Route.post("/getById", "VeiculosController.getById");
    Route.get("/getAll", "VeiculosController.getAll");
    Route.put("/update", "VeiculosController.update");
  })
    .prefix("/vehicle")
    .middleware("auth");

  //Rotas Eventos
  Route.group(() => {
    Route.post("/create", "EventosController.create");
    Route.get("/getAll", "EventosController.getAll");
    Route.put("/update", "EventosController.update");
  })
    .prefix("/event")
    .middleware("auth");

  //Rotas Grupos
  Route.group(() => {
    Route.post("/create", "GruposController.create");
    Route.get("/getAll", "GruposController.getAll");
    Route.put("/update", "GruposController.update");
    Route.post("/getByName", "GruposController.getByName");
  })
    .prefix("/group")
    .middleware("auth");

  // Rotas Grupos Eventos
  Route.group(() => {
    Route.post("/create", "GrupoEventosController.create");
    Route.post("/getById", "GrupoEventosController.getById");
    Route.get("/getAll", "GrupoEventosController.getAll");
    Route.put("/update", "GrupoEventosController.update");
  })
    .prefix("/group_event")
    .middleware("auth");

  // Rotas telemetria
  Route.group(() => {
    Route.post("/get_list", "TelemetriasController.list");
    Route.post("/list_events", "TelemetriasController.list_events");
    Route.get("/score", "TelemetriasController.score");
  })
    .prefix("/telemetria")
    .middleware("auth");

  // Rotas PDF
  Route.group(() => {
    Route.post("/upload", "PdfsController.upload");
    Route.post("getConfirmedsById", "PdfsController.getConfirmedsById");
    Route.get("getAllConfirmeds", "PdfsController.getAllConfirmeds");
  })
    .prefix("/pdfs")
    .middleware("auth");

  //Rotas da escala
  Route.group(() => {
    Route.post("/list", "EscalasController.list");
    Route.get("/list/:data", "EscalasController.getList");
    Route.get("v2/list/:data", "EscalasController.getListV2");
  })
    .prefix("/scale")
    .middleware("auth");

  //Rotas departamentos
  Route.group(() => {
    Route.get("/list", "DepartamentosController.list");
    Route.post(
      "/list_area_departamento",
      "DepartamentosController.list_area_departamento"
    );
  })
    .prefix("/departaments")
    .middleware("auth");

  //Outras rotas
  Route.group(() => {
    Route.get("/position", "OthersController.getPositions");
    Route.post("/searchVehicle", "OthersController.searchVehicle");
  })
    .prefix("/others")
    .middleware("auth");

  //Rotas Solicitações
  Route.group(() => {
    Route.post("/create", "SolicitacoesController.create");
    Route.post("/getById", "SolicitacoesController.getById");
    Route.post("/list", "SolicitacoesController.list");
    Route.post("/listByUser", "SolicitacoesController.listByUser");
    Route.put("/update", "SolicitacoesController.update");
    Route.get("/getParameter", "SolicitacoesController.getParameter");
    Route.post("/getMotivos", "SolicitacoesController.getMotivos");
  })
    .prefix("/requests")
    .middleware("auth");

  //Rotas Notificações
  Route.group(() => {
    Route.post("/create", "NotificationsController.create");
    Route.put("/update", "NotificationsController.updateReadNotifications");
    Route.get(
      "/getNotificationsByUser",
      "NotificationsController.getNotificationsByUser"
    );
  })
    .prefix("/notifications")
    .middleware("auth");

  // Rotas Chat Solicitacoes
  Route.group(() => {
    Route.post("/create", "SolicitacoesRespostasController.create");
    Route.post("/getMessages", "SolicitacoesRespostasController.getById");
  })
    .prefix("/requestsChat")
    .middleware("auth");

  //Rotas de atualização e recuperação de senha
  Route.group(() => {
    Route.post("/change", "AuthController.change").middleware("auth");
    Route.post("/recovery", "AuthController.recovery");
  }).prefix("/password");

  //Rotas de Grupos de segurança
  Route.group(() => {
    Route.group(() => {
      Route.post("/create", "SecuritiesController.createGroup");
      Route.get("/getAll", "SecuritiesController.getAllGroups");
      Route.post("/getById", "SecuritiesController.getGroupById");
      Route.put("/update", "SecuritiesController.updateGroup");
    }).prefix("/group");

    Route.group(() => {
      Route.post("/create", "SecuritiesController.createGroupUser");
      Route.get("/getAll", "SecuritiesController.getAllGroupsUser");
      Route.post("/getById", "SecuritiesController.getGroupUserById");
      Route.get("/getByUser", "SecuritiesController.getGroupUserByIdUser");
      Route.put("/update", "SecuritiesController.updateGroupUser");
    }).prefix("groupUser");
  })
    .prefix("/security")
    .middleware("auth");

  //Rotas Video
  Route.group(() => {
    Route.post("/upload", "VideosController.upload");
    Route.post("/sendToEmployee", "VideosController.sendToEmployee");
    Route.post("/getById", "VideosController.getById");
    Route.get("/getAll", "VideosController.getAll");
    Route.put("/update", "VideosController.update");
    Route.delete("/delete", "VideosController.delete");
  }).prefix("/video");
}).prefix("/v2");
