<template>
  <div class="home">
    hello world
  </div>
</template>

<script>
import { ref } from 'vue';
import $ from 'jquery'

export default {
  name: 'HelloWorld',
  setup() {
    let name = ref('');
    let recommendations = ref('');

    $.ajax({
      // 引入后端getbotinfo接口 -- 未完成
      url: "http://127.0.0.1:4396/pk/getBotInfo/",
      type: "get",
      success(resp) {
        console.log(resp);
      }
    })

    return {
      name, 
      recommendations
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
