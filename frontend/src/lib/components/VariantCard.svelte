<script lang="ts">
  import type IVariant from '$lib/interfaces/IVariant'
  import { ClockOutline } from 'flowbite-svelte-icons'
  import formatPrice from '../../utils/formatPrice'
  import CurrencyBrl from '~icons/mdi/currency-brl'

  interface Props {
    variant: IVariant
  }

  let { variant }: Props = $props()
</script>

<div class="border border-[#cacaca7c] rounded p-3 flex flex-col gap-1 w-fit">
  <p class="text-lg font-bold">{variant.name}</p>

  <div class="flex flex-col">
    <div class="flex gap-1 items-center">
      <ClockOutline />

      <p>
        {variant.durationMinutes}min
      </p>
    </div>

    <div class="flex gap-1 items-center">
      <CurrencyBrl color="green" />

      <p>
        {formatPrice(variant.price)}
      </p>
    </div>
  </div>
</div>
