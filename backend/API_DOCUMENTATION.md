# Documentação da API - Super1 Backend

## Visão Geral

API REST para gerenciamento de serviços, contratações e autenticação de usuários.

- **URL Base**: `http://localhost:3333`
- **Documentação Interativa**: `http://localhost:3333/api-docs`

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Após realizar login, você receberá:

- **token**: Token JWT para ser enviado no header `Authorization: Bearer {token}`
- **refreshToken**: Token de renovação armazenado em cookie HTTP-only

### Headers Necessários

Para endpoints protegidos, envie o token no header:

```
Authorization: Bearer {seu-token-jwt}
```

## Endpoints

### 🔐 Autenticação (`/auth`)

#### POST /auth/login

Realiza login e retorna token JWT.

**Body:**

```json
{
  "email": "joao.silva@email.com",
  "password": "SenhaForte123!",
  "rememberMe": true
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

#### GET /auth/me

Retorna dados do usuário autenticado. Requer autenticação.

**Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "joao.silva@email.com",
  "firstName": "João",
  "lastName": "Silva",
  "phone": "+5511987654321",
  "avatarUrl": "https://i.pravatar.cc/300?img=1"
}
```

#### GET /auth/refresh

Renova o token JWT usando o refresh token do cookie.

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

#### GET /auth/logout

Remove o refresh token do cookie.

---

### 👤 Usuários (`/user`)

#### POST /user

Cria um novo usuário no sistema.

**Body:**

```json
{
  "email": "maria.santos@email.com",
  "firstName": "Maria",
  "lastName": "Santos",
  "phone": "+5511987654321",
  "password": "SenhaForte123!"
}
```

**Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "maria.santos@email.com",
  "firstName": "Maria",
  "lastName": "Santos",
  "phone": "+5511987654321",
  "avatarUrl": null
}
```

---

### 🛠️ Serviços (`/service`)

#### POST /service

Cria um novo tipo de serviço. Requer autenticação.

**Body:**

```json
{
  "name": "Pintura Residencial"
}
```

#### GET /service

Lista todos os tipos de serviços disponíveis.

#### POST /service/provide

Anuncia um novo serviço com variantes e horários. Requer autenticação.

**Body:**

```json
{
  "description": "Serviço de pintura residencial com materiais inclusos",
  "providerId": "550e8400-e29b-41d4-a716-446655440001",
  "serviceId": "550e8400-e29b-41d4-a716-446655440002",
  "variants": [
    {
      "name": "Pintura de Sala Pequena",
      "price": 25000,
      "durationMinutes": 120
    },
    {
      "name": "Pintura de Sala Grande",
      "price": 45000,
      "durationMinutes": 240
    }
  ],
  "schedules": [
    {
      "weekday": 1,
      "start": "08:00:00.000Z",
      "end": "18:00:00.000Z"
    },
    {
      "weekday": 2,
      "start": "08:00:00.000Z",
      "end": "18:00:00.000Z"
    }
  ]
}
```

**Notas:**

- `price`: Valor em centavos (25000 = R$ 250,00)
- `durationMinutes`: Duração estimada do serviço em minutos
- `weekday`: Dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)

#### GET /service/provided

Lista serviços anunciados com paginação e filtros.

**Query Parameters:**

- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `serviceId` (opcional): Filtrar por tipo de serviço
- `search` (opcional): Busca textual
- `providerId` (opcional): Filtrar por prestador

#### GET /service/provided/:id

Retorna detalhes de um serviço anunciado específico.

#### GET /service/provided/:id/availability

Retorna horários disponíveis para agendamento do serviço.

#### DELETE /service/provided/:id

Remove um serviço anunciado. Requer autenticação.

#### POST /service/provided/variant/:variantId/contract

Contrata uma variante específica de serviço. Requer autenticação.

**Body:**

```json
{
  "contractorId": "550e8400-e29b-41d4-a716-446655440003",
  "start": "2024-12-15T10:00:00.000Z"
}
```

#### GET /service/contracted

Lista serviços contratados do usuário autenticado. Requer autenticação.

**Query Parameters:**

- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `contractorId` (opcional): Filtrar por contratante
- `providerId` (opcional): Filtrar por prestador

#### PATCH /service/contracted/:contractedServiceId/accept

Prestador aceita uma solicitação de serviço. Requer autenticação.

#### PATCH /service/contracted/:contractedServiceId/cancel

Cancela uma contratação de serviço. Requer autenticação.

#### PATCH /service/contracted/:contractedServiceId/reject

Prestador rejeita uma solicitação de serviço. Requer autenticação.

---

### 📤 Upload (`/upload`)

Todos os endpoints de upload requerem autenticação e Content-Type `multipart/form-data`.

#### POST /upload

Faz upload de um arquivo genérico.

**Form Data:**

- `file`: Arquivo a ser enviado

**Response (201):**

```json
{
  "url": "https://storage.example.com/files/abc123.jpg"
}
```

#### POST /upload/user-avatar/:userId

Faz upload do avatar do usuário.

**Form Data:**

- `file`: Imagem do avatar

**Response (201):**

```json
{
  "url": "https://storage.example.com/avatars/user123.jpg"
}
```

#### POST /upload/provided-service-image/:providerServiceId

Adiciona imagem ao serviço anunciado.

**Form Data:**

- `file`: Imagem do serviço

**Response (201):**

```json
{
  "url": "https://storage.example.com/services/service123.jpg"
}
```

---

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos no corpo da requisição
- `401 Unauthorized`: Token ausente ou inválido
- `403 Forbidden`: Acesso negado ao recurso
- `404 Not Found`: Recurso não encontrado
- `409 Conflict`: Conflito (ex: email já cadastrado, horário indisponível)
- `500 Internal Server Error`: Erro interno do servidor

## Modelos de Dados

### User

```typescript
{
  id: string (UUID)
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
}
```

### Service

```typescript
{
  id: string(UUID);
  name: string;
}
```

### ProviderService

```typescript
{
  id: string (UUID)
  description: string
  providerId: string (UUID)
  serviceId: string (UUID)
  imageUrls: string[]
  variants: Variant[]
  schedules: Schedule[]
}
```

### Variant

```typescript
{
  id: string (UUID)
  name: string
  price: number (em centavos)
  durationMinutes: number
}
```

### Schedule

```typescript
{
  id: string (UUID)
  weekday: number (0-6)
  start: string (ISO 8601)
  end: string (ISO 8601)
}
```

### ContractedService

```typescript
{
  id: string (UUID)
  contractorId: string (UUID)
  variantId: string (UUID)
  start: string (ISO 8601)
  end: string (ISO 8601)
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELED" | "REJECTED"
}
```

## Testando a API

### Com Swagger UI

Acesse `http://localhost:3333/api-docs` para usar a interface interativa do Swagger.

### Com cURL

**Login:**

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "password": "SenhaForte123!",
    "rememberMe": true
  }'
```

**Criar Usuário:**

```bash
curl -X POST http://localhost:3333/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria.santos@email.com",
    "firstName": "Maria",
    "lastName": "Santos",
    "password": "SenhaForte123!"
  }'
```

**Listar Serviços Anunciados:**

```bash
curl -X GET http://localhost:3333/service/provided?page=1&limit=10
```

**Anunciar Serviço (requer token):**

```bash
curl -X POST http://localhost:3333/service/provide \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token}" \
  -d '{
    "description": "Serviço de pintura residencial",
    "providerId": "550e8400-e29b-41d4-a716-446655440001",
    "serviceId": "550e8400-e29b-41d4-a716-446655440002",
    "variants": [{
      "name": "Sala Pequena",
      "price": 25000,
      "durationMinutes": 120
    }],
    "schedules": [{
      "weekday": 1,
      "start": "08:00:00.000Z",
      "end": "18:00:00.000Z"
    }]
  }'
```

## Observações Importantes

1. **Senhas**: Devem conter pelo menos 8 caracteres com maiúsculas, minúsculas, números e símbolos
2. **Telefones**: Devem estar no formato brasileiro com código do país (+55)
3. **Datas**: Todas as datas devem estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
4. **Preços**: São armazenados em centavos (25000 = R$ 250,00)
5. **UUIDs**: Todos os IDs são no formato UUID v4
6. **Refresh Token**: É armazenado automaticamente em cookie HTTP-only quando `rememberMe` é `true`
