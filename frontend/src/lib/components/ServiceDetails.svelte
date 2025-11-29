<script lang="ts">
  import api from '$lib/AxiosService'
  import ServiceBadge from '$lib/components/ServiceBadge.svelte'
  import type IProviderService from '$lib/interfaces/IProviderService'
  import type { TAvailability } from '$lib/types/TAvailability'
  import { Button, Carousel, CarouselIndicators, Controls, Modal } from 'flowbite-svelte'
  import { onMount } from 'svelte'
  import VariantCard from './VariantCard.svelte'
  import type { IUser } from '$lib/interfaces/IUser'
  import { toast } from 'svelte-sonner'
  import { Toaster } from './ui/sonner'

  interface Props {
    providerService: IProviderService
  }

  const { providerService }: Props = $props()

  let modalVisible = $state(false)
  let selectedDate: string = $state('')
  let selectedTime: string = $state('')
  let availability: TAvailability = $state({})
  let selectedAvailabilityItem = $state<TAvailability[string] | null>(null)
  let selectedVariantId: string = $state('')

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

  const handleContract = async () => {
    const errors: string[] = []

    if (!selectedDate) errors.push('Selecione uma data')
    if (!selectedTime) errors.push('Selecione um horário')
    if (!selectedVariantId) errors.push('Selecione um tipo de serviço')

    if (errors.length > 0) {
      toast.error(errors.join(', '))
      return
    }

    const resMe = await api.axios.get<IUser>('/auth/me')

    if (resMe.status !== 200) return
    const contractorId = resMe.data.id

    const [year, month, day] = selectedDate.split('-').map(Number)
    const [hour, minute] = selectedTime.split(':').map(Number)

    const contractDate = new Date(year, month - 1, day, hour, minute)
    const refinedContractDate = contractDate.toISOString()

    const payload = {
      contractorId,
      start: refinedContractDate,
    }

    const res = await api.axios.post(
      `/service/provided/variant/${selectedVariantId}/contract`,
      payload,
    )

    if (res.status === 201) {
      modalVisible = false
      toast.success('Serviço contratado com sucesso!')
    } else {
      toast.error('Erro ao processar sua solicitação. Tente novamente.')
    }
  }
</script>

<Button class="cursor-pointer" onclick={() => (modalVisible = true)}>Ver detalhes</Button>

<Modal bind:open={modalVisible} size="lg" title="Detalhes do Serviço" class="z-1">
  <div class="absolute">
    <Toaster position="top-center" />
  </div>

  <div class="flex gap-2 items-center">
    {#if providerService.provider.avatarUrl !== null}
      <img
        src={`${providerService.provider.avatarUrl}?height=50&width=50&fit=crop`}
        alt="Provider Avatar"
        class="w-12 h-12 rounded-full object-cover"
      />
    {:else}
      <div class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
        <span class="text-xl text-white font-bold">
          {providerService.provider.firstName.charAt(0).toUpperCase()}
        </span>
      </div>
    {/if}

    <div class="flex gap-4 items-center">
      <p class="text-sm text-text font-bold">
        {providerService.provider.firstName}
        {providerService.provider.lastName}
      </p>
      <p class="text-sm text-muted font-bold">-</p>
      <ServiceBadge service={providerService.service} />
    </div>
  </div>
  <p>{providerService.description}</p>

  <div class="flex flex-col gap-4">
    <div class="border border-[#cacaca] rounded-lg">
      <Carousel {images} style="height: 40dvh;">
        <Controls />
        <CarouselIndicators />
      </Carousel>
    </div>

    <ol class="flex overflow-scroll gap-8 h-32 p-2">
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

    <ul class="flex gap-4 border-t-[#cacaca7c] border-t pt-4">
      {#each providerService.variants as variant}
        <li>
          <button
            class={`cursor-pointer rounded ${selectedVariantId === variant.id ? 'bg-primary-600 text-white' : ''}`}
            onclick={() => (selectedVariantId = variant.id)}
          >
            <VariantCard {variant} />
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <div class="flex justify-between">
    <Button color="gray" onclick={() => (modalVisible = false)}>Fechar</Button>
    <Button onclick={() => handleContract()}>Contratar</Button>
  </div>
</Modal>
