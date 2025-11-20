"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForceHttps {
    async handle({ request, response }, next) {
        const isProduction = process.env.NODE_ENV === "production";
        const isHttps = request.header("x-forwarded-proto") === "https" ||
            request.protocol() === "https";
        if (isProduction && !isHttps) {
            const httpsUrl = `https://${request.hostname()}${request.url()}`;
            return response.redirect(httpsUrl, false, 301);
        }
        await next();
    }
}
exports.default = ForceHttps;
//# sourceMappingURL=ForceHttps.js.map