import { BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

export function PdfUploadInterceptor(fieldName = 'files') {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const extension = extname(file.originalname)
        callback(null, `${uniqueSuffix}${extension}`)
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Apenas arquivos PDF são permitidos'), false)
      }
      callback(null, true)
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  })
}
