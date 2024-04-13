// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
      
  })

  nuxtApp.vueApp.use(vuetify)
})
