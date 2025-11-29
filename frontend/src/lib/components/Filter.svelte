<script lang="ts">
  import api from '$lib/AxiosService'
  import type IService from '$lib/interfaces/IService'
  import { Input, Label, Select } from 'flowbite-svelte'
  import { SearchSolid } from 'flowbite-svelte-icons'
  import { onMount } from 'svelte'

  let services: IService[] = $state([])
  let search: string = $state('')
  let selectedService: string = $state('')

  onMount(async () => {
    const res = await api.axios.get<IService[]>('/service')

    if (res.status === 200) {
      services = res.data
    }
  })
</script>

<div class="flex items-center justify-center gap-10 w-1/2 m-auto">
  <Input
    type="search"
    clearable
    placeholder="Buscar por descrição"
    class="ps-10 placeholder-muted"
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
    class="placeholder-muted w-1/4"
    clearable
  >
    {#each services as { id, name }}
      <option value={id}>{name}</option>
    {/each}
  </Select>
</div>
