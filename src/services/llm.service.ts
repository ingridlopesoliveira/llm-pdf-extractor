import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import OpenAI from 'openai'
import { llm_prompt } from 'src/utils/llm-prompt'

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

    const response = await this.client.responses.create({
      model: 'gpt-4.1',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: llm_prompt },
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
