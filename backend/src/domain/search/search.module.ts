import { Module, OnModuleInit } from '@nestjs/common';
import { SearchController } from './search.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ElasticsearchModule,
  ElasticsearchService,
} from '@nestjs/elasticsearch';
import ServiceSearchService from './service-search.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ServiceSearchService],
  controllers: [SearchController],
  providers: [ServiceSearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly esService: ElasticsearchService) {}

  async onModuleInit() {
    console.log('Incializando índices do Elasticsearch...');
    await this.createProvidedServicesIndex();
    await this.createContractedServicesIndex();
    console.log('Índices do Elasticsearch inicializados com sucesso');
  }

  private async createProvidedServicesIndex() {
    const indexExists = await this.esService.indices.exists({
      index: 'provider-services',
    });

    if (!indexExists) {
      await this.esService.indices.create({
        index: 'provider-services',
        mappings: {
          properties: {
            id: { type: 'keyword' },
            description: { type: 'text' },
            imagesUrls: { type: 'keyword' },
            service: {
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text' },
              },
            },
            provider: {
              properties: {
                id: { type: 'keyword' },
                firstName: { type: 'text' },
                lastName: { type: 'text' },
                avatarUrl: { type: 'keyword' },
              },
            },
            variants: {
              type: 'nested',
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text' },
                price: { type: 'integer' },
                durationMinutes: { type: 'integer' },
              },
            },
            schedules: {
              type: 'nested',
              properties: {
                id: { type: 'keyword' },
                weekday: { type: 'integer' },
                start: { type: 'date' },
                end: { type: 'date' },
              },
            },
          },
        },
      });

      console.log('Índice provider-services criado com sucesso');
    }
  }

  private async createContractedServicesIndex() {
    const indexExists = await this.esService.indices.exists({
      index: 'contracted-services',
    });

    if (!indexExists) {
      await this.esService.indices.create({
        index: 'contracted-services',
        mappings: {
          properties: {
            id: { type: 'keyword' },
            start: { type: 'date' },
            end: { type: 'date' },
            status: { type: 'keyword' },
            totalPrice: { type: 'integer' },
            contractor: {
              properties: {
                id: { type: 'keyword' },
                firstName: { type: 'text' },
                lastName: { type: 'text' },
                avatarUrl: { type: 'keyword' },
              },
            },
            variant: {
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text' },
                price: { type: 'integer' },
                durationMinutes: { type: 'integer' },
                providerService: {
                  properties: {
                    id: { type: 'keyword' },
                    description: { type: 'text' },
                    service: {
                      properties: {
                        id: { type: 'keyword' },
                        name: { type: 'text' },
                      },
                    },
                    provider: {
                      properties: {
                        id: { type: 'keyword' },
                        firstName: { type: 'text' },
                        lastName: { type: 'text' },
                        avatarUrl: { type: 'keyword' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      console.log('Índice contracted-services criado com sucesso');
    }
  }
}
