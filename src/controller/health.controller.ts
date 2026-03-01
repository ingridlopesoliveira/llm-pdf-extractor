import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @HttpCode(HttpStatus.OK)
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
