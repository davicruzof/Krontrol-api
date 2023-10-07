import { schema } from "@ioc:Adonis/Core/Validator";

export const InformativoSchema = {
    informativo_id: schema.number(),
    id: schema.number(),
};