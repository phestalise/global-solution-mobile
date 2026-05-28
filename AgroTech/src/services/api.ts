// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { Propriedade, LeituraSatelital, Alerta, Produtor } from '../types';

// ⚠️  ALTERE AQUI: URL base da sua API C# (.NET)
// Para emulador Android: http://10.0.2.2:5000/api
// Para dispositivo físico: http://SEU_IP_LOCAL:5000/api
// Para produção: https://sua-api.azurewebsites.net/api
const BASE_URL = 'http://10.0.2.2:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptors ──────────────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    // Se sua API usar JWT: descomente e salve o token em AsyncStorage
    // const token = await AsyncStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

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

// ── Produtores ────────────────────────────────────────────────────────────────

export const produtorService = {
  login: (email: string, senha: string) =>
    api.post<{ token: string; produtor: Produtor }>('/auth/login', { email, senha }),

  getById: (id: number) =>
    api.get<Produtor>(`/produtores/${id}`),

  create: (data: Omit<Produtor, 'id' | 'createdAt'> & { senha: string }) =>
    api.post<Produtor>('/produtores', data),

  update: (id: number, data: Partial<Produtor>) =>
    api.put<Produtor>(`/produtores/${id}`, data),
};

// ── Propriedades ──────────────────────────────────────────────────────────────

export const propriedadeService = {
  // ⚠️  ROTA: GET /api/propriedades?produtorId={id}
  listar: (produtorId: number) =>
    api.get<Propriedade[]>('/propriedades', { params: { produtorId } }),

  // ⚠️  ROTA: GET /api/propriedades/{id}
  getById: (id: number) =>
    api.get<Propriedade>(`/propriedades/${id}`),

  // ⚠️  ROTA: POST /api/propriedades
  criar: (data: Omit<Propriedade, 'id' | 'createdAt'>) =>
    api.post<Propriedade>('/propriedades', data),

  // ⚠️  ROTA: PUT /api/propriedades/{id}
  atualizar: (id: number, data: Partial<Propriedade>) =>
    api.put<Propriedade>(`/propriedades/${id}`, data),

  // ⚠️  ROTA: DELETE /api/propriedades/{id}
  deletar: (id: number) =>
    api.delete(`/propriedades/${id}`),
};

// ── Leituras Satelitais ───────────────────────────────────────────────────────

export const leituraService = {
  // ⚠️  ROTA: GET /api/leituras?propriedadeId={id}&limit=30
  listar: (propriedadeId: number, limit = 30) =>
    api.get<LeituraSatelital[]>('/leituras', { params: { propriedadeId, limit } }),

  // ⚠️  ROTA: GET /api/leituras/ultima/{propriedadeId}
  getUltima: (propriedadeId: number) =>
    api.get<LeituraSatelital>(`/leituras/ultima/${propriedadeId}`),

  // ⚠️  ROTA: GET /api/leituras/dashboard — retorna última leitura de todas as propriedades do produtor
  getDashboard: (produtorId: number) =>
    api.get<{ propriedadeId: number; nome: string; leitura: LeituraSatelital; risco: string }[]>(
      '/leituras/dashboard',
      { params: { produtorId } }
    ),
};

// ── Alertas ───────────────────────────────────────────────────────────────────

export const alertaService = {
  // ⚠️  ROTA: GET /api/alertas?produtorId={id}&ativo=true
  listar: (produtorId: number, apenasAtivos = true) =>
    api.get<Alerta[]>('/alertas', { params: { produtorId, ativo: apenasAtivos } }),

  // ⚠️  ROTA: PUT /api/alertas/{id}/resolver
  resolver: (id: number) =>
    api.put(`/alertas/${id}/resolver`),
};

export default api;