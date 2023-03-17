import { getEvents, getToken, getTrips } from "./services/datalBus";
import "reflect-metadata";
import sourceMapSupport from "source-map-support";
import { Ignitor } from "@adonisjs/core/build/standalone";
import { schedule } from "node-cron";
import { DateTime } from "luxon";
import api from "./services/api";
import { TripType } from "./services/serverTypes";

sourceMapSupport.install({ handleUncaughtExceptions: false });

const CRON_TIME_MINUTE = "*/50 * * * *";
const CRON_DAILY = "0 0 0 1/1 * ? *";

const date_log = DateTime.now().toFormat("yyyy-MM-dd");

schedule(CRON_TIME_MINUTE, async () => {
  console.log("Cron execute");

  var tripsList: TripType[] = [];
  const {
    data: { token },
  } = await getToken();

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const [events, trips] = await Promise.all([getEvents(), getTrips()]);

    // precisamos verificar se tem algum eventos novo alem dos que temos
    // na base de dados e adicionar a base de dados caso o mesmo seja novo

    // exemplo de retorno de eventos

    // {
    //   current_page: 1,
    //   data: [
    //     {
    //       id: 79,
    //       name: 'Partida pelo Botão de Emergência',
    //       type: 'Evento'
    //     },
    //     { id: 82, name: 'Sistema SCR Comprometido', type: 'Alerta' },
    //     { id: 83, name: 'Tanque de Arla Vazio', type: 'Alerta' },
    //     {
    //       id: 84,
    //       name: 'Falha Sensor do Nível do Tanque',
    //       type: 'Sumário'
    //     },

    //   ],
    //   first_page_url: 'https://datalbus.com.br:8000/api/v2/events-schema?page=1',
    //   from: 1,
    //   last_page: 1,
    //   last_page_url: 'https://datalbus.com.br:8000/api/v2/events-schema?page=1',
    //   next_page_url: null,
    //   path: 'https://datalbus.com.br:8000/api/v2/events-schema',
    //   per_page: 1000,
    //   prev_page_url: null,
    //   to: 72,
    //   total: 72
    // }

    if (trips.data.data) {
      const dataTrips = trips.data.data;
      tripsList.push(...dataTrips);

      var tips = trips.data;
      var nextPage = "&" + trips.data.next_page_url;

      while (tips.next_page_url !== null) {
        const tripsNew = await getTrips(nextPage.replace("/?", ""));

        tripsList.push(...tripsNew.data.data);
        tips = tripsNew.data;
        nextPage = "&" + tripsNew.data.next_page_url;
      }

      // Devemos armazenas todas as trips com todas as informações
      // precisamos criar tabela para armazenar

      // exemplo de retorno da trips que vamos armazenar

      // [{
      //     id: 15479509,
      //     drive_id: 8372,
      //     asset_id: 548,
      //     engine_hours: '0.4025',
      //     date: '2023-03-15 00:45:26',
      //     end_drive: '2023-03-15 01:10:23',
      //     mileage: '7',
      //     drive_duration: '00:24:57',
      //     total_mileage: '362676.675',
      //     fuel_used: '5.159',
      //     start_latitude: '-23.603960',
      //     start_longitude: '-46.604179',
      //     end_latitude: '-23.650160',
      //     end_longitude: '-46.613319',
      //     log_gps_processed: true,
      //     created_at: null,
      //     updated_at: null,
      //     line_name: '477A-10',
      //     subtrips: [Array]
      //   },
      //   {
      //     id: 15479510,
      //     drive_id: 6437,
      //     asset_id: 463,
      //     engine_hours: '0.0155555555555556',
      //     date: '2023-03-15 01:07:35',
      //     end_drive: '2023-03-15 01:09:07',
      //     mileage: '0.1',
      //     drive_duration: '00:01:32',
      //     total_mileage: '459548.02',
      //     fuel_used: '0.149',
      //     start_latitude: '-23.599819',
      //     start_longitude: '-46.506001',
      //     end_latitude: '-23.600349',
      //     end_longitude: '-46.505951',
      //     log_gps_processed: true,
      //     created_at: null,
      //     updated_at: null,
      //     line_name: null,
      //     subtrips: [Array]
      //   }
      // ]
    } else {
      // devemos armazenar o log caso ocorra um erro
    }
  } else {
    // devemos armazenar o log de erro caso ocorra
  }
});

new Ignitor(__dirname).httpServer().start();
