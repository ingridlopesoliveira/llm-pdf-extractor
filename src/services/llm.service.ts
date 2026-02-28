export abstract class LLMService {
  abstract extractInvoice(filePath: string): Promise<any>
}
