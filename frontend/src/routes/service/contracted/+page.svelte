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
  import { ArrowLeftOutline, ArrowRightOutline, TrashBinOutline } from 'flowbite-svelte-icons'
  import ServiceStatusBadge from '$lib/components/ServiceStatusBadge.svelte'
  import formatPrice from '../../../utils/formatPrice'
  import { toast, Toaster } from 'svelte-sonner'

  let contractedServices: IContractedService[] = $state([])
  let pagination: IPagination = $state({
    currentPage: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 0,
  })
  let user: IUser | null = $state(null)

  interface IContractedServiceResponse {
    data: IContractedService[]
    pagination: IPagination
  }

  const fetchContractedServices = async () => {
    if (!user) return

    const res = await api.axios.get<IContractedServiceResponse>(`/service/contracted`, {
      params: {
        page: pagination.currentPage,
        limit: pagination.perPage,
        contractorId: user.id,
      },
    })

    if (res.status === 200) {
      contractedServices = res.data.data
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

    fetchContractedServices()
  })

  const handlePrevious = async () => {
    if (pagination.currentPage === 1) return

    pagination.currentPage -= 1

    fetchContractedServices()
  }

  const handleNext = async () => {
    if (pagination.currentPage === pagination.totalPages) return

    pagination.currentPage += 1

    fetchContractedServices()
  }

  const handleCancel = async (contractedServiceId: string) => {
    const req = await api.axios.patch(`/service/contracted/${contractedServiceId}/cancel`)

    if (req.status === 200) {
      toast.success('Serviço cancelado com sucesso!')

      setTimeout(() => {
        location.reload()
      }, 2000)
    }
  }
</script>

<Header />

<main class="h-full">
  <Toaster position="top-center" />

  <h2 class="text-xl font-bold p-4">Serviços Contratados</h2>

  <div class="flex flex-col gap-6">
    <Table striped class="border border-[#cacaca7c]">
      <TableHead>
        <TableHeadCell>Prestador</TableHeadCell>
        <TableHeadCell>Serviço</TableHeadCell>
        <TableHeadCell>Variante</TableHeadCell>
        <TableHeadCell>Preço</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell>Início</TableHeadCell>
        <TableHeadCell>Fim</TableHeadCell>
        <TableHeadCell>Ações</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each contractedServices as contractedService}
          <TableBodyRow>
            <TableBodyCell>
              <div class="flex items-center gap-2">
                {#if contractedService.variant.providerService.provider.avatarUrl !== null}
                  <img
                    src={`${contractedService.variant.providerService.provider.avatarUrl}?height=50&width=50&fit=crop`}
                    alt="Provider Avatar"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                {:else}
                  <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span class="text-xl text-white font-bold">
                      {contractedService.variant.providerService.provider.firstName
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                {/if}

                <p>
                  {contractedService.variant.providerService.provider.firstName}
                  {contractedService.variant.providerService.provider.lastName}
                </p>
              </div>
            </TableBodyCell>
            <TableBodyCell>{contractedService.variant.providerService.service.name}</TableBodyCell>
            <TableBodyCell>{contractedService.variant.name}</TableBodyCell>
            <TableBodyCell>R$ {formatPrice(contractedService.totalPrice)}</TableBodyCell>
            <TableBodyCell><ServiceStatusBadge status={contractedService.status} /></TableBodyCell>
            <TableBodyCell
              >{new Date(contractedService.start).toLocaleString('pt-br')}</TableBodyCell
            >
            <TableBodyCell>{new Date(contractedService.end).toLocaleString('pt-br')}</TableBodyCell>
            {#if contractedService.status === 'WAITING_CONFIRMATION'}
              <TableBodyCell>
                <button
                  type="button"
                  class="flex gap-2 text-red-400 cursor-pointer"
                  onclick={() => handleCancel(contractedService.id)}
                >
                  <TrashBinOutline /> Cancelar
                </button>
              </TableBodyCell>
            {:else}
              <TableBodyCell>—</TableBodyCell>
            {/if}
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>

    <div class="flex flex-col items-center justify-center gap-3">
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Mostrando de <span class="font-semibold text-gray-900 dark:text-white"
            >{contractedServices.length}</span
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
