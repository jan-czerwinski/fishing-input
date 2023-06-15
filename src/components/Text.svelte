<script lang="ts">
  import clsx from 'clsx';
  export let size: 'md' | 'lg' | 'xl' = 'lg';
  export let text: string;
</script>

<h1
  class={clsx(
    `bg-transparent shadow-blue-700  text-center text-black `,

    size === 'lg' && 'text-shadow-lg text-2xl',
    size === 'xl' && 'text-shadow-xl text-8xl',
    size === 'md' && 'text-shadow-sm text-2xl'
  )}
>
  {text}
</h1>
