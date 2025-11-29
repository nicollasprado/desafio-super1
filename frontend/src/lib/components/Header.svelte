<script lang="ts">
  import { onMount } from 'svelte'
  import type { IUser } from '$lib/interfaces/IUser'
  import { Button, Dropdown, DropdownItem } from 'flowbite-svelte'
  import Login from './Login.svelte'
  import api from '$lib/AxiosService'
  import Register from './Register.svelte'
  import { ChevronDownOutline } from 'flowbite-svelte-icons'

  let user: IUser | null = $state(null)

  onMount(async () => {
    const res = await api.axios.get(`/auth/me`)

    if (res.status === 200) {
      user = res.data
    }
  })

  const handleLogout = async () => {
    await api.logout()
    location.reload()
  }
</script>

<header class="flex w-full items-center justify-around p-4 border border-gray-300">
  <a href="/"><h1 class="text-2xl font-bold text-primary-600">Marketplace</h1></a>
  {#if user}
    <button type="button" class="cursor-pointer">
      <div class="flex gap-3 items-center">
        {#if user.avatarUrl}
          <img
            src={user.avatarUrl}
            alt="Avatar"
            class="w-[50px] h-[50px] rounded-full object-cover"
          />
        {:else}
          <div
            class="w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
          >
            {user.firstName.charAt(0).toUpperCase()}
          </div>
        {/if}
        <p>
          {user.firstName}
        </p>

        <ChevronDownOutline />
      </div>
    </button>
    <Dropdown simple class="w-56 space-y-1 p-3 text-sm">
      <DropdownItem href="/service/contracted">Serviços contratados</DropdownItem>
      <DropdownItem href="/service/provided">Serviços prestados</DropdownItem>
      <button type="button" onclick={handleLogout} class="cursor-pointer w-full text-left">
        <DropdownItem>Logout</DropdownItem>
      </button>
    </Dropdown>
  {:else}
    <div class="flex gap-10 items-center">
      <Login />
      <Register />
    </div>
  {/if}
</header>
