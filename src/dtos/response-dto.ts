import { HttpStatus } from '@nestjs/common'
export class ResponseDTO {
  statusCode: HttpStatus
  message: string
  data: any

  constructor(statusCode: HttpStatus, message: string, data?: any) {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }
}
