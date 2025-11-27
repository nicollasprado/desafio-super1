<script lang="ts">
  import axios, { AxiosError } from 'axios'
  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte'

  let modalVisible = $state(false)
  let error = $state('')
  let email = $state('')
  let password = $state('')

  async function handleLogin(e: Event) {
    e.preventDefault()

    error = ''

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
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

<Button type="button" class="cursor-pointer" onclick={() => (modalVisible = true)}>Login</Button>

<Modal bind:open={modalVisible} size="xs">
  <form onsubmit={handleLogin}>
    <div class="flex flex-col space-y-6">
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Bem vindo(a) de volta!</h3>

      <p class="text-[0.95rem]">Por favor, insira suas credenciais para continuar.</p>

      {#if error}
        <Label color="red">{error}</Label>
      {/if}

      <Label class="space-y-2">
        <span>Email</span>
        <Input type="email" bind:value={email} required />
      </Label>

      <Label class="space-y-2">
        <span>Senha</span>
        <Input type="password" bind:value={password} required />
      </Label>

      <div class="flex items-start">
        <Checkbox>Lembrar-me</Checkbox>
        <a href="/" class="text-primary-700 dark:text-primary-500 ms-auto text-sm hover:underline"
          >Esqueceu a senha?</a
        >
      </div>

      <Button type="submit">Conectar</Button>

      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        Não tem uma conta? <a
          href="/"
          class="text-primary-700 dark:text-primary-500 hover:underline">Criar conta</a
        >
      </div>
    </div>
  </form>
</Modal>
