// Vue 1.0 数据劫持基础实现
// 缺点：订阅者粒度较细（DOM），导致内存占用过多，影响性能

// 1.   创建 Vue 类
// 1.1  递归 data，拦截 getter setter
// 1.2. 代理，用户可通过直接访问属性的方式获取到内部的 $data
// 2.   递归编译绑定了 vue 的 dom 及其子节点，两种情况：指令和插槽语法
// 2.1  编译时，会触发指令、插槽对应的 update 函数，初始化指令和插槽对应的内容后，创建一个 watcher，watcher 的回调函数闭包保存了当前节点的更新方法
// 2.2  watcher 获取一次当前数据，触发 getter，让 data 的 Dep 在 getter 中将 watcher 收集起来
// 2.3  Dep 类维护一个存放 watcher 的数组，当前 Dep 对应的 data 被 setter 时，触发该 Dep 中所有 watcher 的更新方法即可

// eslint-disable-next-line no-unused-vars
class myVue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    this.$methods = options.methods;

    // 异常情况判断...

    new Observer(this.$data);

    setDataProxy(this);

    new Compiler(this.$el, this);
  }
}

// 递归劫持所有数据
class Observer {
  constructor(data) {
    this.observe(data);
  }

  observe(data) {
    Object.keys(data).forEach(key => {
      const isArray = Array.isArray(data[key]);
      const isObject =
        Object.prototype.toString.call(data[key]) === "[object Object]";

      if (isArray) {
        // 处理数组
      } else if (isObject) {
        // 处理对象
        this.observe(data[key]);
      } else {
        defineReactive(data, key, data[key]);
      }
    });
  }
}

// 数据劫持
function defineReactive(obj, key, val) {
  // 每个 key 拥有一个依赖实例
  let deps = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      // get 中收集依赖
      Dep.target && deps.add(Dep.target);
      return val;
    },
    set(v) {
      val = v;
      // set 中触发依赖
      deps.notify();
    }
  });
}

// 若 this.xx 访问的键在 data 中的存在，则代理到 this.$data.xx
function setDataProxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(val) {
        vm.$data[key] = val;
      }
    });
  });
}

// 编译器
class Compiler {
  constructor(el, vm) {
    this.$vm = vm;

    const $el = document.querySelector(el);
    this.compile($el);
  }

  compile(el) {
    if (!el.childNodes.length) return;
    el.childNodes.forEach(node => {
      // 递归子节点
      if (node.childNodes.length > 0) {
        this.compile(node);
      }

      if (node.nodeType === 1) {
        this.compilerElement(node);
      } else if (this.isSlotText(node)) {
        // 文本节点编译
        this.update(node, RegExp.$1, "text");
      }
    });
  }

  // 元素节点编译
  compilerElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      const { name, value } = attr;
      // 指令语法
      if (this.isDir(name)) {
        // 存在需要特殊处理的指令
        this[name.substr(3)]
          ? this[name.substr(3)](node, value, name.substr(3))
          : this.update(node, value, name.substr(3));
      }
      // 事件语法
      if (this.isEvent(name)) {
        node.addEventListener("click", this.$vm.$methods[value].bind(this.$vm));
      }
    });
  }

  // 判断是否插槽语法
  isSlotText(node) {
    return (
      node.nodeType === 3 && new RegExp(/\{\{(.*)\}\}/).test(node.textContent)
    );
  }

  // 判断是否是指令属性
  isDir(dir) {
    return dir.startsWith("my-");
  }

  isEvent(dir) {
    return new RegExp(/(@click|v-on:click)/).test(dir);
  }

  // 依赖在编译的时候就进行收集了，编译时先是初始化对应节点的值，然后收集依赖
  update(node, dataField, type) {
    const updateEvent = this[type + "Updater"];
    updateEvent && updateEvent(node, this.$vm[dataField]);

    new Watcher(this.$vm, dataField, () => {
      const updateEvent = this[type + "Updater"];
      updateEvent && updateEvent(node, this.$vm[dataField]);
    });
  }

  // my-model
  model(node, dataField, type) {
    // 普通 input 输入框
    if (
      node.tagName === "INPUT" &&
      (node.type === "text" || node.type === "password")
    ) {
      node.addEventListener(
        "input",
        function(e) {
          this.$vm[dataField] = e.target.value;
        }.bind(this)
      );
    }
    // 其他情况... checkbox radio
  }

  // my-text 更新方法
  textUpdater(node, val) {
    node.textContent = val;
  }

  // my-html 更新方法
  htmlUpdater(node, val) {
    node.innerHTML = val;
  }
}

// 订阅者
// 仅维护一个更新函数
class Watcher {
  constructor(data, dataField, updater) {
    this.$data = data;
    this.$dataField = dataField;
    this.$updater = updater;

    // 将当前实例的应用放置到 “某个地方”
    Dep.target = this;
    // get 一次订阅者订阅的内容，让发布者从 “某个地方” 收集订阅者
    this.$data[this.$dataField];
    // 清空
    Dep.target = null;
  }

  update() {
    this.$updater();
  }
}

// 发布者
// 观察者被收集到依赖中，当数据发生变化时，通知观察者，执行更新操作
class Dep {
  constructor() {
    this.deps = [];
  }

  add(watcher) {
    this.deps.push(watcher);
  }

  notify() {
    this.deps.forEach(dep => {
      dep.update && dep.update();
    });
  }
}
