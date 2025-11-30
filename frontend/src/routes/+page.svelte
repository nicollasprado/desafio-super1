<script lang="ts">
  import { onMount } from 'svelte'
  import type IProviderService from '$lib/interfaces/IProviderService'
  import api from '$lib/AxiosService'
  import Header from '$lib/components/Header.svelte'
  import Filter from '$lib/components/Filter.svelte'
  import ServiceCard from '$lib/components/ServiceCard.svelte'
  import { PlusOutline } from 'flowbite-svelte-icons'
  import { GradientButton } from 'flowbite-svelte'
  import ProvideServiceModal from '$lib/components/ProvideService/ProvideServiceModal.svelte'
  import type IService from '$lib/interfaces/IService'

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
    const fetchServices = async () => {
      const res = await api.axios.get<IService[]>('/service')

      if (res.status === 200) {
        services = res.data
      }
    }

    const fetchProviderServices = async () => {
      const res = await api.axios.get<IProviderServiceResponse>('/service/provided', {
        params: {
          page: 1,
          limit: 10,
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

      <main>
        <ol class="flex flex-col xl:flex-row gap-10 xl:gap-20 flex-wrap items-center">
          {#each providerServices as providerService (providerService.id)}
            <ServiceCard {providerService} />
          {/each}
        </ol>
      </main>
    </div>
  </div>
</div>
