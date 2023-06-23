"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsSchema = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
exports.NotificationsSchema = {
    id_funcionario: Validator_1.schema.number(),
    message: Validator_1.schema.string(),
    type: Validator_1.schema.number(),
};
//# sourceMappingURL=Notifications.js.map