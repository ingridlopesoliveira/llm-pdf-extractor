import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilesController } from 'src/controller/files.controller'
import { InvoiceEntity } from 'src/entities/invoice-entity'
import { InvoicesRepository } from 'src/repositories/invoice.repository'
import { FilesService } from 'src/services/files.service'
import { LlmServiceMock } from 'src/services/llm-mock.service'
import { LlmService } from 'src/services/llm.service'
import configuration from '../configuration/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([InvoiceEntity]),
  ],
  controllers: [FilesController],
  providers: [LlmService, FilesService, LlmServiceMock, InvoicesRepository],
})
export class FilesModule {}
