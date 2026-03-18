import { Test, TestingModule } from '@nestjs/testing'
import { LLMService } from 'src/services/llm.service'
import { InvoiceExtractedDTO } from '../src/dtos/invoice/invoice-extracted.dto'
import { ClientRepository } from '../src/repositories/client.repository'
import { InvoicesRepository } from '../src/repositories/invoice.repository'
import { FilesService } from '../src/services/files.service'
import { Invoice } from '../src/types/invoice.type'

describe('FilesService', () => {
  let service: FilesService
  let llmMock: jest.Mocked<LLMService>
  let repo: jest.Mocked<InvoicesRepository>
  let clientRepo: { findOneByClienteNumber: jest.Mock; create: jest.Mock }

  beforeEach(async () => {
    clientRepo = { findOneByClienteNumber: jest.fn(), create: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: LLMService, useValue: { extractInvoice: jest.fn() } },
        { provide: InvoicesRepository, useValue: { create: jest.fn(), findAll: jest.fn() } },
        { provide: ClientRepository, useValue: clientRepo },
      ],
    }).compile()

    service = module.get<FilesService>(FilesService)
    llmMock = module.get(LLMService)
    repo = module.get(InvoicesRepository)
  })

  it('computes aggregated values correctly', () => {
    const invoice: Invoice = {
      fileName: 'fatura.pdf',
      numeroCliente: 7204076117,
      nomeCliente: 'Ingrid Teste',
      mesReferencia: 'SET/2024',
      energia: {
        kwh: 100,
        valor: 1200,
      },
      energiaSceeeSIcms: {
        kwh: 150,
        valor: 1200,
      },
      energiaCompensadaGdI: {
        kwh: 0,
        valor: 0,
      },
      ilumPublica: 40,
    } as Invoice

    const dto: InvoiceExtractedDTO = (service as any).processExtractedDataValues(invoice, 42)
    expect(dto.energyConsume).toBe(250)
    expect(dto.energyCompensated).toBe(0)
    expect(dto.totalValueWithoutGd).toBe(2440) // 1200 + 1200 + 40
    expect(dto.clientId).toBe(42)
  })

  it('processFile calls LLM and repository and returns saved invoice', async () => {
    const fakeInvoice: Invoice = {
      fileName: 'path/any.pdf',
      numeroCliente: 7204076117,
      nomeCliente: 'Ingrid novo',
      mesReferencia: 'SET/2024',
      energia: {
        kwh: 100,
        valor: 1200,
      },
      energiaSceeeSIcms: {
        kwh: 150,
        valor: 1200,
      },
      energiaCompensadaGdI: {
        kwh: 0,
        valor: 0,
      },
      ilumPublica: 40,
    } as Invoice

    llmMock.extractInvoice.mockResolvedValue(fakeInvoice)
    const saved = { id: 99 } as any
    repo.create.mockResolvedValue(saved)
    clientRepo.findOneByClienteNumber.mockResolvedValue(null)

    const result = await service.processFile('/tmp/foo.pdf')

    expect(llmMock.extractInvoice).toHaveBeenCalledWith('/tmp/foo.pdf')
    expect(clientRepo.findOneByClienteNumber).toHaveBeenCalledWith(7204076117)
    expect(clientRepo.create).toHaveBeenCalledWith(expect.any(Object))
    expect(repo.create).toHaveBeenCalledWith(expect.any(InvoiceExtractedDTO))
    expect(result).toBe(saved)
  })

  it('processFile propagates errors from LLM', async () => {
    llmMock.extractInvoice.mockRejectedValue(new Error('LLM failure'))
    await expect(service.processFile('/doesnt/matter')).rejects.toThrow('LLM failure')
  })

  it('does not create client when already exists', async () => {
    const fakeInvoice: Invoice = {
      fileName: 'path/any.pdf',
      numeroCliente: 1111,
      nomeCliente: 'Existing',
      mesReferencia: 'SET/2024',
      energia: { kwh: 10, valor: 100 },
      energiaSceeeSIcms: { kwh: 5, valor: 50 },
      energiaCompensadaGdI: { kwh: 0, valor: 0 },
      ilumPublica: 0,
    } as Invoice

    llmMock.extractInvoice.mockResolvedValue(fakeInvoice)
    const saved = { id: 3 } as any
    repo.create.mockResolvedValue(saved)
    clientRepo.findOneByClienteNumber.mockResolvedValue({ clientNumber: 1111 })

    const result = await service.processFile('/tmp/foo.pdf')
    expect(clientRepo.create).not.toHaveBeenCalled()
    expect(result).toBe(saved)
  })

  it('getFilesData returns repository results', async () => {
    const raw = {
      fileName: 'f1.pdf',
      client: { clientNumber: 123, clientName: 'Foo' },
      month: new Date(2024, 0, 1),
    } as any
    repo.findAll.mockResolvedValue([raw])
    const expected = [new (require('../src/dtos/invoice/invoice-list.dto').InvoiceListDTO)(raw)]
    await expect(service.getFilesData({ page: 1, pageSize: 10 })).resolves.toEqual(expected)
  })
})
