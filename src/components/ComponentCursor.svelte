<script lang="ts">
  import { onMount } from 'svelte';

  import type { SvelteComponentDev } from 'svelte/internal';
  export let componentProps: Record<string, any> = {};

  export let component: typeof SvelteComponentDev;

  let x = 0;
  let y = 0;

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove);
  });

  function handleMouseMove(event: MouseEvent) {
    x = event.clientX;
    y = event.clientY;
  }
</script>

{#key componentProps}
  {#if component}
    <div
      class="fixed top-0 left-0 z-50 rotate-90 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style="top: {y}px; left: {x}px;"
    >
      <svelte:component this={component} {...componentProps} />
    </div>
  {/if}
{/key}
