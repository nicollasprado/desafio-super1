import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { IIndexProviderServiceDTO } from './dtos/provider-service-search-res.dto';

@Injectable()
export default class ServiceSearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async indexProvidedService(
    providerServiceId: string,
    serviceData: IIndexProviderServiceDTO,
  ) {
    return await this.esService.index({
      index: 'provider-services',
      id: providerServiceId,
      document: serviceData,
    });
  }

  async removeProvidedServiceIndex(providerServiceId: string) {
    return await this.esService.delete({
      index: 'provider-services',
      id: providerServiceId,
    });
  }

  async searchProvidedServices({
    search,
    serviceId,
    page,
    limit,
  }: {
    serviceId?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const from = (page - 1) * limit;

    const must: any[] = [];

    if (search && search.trim() !== '') {
      must.push({
        multi_match: {
          query: search,
          fields: ['description', 'service.name'],
          fuzziness: 'AUTO',
        },
      });
    }

    if (serviceId) {
      must.push({
        term: {
          'service.id.keyword': serviceId,
        },
      });
    }

    const query = must.length > 0 ? { bool: { must } } : { match_all: {} };

    const result = await this.esService.search({
      index: 'provider-services',
      from,
      size: limit,
      query,
    });

    if (!result.hits.total) {
      return;
    }

    const totalCount =
      typeof result.hits.total === 'number'
        ? result.hits.total
        : result.hits.total.value;

    const data = result.hits.hits.map((hit) => hit._source);

    return {
      data,
      pagination: {
        totalCount,
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async updateProvidedServiceImages(
    providerServiceId: string,
    imagesUrls: string[],
  ) {
    return await this.esService.update({
      index: 'provider-services',
      id: providerServiceId,
      doc: {
        imagesUrls,
      },
    });
  }
}
