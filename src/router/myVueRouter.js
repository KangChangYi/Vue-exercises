// eslint-disable-next-line no-unused-vars
let _Vue;

class Router {
  constructor(options) {
    this.$options = options;

    const initial = window.location.hash.slice(1) || "/";

    _Vue.util.defineReactive(this, "current", initial);

    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  onHashChange() {
    this.current = window.location.hash.slice(1);
  }
}

// 调用插件 install 时，Vue.use 会传入 Vue
Router.install = function(Vue) {
  _Vue = Vue;

  // 通过全局 mixin 在根实例加载时注入 $router
  Vue.mixin({
    // 根组件（根 Vue 实例）在创建时传入了当前 Router 类的实例，属性名为 router
    // Vue 将组件的入参放在了 $options 中
    // 所以 this.$options.router 就指向那个被传入根组件的 Router 类实例
    beforeCreate() {
      // 这里的 this 是 Vue 的组件
      if (this.$options.router) {
        // 错误1 需要挂载到 Vue 的原型上，可以让所有子组件访问到 Router 类实例
        // this.$router = this.$options.router;
        Vue.prototype.$router = this.$options.router;
      }
    }
  });
  // 未经过模板编译，无法使用 template
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    // render 函数文档
    // https://cn.vuejs.org/v2/guide/render-function.html
    render(h) {
      return h("a", { attrs: { href: "#" + this.to } }, this.$slots.default);
    }
  });

  Vue.component("router-view", {
    render(h) {
      // 当前路径和 Router 配置的路由表匹配出当前需要渲染的组件
      let component;

      const current = this.$router.$options.routes.find(
        item => item.path === this.$router.current
      );

      if (current && current.component) {
        component = current.component;
      }

      return h(component);
    }
  });
};

export default Router;
