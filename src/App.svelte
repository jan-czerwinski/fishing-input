<script lang="ts">
  import Text from './components/Text.svelte';
  import FishTank from './components/FishTank.svelte';
  import FishCursor from './components/FishCursor.svelte';
  import PhoneInput from './components/PhoneInput.svelte';
</script>

<FishCursor />

<main class="bg-indigo-100">
  <div
    class="grid w-screen h-screen grid-cols-5 grid-rows-6 p-6 place-content-center"
  >
    <section class="col-start-3 row-start-1">
      <Text size={'xl'} text="fishing" />
    </section>
    <section class="col-span-3 col-start-1 row-span-5 row-start-2">
      <FishTank />
    </section>

    <section class="col-span-3 col-start-4 row-span-2 row-start-3 p-8">
      <PhoneInput />
    </section>
  </div>
</main>
