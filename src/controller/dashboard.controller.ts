import { Controller, Get } from '@nestjs/common'
import { DashboardService } from 'src/services/dashboard.service'

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard')
  async getFilesData() {
    return this.dashboardService.getFilesData()
  }
}
