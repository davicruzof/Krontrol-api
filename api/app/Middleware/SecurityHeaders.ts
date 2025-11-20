import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SecurityHeaders {
  /**
   * Adiciona headers de segurança às respostas HTTP
   * Protege contra ataques comuns como XSS, clickjacking, etc.
   */
  public async handle(
    { response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    await next();

    // Previne que o site seja exibido em iframes (proteção contra clickjacking)
    response.header("X-Frame-Options", "DENY");

    // Previne MIME type sniffing
    response.header("X-Content-Type-Options", "nosniff");

    // Proteção contra XSS (Cross-Site Scripting)
    response.header("X-XSS-Protection", "1; mode=block");

    // Force HTTPS por 1 ano (apenas em produção)
    if (process.env.NODE_ENV === "production") {
      response.header(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }

    // Controla quais informações de referrer são enviadas
    response.header("Referrer-Policy", "strict-origin-when-cross-origin");

    // Content Security Policy básico (ajuste conforme necessário)
    response.header(
      "Content-Security-Policy",
      "default-src 'self'; frame-ancestors 'none';"
    );
  }
}
