<script lang="ts">
  import api from '$lib/AxiosService'
  import Header from '$lib/components/Header.svelte'
  import type IContractedService from '$lib/interfaces/IContractedService'
  import type IPagination from '$lib/interfaces/IPagination'
  import {
    Pagination,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from 'flowbite-svelte'
  import { onMount } from 'svelte'
  import getAuthUser from '../../../utils/getAuthUser'
  import type { IUser } from '$lib/interfaces/IUser'
  import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons'
  import ServiceStatusBadge from '$lib/components/ServiceStatusBadge.svelte'
  import formatPrice from '../../../utils/formatPrice'

  let providedServices: IContractedService[] = $state([])
  let pagination: IPagination = $state({
    currentPage: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 0,
  })
  let user: IUser | null = $state(null)

  interface IProvidedServiceResponse {
    data: IContractedService[]
    pagination: IPagination
  }

  const fetchProvidedServices = async () => {
    if (!user) return

    const res = await api.axios.get<IProvidedServiceResponse>(`/service/contracted`, {
      params: {
        page: pagination.currentPage,
        limit: pagination.perPage,
        providerId: user.id,
      },
    })

    if (res.status === 200) {
      providedServices = res.data.data
      pagination = res.data.pagination
    }
  }

  onMount(async () => {
    const authUser = await getAuthUser()

    if (!authUser) {
      window.location.href = '/'
      return
    }

    user = authUser

    fetchProvidedServices()
  })

  const handlePrevious = async () => {
    if (pagination.currentPage === 1) return

    pagination.currentPage -= 1

    fetchProvidedServices()
  }
  const handleNext = async () => {
    if (pagination.currentPage === pagination.totalPages) return

    pagination.currentPage += 1

    fetchProvidedServices()
  }
</script>

<Header />

<main class="h-full">
  <h2 class="text-xl font-bold p-4">Serviços Prestados</h2>

  <div class="flex flex-col gap-6">
    <Table striped class="border border-[#cacaca7c]">
      <TableHead>
        <TableHeadCell>Contratante</TableHeadCell>
        <TableHeadCell>Serviço</TableHeadCell>
        <TableHeadCell>Variante</TableHeadCell>
        <TableHeadCell>Preço</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell>Início</TableHeadCell>
        <TableHeadCell>Fim</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each providedServices as providedService}
          <TableBodyRow>
            <TableBodyCell>
              <div class="flex items-center gap-2">
                {#if providedService.contractor.avatarUrl !== null}
                  <img
                    src={`${providedService.contractor.avatarUrl}?height=50&width=50&fit=crop`}
                    alt="Provider Avatar"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                {:else}
                  <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span class="text-xl text-white font-bold">
                      {providedService.variant.providerService.provider.firstName
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                {/if}

                <p>
                  {providedService.variant.providerService.provider.firstName}
                  {providedService.variant.providerService.provider.lastName}
                </p>
              </div>
            </TableBodyCell>
            <TableBodyCell>{providedService.variant.providerService.service.name}</TableBodyCell>
            <TableBodyCell>{providedService.variant.name}</TableBodyCell>
            <TableBodyCell>R$ {formatPrice(providedService.totalPrice)}</TableBodyCell>
            <TableBodyCell><ServiceStatusBadge status={providedService.status} /></TableBodyCell>
            <TableBodyCell>{new Date(providedService.start).toLocaleString('pt-br')}</TableBodyCell>
            <TableBodyCell>{new Date(providedService.end).toLocaleString('pt-br')}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>

    <div class="flex flex-col items-center justify-center gap-3">
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Mostrando de <span class="font-semibold text-gray-900 dark:text-white"
            >{providedServices.length}</span
          >
          até
          <span class="font-semibold text-gray-900 dark:text-white">{pagination.perPage}</span>
          de
          <span class="font-semibold text-gray-900 dark:text-white">{pagination.totalCount}</span>
          Dados
        </div>
        <Pagination table previous={handlePrevious} next={handleNext}>
          {#snippet prevContent()}
            <div class="flex items-center gap-2 bg-gray-800 text-white cursor-pointer">
              <ArrowLeftOutline class="me-2 h-5 w-5" />
              Anterior
            </div>
          {/snippet}
          {#snippet nextContent()}
            <div class="flex items-center gap-2 bg-gray-800 text-white cursor-pointer">
              Próximo
              <ArrowRightOutline class="ms-2 h-5 w-5" />
            </div>
          {/snippet}
        </Pagination>
      </div>
    </div>
  </div>
</main>
