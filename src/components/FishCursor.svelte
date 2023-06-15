<script lang="ts">
  import ComponentCursor from './ComponentCursor.svelte';
  import FishNumber from './FishWithNumber.svelte';
  import { fishCursorCaught } from '../stores/phoneInputStore';
</script>

{#if !!$fishCursorCaught}
  <ComponentCursor
    component={FishNumber}
    componentProps={{ num: $fishCursorCaught }}
  />
{/if}
