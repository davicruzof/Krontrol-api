import { schema } from "@ioc:Adonis/Core/Validator";

export const NotificationsSchema = {
  id_funcionario: schema.number(),

  message: schema.string(),

  type: schema.number(),
};
