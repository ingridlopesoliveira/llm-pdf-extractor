import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FilesController } from 'src/controller/files.controller'
import { FilesService } from 'src/services/files.service'
import { LlmService } from 'src/services/llm.service'
import configuration from '../configuration/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [FilesController],
  providers: [LlmService, FilesService],
})
export class FilesModule {}
