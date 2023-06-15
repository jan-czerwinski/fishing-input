<script lang="ts">
  import FishCursor from './FishCursor.svelte';
  import ComponentCursor from './ComponentCursor.svelte';
  import FISH_SETTINGS from '../lib/FISH_SETTINGS';
  import randomBetween from '../lib/randomBetween';
  import FishWithNumber, { type Position as Mouse } from './FishLogic.svelte';

  let fishTankWidth;
  let fishTankHeight;

  const marginValue = 150;
  const startingFishProps = [];

  //generate digits so there is equal amount of each digit
  const repetitions = Math.ceil(FISH_SETTINGS.fishCount / 10);
  const digitArray = Array.from({ length: 10 }, (_, index) => index % 10);
  const allDigits = Array.from({ length: repetitions }, () => digitArray)
    .flat()
    .slice(0, FISH_SETTINGS.fishCount);

  while (startingFishProps.length < FISH_SETTINGS.fishCount) {
    startingFishProps.push({
      num: allDigits[startingFishProps.length],
      posX: randomBetween(FISH_SETTINGS.edgeMargin, 300),
      posY: randomBetween(FISH_SETTINGS.edgeMargin, 300),
    });
  }

  let mouse: Mouse = { x: 0, y: 0 };
  let tank: HTMLDivElement;

  function handleMousemove(event: MouseEvent) {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
  }
</script>

<div
  class="w-full h-full pt-4 bg-transparent border-2 border-t-0 border-black rounded-sm"
>
  <div
    class="w-full h-full bg-blue-400 transform-gpu"
    style={`cursor: url("{wormImageUrl}"), pointer`}
    on:mousemove={handleMousemove}
    bind:this={tank}
    bind:clientWidth={fishTankWidth}
    bind:clientHeight={fishTankHeight}
  >
    <div class="grid">
      {#each startingFishProps as { num, posX, posY }}
        <FishWithNumber
          fishProps={{ num, posX, posY }}
          {mouse}
          margin={{
            left: marginValue,
            top: marginValue,
            right: fishTankWidth - marginValue,
            bottom: fishTankHeight - marginValue,
          }}
        />
      {/each}
    </div>
  </div>
</div>
