<script lang="ts">
  import type IProviderService from '$lib/interfaces/IProviderService'
  import { onMount } from 'svelte'
  import ServiceDetails from './ServiceDetails.svelte'
  import ServiceBadge from './ServiceBadge.svelte'
  import api from '$lib/AxiosService'
  import { toast, Toaster } from 'svelte-sonner'
  import { Button } from 'flowbite-svelte'
  import { TrashBinOutline } from 'flowbite-svelte-icons'
  import type { IUser } from '$lib/interfaces/IUser'
  import getAuthUser from '../../utils/getAuthUser'

  interface Props {
    providerService: IProviderService
  }

  const { providerService }: Props = $props()

  let mediumPrice: number = $state(0)
  let user: IUser | null = $state(null)

  onMount(async () => {
    const meUser = await getAuthUser()
    user = meUser

    if (providerService.variants.length > 0) {
      const total = providerService.variants.reduce((acc, variant) => acc + variant.price / 100, 0)
      mediumPrice = Number((total / providerService.variants.length).toFixed(2))
    }
  })

  const handleRemove = async (contractedServiceId: string) => {
    const req = await api.axios.delete(`/service/provided/${contractedServiceId}`)

    if (req.status === 204) {
      toast.success('Serviço deletado com sucesso!')
      setTimeout(() => {
        location.reload()
      }, 2000)
    }
  }
</script>

<li
  class="flex flex-col gap-1 bg-white w-[95vw] xl:w-100 p-4 border-gray-300 border rounded-md shadow-md h-full justify-between"
>
  <Toaster position="top-center" />

  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      {#if providerService.provider.avatarUrl !== null}
        <img
          src={`${providerService.provider.avatarUrl}?height=50&width=50&fit=crop`}
          alt="Provider Avatar"
          class="w-8 h-8 rounded-full object-cover"
        />
      {:else}
        <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span class="text-xl text-white font-bold">
            {providerService.provider.firstName.charAt(0).toUpperCase()}
          </span>
        </div>
      {/if}

      <p class="text-[0.88rem]">
        {providerService.provider.firstName}
        {providerService.provider.lastName}
      </p>
    </div>

    <ServiceBadge service={providerService.service} />
  </div>

  <p class="truncate text-[0.94rem]">{providerService.description}</p>

  <div class="flex items-center justify-between">
    <p class="text-sm text-muted">
      Preço médio: <span class="text-green-500">R$ {mediumPrice}</span>
    </p>

    {#if user && providerService.provider.id === user.id}
      <Button
        color="red"
        class="w-6 h-6 cursor-pointer"
        outline
        onclick={() => handleRemove(providerService.id)}
      >
        <TrashBinOutline />
      </Button>
    {/if}
  </div>

  <ServiceDetails {providerService} />
</li>
