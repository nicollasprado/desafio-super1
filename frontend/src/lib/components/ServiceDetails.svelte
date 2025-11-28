<script lang="ts">
  import api from '$lib/AxiosService'
  import ServiceBadge from '$lib/components/ServiceBadge.svelte'
  import type IProviderService from '$lib/interfaces/IProviderService'
  import type { TAvailability } from '$lib/types/TAvailability'
  import { Button, Carousel, CarouselIndicators, Controls, Modal } from 'flowbite-svelte'
  import { onMount } from 'svelte'

  interface Props {
    providerService: IProviderService
  }

  const { providerService }: Props = $props()

  let modalVisible = $state(false)
  let selectedDate: string = $state('')
  let selectedTime: string = $state('')
  let availability: TAvailability = $state({})
  let selectedAvailabilityItem = $state<TAvailability[string] | null>(null)

  const images = providerService.imagesUrls.map((url) => ({
    alt: 'Service Image',
    src: `${url}?height=200&width=200&fit=crop`,
    title: 'image',
  }))

  onMount(async () => {
    const res = await api.axios.get(`/service/provided/${providerService.id}/availability`)

    if (res.status !== 200) return

    availability = res.data
    selectedDate = Object.keys(res.data)[0]
    selectedAvailabilityItem = res.data[selectedDate]
  })

  const handleChangeSelectedDate = (date: string) => {
    selectedDate = date
    selectedAvailabilityItem = availability[date]
    selectedTime = ''
  }

  const handleChangeSelectedTime = (time: string) => {
    selectedTime = time
  }
</script>

<Button class="cursor-pointer" onclick={() => (modalVisible = true)}>Ver detalhes</Button>

<Modal bind:open={modalVisible} size="lg">
  <div class="flex gap-2 items-center">
    <h3 class="text-xl text-text font-bold">Detalhes do Serviço</h3>
    <p class="text-xl text-text font-bold">-</p>
    <ServiceBadge service={providerService.service} />
  </div>
  <p>{providerService.description}</p>

  <div class="flex flex-col gap-4">
    <div class="border border-[#cacaca] rounded-lg">
      <Carousel {images}>
        <Controls />
        <CarouselIndicators />
      </Carousel>
    </div>

    <ol class="flex overflow-scroll gap-8 h-35 p-2">
      {#each Object.values(availability) as availabilityItem}
        <li>
          <Button
            outline
            class={`flex flex-col items-center h-fit cursor-pointer ${selectedDate === availabilityItem.date ? 'bg-primary-600 text-white' : 'border-[#cacaca7c] border'} p-4 px-6 rounded`}
            onclick={() => handleChangeSelectedDate(availabilityItem.date)}
          >
            <p class="text-[0.9rem]">{availabilityItem.weekDay}</p>
            <p class="font-bold text-xl">{availabilityItem.day}</p>
            <p class="text-[0.9rem]">{availabilityItem.month}</p>
          </Button>
        </li>
      {/each}
    </ol>

    <ol class="flex gap-2 flex-wrap">
      {#if selectedAvailabilityItem}
        {#each Object.entries(selectedAvailabilityItem.contractedStarts) as [time, isAvailable]}
          <li>
            <Button
              outline
              size="sm"
              color={isAvailable ? 'primary' : 'gray'}
              disabled={!isAvailable}
              class={`${isAvailable ? 'cursor-pointer' : ''} ${selectedTime === time ? 'bg-primary-600 text-white' : ''}`}
              onclick={() => handleChangeSelectedTime(time)}
            >
              {time}
            </Button>
          </li>
        {/each}
      {/if}
    </ol>

    <p><strong>Variantes:</strong></p>
    <ul class="list-disc list-inside">
      {#each providerService.variants as variant}
        <li>
          {variant.name} - R$ {variant.price / 100}
        </li>
      {/each}
    </ul>
  </div>

  <div class="flex justify-between">
    <Button color="gray" onclick={() => (modalVisible = false)}>Fechar</Button>
    <Button onclick={() => (modalVisible = false)}>Contratar</Button>
  </div>
</Modal>
