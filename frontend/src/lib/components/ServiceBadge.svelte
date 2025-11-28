<script lang="ts">
  import type IProviderService from '$lib/interfaces/IProviderService'
  import type IService from '$lib/interfaces/IService'
  import { Button, Modal } from 'flowbite-svelte'

  interface Props {
    service: IService
  }

  const { service }: Props = $props()
</script>

<span
  class="inline-block w-fit bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
  >{service.name}</span
>
