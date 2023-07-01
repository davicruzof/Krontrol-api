"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Notifications_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Notifications"));
const Notifications_2 = global[Symbol.for('ioc.use')]("App/Schemas/Notifications");
class NotificationsController {
    async create({ request, response, auth }) {
        await request.validate({ schema: Validator_1.schema.create(Notifications_2.NotificationsSchema) });
        let dados = request.body();
        try {
            await Notifications_1.default.create({
                ...dados,
                id_funcionario: auth.user?.id_funcionario,
            });
            response.json({ status: "Notificação cadastrada " });
        }
        catch (error) {
            response.json(error);
        }
    }
    async updateReadNotifications({ request, response, }) {
        await request.validate({
            schema: Validator_1.schema.create(Notifications_2.NotificationsUpdateSchema),
        });
        let { id_notification } = request.body();
        try {
            const notification = await Notifications_1.default.findBy("id", id_notification);
            if (notification) {
                notification.merge({ read: true }).save();
                return response.json({ success: "Atualizado com sucesso" });
            }
            response.json({ error: "Erro na atualização " });
        }
        catch (error) {
            response.json(error);
        }
    }
    async getNotificationsByRequest({ response, request, }) {
        let { id_solicitacao } = request.body();
        try {
            if (id_solicitacao) {
                const notifications = await Notifications_1.default.query()
                    .where("id_solicitacao", id_solicitacao)
                    .where("read", false);
                response.json(notifications);
            }
        }
        catch (error) {
            response.json(error);
        }
    }
    async getNotificationsByUser({ response, auth }) {
        try {
            if (auth.user) {
                const notifications = await Notifications_1.default.query()
                    .where("id_funcionario", auth.user?.id_funcionario)
                    .where("read", false);
                response.json(notifications);
            }
        }
        catch (error) {
            response.json(error);
        }
    }
}
exports.default = NotificationsController;
//# sourceMappingURL=NotificationsController.js.map