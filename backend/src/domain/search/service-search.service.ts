import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { IIndexProviderServiceDTO } from './dtos/provider-service-search-res.dto';
import { TGetAllProvided } from '../service/dtos/get-all-provided-services.dto';
import IIndexContractedServiceDTO from './dtos/contracted-service-search-res.dto';
import INDEXES from 'src/shared/consts/INDEXES';
import { TGetAllContracted } from '../service/dtos/get-all-contracted-services.dto';
import { TServiceStatus } from 'src/shared/types/TServiceStatus';

@Injectable()
export default class ServiceSearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async indexProvidedService(
    providerServiceId: string,
    serviceData: IIndexProviderServiceDTO,
  ) {
    return await this.esService.index({
      index: INDEXES.PROVIDER_SERVICES,
      id: providerServiceId,
      document: serviceData,
    });
  }

  async removeProvidedServiceIndex(providerServiceId: string) {
    return await this.esService.delete({
      index: INDEXES.PROVIDER_SERVICES,
      id: providerServiceId,
    });
  }

  async searchProvidedServices({
    search,
    serviceId,
    providerId,
    page,
    limit,
  }: TGetAllProvided) {
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
          'service.id': serviceId,
        },
      });
    }

    if (providerId) {
      must.push({
        term: {
          'provider.id': providerId,
        },
      });
    }

    const query = must.length > 0 ? { bool: { must } } : { match_all: {} };

    const result = await this.esService.search({
      index: INDEXES.PROVIDER_SERVICES,
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
      index: INDEXES.PROVIDER_SERVICES,
      id: providerServiceId,
      doc: {
        imagesUrls,
      },
    });
  }

  async indexContractedService(
    contractedServiceId: string,
    contractedServiceData: IIndexContractedServiceDTO,
  ) {
    return await this.esService.index({
      index: INDEXES.CONTRACTED_SERVICES,
      id: contractedServiceId,
      document: contractedServiceData,
    });
  }

  async removeContractedServiceIndex(contractedServiceId: string) {
    return await this.esService.delete({
      index: INDEXES.CONTRACTED_SERVICES,
      id: contractedServiceId,
    });
  }

  async searchContractedServices({
    contractorId,
    providerId,
    page,
    limit,
  }: TGetAllContracted) {
    const from = (page - 1) * limit;

    const must: any[] = [];

    if (contractorId) {
      must.push({
        term: {
          'contractor.id': contractorId,
        },
      });
    }

    if (providerId) {
      must.push({
        term: {
          'variant.providerService.provider.id': providerId,
        },
      });
    }

    const query = must.length > 0 ? { bool: { must } } : { match_all: {} };

    const result = await this.esService.search({
      index: INDEXES.CONTRACTED_SERVICES,
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

  async updateContractedServiceStatus(
    contractedServiceId: string,
    status: TServiceStatus,
  ) {
    return await this.esService.update({
      index: INDEXES.CONTRACTED_SERVICES,
      id: contractedServiceId,
      doc: {
        status,
      },
    });
  }
}
