<script lang="ts">
  import type { ICreateServiceSchedule } from '$lib/interfaces/ICreateService'
  import { Checkbox, Input, Label } from 'flowbite-svelte'

  interface Props {
    schedules: ICreateServiceSchedule[]
    onToggle: (weekday: number) => void
    onUpdate: (weekday: number, field: 'start' | 'end', value: Date, valueStr: string) => void
  }

  const { schedules, onToggle, onUpdate }: Props = $props()

  const WEEKDAYS = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
  ]

  const isWeekdaySelected = (weekday: number) => {
    return schedules.some((schedule) => schedule.weekday === weekday)
  }

  const handleUpdate = (weekday: number, type: 'start' | 'end', value: string) => {
    const [hours, minutes] = value.split(':').map(Number)
    const minutesStr = minutes.toString().padStart(2, '0')
    const hoursStr = hours.toString().padStart(2, '0')
    const date = new Date(`2025-01-01T${hoursStr}:${minutesStr}:00`)

    console.log(value, hours, minutes, date)
    onUpdate(weekday, type, date, value)
  }
</script>

<div class="flex flex-col gap-4">
  <div class="text-center mb-4">
    <h3 class="text-xl font-bold text-gray-800">Horários de Disponibilidade</h3>
    <p class="text-sm text-gray-500 mt-1">
      Selecione os dias e horários em que você pode prestar o serviço
    </p>
  </div>

  <Label class="text-base font-semibold"
    >Dias da Semana<span class="text-red-500">*</span>
    <span class="text-sm font-normal text-gray-500">(mínimo 1)</span></Label
  >

  <div class="flex flex-col gap-2 max-h-96 overflow-y-auto">
    {#each WEEKDAYS as { value, label }}
      {@const schedule = schedules.find((schedule) => schedule.weekday === value)}
      {@const isSelected = isWeekdaySelected(value)}

      <button
        type="button"
        onclick={(e) => {
          if (e.target instanceof HTMLInputElement && e.target.type === 'time') {
            return
          }
          onToggle(value)
        }}
        class="border rounded-lg p-3 text-left transition-all cursor-pointer {isSelected
          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}"
      >
        <div class="flex items-center gap-3 h-8">
          <Checkbox checked={isSelected} onchange={() => {}} />

          <div class="flex-1 min-w-0">
            <span class="font-medium {isSelected ? 'text-blue-700' : 'text-gray-700'}">{label}</span
            >
          </div>

          {#if isSelected && schedule}
            <div class="flex items-center gap-1 md:gap-2 pointer-events-none shrink-0">
              <Input
                type="time"
                value={schedule.startStr}
                onchange={(e) => handleUpdate(value, 'start', e.currentTarget.value)}
                class="w-20 md:w-28 pointer-events-auto text-xs md:text-sm"
                required
              />
              <span class="text-gray-500 text-xs md:text-sm">até</span>
              <Input
                type="time"
                value={schedule.endStr}
                onchange={(e) => handleUpdate(value, 'end', e.currentTarget.value)}
                class="w-20 md:w-28 pointer-events-auto text-xs md:text-sm"
                required
              />
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  {#if schedules.length === 0}
    <p class="text-sm text-orange-600 bg-orange-50 p-2 rounded">
      ⚠️ Selecione pelo menos um dia da semana
    </p>
  {/if}
</div>
