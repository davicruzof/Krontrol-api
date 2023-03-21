export type AuthProps = {
  token: string;
  user: {
    id: number;
    email: string;
    tenancy: Array<string>;
    global_admin: boolean;
  };
};

export type EventType = {
  id: number;
  name: string;
  type: string;
};

export type Events = {
  current_page: number;
  data: Array<EventType>;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
};

type SubTrip = {
  id: number;
  trip_id: number;
  asset_id: number;
  start_drive: string;
  end_drive: string;
  driver_name: string;
  group_desc: string;
  worker_id: number;
  mileage: string;
  fuel_used: string;
  idle_duration: number;
};

export type TripType = {
  id: number;
  drive_id: number;
  asset_id: number;
  engine_hours: string;
  date: string;
  end_drive: string;
  mileage: string;
  drive_duration: string;
  total_mileage: string;
  fuel_used: string;
  start_latitude: string;
  start_longitude: string;
  end_latitude: string;
  end_longitude: string;
  log_gps_processed: boolean;
  created_at: string;
  updated_at: string;
  line_name: string;
  subtrips: Array<SubTrip> | [];
};

export type Trips = {
  current_page: number;
  data: Array<TripType>;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
};
