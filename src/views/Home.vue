<template>
  <v-container>
    <h1>Props</h1>
    <!-- Блоки для отображения отформатированного и подсвеченного кода -->
    <pre><code class="language-html">{{ formattedChildComponentCode }}</code></pre>
    <pre><code class="language-html">{{ formattedParentComponentCode }}</code></pre>
  </v-container>
</template>

<script>
import Prism from 'prismjs'
import Prettier from 'prettier/standalone'
import parserHtml from 'prettier/parser-html'
import parserBabel from 'prettier/parser-babel'
import childComponentCode from '@/views/source/childComponentCode.js'
import parentComponentCode from '@/views/source/parentComponentCode.js'
import 'prismjs/themes/prism-tomorrow.css'

export default {
  name: 'Home',
  data() {
    return {
      formattedChildComponentCode: '',
      formattedParentComponentCode: '',
    }
  },
  async mounted() {
    this.formattedChildComponentCode = await this.formatCode(childComponentCode)
    this.formattedParentComponentCode =
      await this.formatCode(parentComponentCode)
    this.$nextTick(() => {
      Prism.highlightAll()
    })
  },
  methods: {
    async formatCode(code) {
      try {
        return await Prettier.format(code, {
          parser: 'babel', // Используйте 'vue' или 'html' для соответствующего типа кода
          plugins: [parserBabel, parserHtml],
        })
      } catch (error) {
        console.error('Ошибка форматирования:', error)
        return code // В случае ошибки возвращаем исходный код
      }
    },
  },
}
</script>

<style>
/* Дополнительные стили, если необходимо */
</style>
