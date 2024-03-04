import {
  getEvents,
  getToken,
  getTrips,
  getEventsTrip,
} from "./services/datalBus";
import "reflect-metadata";
import sourceMapSupport from "source-map-support";
import { Ignitor } from "@adonisjs/core/build/standalone";
import { schedule } from "node-cron";
import api from "./services/api";
import { TripType, EventType } from "./services/serverTypes";

const CRON_MIDNIGHT = "0 0 * * *";

schedule(CRON_MIDNIGHT, async () => {
  const { default: Database } = await import("@ioc:Adonis/Lucid/Database");
  const { default: KontrolEvento } = await import("App/Models/KontrolEvento");

  console.log("Cron executing...");

  var tripsList: TripType[] = [];
  var eventsList: EventType[] = [];
  const token = (await getToken()).data.token;

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const [events, trips] = await Promise.all([getEvents(), getTrips()]);

    if (trips.data) {
      try {
        const dataTrips = trips.data.data;
        const dataEvents = events.data.data;
        eventsList.push(...dataEvents);
        tripsList.push(...dataTrips);
        var tips = trips.data;
        var nextPage = "&" + trips.data.next_page_url;

        let eventoBusca;
        await Promise.all(
          eventsList.map(async (event) => {
            eventoBusca = await KontrolEvento.findBy(
              "id_evento_kontrow",
              event.id
            );
            if (!eventoBusca) {
              await KontrolEvento.create({
                id_empresa: 1,
                id_evento_kontrow: event.id,
                evento: event.name,
              });
            }
          })
        );

        while (tips.next_page_url !== null) {
          const tripsNew = await getTrips(nextPage.replace("/?", ""));
          tripsList.push(...tripsNew.data.data);
          tips = tripsNew.data;
          nextPage = "&" + tripsNew.data.next_page_url;
        }

        await Promise.all(
          tripsList.map(async (trip) => {
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

            const eventsTrip = (await getEventsTrip(trip.id)).data.data;
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
          })
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      // devemos armazenar o log caso ocorra um erro
    }
    console.log("CRON finished!");
  } else {
    console.log("erro");
    // devemos armazenar o log de erro caso ocorra
  }
});
sourceMapSupport.install({ handleUncaughtExceptions: false });
new Ignitor(__dirname).httpServer().start();
