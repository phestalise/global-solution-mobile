// src/types/index.ts

export interface Produtor {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  createdAt?: string;
}

export interface Propriedade {
  id: number;
  nome: string;
  localizacao: string;
  cultura: string;       // ex: "Soja", "Milho", "Café"
  areaHectares: number;
  produtorId: number;
  createdAt?: string;
}

export interface LeituraSatelital {
  id: number;
  propriedadeId: number;
  ndvi: number;          // 0.0 a 1.0
  temperatura: number;   // °C
  umidade: number;       // %
  dataLeitura: string;   // ISO date string
}

export interface Alerta {
  id: number;
  propriedadeId: number;
  tipo: 'SECA' | 'PRAGA' | 'EXCESSO_CHUVA' | 'NDVI_BAIXO';
  descricao: string;
  nivel: 'BAIXO' | 'MEDIO' | 'ALTO';
  ativo: boolean;
  createdAt: string;
}

export type RiscoNivel = 'BAIXO' | 'MÉDIO' | 'ALTO';

// Navigation param lists
export type RootStackParamList = {
  Login:       undefined;
  MainTabs:    undefined;
};

export type TabParamList = {
  Dashboard:    undefined;
  Propriedades: undefined;
  Alertas:      undefined;
  Perfil:       undefined;
};

export type PropriedadesStackParamList = {
  ListaPropriedades:    undefined;
  DetalhesPropriedade:  { propriedadeId: number; nome: string };
  FormPropriedade:      { propriedade?: Propriedade };
};

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}