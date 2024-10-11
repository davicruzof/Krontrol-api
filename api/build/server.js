"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const datalBus_1 = require("./services/datalBus");
require("reflect-metadata");
const source_map_support_1 = __importDefault(require("source-map-support"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const node_cron_1 = require("node-cron");
const api_1 = __importDefault(require("./services/api"));
const CRON_MIDNIGHT = "0 0 * * *";
(0, node_cron_1.schedule)(CRON_MIDNIGHT, async () => {
    const { default: Database } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database")));
    const { default: KontrolEvento } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]("App/Models/KontrolEvento")));
    console.log("Cron executing...");
    var tripsList = [];
    var eventsList = [];
    const token = (await (0, datalBus_1.getToken)()).data.token;
    if (token) {
        api_1.default.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const [events, trips] = await Promise.all([(0, datalBus_1.getEvents)(), (0, datalBus_1.getTrips)()]);
        if (trips.data) {
            try {
                const dataTrips = trips.data.data;
                const dataEvents = events.data.data;
                eventsList.push(...dataEvents);
                tripsList.push(...dataTrips);
                var tips = trips.data;
                var nextPage = "&" + trips.data.next_page_url;
                let eventoBusca;
                await Promise.all(eventsList.map(async (event) => {
                    eventoBusca = await KontrolEvento.findBy("id_evento_kontrow", event.id);
                    if (!eventoBusca) {
                        await KontrolEvento.create({
                            id_empresa: 1,
                            id_evento_kontrow: event.id,
                            evento: event.name,
                        });
                    }
                }));
                while (tips.next_page_url !== null) {
                    const tripsNew = await (0, datalBus_1.getTrips)(nextPage.replace("/?", ""));
                    tripsList.push(...tripsNew.data.data);
                    tips = tripsNew.data;
                    nextPage = "&" + tripsNew.data.next_page_url;
                }
                await Promise.all(tripsList.map(async (trip) => {
                    await Database.connection("pg")
                        .table("ml_int_telemetria_trips")
                        .insert({
                        id_trip: trip.id,
                        drive_id: trip.drive_id,
                        asset_id: trip.asset_id,
                        engine_hours: trip.engine_hours,
                        date: trip.date,
                        end_drive: trip.end_drive,
                        mileage: trip.mileage,
                        drive_duration: trip.drive_duration,
                        total_mileage: trip.total_mileage,
                        fuel_used: trip.fuel_used,
                        start_latitude: trip.start_latitude,
                        start_longitude: trip.start_longitude,
                        end_latitude: trip.end_latitude,
                        end_longitude: trip.end_longitude,
                        log_gps_processed: trip.log_gps_processed,
                        created_at: trip.created_at,
                        updated_at: trip.updated_at,
                        line_name: trip.line_name,
                    });
                    const eventsTrip = (await (0, datalBus_1.getEventsTrip)(trip.id)).data.data;
                    eventsTrip.map(async (event) => {
                        await Database.connection("pg")
                            .table("ml_int_telemetria_events_trip")
                            .insert({
                            id_trip_event: event.id,
                            trip_id: event.trip_id,
                            event_id: event.event_id,
                            asset_id: event.asset_id,
                            license_number: event.license_number,
                            time: event.time,
                            event_type_id: event.event_type_id,
                            event_type_description: event.event_type_description,
                            event_category_description: event.event_category_description,
                            latitude: event.latitude,
                            longitude: event.longitude,
                            coordinates: event.coordinates,
                        });
                    });
                    trip.subtrips.map(async (subtrip) => {
                        await Database.connection("pg")
                            .table("ml_int_telemetria_subtrips")
                            .insert({
                            id_subtrip: subtrip.id,
                            trip_id: subtrip.trip_id,
                            asset_id: subtrip.asset_id,
                            start_drive: subtrip.start_drive,
                            end_drive: subtrip.end_drive,
                            driver_name: subtrip.driver_name,
                            group_desc: subtrip.group_desc,
                            worker_id: subtrip.worker_id,
                            mileage: subtrip.mileage,
                            fuel_used: subtrip.fuel_used,
                            idle_duration: subtrip.idle_duration,
                        });
                    });
                }));
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
        }
        console.log("CRON finished!");
    }
    else {
        console.log("erro");
    }
});
source_map_support_1.default.install({ handleUncaughtExceptions: false });
new standalone_1.Ignitor(__dirname).httpServer().start();
//# sourceMappingURL=server.js.map