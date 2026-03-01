import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DashboardModule } from 'src/modules/dashboard.module'
import { FilesModule } from 'src/modules/files.module'
import { HealthModule } from 'src/modules/health.module'
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
        url: config.get('database.url'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    FilesModule,
    DashboardModule,
    HealthModule,
  ],
})
export class AppModule {}
