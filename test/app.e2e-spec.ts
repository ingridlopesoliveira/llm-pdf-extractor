import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/modules/app.module'
import { FilesService } from '../src/services/files.service'

const pdfBuffer = Buffer.from('%PDF-1.4\n%âãÏÓ\n')

describe('AppController (e2e)', () => {
  let app: INestApplication<App>
  let mockedService: { processFile: jest.Mock; getFilesData: jest.Mock }

  beforeEach(async () => {
    mockedService = {
      processFile: jest.fn(),
      getFilesData: jest.fn(),
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FilesService)
      .useValue(mockedService)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('GET /files returns data from service', () => {
    const data = [{ id: 5 }]
    mockedService.getFilesData.mockResolvedValue(data)
    return request(app.getHttpServer()).get('/files').expect(200).expect(data)
  })

  it('POST /upload rejects non-PDF', () => {
    return request(app.getHttpServer())
      .post('/upload')
      .attach('files', Buffer.from('notpdf'), {
        filename: 'file.txt',
        contentType: 'text/plain',
      })
      .expect(400)
  })

  it('POST /upload with PDF calls service and returns its value', async () => {
    const result = { saved: true }
    mockedService.processFile.mockResolvedValue(result)

    await request(app.getHttpServer())
      .post('/upload')
      .attach('files', pdfBuffer, {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      })
      .expect(201)
      .expect(result)

    expect(mockedService.processFile).toHaveBeenCalled()
  })

  it('POST /upload propagates service errors (simulated LLM failure)', async () => {
    mockedService.processFile.mockRejectedValue(new Error('llm down'))

    await request(app.getHttpServer())
      .post('/upload')
      .attach('files', pdfBuffer, {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      })
      .expect(500)
  })
})
