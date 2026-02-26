import { Injectable } from '@nestjs/common'

@Injectable()
export class LlmServiceMock {
  constructor() {}

  async extractInvoice(filePath: string): Promise<any> {
    return {}
  }
}
