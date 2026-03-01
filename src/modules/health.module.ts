import { Module } from '@nestjs/common'
import { HealthController } from 'src/controller/health.controller'

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
