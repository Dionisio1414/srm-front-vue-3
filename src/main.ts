import { createApp, ref } from 'vue';

import PrimeVue from 'primevue/config';

import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import { abilitiesPlugin } from '@casl/vue';

import App from '@/app/app.vue';
import router from '@/app/app-routes';
import pinia from '@/app/app-store';

import '@/app/app.css';

import useLoginStore from '@/app/login/shared/store/login-store';

import { i18n, loadLocaleMessages } from '@/plugins/i18n';

loadLocaleMessages(i18n, 'en');
loadLocaleMessages(i18n, 'ru');

const app = createApp(App);

app.use(i18n);
app.use(pinia);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);

const loginStore = useLoginStore();
const permission = ref(loginStore.user.permissions);

if (permission.value) {
  loginStore.updateAbility(permission.value);
}

app.use(abilitiesPlugin, loginStore.ability, { useGlobalProperties: true });

app.mount('#app');
