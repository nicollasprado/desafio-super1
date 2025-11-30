<script lang="ts">
  import { onMount } from 'svelte'
  import type IProviderService from '$lib/interfaces/IProviderService'
  import api from '$lib/AxiosService'
  import Header from '$lib/components/Header.svelte'
  import Filter from '$lib/components/Filter.svelte'
  import ServiceCard from '$lib/components/ServiceCard.svelte'
  import ProvideServiceModal from '$lib/components/ProvideService/ProvideServiceModal.svelte'
  import type IService from '$lib/interfaces/IService'
  import { PaginationNav } from 'flowbite-svelte'
  import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons'
  import type IPagination from '$lib/interfaces/IPagination'

  interface IFilters {
    search?: string
    serviceId?: string
  }

  let providerServices: IProviderService[] = $state([])
  let filters: IFilters = $state({
    search: undefined,
    serviceId: undefined,
  })
  let services: IService[] = $state([])
  let pagination: IPagination = $state({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    perPage: 10,
  })

  interface IProviderServiceResponse {
    data: IProviderService[]
    pagination: IPagination
  }

  onMount(async () => {
    const fetchServices = async () => {
      const res = await api.axios.get<IService[]>('/service')

      if (res.status === 200) {
        services = res.data
      }
    }

    const fetchProviderServices = async () => {
      const res = await api.axios.get<IProviderServiceResponse>('/service/provided', {
        params: {
          page: pagination.currentPage,
          limit: pagination.perPage,
        },
      })

      providerServices = res.data.data
    }

    await fetchServices()
    await fetchProviderServices()
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

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return

    pagination.currentPage = newPage
  }
</script>

<svelte:head>
  <title>Marketplace</title>
</svelte:head>

<div class="flex w-full flex-col h-full">
  <Header />

  <div class="p-4 bg-gray-100 h-full flex flex-col gap-10">
    <div class="flex flex-col gap-10">
      <div class="flex flex-col gap-10">
        <div class="xl:px-10">
          <div
            class="bg-linear-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md flex flex-col xl:flex-row gap-8 xl:gap-0 items-center justify-between"
          >
            <div>
              <h2 class="text-2xl font-bold mb-2">Quer prestar serviços?</h2>
              <p class="text-orange-100">Cadastre seu serviço e comece a receber clientes agora!</p>
            </div>

            <ProvideServiceModal {services} />
          </div>
        </div>

        <div class="xl:m-auto">
          <Filter {handleSearchChange} {handleServiceIdChange} {services} />
        </div>
      </div>

      <main class="flex flex-col gap-20">
        <ol class="flex flex-col xl:flex-row gap-10 xl:gap-20 flex-wrap items-center">
          {#each providerServices as providerService (providerService.id)}
            <ServiceCard {providerService} />
          {/each}
        </ol>

        <div class="flex items-center justify-center">
          <PaginationNav
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => handlePageChange(page)}
          >
            {#snippet prevContent()}
              <span class="sr-only">Anterior</span>
              <ArrowLeftOutline class="h-5 w-5" />
            {/snippet}

            {#snippet nextContent()}
              <span class="sr-only">Próximo</span>
              <ArrowRightOutline class="h-5 w-5" />
            {/snippet}
          </PaginationNav>
        </div>
      </main>
    </div>
  </div>
</div>
