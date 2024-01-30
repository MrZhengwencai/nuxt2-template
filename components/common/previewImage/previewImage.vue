<template>
  <div>
    <div id="viewer-images" style="display: none">
      <img v-for="(item, index) in images" :key="index" :src="item.src" alt="预览图" />
    </div>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'
export default {
  name: 'PreviewImage',
  props: {
    images: {
      type: Array,
    },
    options: {
      type: Object,
    },
  },

  data() {
    return {}
  },

  computed: {},

  watch: {
    images() {
      this.$nextTick(() => {
        this.onChange()
      })
    },
  },

  mounted() {
    this.createViewer()
  },

  destroyed() {
    this.destroyViewer()
  },

  methods: {
    onChange() {
      // if (this.rebuild) {
      //   this.rebuildViewer()
      // } else {
      //   this.updateViewer()
      // }
      this.updateViewer()
    },
    // rebuildViewer () {
    //   this.destroyViewer()
    //   this.createViewer()
    // },
    updateViewer() {
      if (this.$viewer) {
        this.$viewer.update()
        // this.$emit('update', this.$viewer)
      } else {
        this.createViewer()
      }
    },
    destroyViewer() {
      this.$viewer && this.$viewer.destroy()
    },
    createViewer() {
      // this.$el.addEventListener('hidden', (event) => {
      //   console.log('event', event)
      // })
      this.$viewer = new Viewer(this.$el, this.options)
      // this.$viewer.view(0)
      // this.$emit('update', this.$viewer)
    },
    show(index) {
      this.$viewer.show()
      this.$nextTick(() => {
        if (index !== '') {
          this.$viewer.view(index)
        } else {
          this.$viewer.view(0)
        }
      })
    },
  },
}
</script>

<style scoped></style>
