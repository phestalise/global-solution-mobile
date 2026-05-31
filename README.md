# 🌾 AgroTech

Monitoramento agrícola inteligente com análise orbital, sensores e dados climáticos.

O **AgroTech** é um aplicativo mobile que conecta produtores rurais a informações vitais sobre suas lavouras.  
Com ele é possível visualizar índices de vegetação (NDVI), temperatura, umidade do solo e receber alertas de riscos em tempo real, auxiliando na tomada de decisão e aumentando a produtividade no campo.

---

## 📱 Funcionalidades principais

- **Autenticação de produtores** via CPF e senha.
- **Dashboard** com visão geral:
  - Risco da lavoura (baixo, médio, alto).
  - Métricas de NDVI, temperatura e umidade.
  - Alertas recentes (pragas, clima, etc.).
- **Cadastro e gerenciamento de propriedades rurais**:
  - Localização, área em hectares, cultura plantada.
- **Consulta de propriedades** com dados satelitais históricos.
- **Sistema de alertas** com filtros por nível de risco.
- **Perfil do produtor** editável.

---

## 🛠 Tecnologias utilizadas

- **React Native (Expo)** – framework para desenvolvimento mobile.
- **TypeScript** – tipagem estática para maior segurança.
- **React Navigation** – navegação entre telas (Drawer + Stack).
- **Axios** – cliente HTTP para comunicação com a API.
- **Context API** – gerenciamento global de autenticação.
- **Async Storage** – persistência de sessão local.
- **Expo Linear Gradient** – fundos com gradiente.
- **Ionicons (Expo)** – bibli