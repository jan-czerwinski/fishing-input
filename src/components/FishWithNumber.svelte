<script lang="ts">
  import FISH_SETTINGS from '../lib/FISH_SETTINGS';

  export let num: number;
  export let fishMirrored = false;
</script>

<span
  class={'place-content-center grid col-start-1 row-start-1 origin-center'}
  style="width:{FISH_SETTINGS.fishWidth}px;"
>
  <span
    class="z-10 col-start-1 row-start-1 p-0 text-xl text-center text-black -rotate-90 translate-x-3 w-fit"
  >
    {num}
  </span>
  <div class="grid col-start-1 row-start-1 place-content-center">
    <img
      src="/fish.png"
      alt="fish"
      class="w-full"
      style="transform: scaleX({fishMirrored ? -1 : 1});"
    />
  </div>
</span>
