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
DATABASE_URL=
OPENAI_API_KEY=
ENV_MODE=DEV
```

# Endpoints

## POST /files

Upload e processamento de PDF.

Exemplo:

```
curl -X POST https://llm-pdf-extractor-production.up.railway.app/files \
  -F "files=@fatura.pdf"
```

Resposta:

```json
{
  "statusCode": 201,
  "message": "Arquivo processado com sucesso",
  "data": {
    "id": 17,
    "fileName": "uploads/1772399344385-858936345.pdf",
    "clientId": "7204076117",
    "month": "2024-09-01T03:00:00.000Z",
    "energyConsume": 250,
    "energyCompensated": 0,
    "totalValueWithoutGd": 2440,
    "economyGd": 0
  }
}
```

## GET /files

Lista arquivos processados.

Query params suportados:

- Paginação:
  - page: number
  - pageSize: number
- Filtros:
  - client: number - filtro referente ao campo numero_do_cliente
  - month: string - filtro referente ao campo mês_de_referencia ex: FEV/2024

Exemplo:

```
curl "https://llm-pdf-extractor-production.up.railway.app/files?page=1&pageSize=20&client=7204076117&month=SET/2024"
```

Resposta:

```json
{
  "statusCode": 200,
  "message": "Dados dos arquivos obtidos com sucesso",
  "data": [
    {
      "nome_do_arquivo_processado": "uploads/1772234283713-390774394.pdf",
      "numero_do_cliente": "7204076117",
      "mes_referencia": "setembro de 2024",
      "nome_do_cliente": "Ingrid novo",
      "energia_consumida": 250,
      "energia_conpensada": 0,
      "valor_total_sem_gd": 2440,
      "economia_gd": 0
    },
    {
      "nome_do_arquivo_processado": "uploads/1772281267521-957613123.pdf",
      "numero_do_cliente": "7204076117",
      "mes_referencia": "setembro de 2024",
      "nome_do_cliente": "Ingrid novo",
      "energia_consumida": 250,
      "energia_conpensada": 0,
      "valor_total_sem_gd": 2440,
      "economia_gd": 0
    },
    {
      "nome_do_arquivo_processado": "uploads/.pdf",
      "numero_do_cliente": "7204076117",
      "mes_referencia": "setembro de 2024",
      "nome_do_cliente": "Ingrid novo",
      "energia_consumida": 250,
      "energia_conpensada": 0,
      "valor_total_sem_gd": 2440,
      "economia_gd": 0
    },
    {
      "nome_do_arquivo_processado": "uploads/1772308673773-753515988.pdf",
      "numero_do_cliente": "7204076117",
      "mes_referencia": "setembro de 2024",
      "nome_do_cliente": "Ingrid novo",
      "energia_consumida": 250,
      "energia_conpensada": 0,
      "valor_total_sem_gd": 2440,
      "economia_gd": 0
    },
    {
      "nome_do_arquivo_processado": "uploads/1772308746578-521448920.pdf",
      "numero_do_cliente": "7204076117",
      "mes_referencia": "setembro de 2024",
      "nome_do_cliente": "Ingrid novo",
      "energia_consumida": 250,
      "energia_conpensada": 0,
      "valor_total_sem_gd": 2440,
      "economia_gd": 0
    },
    {
      "nome_do_arquivo_processado": "uploads/1772399344385-858936345.pdf",
      "numero_do_cliente": "7204076117",
      "mes_referencia": "setembro de 2024",
      "nome_do_cliente": "Ingrid novo",
      "energia_consumida": 250,
      "energia_conpensada": 0,
      "valor_total_sem_gd": 2440,
      "economia_gd": 0
    }
  ]
}
```

### GET /dashboard

Retorna valores totais consolidados. Permite filtros de mês e de cliente.

```
curl "https://llm-pdf-extractor-production.up.railway.app/dashboard/?client=7202210726&month=SET/2024"
```

Resposta:

```json
{
  "statusCode": 200,
  "message": "Valores totais consultados com sucesso",
  "data": {
    "resultados_energia": {
      "energia_conpensada": "0",
      "energia_consumida": "3250"
    },
    "resultados_financeiros": {
      "valor_total_sem_gd": 31720,
      "economia_gd": 0
    }
  }
}
```

## GET /dashboard/by-month

Retorna valores agregados por mês.
Posso retornar os valores de duas formas, com base no parametro na rota:

- visualizeOnDashboard: ele permite retornar os dados agrupados em arrays para facilidar a integração em libs de gráficos como a ApexChart

```
curl "https://llm-pdf-extractor-production.up.railway.app/dashboard/by-month"
```

Resposta:

```json
{
  "statusCode": 200,
  "message": "Valores agregados por mês consultados com sucesso",
  "data": [
    {
      "mes": "setembro de 2024",
      "resultados_energia": {
        "energia_conpensada": "0",
        "energia_consumida": "3000"
      },
      "resultados_financeiros": {
        "valor_total_sem_gd": 29280,
        "economia_gd": 0
      }
    },
    {
      "mes": "outubro de 2024",
      "resultados_energia": {
        "energia_conpensada": "0",
        "energia_consumida": "250"
      },
      "resultados_financeiros": {
        "valor_total_sem_gd": 2440,
        "economia_gd": 0
      }
    }
  ]
}
```

```
curl "https://llm-pdf-extractor-production.up.railway.app/dashboard/by-month?visualizeOnDashboard=true"
```

Resposta:

```json
{
  "statusCode": 200,
  "message": "Valores agregados por mês consultados com sucesso",
  "data": {
    "mes": ["2024-09-01T00:00:00.000-03:00", "2024-10-01T00:00:00.000-03:00"],
    "energia_consumida": [3000, 250],
    "energia_conpensada": [0, 0],
    "valor_total_sem_gd": [29280, 2440],
    "economia_gd": [0, 0]
  }
}
```

## Diagrama

<img width="823" height="415" alt="image" src="https://github.com/user-attachments/assets/de17062b-ff8c-4474-8d2f-bf74dabb58a0" />
