import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ForceHttps {
  /**
   * Força redirecionamento para HTTPS em produção
   * Útil quando o Load Balancer envia cabeçalhos X-Forwarded-Proto
   */
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const isProduction = process.env.NODE_ENV === "production";
    const isHttps =
      request.header("x-forwarded-proto") === "https" ||
      request.protocol() === "https";

    // Em produção, redireciona HTTP para HTTPS
    if (isProduction && !isHttps) {
      const httpsUrl = `https://${request.hostname()}${request.url()}`;
      return response.redirect(httpsUrl, false, 301);
    }

    await next();
  }
}
