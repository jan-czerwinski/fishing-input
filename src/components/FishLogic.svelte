<script context="module" lang="ts">
  import { fishCursorCaught } from '../stores/phoneInputStore.js';
  import FISH_SETTINGS from '../lib/FISH_SETTINGS';

  const protected_range_squared =
    FISH_SETTINGS.protected_range * FISH_SETTINGS.protected_range;
  const visual_range_squared =
    FISH_SETTINGS.visual_range * FISH_SETTINGS.visual_range;

  const defaultBiasval = 0.001;

  // default biasval: 0.001 (user-changeable, or updated dynamically)
  type FishPropsData = {
    num: number;
    posX: number;
    posY: number;
  };
  type FishData = FishPropsData & {
    caught: boolean;
    velX: number;
    velY: number;
    biasval: number;
  };
  export type Position = { x: number; y: number };

  const allFishes = new Map<number, FishData>();
</script>

<script lang="ts">
  import randomBetween from '../lib/randomBetween';
  import clsx from 'clsx';
  import FishWithNumber from './FishWithNumber.svelte';

  export let fishProps: FishPropsData;
  export let margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  export let mouse: Position;
  const thisFishId = Math.floor(Math.random() * 10000000000000000); //FIXME terrible way of genereting ids
  let thisFish: FishData = {
    ...fishProps,
    caught: false,
    velX: randomBetween(
      -Math.sqrt(FISH_SETTINGS.maxspeed),
      Math.sqrt(FISH_SETTINGS.maxspeed)
    ),
    velY: randomBetween(
      -Math.sqrt(FISH_SETTINGS.maxspeed),
      Math.sqrt(FISH_SETTINGS.maxspeed)
    ),
    biasval: defaultBiasval,
  };

  const runAwayFromMouse = () => {
    //TODO
    mouse;
  };

  const updateFishPosition = () => {
    let xvel_avg = 0;
    let yvel_avg = 0;
    let neighboring_fishes = 0;
    let close_dx = 0;
    let close_dy = 0;
    let xpos_avg = 0;
    let ypos_avg = 0;

    for (const [id, otherFish] of allFishes) {
      if (id !== thisFishId) {
        let dx = thisFish.posX - otherFish.posX;
        let dy = thisFish.posY - otherFish.posY;

        if (
          Math.abs(dx) < FISH_SETTINGS.visual_range &&
          Math.abs(dy) < FISH_SETTINGS.visual_range
        ) {
          //If so, calculate the squared distance
          let squared_distance = dx * dx + dy * dy;

          //Is squared distance less than the protected range?
          if (squared_distance < protected_range_squared) {
            //If so, calculate difference in x/y-coordinates to nearfield boid
            close_dx += thisFish.posX - otherFish.posX;
            close_dy += thisFish.posY - otherFish.posY;
          }
          // If not in protected range, is the boid in the visual range?
          else if (squared_distance < visual_range_squared) {
            //Add other boid's x/y-coord and x/y vel to accumulator variables
            xpos_avg += otherFish.posX;
            ypos_avg += otherFish.posY;
            xvel_avg += otherFish.velX;
            yvel_avg += otherFish.velY;

            //Increment number of fishes within visual range
            neighboring_fishes += 1;
          }
        }
      }
    }

    // If there were any fishes in the visual range . . .
    if (neighboring_fishes > 0) {
      //Divide accumulator variables by number of fishes in visual range
      xpos_avg = xpos_avg / neighboring_fishes;
      ypos_avg = ypos_avg / neighboring_fishes;
      xvel_avg = xvel_avg / neighboring_fishes;
      yvel_avg = yvel_avg / neighboring_fishes;

      //Add the centering/matching contributions to velocity
      thisFish.velX =
        thisFish.velX +
        (xpos_avg - thisFish.posX) * FISH_SETTINGS.centering_factor +
        (xvel_avg - thisFish.velX) * FISH_SETTINGS.matching_factor;

      thisFish.velY =
        thisFish.velY +
        (ypos_avg - thisFish.posY) * FISH_SETTINGS.centering_factor +
        (yvel_avg - thisFish.velY) * FISH_SETTINGS.matching_factor;
    }

    //Add the avoidance contribution to velocity
    thisFish.velX = thisFish.velX + close_dx * FISH_SETTINGS.avoidfactor;
    thisFish.velY = thisFish.velY + close_dy * FISH_SETTINGS.avoidfactor;

    //screen edges
    if (thisFish.posX < margin.left) {
      thisFish.velX = thisFish.velX + FISH_SETTINGS.turnfactor;
    }

    if (thisFish.posX > margin.right) {
      thisFish.velX = thisFish.velX - FISH_SETTINGS.turnfactor;
    }

    if (thisFish.posY > margin.bottom) {
      thisFish.velY = thisFish.velY - FISH_SETTINGS.turnfactor;
    }

    if (thisFish.posY < margin.top) {
      thisFish.velY = thisFish.velY + FISH_SETTINGS.turnfactor;
    }

    // bias
    if (thisFishId % 2 === 0) {
      thisFish.velX =
        (1 - thisFish.biasval) * thisFish.velX + thisFish.biasval * 1;
    } else {
      thisFish.velX =
        (1 - thisFish.biasval) * thisFish.velX + thisFish.biasval * -1;
    }

    //🚓  constrain speed 🚓
    const speed = Math.sqrt(
      thisFish.velX * thisFish.velX + thisFish.velY * thisFish.velY
    );
    if (speed > FISH_SETTINGS.maxspeed) {
      thisFish.velX = (thisFish.velX / speed) * FISH_SETTINGS.maxspeed;
      thisFish.velY = (thisFish.velY / speed) * FISH_SETTINGS.maxspeed;
    }
    if (speed < FISH_SETTINGS.minspeed) {
      thisFish.velX = (thisFish.velX / speed) * FISH_SETTINGS.minspeed;
      thisFish.velY = (thisFish.velY / speed) * FISH_SETTINGS.minspeed;
    }

    //update position
    thisFish.posX = thisFish.posX + thisFish.velX;
    thisFish.posY = thisFish.posY + thisFish.velY;

    // trigger re render
    thisFish = thisFish;
    allFishes.set(thisFishId, thisFish);
  };

  const fps = 30;

  const msPerFrame = 1000 / fps;

  setInterval(() => {
    updateFishPosition();
  }, msPerFrame);

  // fish width and height to center the fish reference point
  let fishHeight; //depends on fish aspect ratio

  //update fish rotation and direction based on velocity vector
  let rotationAngle = 0;
  $: {
    rotationAngle =
      thisFish.velX > 0
        ? Math.atan2(thisFish.velY, thisFish.velX)
        : Math.atan2(-thisFish.velY, -thisFish.velX);
  }

  //turn off animation when the fish is turning so it doesnt spin like crazy
  const animationOffTime = msPerFrame;
  let isAnimation = true;
</script>

{#if !thisFish.caught}
  <button
    class={clsx(
      isAnimation && 'transition',
      'place-content-center grid col-start-1 row-start-1 origin-center z-20'
    )}
    style="transition-duration: {msPerFrame *
      3}ms; width:{FISH_SETTINGS.fishWidth}px; transform: translate({thisFish.posX -
      FISH_SETTINGS.fishWidth / 2}px, {thisFish.posY -
      fishHeight / 2}px) rotate({rotationAngle}rad);"
    bind:clientHeight={fishHeight}
    on:click={() => {
      if (!$fishCursorCaught) {
        fishCursorCaught.update(() => thisFish.num);
        thisFish.caught = true;
        allFishes.set(thisFishId, thisFish);
      }
    }}
  >
    <FishWithNumber num={thisFish.num} fishMirrored={thisFish.velX < 0} />
  </button>
{/if}
