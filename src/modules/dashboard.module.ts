import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DashboardController } from 'src/controller/dashboard.controller'
import { InvoiceEntity } from 'src/entities/invoice-entity'
import { InvoicesRepository } from 'src/repositories/invoice.repository'
import { DashboardService } from 'src/services/dashboard.service'
import configuration from '../configuration/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([InvoiceEntity]),
  ],
  controllers: [DashboardController],
  providers: [InvoicesRepository, DashboardService],
})
export class DashboardModule {}
