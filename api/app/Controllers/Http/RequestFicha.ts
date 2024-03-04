import axios, { AxiosError } from "axios";

const BASE_URL = "https://endpointsambaiba.ml18.com.br/glo/pontoeletronico";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default async function RequestFichaPonto(
  id_funcionario_erp: number,
  dateRequestInitial: string,
  dateRequestFinish: string
) {
  try {
    const { data } = await api.post("/ficha", {
      ID_FUNCIONARIO_ERP: id_funcionario_erp,
      dt_movimento_inicio: dateRequestInitial,
      dt_movimento_fim: dateRequestFinish,
    });

    return data;
  } catch (err) {
    const { error } = (err as AxiosError<any, any>)?.response?.data;
    console.log({ error });
    throw new Error(error);
  }
}
