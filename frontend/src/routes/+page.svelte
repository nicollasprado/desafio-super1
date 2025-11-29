<script lang="ts">
  import { onMount } from 'svelte'
  import type IProviderService from '$lib/interfaces/IProviderService'
  import api from '$lib/AxiosService'
  import Header from '$lib/components/Header.svelte'
  import Filter from '$lib/components/Filter.svelte'
  import ServiceCard from '$lib/components/ServiceCard.svelte'

  let providerServices: IProviderService[] = $state([])

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
    const response = await api.axios.get<IProviderServiceResponse>('/service/provided', {
      params: {
        page: 1,
        limit: 10,
      },
    })

    providerServices = response.data.data
  })
</script>

<svelte:head>
  <title>Marketplace</title>
</svelte:head>

<div class="flex w-full flex-col h-full">
  <Header />

  <div class="p-4 bg-gray-100 h-full">
    <div class="flex flex-col gap-10">
      <Filter />
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
