import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { FilesController } from '../src/controller/files.controller'
import { FilesService } from '../src/services/files.service'

describe('FilesController', () => {
  let controller: FilesController
  let service: jest.Mocked<FilesService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [{ provide: FilesService, useValue: { processFile: jest.fn(), getFilesData: jest.fn() } }],
    }).compile()

    controller = module.get<FilesController>(FilesController)
    service = module.get(FilesService)
  })

  it('upload forwards path to service and returns ResponseDTO', async () => {
    const file = { path: '/tmp/file.pdf' } as Express.Multer.File
    const payload = { ok: true }
    service.processFile.mockResolvedValue(payload)

    const result = await controller.upload(file)
    expect(service.processFile).toHaveBeenCalledWith('/tmp/file.pdf')
    expect(result).toEqual({ statusCode: 201, message: 'Arquivo processado com sucesso', data: payload })
  })

  it('upload throws BadRequestException when no file is provided', async () => {
    await expect(controller.upload(undefined as any)).rejects.toThrow(BadRequestException)
  })

  it('upload propagates service errors as InternalServerErrorException', async () => {
    service.processFile.mockRejectedValue(new Error('boom'))
    await expect(controller.upload({ path: '/tmp/x' } as any)).rejects.toThrow(InternalServerErrorException)
    await expect(controller.upload({ path: '/tmp/x' } as any)).rejects.toThrow('Erro ao processar o arquivo')
  })

  it('getFilesData returns the service value wrapped', async () => {
    const arr = [{ id: 1 }]
    service.getFilesData.mockResolvedValue(arr as any)
    await expect(controller.getFilesData({ page: 1, pageSize: 10 })).resolves.toEqual({ statusCode: 200, message: 'Dados dos arquivos obtidos com sucesso', data: arr })
  })

  it('file filter rejects non-PDF and accepts PDF', () => {
    const filter = (req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Apenas arquivos PDF são permitidos'), false)
      }
      callback(null, true)
    }

    const cb = jest.fn()
    filter(null, { mimetype: 'text/plain' } as any, cb)
    expect(cb).toHaveBeenCalledWith(expect.any(BadRequestException), false)

    cb.mockClear()
    filter(null, { mimetype: 'application/pdf' } as any, cb)
    expect(cb).toHaveBeenCalledWith(null, true)
  })

  it('getFilesData propagates errors as InternalServerErrorException', async () => {
    service.getFilesData.mockRejectedValue(new Error('oops'))
    await expect(controller.getFilesData({ page: 1, pageSize: 10 })).rejects.toThrow(InternalServerErrorException)
    await expect(controller.getFilesData({ page: 1, pageSize: 10 })).rejects.toThrow('Erro ao obter os dados dos arquivos')
  })
})
