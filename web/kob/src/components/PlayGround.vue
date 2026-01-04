<template>
    <div class="playground">
        <GameMap />
    </div>
</template>

<script>
import GameMap from './GameMap.vue';

export default {
    components: {
        GameMap
    }
}
</script>

<style scoped>
.playground {
    width: 70vw;
    height: 70vh;
    margin: 60px auto;
}
</style>