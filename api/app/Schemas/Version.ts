import { schema } from "@ioc:Adonis/Core/Validator";

export const AppVersionInsert = {
  id_empresa: schema.number.nullableAndOptional(),
  id_funcionario: schema.number.nullableAndOptional(),
  so: schema.string.nullableAndOptional(),
  app_version: schema.string.nullableAndOptional(),
};
