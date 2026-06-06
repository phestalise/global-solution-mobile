import axios, { AxiosInstance, AxiosError } from "axios";
import { Platform } from "react-native";
import { Produtor, LeituraSatelital, Alerta } from "../types";

const LOCAL_IP = "10.0.0.244";

const BASE_URL = Platform.select({
  android: "http://13.71.191.204:8080/api",
  ios: `http://${LOCAL_IP}:8080/api`,
  default: "http://localhost:8080/api",
});

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log("=== ERRO API ===");
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", JSON.stringify(error.response?.data, null, 2));
    console.log("================");

    const data = error.response?.data as any;
    const msg =
      data?.message ||
      data?.detail ||
      data?.title ||
      data?.error ||
      error.message ||
      "Erro de conexão com o servidor";
    return Promise.reject(new Error(msg));
  }
);

const cleanCpf = (cpf: string) => cpf.replace(/\D/g, "");

export const produtorService = {
  login: (cpf: string, senha: string) =>
    api.post<Produtor>("/Produtores/Login", {
      cpf: cleanCpf(cpf),
      senha,
    }),

  getById: (id: number) =>
    api.get<Produtor>(`/Produtores/${id}`),

  create: (data: Omit<Produtor, "id" | "dtCadastro" | "createdAt"> & { senha: string }) =>
    api.post<Produtor>("/Produtores/Cadastro", {
      ...data,
      cpf: cleanCpf(data.cpf),
    }),

  update: (id: number, data: Partial<Produtor>) =>
    api.put<Produtor>(`/Produtores/${id}`, {
      ...data,
      cpf: data.cpf ? cleanCpf(data.cpf) : undefined,
    }),
};

export const propriedadeService = {
  listar: (produtorId: number) =>
    api.get<any[]>("/propriedades", {
      params: { produtorId },
    }),

  getById: (id: number) =>
    api.get<any>(`/propriedades/${id}`),

  criar: (data: {
    idProdutor: number;
    nomeFazenda: string;
    estado: string;
    municipio: string;
    areaHectares: number;
    tipoCultura?: string;
    safra?: string;
    latitude?: number;
    longitude?: number;
  }) =>
    api.post<any>("/propriedades", data),

  atualizar: (id: number, data: Partial<{
    nomeFazenda: string;
    estado: string;
    municipio: string;
    areaHectares: number;
    tipoCultura?: string;
    latitude?: number;
    longitude?: number;
  }>) =>
    api.put<any>(`/propriedades/${id}`, data),

  deletar: (id: number) =>
    api.delete(`/propriedades/${id}`),
};

export const leituraService = {
  listar: (propriedadeId: number, limit = 30) =>
    api.get<LeituraSatelital[]>("/leituras", {
      params: { propriedadeId, limit },
    }),

  getUltima: (propriedadeId: number) =>
    api.get<LeituraSatelital>(`/leituras/ultima/${propriedadeId}`),

  getDashboard: (produtorId: number) =>
    api.get<{
      propriedadeId: number;
      nome: string;
      leitura: LeituraSatelital;
      risco: string;
    }[]>("/leituras/dashboard", {
      params: { produtorId },
    }),

  // NOVO MÉTODO – POST /api/leituras
  criar: (dados: {
    idPropriedade: number;
    ndvi?: number;
    temperatura?: number;
    umidade?: number;
    precipitacao?: number;
    fonteSatelite?: string;
  }) => api.post<LeituraSatelital>("/leituras", dados),
};

export const alertaService = {
  listar: (produtorId: number, apenasAtivos = true) =>
    api.get<Alerta[]>("/alertas", {
      params: { produtorId, ativo: apenasAtivos },
    }),

  resolver: (id: number) =>
    api.put(`/alertas/${id}/resolver`),
};

export default api;