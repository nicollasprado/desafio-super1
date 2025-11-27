<script lang="ts">
  import { onMount } from 'svelte'
  import axios from 'axios'
  import type { IUser } from '$lib/interfaces/IUser'
  import { Button } from 'flowbite-svelte'
  import Login from './Login.svelte'

  let user: IUser | null = null

  onMount(async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
      withCredentials: true,
    })

    if (res.status === 200) {
      user = res.data
    }
  })
</script>

<header class="flex w-full items-center justify-around p-4 border border-gray-300">
  <h1 class="text-2xl font-bold text-primary-600">Marketplace</h1>
  {#if user}
    <div>{user.firstName}</div>
  {:else}
    <div class="flex gap-10">
      <Login />
      <Button outline color="dark" class="cursor-pointer">Cadastro</Button>
    </div>
  {/if}
</header>
