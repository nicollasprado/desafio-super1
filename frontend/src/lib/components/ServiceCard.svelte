<script lang="ts">
  import type IProviderService from '$lib/interfaces/IProviderService'
  import { Button } from 'flowbite-svelte'
  import { onMount } from 'svelte'
  import ServiceDetails from './ServiceDetails.svelte'

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
  class="flex flex-col gap-4 bg-white w-fit p-4 border-gray-300 border rounded-md shadow-md mb-4"
>
  <p>{providerService.description}</p>

  <div class="flex gap-4">
    <p>Preço médio: R$ {mediumPrice}</p>
    <p>{providerService.service.name}</p>
  </div>

  <ServiceDetails {providerService} />
</div>
