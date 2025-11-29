<script lang="ts">
  import type IProviderService from '$lib/interfaces/IProviderService'
  import { Button } from 'flowbite-svelte'
  import { onMount } from 'svelte'
  import ServiceDetails from './ServiceDetails.svelte'
  import api from '$lib/AxiosService'
  import ServiceBadge from './ServiceBadge.svelte'

  interface Props {
    providerService: IProviderService
  }

  const { providerService }: Props = $props()

  let mediumPrice: number = $state(0)

  onMount(() => {
    if (providerService.variants.length > 0) {
      const total = providerService.variants.reduce((acc, variant) => acc + variant.price / 100, 0)
      mediumPrice = total / providerService.variants.length
    }
  })
</script>

<div
  class="flex flex-col gap-4 bg-white w-[20dvw] p-4 border-gray-300 border rounded-md shadow-md mb-4"
>
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

  <div class="flex gap-4">
    <p class="text-sm text-muted">
      Preço médio: <span class="text-green-500">R$ {mediumPrice}</span>
    </p>
  </div>

  <ServiceDetails {providerService} />
</div>
