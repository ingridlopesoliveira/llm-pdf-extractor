import { Injectable } from '@nestjs/common'
import { LlmService } from 'src/services/llm.service'

@Injectable()
export class FilesService {
  constructor(private llmService: LlmService) {}

  async processFile(filePath: string): Promise<any> {
    const extracted = await this.llmService.extractInvoice(filePath)
  }
}
