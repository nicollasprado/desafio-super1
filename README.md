![Svelte](https://img.shields.io/badge/sveltekit-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) 
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/elasticsearch-%230377CC.svg?style=for-the-badge&logo=elasticsearch&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

# Plataforma de Marketplace

Plataforma completa para conectar prestadores de serviços a clientes, permitindo anúncio, busca, contratação e gerenciamento de serviços diversos.

## Pré-requisitos

- Node.js 18+
- pnpm
- Docker e Docker Compose

## ⚙️ Configuração e Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/nicollasprado/desafio-super1.git
cd desafio-super1
```

### 2. Configure as variáveis de ambiente

#### Backend (`/backend/.env`)

- DATABASE_URL: URL para o banco de dados
- JWT_SECRET: senha para geração de hash do jwt
- JWT_EXPIRATION_TIME: tempo em segundos para expiração do token de acesso
- JWT_REFRESH_EXPIRATION_TIME: tempo em segundos para expiração do refresh token
- SUPABASE_URL: URL para o seu supabase
- SUPABASE_KEY: Chave da API do supabase
- SUPABASE_BUCKET: Nome do bucket do supabase
- ELASTICSEARCH_NODE: URL para o node do seu elasticsearch
- REDIS_URL: URL do seu redis

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/marketplace
PORT=3333

JWT_SECRET=marketplace
JWT_EXPIRATION_TIME=3600 # 1 hora em segundos
JWT_REFRESH_EXPIRATION_TIME=604800 # 1 semana em segundos

SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET=

ELASTICSEARCH_NODE=http://localhost:9200

REDIS_URL=redis://localhost:6379
```

#### Frontend (`/frontend/.env`)

- PUBLIC_API_URL: URL da api (backend)

```env
PUBLIC_API_URL="http://localhost:3333"
```

### 3. Inicie os serviços Docker

```bash
docker-compose up -d
```

Isso iniciará:

- PostgreSQL (porta 5432)
- Elasticsearch (porta 9200)
- Kibana (porta 5601)
- Redis (porta 6379)

### 4. Instale as dependências

#### Backend

```bash
cd backend
pnpm install
```

#### Frontend

```bash
cd frontend
pnpm install
```

### 5. Configure o banco de dados

```bash
cd backend

# Executar migrations
pnpm prisma migrate deploy

# Popular banco de dados com dados de exemplo
pnpm seed
```

O seed criará:

- 9 usuários (5 prestadores, 4 clientes)
- 8 tipos de serviços
- 5 serviços anunciados
- Múltiplas variantes e horários
- Exemplos de contratações
- Dados indexados no Elasticsearch

### 6. Inicie as aplicações

#### Backend

```bash
cd backend
pnpm start:dev
```

A API estará disponível em `http://localhost:3333`

#### Frontend

```bash
cd frontend
pnpm dev
```

O frontend estará disponível em `http://localhost:5173`

## 📚 Documentação da API

Acesse a documentação interativa Swagger em:

```
http://localhost:3333/api-docs
```

## 🗄️ Modelo de Dados

### Principais Entidades

- **User**: Usuários (clientes e prestadores)
- **Service**: Tipos de serviços (Pintor, Eletricista, etc.)
- **ProviderService**: Serviços anunciados por prestadores
- **Variant**: Variantes de preço/duração de um serviço
- **Schedule**: Horários disponíveis por dia da semana
- **ContractedService**: Contratações realizadas

Veja o diagrama completo em [docs/db/db.dbml](/docs/db.dbml)
