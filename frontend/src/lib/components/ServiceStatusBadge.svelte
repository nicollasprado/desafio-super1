<script lang="ts">
  import type { TServiceStatus } from '$lib/types/TServiceStatus'
  import getServiceStatusColors from '../../utils/getServiceStatusColors'
  import getServiceStatusPTBR from '../../utils/getServiceStatusPTBR'

  interface Props {
    status: TServiceStatus
  }

  let { status }: Props = $props()

  const statusPTBR = getServiceStatusPTBR(status)
  const statusColor = getServiceStatusColors(status)
</script>

<div
  class="{statusColor.bgColor} {statusColor.textColor} p-3 rounded-full w-fit text-[0.7rem] font-bold"
>
  {statusPTBR}
</div>
