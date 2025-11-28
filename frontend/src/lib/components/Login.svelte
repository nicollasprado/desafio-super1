<script lang="ts">
  import api from '$lib/AxiosService'
  import { AxiosError } from 'axios'
  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte'

  let modalVisible = $state(false)
  let error = $state('')
  let email = $state('')
  let password = $state('')
  let rememberMe = $state(false)

  async function handleLogin(e: Event) {
    e.preventDefault()

    error = ''

    try {
      const res = await api.axios.post(`/auth/login`, {
        email,
        password,
        rememberMe,
      })

      if (res.status === 200) {
        const { token } = res.data
        api.setAccessToken(token)
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

<Button size="sm" type="button" class="cursor-pointer" onclick={() => (modalVisible = true)}
  >Login</Button
>

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
        <Checkbox bind:checked={rememberMe}>Lembrar-me</Checkbox>
        <a href="/" class="text-primary-700 dark:text-primary-500 ms-auto text-sm hover:underline"
          >Esqueceu a senha?</a
        >
      </div>

      <Button type="submit">Conectar</Button>
    </div>
  </form>
</Modal>
