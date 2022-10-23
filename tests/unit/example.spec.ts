import { shallowMount } from '@vue/test-utils';
import App from '@/app/app.vue';

describe.skip('App.vue', () => {
  it('renders app component', () => {
    const wrapper = shallowMount(App, {});

    expect(wrapper.element).toMatchSnapshot();
  });
});
