<script lang="ts">
  import { onMount } from 'svelte'
  import type IProviderService from '$lib/interfaces/IProviderService'
  import api from '$lib/AxiosService'
  import Header from '$lib/components/Header.svelte'
  import Filter from '$lib/components/Filter.svelte'
  import ServiceCard from '$lib/components/ServiceCard.svelte'

  interface IFilters {
    search?: string
    serviceId?: string
  }

  let providerServices: IProviderService[] = $state([])
  let filters: IFilters = $state({
    search: undefined,
    serviceId: undefined,
  })

  interface IProviderServiceResponse {
    data: IProviderService[]
    pagination: {
      totalCount: number
      currentPage: number
      perPage: number
      totalPages: number
    }
  }

  onMount(async () => {
    const res = await api.axios.get<IProviderServiceResponse>('/service/provided', {
      params: {
        page: 1,
        limit: 10,
      },
    })

    providerServices = res.data.data
  })

  $effect(() => {
    filters

    const fetchData = async () => {
      let params: IFilters & { page: number; limit: number } = {
        page: 1,
        limit: 10,
      }

      if (filters.search) {
        params = { ...params, search: filters.search }
      }

      if (filters.serviceId) {
        params = { ...params, serviceId: filters.serviceId }
      }

      const res = await api.axios.get<IProviderServiceResponse>('/service/provided', {
        params,
      })

      providerServices = res.data.data
    }

    fetchData()
  })

  const handleSearchChange = (newSearch: string) => {
    filters.search = newSearch
  }

  const handleServiceIdChange = (newServiceId: string) => {
    filters.serviceId = newServiceId
  }
</script>

<svelte:head>
  <title>Marketplace</title>
</svelte:head>

<div class="flex w-full flex-col h-full">
  <Header />

  <div class="p-4 bg-gray-100 h-full">
    <div class="flex flex-col gap-10">
      <Filter {handleSearchChange} {handleServiceIdChange} />
      <main>
        <ol>
          {#each providerServices as providerService (providerService.id)}
            <li>
              <ServiceCard {providerService} />
            </li>
          {/each}
        </ol>
      </main>
    </div>
  </div>
</div>
