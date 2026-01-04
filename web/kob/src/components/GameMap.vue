<template>
    <div ref="parent" class="gamemap">
      <canvas ref="canvas" tabindex="0"></canvas>
    </div>
</template>

<script>
import { GameMap } from '@/js/GameMap';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    let parent = ref(null);
    let canvas = ref(null);

    // console.log("This is gamemap.vue");

    onMounted(() => {
      new GameMap(canvas.value.getContext('2d'), parent.value);
      // console.log("gamemap.js has imported.");
    })

    return {
      parent,
      canvas
    }
  }
}
</script>

<style scoped>
  .gamemap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>