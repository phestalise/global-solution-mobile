export interface Produtor {
  id: number;
  nome: string;
  cpf: string;
  estado: string;
  cidade: string;
  email?: string;
  telefone?: string;
  dtCadastro?: string;
  createdAt?: string;
}

export interface Propriedade {
  id: number;
  nome: string;
  localizacao: string;
  cultura: string;
  areaHectares: number;
  produtorId: number;
  createdAt?: string;
}

export interface LeituraSatelital {
  id: number;
  propriedadeId: number;
  ndvi: number;
  temperatura: number;
  umidade: number;
  dataLeitura: string;
  statusSolo?: string;
}

export interface Alerta {
  id: number;
  propriedadeId: number;
  tipo: 'praga' | 'clima' | 'seca' | 'ndvi_baixo';
  mensagem: string;
  gravidade: 'alta' | 'média' | 'baixa';
  ativo: boolean;
  createdAt: string;
}

export type RiscoNivel = 'baixo' | 'médio' | 'alto';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Propriedades: undefined;
  Alertas: undefined;
  Perfil: undefined;
};

export type PropriedadesStackParamList = {
  ListaPropriedades: undefined;
  DetalhesPropriedade: { propriedadeId: number; nome: string };
  FormPropriedade: { propriedade?: Propriedade };
};

export interface DashboardLeitura {
  propriedadeId: number;
  nome: string;
  leitura: LeituraSatelital;
  risco: RiscoNivel | string;
}

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