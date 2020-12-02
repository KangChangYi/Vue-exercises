// eslint-disable-next-line no-unused-vars
let _Vue;

class Store {
  constructor(options) {
    this.$options = options;

    this.vm = new _Vue({
      data() {
        return {
          $$state: options.state
        };
      }
    });

    this.commit = this.commit.bind(this);

    this.dispatch = this.dispatch.bind(this);

    // getters
    this.getters = Object.create(null);
    const store = this;
    let computed = {};
    Object.entries(this.$options.getters).forEach(([name, fn]) => {
      computed[name] = () => fn(store.vm._data.$$state, store.getters);

      Object.defineProperty(store.getters, name, {
        get: () => store.vm[name]
      });
    });

    this.vm = new _Vue({
      data() {
        return {
          $$state: options.state
        };
      },
      computed
    });
  }

  get state() {
    return this.vm._data.$$state;
  }

  set state(val) {
    throw Error("connot direct to set state");
  }

  commit = function(mutationName, payload) {
    const entry = this.$options.mutations[mutationName];
    return entry(this.vm._data.$$state, payload);
  };

  dispatch = function(type, payload) {
    const entry = this.$options.actions[type];
    return entry(this, payload);
  };
}

function install(Vue) {
  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      // 在根组件创建时，将 store 实例挂载到 Vue 原型链
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
}

export default { Store, install };
