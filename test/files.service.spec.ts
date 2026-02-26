import { Test, TestingModule } from '@nestjs/testing'
import { InvoiceDTO } from '../src/dtos/invoice.dto'
import { InvoicesRepository } from '../src/repositories/invoice.repository'
import { FilesService } from '../src/services/files.service'
import { LlmServiceMock } from '../src/services/llm-mock.service'
import { Invoice } from '../src/types/invoice.type'

describe('FilesService', () => {
  let service: FilesService
  let llmMock: jest.Mocked<LlmServiceMock>
  let repo: jest.Mocked<InvoicesRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService, { provide: LlmServiceMock, useValue: { extractInvoice: jest.fn() } }, { provide: InvoicesRepository, useValue: { create: jest.fn(), findAll: jest.fn() } }],
    }).compile()

    service = module.get<FilesService>(FilesService)
    llmMock = module.get(LlmServiceMock) as jest.Mocked<LlmServiceMock>
    repo = module.get(InvoicesRepository) as jest.Mocked<InvoicesRepository>
  })

  it('computes aggregated values correctly', () => {
    const invoice: Invoice = {
      fileName: 'fatura.pdf',
      cliente: '123',
      mesReferencia: 'JAN-2026',
      energia: { kwh: 10, valor: 100 },
      energiaSceeeSIcms: { kwh: 20, valor: 200 },
      energiaCompensadaGdI: { kwh: 5, valor: 50 },
      ilumPublica: 30,
    } as Invoice

    const dto: InvoiceDTO = (service as any).processExtractedDataValues(invoice)
    expect(dto.energyConsume).toBe(30) // 10 + 20
    expect(dto.energyCompensated).toBe(5)
    expect(dto.totalValueWithoutGd).toBe(330) // 100 + 200 + 30
    expect(dto.economyGd).toBe(50)
  })

  it('processFile calls LLM and repository and returns saved invoice', async () => {
    const fakeInvoice: Invoice = {
      fileName: 'path/any.pdf',
      cliente: 'abc',
      mesReferencia: 'FEB-2026',
      energia: { kwh: 1, valor: 10 },
      energiaSceeeSIcms: { kwh: 2, valor: 20 },
      energiaCompensadaGdI: { kwh: 0, valor: 0 },
      ilumPublica: 0,
    } as Invoice

    llmMock.extractInvoice.mockResolvedValue(fakeInvoice)
    const saved = { id: 99 } as any
    repo.create.mockResolvedValue(saved)

    const result = await service.processFile('/tmp/foo.pdf')

    expect(llmMock.extractInvoice).toHaveBeenCalledWith('/tmp/foo.pdf')
    expect(repo.create).toHaveBeenCalledWith(expect.any(InvoiceDTO))
    expect(result).toBe(saved)
  })

  it('processFile propagates errors from LLM', async () => {
    llmMock.extractInvoice.mockRejectedValue(new Error('LLM failure'))
    await expect(service.processFile('/doesnt/matter')).rejects.toThrow('LLM failure')
  })

  it('getFilesData returns repository results', async () => {
    const arr = [{ id: 1 }, { id: 2 }]
    repo.findAll.mockResolvedValue(arr as any)
    await expect(service.getFilesData()).resolves.toBe(arr)
  })
})
