
import axios, { AxiosInstance, AxiosError } from 'axios';
import { Platform } from 'react-native';
import { Produtor, Propriedade, LeituraSatelital, Alerta } from '../types';

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080/api',
  ios: 'http://localhost:8080/api',
  default: 'http://localhost:8080/api',
});

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const msg =
      (error.response?.data as any)?.message ||
      error.message ||
      'Erro de conexão com o servidor';
    return Promise.reject(new Error(msg));
  }
);

export const produtorService = {
  login: (cpf: string) =>
    api.post<Produtor>('/Produtores/Login', JSON.stringify(cpf), {
      headers: { 'Content-Type': 'application/json' },
    }),

  getById: (id: number) =>
    api.get<Produtor>(`/Produtores/${id}`),

  create: (data: Omit<Produtor, 'id' | 'dtCadastro'>) =>
    api.post<Produtor>('/Produtores/Cadastro', data),

  update: (id: number, data: Partial<Produtor>) =>
    api.put<Produtor>(`/Produtores/${id}`, data),
};

export const propriedadeService = {
  listar: (produtorId: number) =>
    api.get<Propriedade[]>('/propriedades', { params: { produtorId } }),

  getById: (id: number) =>
    api.get<Propriedade>(`/propriedades/${id}`),

  criar: (data: Omit<Propriedade, 'id' | 'createdAt'>) =>
    api.post<Propriedade>('/propriedades', data),

  atualizar: (id: number, data: Partial<Propriedade>) =>
    api.put<Propriedade>(`/propriedades/${id}`, data),

  deletar: (id: number) =>
    api.delete(`/propriedades/${id}`),
};

export const leituraService = {
  listar: (propriedadeId: number, limit = 30) =>
    api.get<LeituraSatelital[]>('/leituras', { params: { propriedadeId, limit } }),

  getUltima: (propriedadeId: number) =>
    api.get<LeituraSatelital>(`/leituras/ultima/${propriedadeId}`),

  getDashboard: (produtorId: number) =>
    api.get<{ propriedadeId: number; nome: string; leitura: LeituraSatelital; risco: string }[]>(
      '/leituras/dashboard',
      { params: { produtorId } }
    ),
};

export const alertaService = {
  listar: (produtorId: number, apenasAtivos = true) =>
    api.get<Alerta[]>('/alertas', { params: { produtorId, ativo: apenasAtivos } }),

  resolver: (id: number) =>
    api.put(`/alertas/${id}/resolver`),
};

export default api;