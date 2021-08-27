import Vue from 'vue'
import vSelect from 'vue-select'

import App from './App'

Vue.component('VSelect', vSelect)
Vue.directive('focus', {
	inserted: (el) => {
		// Focus the element
		el.focus()
	}
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	render: (h) => h(App)
})