import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilesController } from 'src/controller/files.controller'
import { ClientEntity } from 'src/entities/client-entity'
import { InvoiceEntity } from 'src/entities/invoice-entity'
import { LLMModule } from 'src/modules/llm.module'
import { ClientRepository } from 'src/repositories/client.repository'
import { InvoicesRepository } from 'src/repositories/invoice.repository'
import { FilesService } from 'src/services/files.service'
import configuration from '../configuration/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([InvoiceEntity, ClientEntity]),
    LLMModule,
  ],
  controllers: [FilesController],
  providers: [FilesService, InvoicesRepository, ClientRepository],
})
export class FilesModule {}
