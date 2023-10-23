import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class VersionApp {
  public versionApp = async ({ response }: HttpContextContract) => {
    const versions = await Database.connection("pg").rawQuery(
      "SELECT * FROM public.version_app"
    );

    return response.json(versions.rows[0]);
  };
}
