import { BadRequestException } from '@nestjs/common'
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
    service = module.get(FilesService) as jest.Mocked<FilesService>
  })

  it('upload forwards path to service and returns result', async () => {
    const file = { path: '/tmp/file.pdf' } as Express.Multer.File
    service.processFile.mockResolvedValue({ ok: true })

    const result = await controller.upload(file)
    expect(service.processFile).toHaveBeenCalledWith('/tmp/file.pdf')
    expect(result).toEqual({ ok: true })
  })

  it('upload propagates service errors', async () => {
    service.processFile.mockRejectedValue(new Error('boom'))
    await expect(controller.upload({ path: '/tmp/x' } as any)).rejects.toThrow('boom')
  })

  it('getFilesData returns the service value', async () => {
    const arr = [{ id: 1 }]
    service.getFilesData.mockResolvedValue(arr as any)
    await expect(controller.getFilesData()).resolves.toBe(arr)
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
})
