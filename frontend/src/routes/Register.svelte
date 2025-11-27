<script lang="ts">
  import api from '$lib/AxiosService'
  import { AxiosError } from 'axios'
  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte'

  let modalVisible = $state(false)
  let error = $state('')
  let firstName = $state('')
  let lastName = $state('')
  let email = $state('')
  let password = $state('')

  async function handleLogin(e: Event) {
    e.preventDefault()

    error = ''

    try {
      const res = await api.axios.post(`/auth/login`, {
        email,
        password,
      })

      if (res.status === 200) {
        modalVisible = false
        location.reload()
      } else {
        error = 'Credenciais inválidas. Tente novamente.'
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        error = 'Credenciais inválidas. Tente novamente.'
      } else {
        error = 'Erro ao autenticar. Tente novamente mais tarde.'
      }
    }
  }
</script>

<Button size="xs" outline color="dark" class="cursor-pointer" onclick={() => (modalVisible = true)}
  >Cadastro</Button
>

<Modal bind:open={modalVisible} size="xs">
  <form onsubmit={handleLogin}>
    <div class="flex flex-col space-y-6">
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Criar conta</h3>

      <p class="text-[0.95rem]">Preencha os campos abaixo para criar sua conta.</p>

      {#if error}
        <Label color="red">{error}</Label>
      {/if}

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
