<script lang="ts">
  import type IService from '$lib/interfaces/IService'
  import { Button, Label, Select, Textarea } from 'flowbite-svelte'
  import { TrashBinOutline, UploadOutline } from 'flowbite-svelte-icons'

  interface Props {
    services: IService[]
    serviceId: string
    description: string
    images: File[]
    onUpdate: (field: 'serviceId' | 'description', value: string) => void
    onImagesUpdate: (images: File[]) => void
  }

  const { services, serviceId, description, images, onUpdate, onImagesUpdate }: Props = $props()

  const servicesItems = services.map((service) => ({
    value: service.id,
    name: service.name,
  }))

  let fileInput: HTMLInputElement

  const MAX_IMAGES = 3

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files) {
      const newFiles = Array.from(target.files)
      const remainingSlots = MAX_IMAGES - images.length

      if (remainingSlots <= 0) {
        alert(`Você pode adicionar no máximo ${MAX_IMAGES} imagens`)
        target.value = ''
        return
      }

      const filesToAdd = newFiles.slice(0, remainingSlots)
      onImagesUpdate([...images, ...filesToAdd])

      if (newFiles.length > remainingSlots) {
        alert(`Apenas ${remainingSlots} imagem(ns) foram adicionadas. Limite máximo: ${MAX_IMAGES}`)
      }

      target.value = ''
    }
  }

  const removeImage = (index: number) => {
    onImagesUpdate(images.filter((_, i) => i !== index))
  }

  const getImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }
</script>

<div class="flex flex-col gap-4">
  <div class="text-center mb-4">
    <h3 class="text-xl font-bold text-gray-800">Informações do Serviço</h3>
    <p class="text-sm text-gray-500 mt-1">Selecione o tipo de serviço e adicione uma descrição</p>
  </div>

  <Label>
    Serviço<span class="text-red-500">*</span>
    <Select
      value={serviceId}
      onchange={(e) => onUpdate('serviceId', e.currentTarget.value)}
      items={servicesItems}
      placeholder="Selecione um serviço"
      clearable
      required
    />
  </Label>

  <Label>
    Descrição<span class="text-red-500">*</span>
    <Textarea
      id="description"
      value={description}
      oninput={(e) => onUpdate('description', e.currentTarget.value)}
      required
      rows={6}
      class="w-full resize-none placeholder-muted"
      placeholder="Descreva detalhadamente o serviço que você oferece..."
    />
  </Label>

  <div class="flex flex-col gap-3">
    <Label class="text-base font-semibold">
      Imagens do Serviço <span class="text-sm font-normal text-gray-500"
        >(opcional - máximo {MAX_IMAGES})</span
      >
    </Label>
    <p class="text-sm text-gray-500">Adicione fotos que demonstrem seu trabalho</p>

    <input
      type="file"
      accept="image/*"
      multiple
      bind:this={fileInput}
      onchange={handleFileChange}
      class="hidden"
    />

    <Button
      type="button"
      color="light"
      class="w-full cursor-pointer"
      onclick={() => fileInput.click()}
      disabled={images.length >= MAX_IMAGES}
    >
      <UploadOutline class="w-5 h-5 me-2" />
      {images.length >= MAX_IMAGES ? 'Limite de imagens atingido' : 'Adicionar Imagens'}
    </Button>

    {#if images.length > 0}
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        {#each images as image, index}
          <div class="relative group">
            <img
              src={getImagePreview(image)}
              alt="Preview {index + 1}"
              class="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onclick={() => removeImage(index)}
              class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remover imagem"
            >
              <TrashBinOutline class="w-4 h-4" />
            </button>
            <div
              class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate"
            >
              {image.name}
            </div>
          </div>
        {/each}
      </div>
      <p class="text-sm text-gray-500">
        {images.length} de {MAX_IMAGES} imagem(ns) selecionada(s)
      </p>
    {/if}
  </div>
</div>
