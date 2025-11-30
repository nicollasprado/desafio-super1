<script lang="ts">
  import api from '$lib/AxiosService'
  import { AxiosError } from 'axios'
  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte'
  import { toast, Toaster } from 'svelte-sonner'

  let modalVisible = $state(false)
  let error = $state('')
  let firstName = $state('')
  let lastName = $state('')
  let email = $state('')
  let password = $state('')
  let avatarFile = $state<File | null>(null)
  let avatarPreview = $state<string | null>(null)

  const handleAvatarChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
      avatarFile = file
      const reader = new FileReader()
      reader.onload = (e) => {
        avatarPreview = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    avatarFile = null
    avatarPreview = null
  }

  const handleModalClose = () => {
    error = ''
    firstName = ''
    lastName = ''
    email = ''
    password = ''
    avatarFile = null
    avatarPreview = null
    modalVisible = false
  }

  async function handleRegister(e: Event) {
    e.preventDefault()

    error = ''

    const res = await api.axios.post(`/user`, {
      firstName,
      lastName,
      email,
      password,
    })

    if (res.status === 201) {
      if (avatarFile) {
        const token = await api.axios.post(`/auth/login`, {
          email,
          password,
          rememberMe: true,
        })

        api.setAccessToken(token.data.token)

        await api.axios.post(
          `/upload/user-avatar/${res.data.id}`,
          {
            file: avatarFile,
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
      }

      toast.success('Cadastro realizado com sucesso!')

      setTimeout(() => {
        handleModalClose()
        location.reload()
      }, 2000)
    } else {
      error = res.data.errors
    }
  }
</script>

<Button size="xs" outline color="dark" class="cursor-pointer" onclick={() => (modalVisible = true)}
  >Cadastro</Button
>

<Modal bind:open={modalVisible} size="xs" onclose={handleModalClose}>
  <Toaster position="top-center" />

  <form onsubmit={handleRegister}>
    <div class="flex flex-col space-y-6">
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Criar conta</h3>

      <p class="text-[0.95rem]">Preencha os campos abaixo para criar sua conta.</p>

      {#if error}
        <Label color="red">{error}</Label>
      {/if}

      <div class="flex flex-col items-center gap-3">
        {#if avatarPreview}
          <div class="relative">
            <img
              src={avatarPreview}
              alt="Avatar preview"
              class="h-24 w-24 rounded-full object-cover"
            />
            <button
              type="button"
              onclick={removeAvatar}
              class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              ×
            </button>
          </div>
        {:else}
          <div
            class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700"
          >
            <svg class="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        {/if}

        <Label class="cursor-pointer">
          <input type="file" accept="image/*" onchange={handleAvatarChange} class="hidden" />
          <span class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500">
            {avatarPreview ? 'Trocar foto' : 'Adicionar foto de perfil'}
          </span>
        </Label>
      </div>

      <div class="flex gap-10">
        <Label class="space-y-2">
          <span>Nome</span>
          <Input type="text" bind:value={firstName} required />
        </Label>

        <Label class="space-y-2">
          <span>Sobrenome</span>
          <Input type="text" bind:value={lastName} required />
        </Label>
      </div>

      <Label class="space-y-2">
        <span>Email</span>
        <Input type="email" bind:value={email} required />
      </Label>

      <Label class="space-y-2">
        <span>Senha</span>
        <Input type="password" bind:value={password} required />
      </Label>

      <Button type="submit">Cadastrar</Button>
    </div>
  </form>
</Modal>
