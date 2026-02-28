export const llm_prompt = `Você receberá um documento PDF contendo uma fatura de energia elétrica.

Sua tarefa é extrair exclusivamente os dados solicitados abaixo, retornando apenas um JSON válido, sem qualquer texto adicional.

Formato obrigatório:

type Invoice = {
  fileName: string
  numeroCliente: number | null
  nomeCliente: string | null
  mesReferencia: string | null
  energia: {
    kwh: number | null
    valor: number | null
  } | null
  energiaSceeeSIcms: {
    kwh: number | null
    valor: number | null
  } | null
  energiaCompensadaGdI: {
    kwh: number | null
    valor: number | null
  } | null
  ilumPublica: number | null
}

REGRAS OBRIGATÓRIAS:

1. Saída

- Retorne somente JSON válido
- Não inclua explicações
- Não inclua comentários
- Não inclua markdown
- Não inclua texto antes ou depois do JSON

2. Normalização Numérica

- Converter vírgula decimal para ponto.
- Remover separador de milhar.
- Retornar apenas número (sem "R$", sem texto).
- Manter sinal negativo quando existir.

Exemplos:
1.940 → 1940
232,42 → 232.42
-945,42 → -945.42

3. Dados Ausentes

Se qualquer campo não existir no documento:
- Retornar null
- Não inventar valores
- Não estimar
- Não inferir
- Não utilize o campo histórico

4. Validação

Antes de responder, valide:
- JSON válido
- Todos os campos presentes
- Tipos corretos
- Nenhum texto adicional

Retorne exclusivamente o JSON final.`
