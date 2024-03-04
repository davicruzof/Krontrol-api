"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsTrip = exports.getTrips = exports.getEvents = exports.getToken = void 0;
const luxon_1 = require("luxon");
const api_1 = __importDefault(require("./api"));
const getToken = async () => {
    try {
        const URL = `/login?email=${process.env.DATALBUS_API_LOGIN}&password=${process.env.DATALBUS_API_PASSWORD}`;
        const token = await api_1.default.post(URL);
        return token;
    }
    catch (err) {
        const { error } = err?.response?.data;
        throw new Error(error);
    }
};
exports.getToken = getToken;
const getEvents = async () => {
    try {
        const URL = "/events-schema?per_page=1000";
        const data = await api_1.default.get(URL);
        return data;
    }
    catch (err) {
        const { error } = err?.response?.data;
        throw new Error(error);
    }
};
exports.getEvents = getEvents;
const getTrips = async (nextPage = "") => {
    try {
        const date_consult = luxon_1.DateTime.now()
            .minus({ days: 1 })
            .toFormat("yyyy-MM-dd");
        const URL = `/trips?per_page=100&date=${date_consult}${nextPage}`;
        const data = await api_1.default.get(URL);
        return data;
    }
    catch (err) {
        const { error } = err?.response?.data;
        throw new Error(error);
    }
};
exports.getTrips = getTrips;
const getEventsTrip = async (id, nextPage = "") => {
    try {
        const date_consult = luxon_1.DateTime.now()
            .minus({ days: 1 })
            .toFormat("yyyy-MM-dd");
        const URL = `/trips/${id}/events?per_page=1000&date=${date_consult}${nextPage}`;
        const data = await api_1.default.get(URL);
        return data;
    }
    catch (err) {
        const { error } = err?.response?.data;
        throw new Error(error);
    }
};
exports.getEventsTrip = getEventsTrip;
//# sourceMappingURL=datalBus.js.map