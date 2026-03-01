# Invoice Processing API

API para upload e processamento de faturas de energia elétrica em PDF, com extração estruturada de dados via LLM e disponibilização de dados agregados por meio de endpoints REST.

## Backend

- Node.js (NestJS + TypeScript)
- TypeORM
- PostgreSQL
- Zod
- OpenAI (LLM)

## Framework: NestJS

O NestJS foi escolhido por:

- Arquitetura modular e escalável
- Forte suporte a Injeção de Dependência (DI)
- Estrutura baseada em Controllers e Services
- Facilidade para testes unitários
- Organização clara por módulos

A aplicação segue o padrão:
Controller → Service → Repository (TypeORM) → Database

## ORM: TypeORM

O TypeORM foi escolhido por:

- Integração nativa e madura com NestJS
- Suporte robusto a PostgreSQL
- Mapeamento objeto-relacional baseado em decorators
- Facilidade de uso com repositórios customizados
- Suporte a migrations

## Validação: Zod

Utilizado para:

- Validação de query parameters
- Definição explícita de contratos de entrada
- Tipagem segura
- Mensagens de erro estruturadas

## LLM: OpenAI

Utilizado para:

- Extração estruturada de dados de PDFs
- Conversão do conteúdo textual da fatura para JSON tipado

A integração foi abstraída por meio de uma interface `LLMService`, permitindo:

- Mock em ambiente de testes
- Inversão de dependência
- Possível troca futura de provedor de LLM

# Instalação

## Pré-requisitos

- Node.js >= 18
- PostgreSQL
- Chave de API OpenAI

## Variáveis de Ambiente

```
PORT=3000

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

OPENAI_API_KEY=

ENV_MODE=DEV
```

# Endpoints

## POST /files

Upload e processamento de PDF.

Exemplo:

```
curl -X POST http://localhost:3000/files \
  -F "files=@fatura.pdf"
```

Resposta:
{
"statusCode": 201,
"message": "Arquivo processado com sucesso",
"data": {
"fileName": "fatura.pdf",
"numeroCliente": 123456,
"nomeCliente": "Maria Silva",
"mesReferencia": "2024-01",
"energia": {
"kwh": 350,
"valor": 289.90
}
}
}

## GET /files

Lista arquivos processados.

Query params suportados:

- Paginação:
  page
  pageSize
- Filtros:
  numeroCliente
  mesReferencia

Exemplo:

```
curl "http://localhost:3000/files?page=1&pageSize=10"
```

### GET /dashboard

Retorna valores totais consolidados.

```
curl "http://localhost:3000/dashboard"
```

## GET /dashboard/by-month

Retorna valores agregados por mês.

```
curl "http://localhost:3000/dashboard/by-month"

```
