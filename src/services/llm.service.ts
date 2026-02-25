import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import OpenAI from 'openai'

@Injectable()
export class LlmService {
  private client: OpenAI

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get('openai.apiKey'),
    })
  }

  async extractInvoice(filePath: string): Promise<any> {
    const file = await this.client.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'assistants',
    })

    const prompt = `
Você receberá um documento PDF contendo faturas de energia elétrica.

Analise o documento completo e retorne exclusivamente um JSON válido,
sem texto adicional, no seguinte formato:

{
  "numero_fatura": "string",
  "data_emissao": "YYYY-MM-DD",
  "valor_total": number,
  "cnpj_emissor": "string",
  "nome_emissor": "string",
  "itens": [
    {
      "descricao": "string",
      "quantidade": number,
      "valor_unitario": number,
      "valor_total": number
    }
  ]
}

Regras:
- O JSON deve ser estrito.
- Não inclua comentários.
- Não inclua explicações.
- Caso alguma informação não exista, retorne null.
- Não invente dados.
`

    const response = await this.client.responses.create({
      model: 'gpt-4.1',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            {
              type: 'input_file',
              file_id: file.id,
            },
          ],
        },
      ],
      text: {
        format: { type: 'json_object' },
      },
    })

    const message = response.output[0] as {
      type: 'message'
      content: {
        type: 'output_text'
        text: string
      }[]
    }

    const textOnResponseToParse = message.content[0].text

    return JSON.parse(textOnResponseToParse)
  }
}
