<template>
  <div>
    <h1>Bible Reader</h1>

    <div class="ui grid container">
      <div class="ui input eight wide column">
        <input type="text" v-model="refInput" placeholder="Input passage reference..." style="width: 100%" @input="display"/>
      </div>
      <div class="ui input eight wide column">
        <input type="text" v-model="search" placeholder="Search..." style="width: 100%" />
      </div>

      <div>
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
/* eslint no-unused-vars: "off" */
import bible from '../../data/pl/bible/ubg.json'

export default {
  data () {
    return {
      refInput: '',
      search: '',
      text: '',
      bible
    }
  },
  methods: {
    display () {
      /* eslint no-eval: "off" */
      this.text = eval('this.bible.' + this.refInput)
    }
  }
}
</script>
