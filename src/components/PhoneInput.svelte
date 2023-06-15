<script>
  import Text from './Text.svelte';
  import { phoneNumber, fishCursorCaught } from '../stores/phoneInputStore';
</script>

<div class="flex flex-col justify-center w-full gap-20">
  <Text text="please fish for your phone number" />

  <div class="flex justify-between w-full">
    {#each $phoneNumber as digit, i}
      <button
        class="grid w-10 h-12 text-4xl bg-blue-100 border-2 border-t-0 border-blue-800 rounded-sm rounded-t-none place-content-center"
        on:click={() => {
          if (!$fishCursorCaught) return;
          phoneNumber.update((phone) =>
            phone.map((num, j) => (j === i ? $fishCursorCaught : num))
          );
          fishCursorCaught.update(() => null);
        }}
      >
        {#if digit}
          {digit}
        {/if}
      </button>
    {/each}
  </div>
  {#if !$phoneNumber.some((digit) => digit === null)}
    <button
      class="p-10"
      on:click={() =>
        alert(
          'Thank you for using my intuitive and easy to use phone number picker!'
        )}
    >
      <Text text="🐟 Submit 🐟" />
    </button>
  {/if}
</div>
