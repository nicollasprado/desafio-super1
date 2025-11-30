<script lang="ts">
  import type IService from '$lib/interfaces/IService'
  import { Button, GradientButton, Modal } from 'flowbite-svelte'
  import { ArrowLeftOutline, ArrowRightOutline, PlusOutline } from 'flowbite-svelte-icons'
  import Step1ServiceInfo from './Step1ServiceInfo.svelte'
  import Step2Variants from './Step2Variants.svelte'
  import Step3Schedules from './Step3Schedules.svelte'
  import type {
    ICreateServiceSchedule,
    ICreateServiceVariant,
  } from '$lib/interfaces/ICreateService'
  import type { IUser } from '$lib/interfaces/IUser'
  import { onMount } from 'svelte'
  import api from '$lib/AxiosService'
  import { Toaster } from '../ui/sonner'
  import { toast } from 'svelte-sonner'
  import getAuthUser from '../../../utils/getAuthUser'

  interface Props {
    services: IService[]
  }

  const { services }: Props = $props()

  interface IFormData {
    serviceId: string
    description: string
    schedules: ICreateServiceSchedule[]
    variants: ICreateServiceVariant[]
  }

  let modalOpen = $state(false)
  let currentStep = $state(1)
  let formData: IFormData = $state({
    serviceId: '',
    description: '',
    schedules: [],
    variants: [
      {
        name: '',
        price: 0,
        durationMinutes: 0,
      },
    ],
  })
  let images = $state<File[]>([])
  let user: IUser | null = $state(null)

  const fetchUser = async () => {
    user = await getAuthUser()
  }

  onMount(() => {
    fetchUser()
  })

  const STEPS = [
    { number: 1, title: 'Serviço' },
    { number: 2, title: 'Variações' },
    { number: 3, title: 'Horários' },
  ]

  const handleServiceInfoUpdate = (field: 'serviceId' | 'description', value: string) => {
    formData[field] = value
  }

  const handleImagesUpdate = (newImages: File[]) => {
    images = newImages
  }

  const handleAddVariant = () => {
    formData.variants = [
      ...formData.variants,
      {
        name: '',
        price: 0,
        durationMinutes: 0,
      },
    ]
  }

  const handleRemoveVariant = (index: number) => {
    if (formData.variants.length > 1) {
      formData.variants = formData.variants.filter((_, i) => i !== index)
    }
  }

  const handleUpdateVariant = (
    index: number,
    field: keyof ICreateServiceVariant,
    value: string | number,
  ) => {
    formData.variants = formData.variants.map((variant, i) => {
      if (i === index) {
        return { ...variant, [field]: value }
      }
      return variant
    })
  }

  const handleToggleWeekday = (weekday: number) => {
    const index = formData.schedules.findIndex((schedule) => schedule.weekday === weekday)

    if (index !== -1) {
      formData.schedules = formData.schedules.filter((schedule) => schedule.weekday !== weekday)
    } else {
      formData.schedules = [
        ...formData.schedules,
        {
          weekday,
          start: new Date('2025-01-01T09:00:00'),
          end: new Date('2025-01-01T18:00:00'),
          startStr: '09:00',
          endStr: '18:00',
        },
      ]
    }
  }

  const handleUpdateScheduleTime = (
    weekday: number,
    field: 'start' | 'end',
    value: Date,
    valueStr: string,
  ) => {
    formData.schedules = formData.schedules.map((schedule) => {
      if (schedule.weekday === weekday) {
        return { ...schedule, [field]: value, [`${field}Str`]: valueStr }
      }
      return schedule
    })
  }

  const canGoNext = () => {
    if (currentStep === 1) {
      return formData.serviceId !== '' && formData.description !== ''
    }
    if (currentStep === 2) {
      return (
        formData.variants.length > 0 &&
        formData.variants.every((v) => v.name && v.price > 0 && v.durationMinutes > 0)
      )
    }
    return true
  }

  const goNext = () => {
    if (currentStep < 3 && canGoNext()) {
      currentStep++
    }
  }

  const goPrevious = () => {
    if (currentStep > 1) {
      currentStep--
    }
  }

  const handleModalClose = () => {
    formData = {
      serviceId: '',
      description: '',
      schedules: [],
      variants: [
        {
          name: '',
          price: 0,
          durationMinutes: 0,
        },
      ],
    }
    images = []
    currentStep = 1
    modalOpen = false
  }

  const handleSubmit = async () => {
    const res = await api.axios.post('/service/provide', {
      providerId: user?.id,
      serviceId: formData.serviceId,
      description: formData.description,
      variants: formData.variants,
      schedules: formData.schedules,
    })

    if (res.status === 201) {
      images.forEach(async (image) => {
        const formDataImage = new FormData()
        formDataImage.append('file', image)

        const resImg = await api.axios.post(
          `/upload/provided-service-image/${res.data.id}`,
          formDataImage,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
      })

      toast.success('Serviço cadastrado com sucesso!')

      setTimeout(() => {
        handleModalClose()
        location.reload()
      }, 1500)
    } else {
      toast.error('Erro ao cadastrar serviço. Tente novamente.')
    }
  }
</script>

<div class="cursor-pointer">
  <GradientButton
    outline
    color="cyanToBlue"
    class="flex items-center cursor-pointer bg-transparent"
    onclick={() => (modalOpen = true)}
  >
    <PlusOutline class="w-6 h-6 me-2" />
    <p class="font-bold">Cadastrar Serviço</p>
  </GradientButton>
</div>

<Modal bind:open={modalOpen} size="lg" dismissable={false} class="p-0">
  <Toaster position="top-center" />

  <div class="flex flex-col gap-6">
    <!-- Progress Stepper - Responsivo -->
    <div class="px-4 md:px-8 pt-6">
      <div class="flex items-center justify-between min-w-max md:min-w-0">
        {#each STEPS as step, index}
          <div class="flex items-center {index < STEPS.length - 1 ? 'flex-1' : ''}">
            <div
              class="flex items-center justify-center w-6 h-6 md:w-10 md:h-10 rounded-full border-2 transition-all shrink-0 {currentStep >=
              step.number
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400'}"
            >
              <span class="font-semibold text-sm md:text-base">{step.number}</span>
            </div>

            <span
              class="ml-1 md:ml-2 text-xs md:text-sm font-medium whitespace-nowrap {currentStep >=
              step.number
                ? 'text-blue-600'
                : 'text-gray-400'}"
            >
              {step.title}
            </span>

            {#if index < STEPS.length - 1}
              <div
                class="flex-1 h-0.5 mx-2 md:mx-4 min-w-5 {currentStep > step.number
                  ? 'bg-blue-600'
                  : 'bg-gray-300'}"
              ></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="px-4 md:px-8 min-h-[400px]">
      {#if currentStep === 1}
        <Step1ServiceInfo
          {services}
          serviceId={formData.serviceId}
          description={formData.description}
          {images}
          onUpdate={handleServiceInfoUpdate}
          onImagesUpdate={handleImagesUpdate}
        />
      {:else if currentStep === 2}
        <Step2Variants
          variants={formData.variants}
          onAdd={handleAddVariant}
          onRemove={handleRemoveVariant}
          onUpdate={handleUpdateVariant}
        />
      {:else if currentStep === 3}
        <Step3Schedules
          schedules={formData.schedules}
          onToggle={handleToggleWeekday}
          onUpdate={handleUpdateScheduleTime}
        />
      {/if}
    </div>

    <div class="flex justify-between px-4 md:px-8 pb-6 border-t pt-4 gap-2">
      {#if currentStep > 1}
        <Button type="button" color="light" onclick={goPrevious} class="cursor-pointer">
          <ArrowLeftOutline class="w-4 h-4 me-2" />
          <span class="hidden sm:inline">Voltar</span>
        </Button>
      {:else}
        <Button type="button" color="dark" class="cursor-pointer" onclick={handleModalClose}>
          <span class="hidden sm:inline">Cancelar</span>
          <span class="sm:hidden">✕</span>
        </Button>
      {/if}

      <div>
        {#if currentStep < 3}
          <Button
            type="button"
            color="blue"
            class={canGoNext() ? 'cursor-pointer' : 'cursor-not-allowed'}
            onclick={goNext}
            disabled={!canGoNext()}
          >
            <span class="hidden sm:inline">Próximo</span>
            <span class="sm:hidden">→</span>
            <ArrowRightOutline class="w-4 h-4 ms-2 hidden sm:inline" />
          </Button>
        {:else}
          <Button
            type="button"
            color="blue"
            class="cursor-pointer"
            onclick={handleSubmit}
            disabled={formData.schedules.length === 0}
          >
            <span class="hidden sm:inline">Cadastrar Serviço</span>
            <span class="sm:hidden">Cadastrar</span>
          </Button>
        {/if}
      </div>
    </div>
  </div>
</Modal>
