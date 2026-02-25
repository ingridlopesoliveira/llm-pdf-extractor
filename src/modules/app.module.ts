import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
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

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [LlmService, FilesService],
})
export class AppModule {}
