import { Test, TestingModule } from '@nestjs/testing'
import { FilesController } from '../src/controller/files.controller'
import { LlmService } from '../src/services/llm.service'

describe('AppController', () => {
  let appController: FilesController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [LlmService],
    }).compile()

    appController = app.get<FilesController>(FilesController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!')
    })
  })
})
