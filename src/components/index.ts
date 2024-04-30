import { App } from 'vue';
import WaterFall from './water-fall/index.vue';
import Drawer from './drawer/index.vue';
import SvgIcon from './svg-icon/index.vue';
import Spin from './spin/index.vue';
import Button from './button/index.vue';
import Tabs from './tabs/index.vue';
import TabPane from './tabs/pane.vue';

export default {
  install(Vue: App) {
    // Vue.component('WaterFall', WaterFall);
    Vue.component('Drawer', Drawer);
    Vue.component('SvgIcon', SvgIcon);
    Vue.component('Spin', Spin);
    Vue.component('Tabs', Tabs);
    Vue.component('TabPane', TabPane);
  },
};
