import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'
import { LlmServiceMock } from 'src/services/llm-mock.service'
import { LlmOpenAiService } from 'src/services/llm-open-ai.service'
import { LLMService } from 'src/services/llm.service'

@Module({
  providers: [
    {
      provide: OpenAI,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new OpenAI({
          apiKey: config.get<string>('OPENAI_API_KEY'),
        })
      },
    },
    {
      provide: LLMService,
      inject: [ConfigService, OpenAI],
      useFactory: (config: ConfigService, openai: OpenAI) => {
        const env_provider = config.get<string>('ENV_MODE')
        if (env_provider === 'DEV') return new LlmServiceMock()
        return new LlmOpenAiService(openai)
      },
    },
  ],
  exports: [LLMService],
})
export class LLMModule {}
