<script lang="ts">
  import { Button, Input, Label } from 'flowbite-svelte'
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons'
  import type { ICreateServiceVariant } from '$lib/interfaces/ICreateService'

  interface Props {
    variants: ICreateServiceVariant[]
    onAdd: () => void
    onRemove: (index: number) => void
    onUpdate: (index: number, field: keyof ICreateServiceVariant, value: string | number) => void
  }

  const { variants, onAdd, onRemove, onUpdate }: Props = $props()
</script>

<div class="flex flex-col gap-4">
  <div class="text-center mb-4">
    <h3 class="text-xl font-bold text-gray-800">Variações do Serviço</h3>
    <p class="text-sm text-gray-500 mt-1">Cadastre diferentes opções do seu serviço</p>
  </div>

  <div class="flex items-center justify-between">
    <Label class="text-base font-semibold"
      >Variações<span class="text-red-500">*</span>
      <span class="text-sm font-normal text-gray-500">(mínimo 1)</span></Label
    >
    <Button type="button" size="xs" color="blue" onclick={onAdd}>
      <PlusOutline class="w-4 h-4 me-1" />
      Adicionar Variação
    </Button>
  </div>

  <div class="flex flex-col gap-3 max-h-96 overflow-y-auto">
    {#each variants as variant, index}
      <div class="border rounded-lg p-4 bg-gray-50">
        <div class="flex items-center justify-between mb-3">
          <span class="font-medium text-gray-700">Variação {index + 1}</span>
          {#if variants.length > 1}
            <Button type="button" size="xs" color="red" outline onclick={() => onRemove(index)}>
              <TrashBinOutline class="w-4 h-4" />
            </Button>
          {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Label>
            Nome<span class="text-red-500">*</span>
            <Input
              type="text"
              placeholder="Ex: Básico, Premium"
              value={variant.name}
              oninput={(e) => onUpdate(index, 'name', (e.target as HTMLInputElement).value)}
              required
              class="placeholder-muted"
            />
          </Label>

          <Label>
            Preço (R$)<span class="text-red-500">*</span>
            <Input
              type="number"
              placeholder="0.00"
              min="0"
              value={variant.price}
              class="placeholder-muted"
              oninput={(e) =>
                onUpdate(
                  index,
                  'price',
                  parseInt((e.target as HTMLInputElement).value.split('.').join('')),
                )}
              required
            />
          </Label>

          <Label>
            Duração (minutos)<span class="text-red-500">*</span>
            <Input
              type="number"
              placeholder="60"
              min="1"
              value={variant.durationMinutes}
              class="placeholder-muted"
              oninput={(e) =>
                onUpdate(index, 'durationMinutes', parseInt((e.target as HTMLInputElement).value))}
              required
            />
          </Label>
        </div>
      </div>
    {/each}
  </div>
</div>
