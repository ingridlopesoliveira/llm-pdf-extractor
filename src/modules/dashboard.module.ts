import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DashboardController } from 'src/controller/dashboard.controller'
import { InvoiceEntity } from 'src/entities/invoice-entity'
import { InvoicesRepository } from 'src/repositories/invoice.repository'
import { DashboardService } from 'src/services/dashboard.service'

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
  controllers: [DashboardController],
  providers: [InvoicesRepository, DashboardService],
})
export class DashboardModule {}
