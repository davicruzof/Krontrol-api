import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Notifications from "App/Models/Notifications";
import {
  NotificationsSchema,
  NotificationsUpdateSchema,
} from "App/Schemas/Notifications";

export default class NotificationsController {
  public async create({ request, response, auth }: HttpContextContract) {
    await request.validate({ schema: schema.create(NotificationsSchema) });
    let dados = request.body();

    try {
      await Notifications.create({
        ...dados,
        id_funcionario: auth.user?.id_funcionario,
      });
      response.json({ status: "Notificação cadastrada " });
    } catch (error) {
      response.json(error);
    }
  }

  public async updateReadNotifications({
    request,
    response,
  }: HttpContextContract) {
    await request.validate({
      schema: schema.create(NotificationsUpdateSchema),
    });

    let { id_notification } = request.body();
    try {
      const notification = await Notifications.findBy("id", id_notification);

      if (notification) {
        notification.merge({ read: true }).save();
        return response.json({ success: "Atualizado com sucesso" });
      }
      response.json({ error: "Erro na atualização " });
    } catch (error) {
      response.json(error);
    }
  }

  public async getNotificationsByUser({ response, auth }: HttpContextContract) {
    try {
      if (auth.user) {
        const notifications = await Notifications.query()
          .where("id_funcionario", auth.user?.id_funcionario)
          .where("read", false);
        response.json(notifications);
      }
    } catch (error) {
      response.json(error);
    }
  }
}
