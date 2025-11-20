"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SecurityHeaders {
    async handle({ response }, next) {
        await next();
        response.header("X-Frame-Options", "DENY");
        response.header("X-Content-Type-Options", "nosniff");
        response.header("X-XSS-Protection", "1; mode=block");
        if (process.env.NODE_ENV === "production") {
            response.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        }
        response.header("Referrer-Policy", "strict-origin-when-cross-origin");
        response.header("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none';");
    }
}
exports.default = SecurityHeaders;
//# sourceMappingURL=SecurityHeaders.js.map