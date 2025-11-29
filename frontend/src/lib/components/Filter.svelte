<script lang="ts">
  import api from '$lib/AxiosService'
  import type IService from '$lib/interfaces/IService'
  import { Input, Label, Select } from 'flowbite-svelte'
  import { SearchSolid } from 'flowbite-svelte-icons'
  import { onMount } from 'svelte'

  let services: IService[] = $state([])
  let search: string = $state('')
  let selectedService: string = $state('')

  interface Props {
    handleSearchChange: (search: string) => void
    handleServiceIdChange: (serviceId: string) => void
  }

  let { handleSearchChange, handleServiceIdChange }: Props = $props()

  $effect(() => {
    search
    const timer = setTimeout(() => {
      handleSearchChange(search)
    }, 500)

    return () => clearTimeout(timer)
  })

  $effect(() => {
    handleServiceIdChange(selectedService)
  })

  onMount(async () => {
    const res = await api.axios.get<IService[]>('/service')

    if (res.status === 200) {
      services = res.data
    }
  })
</script>

<div class="flex flex-col xl:flex-row items-center justify-center gap-5 xl:gap-10">
  <Input
    type="search"
    clearable
    placeholder="Buscar por descrição"
    class="ps-10 placeholder-muted xl:min-w-120"
    bind:value={search}
  >
    {#snippet left()}
      <SearchSolid class="shrink-0 h-6 w-6 fill-transparent stroke-black" />
    {/snippet}
  </Input>

  <Select
    id="countries"
    bind:value={selectedService}
    placeholder="Tipo do serviço"
    class="placeholder-muted xl:min-w-50"
    clearable
  >
    {#each services as { id, name }}
      <option value={id}>{name}</option>
    {/each}
  </Select>
</div>
