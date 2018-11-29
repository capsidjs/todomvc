;(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == 'function' && require
        if (!u && a) return a(o, !0)
        if (i) return i(o, !0)
        var f = new Error("Cannot find module '" + o + "'")
        throw ((f.code = 'MODULE_NOT_FOUND'), f)
      }
      var l = (n[o] = { exports: {} })
      t[o][0].call(
        l.exports,
        function(e) {
          var n = t[o][1][e]
          return s(n ? n : e)
        },
        l,
        l.exports,
        e,
        t,
        n,
        r
      )
    }
    return n[o].exports
  }
  var i = typeof require == 'function' && require
  for (var o = 0; o < r.length; o++) s(r[o])
  return s
})(
  {
    1: [
      function(require, module, exports) {
        'use strict'

        Object.defineProperty(exports, '__esModule', { value: true })

        /**
         * The mapping from class-component name to its initializer function.
         */
        var ccc = {}

        /**
         * Asserts the given condition holds, otherwise throws.
         * @param assertion The assertion expression
         * @param message The assertion message
         */

        function check(assertion, message) {
          if (!assertion) {
            throw new Error(message)
          }
        }
        /**
         * @param classNames The class names
         */

        /**
         * Asserts the given name is a valid component name.
         * @param name The component name
         */

        function checkComponentNameIsValid(name) {
          check(typeof name === 'string', 'The name should be a string')
          check(
            !!ccc[name],
            'The coelement of the given name is not registered: '.concat(name)
          )
        }

        var READY_STATE_CHANGE = 'readystatechange'
        var doc = document
        var ready = new Promise(function(resolve) {
          var checkReady = function checkReady() {
            if (doc.readyState === 'complete') {
              resolve()
              doc.removeEventListener(READY_STATE_CHANGE, checkReady)
            }
          }

          doc.addEventListener(READY_STATE_CHANGE, checkReady)
          checkReady()
        })
        var documentElement = doc.documentElement

        /**
         * Initializes the class components of the given name in the range of the given element.
         * @param name The class name
         * @param el The dom where class componets are initialized
         * @throws when the class name is invalid type.
         */

        var prep = function(name, el) {
          var classNames

          if (!name) {
            classNames = Object.keys(ccc)
          } else {
            checkComponentNameIsValid(name)
            classNames = [name]
          }

          classNames.map(function(className) {
            ;[].map.call(
              (el || doc).querySelectorAll(ccc[className].sel),
              ccc[className]
            )
          })
        }

        var pluginHooks = []

        var COELEMENT_DATA_KEY_PREFIX = 'C$'
        var KEY_EVENT_LISTENERS = 'K$'
        var INITIALIZED_KEY = 'I$'
        var COMPONENT_NAME_KEY = 'N$'

        var initConstructor = function(constructor, name) {
          constructor[INITIALIZED_KEY] = true
          constructor[COMPONENT_NAME_KEY] = name // Expose capsid here

          constructor.capsid = capsid // If the constructor has the static __init__, then calls it.

          if (typeof constructor.__init__ === 'function') {
            constructor.__init__()
          }
        }

        /**
         * Initialize component.
         * @param Constructor The coelement class
         * @param el The element
         * @param name The coelement name
         * @return The created coelement instance
         */

        var mount = function(Constructor, el, name) {
          if (!Constructor[INITIALIZED_KEY]) {
            initConstructor(Constructor, name)
          }

          var coelem = new Constructor() // Assigns element to coelement's .el property

          coelem.el = el

          if (name) {
            // Assigns coelement to element's "hidden" property

            el[COELEMENT_DATA_KEY_PREFIX + name] = coelem
          } // Initialize event listeners defined by @emit decorator

          ;(Constructor[KEY_EVENT_LISTENERS] || []).map(function(
            listenerBinder
          ) {
            listenerBinder(el, coelem, name)
          }) // Executes plugin hooks

          pluginHooks.forEach(function(pluginHook) {
            pluginHook(el, coelem)
          })

          if (typeof coelem.__mount__ === 'function') {
            coelem.__mount__()
          }

          return coelem
        }

        /**
         * Registers the class-component for the given name and constructor and returns the constructor.
         * @param name The component name
         * @param Constructor The constructor of the class component
         * @return The registered component class
         */

        var def = function def(name, Constructor) {
          check(
            typeof name === 'string',
            '`name` of a class component has to be a string.'
          )
          check(
            typeof Constructor === 'function',
            '`Constructor` of a class component has to be a function'
          )
          var initClass = ''.concat(name, '-\uD83D\uDC8A')
          /**
           * Initializes the html element by the configuration.
           * @param el The html element
           * @param coelem The dummy parameter, don't use
           */

          var initializer = function initializer(el, coelem) {
            var classList = el.classList

            if (!classList.contains(initClass)) {
              classList.add(name, initClass)
              mount(Constructor, el, name)
            }
          } // The selector

          initializer.sel = '.'.concat(name, ':not(.').concat(initClass, ')')
          ccc[name] = initializer
          ready.then(function() {
            prep(name)
          })
        }

        /**
         * Gets the eoelement instance of the class-component of the given name
         * @param name The class-component name
         * @param el The element
         */

        var _get = function(name, el) {
          checkComponentNameIsValid(name)
          var coelement = el[COELEMENT_DATA_KEY_PREFIX + name]
          check(
            coelement,
            'no coelement named: '
              .concat(name, ', on the dom: ')
              .concat(el.tagName)
          )
          return coelement
        }

        /**
         * Initializes the given element as the class-component.
         * @param name The name of the class component
         * @param el The element to initialize
         */

        var init = function(name, el) {
          checkComponentNameIsValid(name)
          ccc[name](el)
        }

        /**
         * Initializes the given element as the class-component.
         * @param name The name of the class component
         * @param el The element to initialize
         * @return
         */

        var make = function(name, elm) {
          init(name, elm)
          return _get(name, elm)
        }

        var unmount = function(name, el) {
          var coel = _get(name, el)

          if (typeof coel.__unmount__ === 'function') {
            coel.__unmount__()
          }

          el.classList.remove(name, ''.concat(name, '-\uD83D\uDC8A'))
          ;(el[KEY_EVENT_LISTENERS + name] || []).forEach(function(listener) {
            listener.remove()
          })
          delete el[COELEMENT_DATA_KEY_PREFIX + name]
          delete coel.el
        }

        /**
         * Installs the capsid module or plugin.
         *
         * @param {CapsidModule} capsidModule
         * @param {object} options
         */
        var install$$1 = function(capsidModule, options) {
          check(
            typeof capsidModule.install === 'function',
            'The given capsid module does not have `install` method. Please check the install call.'
          )
          capsidModule.install(capsid, options || {})
        }

        var debugMessage = function(message) {
          if (typeof capsidDebugMessage === 'function') {
            capsidDebugMessage(message)
          }
        }

        /**
         * The decorator for registering event listener info to the method.
         * @param event The event name
         * @param at The selector
         * @param descriptor The method descriptor
         */
        var on = function(event) {
          var _ref =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {},
            at = _ref.at

          return function(descriptor) {
            var key = descriptor.key

            descriptor.finisher = function(constructor) {
              check(
                !!event,
                'Empty event handler is given: constructor='
                  .concat(constructor.name, ' key=')
                  .concat(key)
              )
              /**
               * @param el The element
               * @param coelem The coelement
               * @param name The component name
               */

              constructor[KEY_EVENT_LISTENERS] = (
                constructor[KEY_EVENT_LISTENERS] || []
              ).concat(function(el, coelem, name) {
                var keyEventListeners = KEY_EVENT_LISTENERS + name

                var listener = function listener(e) {
                  if (
                    !at ||
                    [].some.call(el.querySelectorAll(at), function(node) {
                      return node === e.target || node.contains(e.target)
                    })
                  ) {
                    {
                      debugMessage({
                        type: 'event',
                        module: '💊',
                        color: '#e0407b',
                        e: e,
                        el: el,
                        coelem: coelem
                      })
                    }

                    coelem[key](e)
                  }
                }
                /**
                 * Removes the event listener.
                 */

                listener.remove = function() {
                  el.removeEventListener(event, listener)
                }
                /**
                 * Store event listeners to remove it later.
                 */

                el[keyEventListeners] = (el[keyEventListeners] || []).concat(
                  listener
                )
                el.addEventListener(event, listener)
              })
            }
          }
        }

        /**
         * Registers the on[eventName] and on[eventName].at decorators.
         * @param {string} handlerName
         */

        var useHandler = function(handlerName) {
          on[handlerName] = on(handlerName)

          on[handlerName].at = function(selector) {
            return on(handlerName, {
              at: selector
            })
          }
        }

        /**
         * Triggers the event.
         * @param el The element
         * @param type The event type
         * @param detail The optional detail object
         */
        var trigger = function(el, type, bubbles, detail) {
          el.dispatchEvent(
            new CustomEvent(type, {
              detail: detail,
              bubbles: bubbles
            })
          )
        }

        /**
         * `@emits(event)` decorator
         *
         * This decorator adds the event emission at the end of the method.
         * If the method returns the promise, then the event is emitted when it is resolved.
         * @param event The event name
         */

        var emits = function emits(event) {
          return function(descriptor) {
            var method = descriptor.descriptor.value
            var key = descriptor.key

            descriptor.finisher = function(constructor) {
              check(
                !!event,
                'Unable to emits an empty event: constructor='
                  .concat(constructor.name, ' key=')
                  .concat(key)
              )
            }

            descriptor.descriptor.value = function() {
              var _this = this

              var result = method.apply(this, arguments)

              var emit = function emit(x) {
                return trigger(_this.el, event, true, x)
              }

              if (result && result.then) {
                result.then(emit)
              } else {
                emit(result)
              }

              return result
            }
          }
        }

        var matches =
          documentElement.matches ||
          documentElement.webkitMatchesSelector ||
          documentElement.msMatchesSelector

        /**
         * Wires the class component of the name of the key to the property of the same name.
         *
         * Replaces the getter with the function which accesses the class-component of the given name.
         * @param name The class component name
         * @param selector The selector to access class component dom. Optional. Default is '.[name]'.
         * @param descriptor The method element descriptor
         */

        var wiredComponent = function wiredComponent(name, selector) {
          return function(descriptor) {
            var sel = selector || '.'.concat(name)
            var key = descriptor.key
            descriptor.placement = 'prototype'

            descriptor.finisher = function(constructor) {
              Object.defineProperty(constructor.prototype, key, {
                get: function get() {
                  check(
                    !!this.el,
                    "Component's element is not ready. Probably wired getter called at constructor.(class=[".concat(
                      this.constructor.name,
                      ']'
                    )
                  )

                  if (matches.call(this.el, sel)) {
                    return _get(name, this.el)
                  }

                  var nodes = this.el.querySelectorAll(sel)
                  check(
                    nodes.length > 0,
                    'wired component "'
                      .concat(name, '" is not available at ')
                      .concat(this.el.tagName, '(class=[')
                      .concat(this.constructor.name, ']')
                  )
                  return _get(name, nodes[0])
                }
              })
            }
          }
        }

        var wired = function wired(sel) {
          return function(descriptor) {
            var key = descriptor.key
            descriptor.placement = 'prototype'

            descriptor.finisher = function(constructor) {
              Object.defineProperty(constructor.prototype, key, {
                get: function get() {
                  return this.el.querySelector(sel)
                }
              })
            }
          }
        }

        var wiredAll = function wiredAll(sel) {
          return function(descriptor) {
            var key = descriptor.key
            descriptor.placement = 'prototype'

            descriptor.finisher = function(constructor) {
              Object.defineProperty(constructor.prototype, key, {
                get: function get() {
                  return this.el.querySelectorAll(sel)
                }
              })
            }
          }
        }

        wired.all = wiredAll
        wired.component = wiredComponent

        /**
         * The decorator for class component registration.
         *
         * if `name` is function, then use it as class itself and the component name is kebab-cased version of its name.
         * @param name The class name or the implementation class itself
         * @return The decorator if the class name is given, undefined if the implementation class is given
         */

        var component = function component(name) {
          check(!!name, 'Component name must be non-empty')
          return function(desc) {
            desc.finisher = function(Cls) {
              def(name, Cls)
            }
          }
        }

        /**
         * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
         */

        var notifies = function(event, selector) {
          return function(descriptor) {
            var key = descriptor.key
            var d = descriptor.descriptor
            var method = d.value

            descriptor.finisher = function(constructor) {
              check(
                !!event,
                'Unable to notify empty event: constructor='
                  .concat(constructor.name, ' key=')
                  .concat(key)
              )
            }

            d.value = function() {
              var _this = this

              var result = method.apply(this, arguments)
              var forEach = [].forEach

              var emit = function emit(x) {
                forEach.call(_this.el.querySelectorAll(selector), function(el) {
                  return trigger(el, event, false, x)
                })
              }

              if (result && result.then) {
                result.then(emit)
              } else {
                emit(result)
              }

              return result
            }
          }
        }

        on.useHandler = useHandler
        on.useHandler('click')

        var capsid = Object.freeze({
          def: def,
          prep: prep,
          make: make,
          mount: mount,
          unmount: unmount,
          get: _get,
          install: install$$1,
          on: on,
          emits: emits,
          wired: wired,
          component: component,
          notifies: notifies,
          __ccc__: ccc,
          pluginHooks: pluginHooks
        })

        exports.def = def
        exports.prep = prep
        exports.make = make
        exports.mount = mount
        exports.unmount = unmount
        exports.get = _get
        exports.install = install$$1
        exports.on = on
        exports.emits = emits
        exports.wired = wired
        exports.component = component
        exports.notifies = notifies
        exports.__ccc__ = ccc
        exports.pluginHooks = pluginHooks
      },
      {}
    ],
    2: [
      function(require, module, exports) {
        'use strict'

        Object.defineProperty(exports, '__esModule', { value: true })

        /**
         * The mapping from class-component name to its initializer function.
         */
        var ccc = {}

        /**
         * Asserts the given condition holds, otherwise throws.
         * @param assertion The assertion expression
         * @param message The assertion message
         */

        function check(assertion, message) {
          if (!assertion) {
            throw new Error(message)
          }
        }
        /**
         * @param classNames The class names
         */

        /**
         * Asserts the given name is a valid component name.
         * @param name The component name
         */

        function checkComponentNameIsValid(name) {
          check(typeof name === 'string', 'The name should be a string')
          check(
            !!ccc[name],
            'The coelement of the given name is not registered: '.concat(name)
          )
        }

        var READY_STATE_CHANGE = 'readystatechange'
        var doc = document
        var ready = new Promise(function(resolve) {
          var checkReady = function checkReady() {
            if (doc.readyState === 'complete') {
              resolve()
              doc.removeEventListener(READY_STATE_CHANGE, checkReady)
            }
          }

          doc.addEventListener(READY_STATE_CHANGE, checkReady)
          checkReady()
        })
        var documentElement = doc.documentElement

        /**
         * Initializes the class components of the given name in the range of the given element.
         * @param name The class name
         * @param el The dom where class componets are initialized
         * @throws when the class name is invalid type.
         */

        var prep = function(name, el) {
          var classNames

          if (!name) {
            classNames = Object.keys(ccc)
          } else {
            checkComponentNameIsValid(name)
            classNames = [name]
          }

          classNames.map(function(className) {
            ;[].map.call(
              (el || doc).querySelectorAll(ccc[className].sel),
              ccc[className]
            )
          })
        }

        var pluginHooks = []

        var COELEMENT_DATA_KEY_PREFIX = 'C$'
        var KEY_EVENT_LISTENERS = 'K$'
        var INITIALIZED_KEY = 'I$'
        var COMPONENT_NAME_KEY = 'N$'

        var initConstructor = function(constructor, name) {
          constructor[INITIALIZED_KEY] = true
          constructor[COMPONENT_NAME_KEY] = name // Expose capsid here

          constructor.capsid = capsid // If the constructor has the static __init__, then calls it.

          if (typeof constructor.__init__ === 'function') {
            constructor.__init__()
          }
        }

        /**
         * Initialize component.
         * @param Constructor The coelement class
         * @param el The element
         * @param name The coelement name
         * @return The created coelement instance
         */

        var mount = function(Constructor, el, name) {
          if (!Constructor[INITIALIZED_KEY]) {
            initConstructor(Constructor, name)
          }

          var coelem = new Constructor() // Assigns element to coelement's .el property

          coelem.el = el

          if (name) {
            // Assigns coelement to element's "hidden" property

            el[COELEMENT_DATA_KEY_PREFIX + name] = coelem
          } // Initialize event listeners defined by @emit decorator

          ;(Constructor[KEY_EVENT_LISTENERS] || []).map(function(
            listenerBinder
          ) {
            listenerBinder(el, coelem, name)
          }) // Executes plugin hooks

          pluginHooks.forEach(function(pluginHook) {
            pluginHook(el, coelem)
          })

          if (typeof coelem.__mount__ === 'function') {
            coelem.__mount__()
          }

          return coelem
        }

        /**
         * Registers the class-component for the given name and constructor and returns the constructor.
         * @param name The component name
         * @param Constructor The constructor of the class component
         * @return The registered component class
         */

        var def = function def(name, Constructor) {
          check(
            typeof name === 'string',
            '`name` of a class component has to be a string.'
          )
          check(
            typeof Constructor === 'function',
            '`Constructor` of a class component has to be a function'
          )
          var initClass = ''.concat(name, '-\uD83D\uDC8A')
          /**
           * Initializes the html element by the configuration.
           * @param el The html element
           * @param coelem The dummy parameter, don't use
           */

          var initializer = function initializer(el, coelem) {
            var classList = el.classList

            if (!classList.contains(initClass)) {
              classList.add(name, initClass)
              mount(Constructor, el, name)
            }
          } // The selector

          initializer.sel = '.'.concat(name, ':not(.').concat(initClass, ')')
          ccc[name] = initializer
          ready.then(function() {
            prep(name)
          })
        }

        /**
         * Gets the eoelement instance of the class-component of the given name
         * @param name The class-component name
         * @param el The element
         */

        var _get = function(name, el) {
          checkComponentNameIsValid(name)
          var coelement = el[COELEMENT_DATA_KEY_PREFIX + name]
          check(
            coelement,
            'no coelement named: '
              .concat(name, ', on the dom: ')
              .concat(el.tagName)
          )
          return coelement
        }

        /**
         * Initializes the given element as the class-component.
         * @param name The name of the class component
         * @param el The element to initialize
         */

        var init = function(name, el) {
          checkComponentNameIsValid(name)
          ccc[name](el)
        }

        /**
         * Initializes the given element as the class-component.
         * @param name The name of the class component
         * @param el The element to initialize
         * @return
         */

        var make = function(name, elm) {
          init(name, elm)
          return _get(name, elm)
        }

        var unmount = function(name, el) {
          var coel = _get(name, el)

          if (typeof coel.__unmount__ === 'function') {
            coel.__unmount__()
          }

          el.classList.remove(name, ''.concat(name, '-\uD83D\uDC8A'))
          ;(el[KEY_EVENT_LISTENERS + name] || []).forEach(function(listener) {
            listener.remove()
          })
          delete el[COELEMENT_DATA_KEY_PREFIX + name]
          delete coel.el
        }

        /**
         * Installs the capsid module or plugin.
         *
         * @param {CapsidModule} capsidModule
         * @param {object} options
         */
        var install$$1 = function(capsidModule, options) {
          check(
            typeof capsidModule.install === 'function',
            'The given capsid module does not have `install` method. Please check the install call.'
          )
          capsidModule.install(capsid, options || {})
        }

        /**
         * The decorator for registering event listener info to the method.
         * @param event The event name
         * @param at The selector
         * @param descriptor The method descriptor
         */
        var on = function(event) {
          var _ref =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {},
            at = _ref.at

          return function(descriptor) {
            var key = descriptor.key

            descriptor.finisher = function(constructor) {
              check(
                !!event,
                'Empty event handler is given: constructor='
                  .concat(constructor.name, ' key=')
                  .concat(key)
              )
              /**
               * @param el The element
               * @param coelem The coelement
               * @param name The component name
               */

              constructor[KEY_EVENT_LISTENERS] = (
                constructor[KEY_EVENT_LISTENERS] || []
              ).concat(function(el, coelem, name) {
                var keyEventListeners = KEY_EVENT_LISTENERS + name

                var listener = function listener(e) {
                  if (
                    !at ||
                    [].some.call(el.querySelectorAll(at), function(node) {
                      return node === e.target || node.contains(e.target)
                    })
                  ) {
                    coelem[key](e)
                  }
                }
                /**
                 * Removes the event listener.
                 */

                listener.remove = function() {
                  el.removeEventListener(event, listener)
                }
                /**
                 * Store event listeners to remove it later.
                 */

                el[keyEventListeners] = (el[keyEventListeners] || []).concat(
                  listener
                )
                el.addEventListener(event, listener)
              })
            }
          }
        }

        /**
         * Registers the on[eventName] and on[eventName].at decorators.
         * @param {string} handlerName
         */

        var useHandler = function(handlerName) {
          on[handlerName] = on(handlerName)

          on[handlerName].at = function(selector) {
            return on(handlerName, {
              at: selector
            })
          }
        }

        /**
         * Triggers the event.
         * @param el The element
         * @param type The event type
         * @param detail The optional detail object
         */
        var trigger = function(el, type, bubbles, detail) {
          el.dispatchEvent(
            new CustomEvent(type, {
              detail: detail,
              bubbles: bubbles
            })
          )
        }

        /**
         * `@emits(event)` decorator
         *
         * This decorator adds the event emission at the end of the method.
         * If the method returns the promise, then the event is emitted when it is resolved.
         * @param event The event name
         */

        var emits = function emits(event) {
          return function(descriptor) {
            var method = descriptor.descriptor.value
            var key = descriptor.key

            descriptor.finisher = function(constructor) {
              check(
                !!event,
                'Unable to emits an empty event: constructor='
                  .concat(constructor.name, ' key=')
                  .concat(key)
              )
            }

            descriptor.descriptor.value = function() {
              var _this = this

              var result = method.apply(this, arguments)

              var emit = function emit(x) {
                return trigger(_this.el, event, true, x)
              }

              if (result && result.then) {
                result.then(emit)
              } else {
                emit(result)
              }

              return result
            }
          }
        }

        var matches =
          documentElement.matches ||
          documentElement.webkitMatchesSelector ||
          documentElement.msMatchesSelector

        /**
         * Wires the class component of the name of the key to the property of the same name.
         *
         * Replaces the getter with the function which accesses the class-component of the given name.
         * @param name The class component name
         * @param selector The selector to access class component dom. Optional. Default is '.[name]'.
         * @param descriptor The method element descriptor
         */

        var wiredComponent = function wiredComponent(name, selector) {
          return function(descriptor) {
            var sel = selector || '.'.concat(name)
            var key = descriptor.key
            descriptor.placement = 'prototype'

            descriptor.finisher = function(constructor) {
              Object.defineProperty(constructor.prototype, key, {
                get: function get() {
                  check(
                    !!this.el,
                    "Component's element is not ready. Probably wired getter called at constructor.(class=[".concat(
                      this.constructor.name,
                      ']'
                    )
                  )

                  if (matches.call(this.el, sel)) {
                    return _get(name, this.el)
                  }

                  var nodes = this.el.querySelectorAll(sel)
                  check(
                    nodes.length > 0,
                    'wired component "'
                      .concat(name, '" is not available at ')
                      .concat(this.el.tagName, '(class=[')
                      .concat(this.constructor.name, ']')
                  )
                  return _get(name, nodes[0])
                }
              })
            }
          }
        }

        var wired = function wired(sel) {
          return function(descriptor) {
            var key = descriptor.key
            descriptor.placement = 'prototype'

            descriptor.finisher = function(constructor) {
              Object.defineProperty(constructor.prototype, key, {
                get: function get() {
                  return this.el.querySelector(sel)
                }
              })
            }
          }
        }

        var wiredAll = function wiredAll(sel) {
          return function(descriptor) {
            var key = descriptor.key
            descriptor.placement = 'prototype'

            descriptor.finisher = function(constructor) {
              Object.defineProperty(constructor.prototype, key, {
                get: function get() {
                  return this.el.querySelectorAll(sel)
                }
              })
            }
          }
        }

        wired.all = wiredAll
        wired.component = wiredComponent

        /**
         * The decorator for class component registration.
         *
         * if `name` is function, then use it as class itself and the component name is kebab-cased version of its name.
         * @param name The class name or the implementation class itself
         * @return The decorator if the class name is given, undefined if the implementation class is given
         */

        var component = function component(name) {
          check(!!name, 'Component name must be non-empty')
          return function(desc) {
            desc.finisher = function(Cls) {
              def(name, Cls)
            }
          }
        }

        /**
         * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
         */

        var notifies = function(event, selector) {
          return function(descriptor) {
            var key = descriptor.key
            var d = descriptor.descriptor
            var method = d.value

            descriptor.finisher = function(constructor) {
              check(
                !!event,
                'Unable to notify empty event: constructor='
                  .concat(constructor.name, ' key=')
                  .concat(key)
              )
            }

            d.value = function() {
              var _this = this

              var result = method.apply(this, arguments)
              var forEach = [].forEach

              var emit = function emit(x) {
                forEach.call(_this.el.querySelectorAll(selector), function(el) {
                  return trigger(el, event, false, x)
                })
              }

              if (result && result.then) {
                result.then(emit)
              } else {
                emit(result)
              }

              return result
            }
          }
        }

        on.useHandler = useHandler
        on.useHandler('click')

        var capsid = Object.freeze({
          def: def,
          prep: prep,
          make: make,
          mount: mount,
          unmount: unmount,
          get: _get,
          install: install$$1,
          on: on,
          emits: emits,
          wired: wired,
          component: component,
          notifies: notifies,
          __ccc__: ccc,
          pluginHooks: pluginHooks
        })

        exports.def = def
        exports.prep = prep
        exports.make = make
        exports.mount = mount
        exports.unmount = unmount
        exports.get = _get
        exports.install = install$$1
        exports.on = on
        exports.emits = emits
        exports.wired = wired
        exports.component = component
        exports.notifies = notifies
        exports.__ccc__ = ccc
        exports.pluginHooks = pluginHooks
      },
      {}
    ],
    3: [
      function(require, module, exports) {
        ;(function(process) {
          if (process.env.NODE_ENV === 'production') {
            module.exports = require('./dist/capsid-cjs')
          } else {
            module.exports = require('./dist/capsid-cjs.development')
          }
        }.call(this, require('_process')))
      },
      {
        './dist/capsid-cjs': 2,
        './dist/capsid-cjs.development': 1,
        _process: 8
      }
    ],
    4: [
      function(require, module, exports) {
        'use strict'

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || false
            descriptor.configurable = true
            if ('value' in descriptor) descriptor.writable = true
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps)
          if (staticProps) _defineProperties(Constructor, staticProps)
          return Constructor
        }

        /**
         * Returns the object from the given array which sutisfies the given predicate first.
         * @param {object[]} array The array to test
         * @param {Function} predicate The predicate
         */
        var _first = function first(array, predicate) {
          for (var i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
              return array[i]
            }
          }
        }
        /**
         * The collection model of HashRoutes.
         */

        var HashRouteCollection =
          /*#__PURE__*/
          (function() {
            function HashRouteCollection() {
              _classCallCheck(this, HashRouteCollection)

              this.routes = []
            }
            /**
             * @param {HashRoute}
             */

            _createClass(HashRouteCollection, [
              {
                key: 'add',
                value: function add(route) {
                  this.routes.push(route)
                }
                /**
                 * @param {object} obj The object
                 * @param {string} path The path
                 */
              },
              {
                key: 'dispatch',
                value: function dispatch(obj, path) {
                  var route = this.first(path)

                  if (route == null) {
                    return
                  }

                  route.dispatch(obj, path)
                }
              },
              {
                key: 'first',
                value: function first(path) {
                  return _first(this.routes, function(route) {
                    return route.test(path)
                  })
                }
              }
            ])

            return HashRouteCollection
          })()

        module.exports = HashRouteCollection
      },
      {}
    ],
    5: [
      function(require, module, exports) {
        'use strict'

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || false
            descriptor.configurable = true
            if ('value' in descriptor) descriptor.writable = true
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps)
          if (staticProps) _defineProperties(Constructor, staticProps)
          return Constructor
        }

        var pathToRegexp = require('path-to-regexp')
        /**
         * The route model.
         */

        var HashRoute =
          /*#__PURE__*/
          (function() {
            /**
             * @param {string} pattern The pattern string
             * @param {RegExp} re The regexp
             * @param {object[]} keys The key informations
             */
            function HashRoute(_ref) {
              var pattern = _ref.pattern,
                re = _ref.re,
                keys = _ref.keys,
                property = _ref.property

              _classCallCheck(this, HashRoute)

              this.pattern = pattern
              this.re = re
              this.keys = keys
              this.property = property
            }
            /**
             * Creates the hash route object from the given pattern and property name.
             * @param {string} pattern The route pattern
             * @param {string} property The property name
             */

            _createClass(
              HashRoute,
              [
                {
                  key: 'match',

                  /**
                   * Returns the params object if the path matches the pattern and returns null otherwise.
                   * @param {string} path The path to test
                   * @return {object}
                   */
                  value: function match(path) {
                    var result = {}
                    var match = path.match(this.re)

                    if (match == null) {
                      return null
                    }

                    this.keys.forEach(function(keyInfo, i) {
                      result[keyInfo.name] = match[i + 1]
                    })
                    return result
                  }
                  /**
                   * Tests if the path matches the route pattern.
                   * @param {string} path The path
                   * @return {boolean}
                   */
                },
                {
                  key: 'test',
                  value: function test(path) {
                    return this.re.test(path)
                  }
                  /**
                   * Dispatches the route with the given path.
                   * @param {string} path The path
                   */
                },
                {
                  key: 'dispatch',
                  value: function dispatch(obj, path) {
                    var params = this.match(path)
                    return obj[this.property](params, path, this)
                  }
                }
              ],
              [
                {
                  key: 'createFromPatternAndProperty',
                  value: function createFromPatternAndProperty(
                    pattern,
                    property
                  ) {
                    var keys = []
                    var re = pathToRegexp(pattern, keys)
                    return new HashRoute({
                      pattern: pattern,
                      re: re,
                      keys: keys,
                      property: property
                    })
                  }
                }
              ]
            )

            return HashRoute
          })()

        module.exports = HashRoute
      },
      { 'path-to-regexp': 7 }
    ],
    6: [
      function(require, module, exports) {
        'use strict'

        var HashRoute = require('./hash-route')

        var HashRouteCollection = require('./hash-route-collection')

        var routes
        /**
         * Resets the route info.
         */

        exports.reset = function() {
          routes = new HashRouteCollection()
        }

        exports.reset()
        /**
         * @param {Object} descriptor The element descriptor
         */

        exports.route = function(descriptor) {
          var key = descriptor.key
          routes.add(HashRoute.createFromPatternAndProperty(key, key))
        }
        /**
         * Dispatches the route.
         * @param {Object} obj The router methods host
         */

        exports.dispatch = function(obj, path) {
          path = path || location.hash
          routes.dispatch(obj, path)
        }
      },
      { './hash-route': 5, './hash-route-collection': 4 }
    ],
    7: [
      function(require, module, exports) {
        /**
         * Expose `pathToRegexp`.
         */
        module.exports = pathToRegexp
        module.exports.parse = parse
        module.exports.compile = compile
        module.exports.tokensToFunction = tokensToFunction
        module.exports.tokensToRegExp = tokensToRegExp

        /**
         * Default configs.
         */
        var DEFAULT_DELIMITER = '/'
        var DEFAULT_DELIMITERS = './'

        /**
         * The main path matching regexp utility.
         *
         * @type {RegExp}
         */
        var PATH_REGEXP = new RegExp(
          [
            // Match escaped characters that would otherwise appear in future matches.
            // This allows the user to escape special characters that won't transform.
            '(\\\\.)',
            // Match Express-style parameters and un-named parameters with a prefix
            // and optional suffixes. Matches appear as:
            //
            // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
            // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
            '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
          ].join('|'),
          'g'
        )

        /**
         * Parse a string for the raw tokens.
         *
         * @param  {string}  str
         * @param  {Object=} options
         * @return {!Array}
         */
        function parse(str, options) {
          var tokens = []
          var key = 0
          var index = 0
          var path = ''
          var defaultDelimiter =
            (options && options.delimiter) || DEFAULT_DELIMITER
          var delimiters = (options && options.delimiters) || DEFAULT_DELIMITERS
          var pathEscaped = false
          var res

          while ((res = PATH_REGEXP.exec(str)) !== null) {
            var m = res[0]
            var escaped = res[1]
            var offset = res.index
            path += str.slice(index, offset)
            index = offset + m.length

            // Ignore already escaped sequences.
            if (escaped) {
              path += escaped[1]
              pathEscaped = true
              continue
            }

            var prev = ''
            var next = str[index]
            var name = res[2]
            var capture = res[3]
            var group = res[4]
            var modifier = res[5]

            if (!pathEscaped && path.length) {
              var k = path.length - 1

              if (delimiters.indexOf(path[k]) > -1) {
                prev = path[k]
                path = path.slice(0, k)
              }
            }

            // Push the current path onto the tokens.
            if (path) {
              tokens.push(path)
              path = ''
              pathEscaped = false
            }

            var partial = prev !== '' && next !== undefined && next !== prev
            var repeat = modifier === '+' || modifier === '*'
            var optional = modifier === '?' || modifier === '*'
            var delimiter = prev || defaultDelimiter
            var pattern = capture || group

            tokens.push({
              name: name || key++,
              prefix: prev,
              delimiter: delimiter,
              optional: optional,
              repeat: repeat,
              partial: partial,
              pattern: pattern
                ? escapeGroup(pattern)
                : '[^' + escapeString(delimiter) + ']+?'
            })
          }

          // Push any remaining characters.
          if (path || index < str.length) {
            tokens.push(path + str.substr(index))
          }

          return tokens
        }

        /**
         * Compile a string to a template function for the path.
         *
         * @param  {string}             str
         * @param  {Object=}            options
         * @return {!function(Object=, Object=)}
         */
        function compile(str, options) {
          return tokensToFunction(parse(str, options))
        }

        /**
         * Expose a method for transforming tokens into the path function.
         */
        function tokensToFunction(tokens) {
          // Compile all the tokens into regexps.
          var matches = new Array(tokens.length)

          // Compile all the patterns before compilation.
          for (var i = 0; i < tokens.length; i++) {
            if (typeof tokens[i] === 'object') {
              matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
            }
          }

          return function(data, options) {
            var path = ''
            var encode = (options && options.encode) || encodeURIComponent

            for (var i = 0; i < tokens.length; i++) {
              var token = tokens[i]

              if (typeof token === 'string') {
                path += token
                continue
              }

              var value = data ? data[token.name] : undefined
              var segment

              if (Array.isArray(value)) {
                if (!token.repeat) {
                  throw new TypeError(
                    'Expected "' + token.name + '" to not repeat, but got array'
                  )
                }

                if (value.length === 0) {
                  if (token.optional) continue

                  throw new TypeError(
                    'Expected "' + token.name + '" to not be empty'
                  )
                }

                for (var j = 0; j < value.length; j++) {
                  segment = encode(value[j], token)

                  if (!matches[i].test(segment)) {
                    throw new TypeError(
                      'Expected all "' +
                        token.name +
                        '" to match "' +
                        token.pattern +
                        '"'
                    )
                  }

                  path += (j === 0 ? token.prefix : token.delimiter) + segment
                }

                continue
              }

              if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean'
              ) {
                segment = encode(String(value), token)

                if (!matches[i].test(segment)) {
                  throw new TypeError(
                    'Expected "' +
                      token.name +
                      '" to match "' +
                      token.pattern +
                      '", but got "' +
                      segment +
                      '"'
                  )
                }

                path += token.prefix + segment
                continue
              }

              if (token.optional) {
                // Prepend partial segment prefixes.
                if (token.partial) path += token.prefix

                continue
              }

              throw new TypeError(
                'Expected "' +
                  token.name +
                  '" to be ' +
                  (token.repeat ? 'an array' : 'a string')
              )
            }

            return path
          }
        }

        /**
         * Escape a regular expression string.
         *
         * @param  {string} str
         * @return {string}
         */
        function escapeString(str) {
          return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
        }

        /**
         * Escape the capturing group by escaping special characters and meaning.
         *
         * @param  {string} group
         * @return {string}
         */
        function escapeGroup(group) {
          return group.replace(/([=!:$/()])/g, '\\$1')
        }

        /**
         * Get the flags for a regexp from the options.
         *
         * @param  {Object} options
         * @return {string}
         */
        function flags(options) {
          return options && options.sensitive ? '' : 'i'
        }

        /**
         * Pull out keys from a regexp.
         *
         * @param  {!RegExp} path
         * @param  {Array=}  keys
         * @return {!RegExp}
         */
        function regexpToRegexp(path, keys) {
          if (!keys) return path

          // Use a negative lookahead to match only capturing groups.
          var groups = path.source.match(/\((?!\?)/g)

          if (groups) {
            for (var i = 0; i < groups.length; i++) {
              keys.push({
                name: i,
                prefix: null,
                delimiter: null,
                optional: false,
                repeat: false,
                partial: false,
                pattern: null
              })
            }
          }

          return path
        }

        /**
         * Transform an array into a regexp.
         *
         * @param  {!Array}  path
         * @param  {Array=}  keys
         * @param  {Object=} options
         * @return {!RegExp}
         */
        function arrayToRegexp(path, keys, options) {
          var parts = []

          for (var i = 0; i < path.length; i++) {
            parts.push(pathToRegexp(path[i], keys, options).source)
          }

          return new RegExp('(?:' + parts.join('|') + ')', flags(options))
        }

        /**
         * Create a path regexp from string input.
         *
         * @param  {string}  path
         * @param  {Array=}  keys
         * @param  {Object=} options
         * @return {!RegExp}
         */
        function stringToRegexp(path, keys, options) {
          return tokensToRegExp(parse(path, options), keys, options)
        }

        /**
         * Expose a function for taking tokens and returning a RegExp.
         *
         * @param  {!Array}  tokens
         * @param  {Array=}  keys
         * @param  {Object=} options
         * @return {!RegExp}
         */
        function tokensToRegExp(tokens, keys, options) {
          options = options || {}

          var strict = options.strict
          var start = options.start !== false
          var end = options.end !== false
          var delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER)
          var delimiters = options.delimiters || DEFAULT_DELIMITERS
          var endsWith = []
            .concat(options.endsWith || [])
            .map(escapeString)
            .concat('$')
            .join('|')
          var route = start ? '^' : ''
          var isEndDelimited = tokens.length === 0

          // Iterate over the tokens and create our regexp string.
          for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i]

            if (typeof token === 'string') {
              route += escapeString(token)
              isEndDelimited =
                i === tokens.length - 1 &&
                delimiters.indexOf(token[token.length - 1]) > -1
            } else {
              var capture = token.repeat
                ? '(?:' +
                  token.pattern +
                  ')(?:' +
                  escapeString(token.delimiter) +
                  '(?:' +
                  token.pattern +
                  '))*'
                : token.pattern

              if (keys) keys.push(token)

              if (token.optional) {
                if (token.partial) {
                  route += escapeString(token.prefix) + '(' + capture + ')?'
                } else {
                  route +=
                    '(?:' + escapeString(token.prefix) + '(' + capture + '))?'
                }
              } else {
                route += escapeString(token.prefix) + '(' + capture + ')'
              }
            }
          }

          if (end) {
            if (!strict) route += '(?:' + delimiter + ')?'

            route += endsWith === '$' ? '$' : '(?=' + endsWith + ')'
          } else {
            if (!strict) route += '(?:' + delimiter + '(?=' + endsWith + '))?'
            if (!isEndDelimited)
              route += '(?=' + delimiter + '|' + endsWith + ')'
          }

          return new RegExp(route, flags(options))
        }

        /**
         * Normalize the given path string, returning a regular expression.
         *
         * An empty array can be passed in for the keys, which will hold the
         * placeholder key descriptions. For example, using `/user/:id`, `keys` will
         * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
         *
         * @param  {(string|RegExp|Array)} path
         * @param  {Array=}                keys
         * @param  {Object=}               options
         * @return {!RegExp}
         */
        function pathToRegexp(path, keys, options) {
          if (path instanceof RegExp) {
            return regexpToRegexp(path, keys)
          }

          if (Array.isArray(path)) {
            return arrayToRegexp(/** @type {!Array} */ (path), keys, options)
          }

          return stringToRegexp(/** @type {string} */ (path), keys, options)
        }
      },
      {}
    ],
    8: [
      function(require, module, exports) {
        // shim for using process in browser
        var process = (module.exports = {})

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout
        var cachedClearTimeout

        function defaultSetTimout() {
          throw new Error('setTimeout has not been defined')
        }
        function defaultClearTimeout() {
          throw new Error('clearTimeout has not been defined')
        }
        ;(function() {
          try {
            if (typeof setTimeout === 'function') {
              cachedSetTimeout = setTimeout
            } else {
              cachedSetTimeout = defaultSetTimout
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout
          }
          try {
            if (typeof clearTimeout === 'function') {
              cachedClearTimeout = clearTimeout
            } else {
              cachedClearTimeout = defaultClearTimeout
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout
          }
        })()
        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0)
          }
          // if setTimeout wasn't available but was latter defined
          if (
            (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
            setTimeout
          ) {
            cachedSetTimeout = setTimeout
            return setTimeout(fun, 0)
          }
          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0)
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0)
            } catch (e) {
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0)
            }
          }
        }
        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker)
          }
          // if clearTimeout wasn't available but was latter defined
          if (
            (cachedClearTimeout === defaultClearTimeout ||
              !cachedClearTimeout) &&
            clearTimeout
          ) {
            cachedClearTimeout = clearTimeout
            return clearTimeout(marker)
          }
          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker)
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker)
            } catch (e) {
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker)
            }
          }
        }
        var queue = []
        var draining = false
        var currentQueue
        var queueIndex = -1

        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return
          }
          draining = false
          if (currentQueue.length) {
            queue = currentQueue.concat(queue)
          } else {
            queueIndex = -1
          }
          if (queue.length) {
            drainQueue()
          }
        }

        function drainQueue() {
          if (draining) {
            return
          }
          var timeout = runTimeout(cleanUpNextTick)
          draining = true

          var len = queue.length
          while (len) {
            currentQueue = queue
            queue = []
            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run()
              }
            }
            queueIndex = -1
            len = queue.length
          }
          currentQueue = null
          draining = false
          runClearTimeout(timeout)
        }

        process.nextTick = function(fun) {
          var args = new Array(arguments.length - 1)
          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i]
            }
          }
          queue.push(new Item(fun, args))
          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue)
          }
        }

        // v8 likes predictible objects
        function Item(fun, array) {
          this.fun = fun
          this.array = array
        }
        Item.prototype.run = function() {
          this.fun.apply(null, this.array)
        }
        process.title = 'browser'
        process.browser = true
        process.env = {}
        process.argv = []
        process.version = '' // empty string to avoid regexp issues
        process.versions = {}

        function noop() {}

        process.on = noop
        process.addListener = noop
        process.once = noop
        process.off = noop
        process.removeListener = noop
        process.removeAllListeners = noop
        process.emit = noop
        process.prependListener = noop
        process.prependOnceListener = noop

        process.listeners = function(name) {
          return []
        }

        process.binding = function(name) {
          throw new Error('process.binding is not supported')
        }

        process.cwd = function() {
          return '/'
        }
        process.chdir = function(dir) {
          throw new Error('process.chdir is not supported')
        }
        process.umask = function() {
          return 0
        }
      },
      {}
    ],
    9: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _decorate(decorators, factory, superClass) {
          var r = factory(function initialize(O) {
            _initializeInstanceElements(O, decorated.elements)
          }, superClass)
          var decorated = _decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
          )
          _initializeClassElements(r.F, decorated.elements)
          return _runClassFinishers(r.F, decorated.finishers)
        }

        function _createElementDescriptor(def) {
          var key = _toPropertyKey(def.key)
          var descriptor
          if (def.kind === 'method') {
            descriptor = {
              value: def.value,
              writable: true,
              configurable: true,
              enumerable: false
            }
            Object.defineProperty(def.value, 'name', {
              value: _typeof(key) === 'symbol' ? '' : key,
              configurable: true
            })
          } else if (def.kind === 'get') {
            descriptor = {
              get: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'set') {
            descriptor = {
              set: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'field') {
            descriptor = {
              configurable: true,
              writable: true,
              enumerable: true
            }
          }
          var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static
              ? 'static'
              : def.kind === 'field'
                ? 'own'
                : 'prototype',
            descriptor: descriptor
          }
          if (def.decorators) element.decorators = def.decorators
          if (def.kind === 'field') element.initializer = def.value
          return element
        }

        function _coalesceGetterSetter(element, other) {
          if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get
          } else {
            other.descriptor.set = element.descriptor.set
          }
        }

        function _coalesceClassElements(elements) {
          var newElements = []
          var isSameElement = function isSameElement(other) {
            return (
              other.kind === 'method' &&
              other.key === element.key &&
              other.placement === element.placement
            )
          }
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            var other
            if (
              element.kind === 'method' &&
              (other = newElements.find(isSameElement))
            ) {
              if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
              ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                  throw new ReferenceError(
                    'Duplicated methods (' +
                      element.key +
                      ") can't be decorated."
                  )
                }
                other.descriptor = element.descriptor
              } else {
                if (_hasDecorators(element)) {
                  if (_hasDecorators(other)) {
                    throw new ReferenceError(
                      "Decorators can't be placed on different accessors with for " +
                        'the same property (' +
                        element.key +
                        ').'
                    )
                  }
                  other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
              }
            } else {
              newElements.push(element)
            }
          }
          return newElements
        }

        function _hasDecorators(element) {
          return element.decorators && element.decorators.length
        }

        function _isDataDescriptor(desc) {
          return (
            desc !== undefined &&
            !(desc.value === undefined && desc.writable === undefined)
          )
        }

        function _initializeClassElements(F, elements) {
          var proto = F.prototype
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              var placement = element.placement
              if (
                element.kind === kind &&
                (placement === 'static' || placement === 'prototype')
              ) {
                var receiver = placement === 'static' ? F : proto
                _defineClassElement(receiver, element)
              }
            })
          })
        }

        function _initializeInstanceElements(O, elements) {
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              if (element.kind === kind && element.placement === 'own') {
                _defineClassElement(O, element)
              }
            })
          })
        }

        function _defineClassElement(receiver, element) {
          var descriptor = element.descriptor
          if (element.kind === 'field') {
            var initializer = element.initializer
            descriptor = {
              enumerable: descriptor.enumerable,
              writable: descriptor.writable,
              configurable: descriptor.configurable,
              value:
                initializer === void 0 ? void 0 : initializer.call(receiver)
            }
          }
          Object.defineProperty(receiver, element.key, descriptor)
        }

        function _decorateClass(elements, decorators) {
          var newElements = []
          var finishers = []
          var placements = { static: [], prototype: [], own: [] }
          elements.forEach(function(element) {
            _addElementPlacement(element, placements)
          })
          elements.forEach(function(element) {
            if (!_hasDecorators(element)) return newElements.push(element)
            var elementFinishersExtras = _decorateElement(element, placements)
            newElements.push(elementFinishersExtras.element)
            newElements.push.apply(newElements, elementFinishersExtras.extras)
            finishers.push.apply(finishers, elementFinishersExtras.finishers)
          })
          if (!decorators) {
            return { elements: newElements, finishers: finishers }
          }
          var result = _decorateConstructor(newElements, decorators)
          finishers.push.apply(finishers, result.finishers)
          result.finishers = finishers
          return result
        }

        function _addElementPlacement(element, placements, silent) {
          var keys = placements[element.placement]
          if (!silent && keys.indexOf(element.key) !== -1) {
            throw new TypeError('Duplicated element (' + element.key + ')')
          }
          keys.push(element.key)
        }

        function _decorateElement(element, placements) {
          var extras = []
          var finishers = []
          for (
            var decorators = element.decorators, i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var keys = placements[element.placement]
            keys.splice(keys.indexOf(element.key), 1)
            var elementObject = _fromElementDescriptor(element)
            var elementFinisherExtras = _toElementFinisherExtras(
              (0, decorators[i])(elementObject) || elementObject
            )
            element = elementFinisherExtras.element
            _addElementPlacement(element, placements)
            if (elementFinisherExtras.finisher) {
              finishers.push(elementFinisherExtras.finisher)
            }
            var newExtras = elementFinisherExtras.extras
            if (newExtras) {
              for (var j = 0; j < newExtras.length; j++) {
                _addElementPlacement(newExtras[j], placements)
              }
              extras.push.apply(extras, newExtras)
            }
          }
          return { element: element, finishers: finishers, extras: extras }
        }

        function _decorateConstructor(elements, decorators) {
          var finishers = []
          for (var i = decorators.length - 1; i >= 0; i--) {
            var obj = _fromClassDescriptor(elements)
            var elementsAndFinisher = _toClassDescriptor(
              (0, decorators[i])(obj) || obj
            )
            if (elementsAndFinisher.finisher !== undefined) {
              finishers.push(elementsAndFinisher.finisher)
            }
            if (elementsAndFinisher.elements !== undefined) {
              elements = elementsAndFinisher.elements
              for (var j = 0; j < elements.length - 1; j++) {
                for (var k = j + 1; k < elements.length; k++) {
                  if (
                    elements[j].key === elements[k].key &&
                    elements[j].placement === elements[k].placement
                  ) {
                    throw new TypeError(
                      'Duplicated element (' + elements[j].key + ')'
                    )
                  }
                }
              }
            }
          }
          return { elements: elements, finishers: finishers }
        }

        function _fromElementDescriptor(element) {
          var obj = {
            kind: element.kind,
            key: element.key,
            placement: element.placement,
            descriptor: element.descriptor
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          if (element.kind === 'field') obj.initializer = element.initializer
          return obj
        }

        function _toElementDescriptors(elementObjects) {
          if (elementObjects === undefined) return
          return _toArray(elementObjects).map(function(elementObject) {
            var element = _toElementDescriptor(elementObject)
            _disallowProperty(
              elementObject,
              'finisher',
              'An element descriptor'
            )
            _disallowProperty(elementObject, 'extras', 'An element descriptor')
            return element
          })
        }

        function _toElementDescriptor(elementObject) {
          var kind = String(elementObject.kind)
          if (kind !== 'method' && kind !== 'field') {
            throw new TypeError(
              'An element descriptor\'s .kind property must be either "method" or' +
                ' "field", but a decorator created an element descriptor with' +
                ' .kind "' +
                kind +
                '"'
            )
          }
          var key = _toPropertyKey(elementObject.key)
          var placement = String(elementObject.placement)
          if (
            placement !== 'static' &&
            placement !== 'prototype' &&
            placement !== 'own'
          ) {
            throw new TypeError(
              'An element descriptor\'s .placement property must be one of "static",' +
                ' "prototype" or "own", but a decorator created an element descriptor' +
                ' with .placement "' +
                placement +
                '"'
            )
          }
          var descriptor = elementObject.descriptor
          _disallowProperty(elementObject, 'elements', 'An element descriptor')
          var element = {
            kind: kind,
            key: key,
            placement: placement,
            descriptor: Object.assign({}, descriptor)
          }
          if (kind !== 'field') {
            _disallowProperty(
              elementObject,
              'initializer',
              'A method descriptor'
            )
          } else {
            _disallowProperty(
              descriptor,
              'get',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'set',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'value',
              'The property descriptor of a field descriptor'
            )
            element.initializer = elementObject.initializer
          }
          return element
        }

        function _toElementFinisherExtras(elementObject) {
          var element = _toElementDescriptor(elementObject)
          var finisher = _optionalCallableProperty(elementObject, 'finisher')
          var extras = _toElementDescriptors(elementObject.extras)
          return { element: element, finisher: finisher, extras: extras }
        }

        function _fromClassDescriptor(elements) {
          var obj = {
            kind: 'class',
            elements: elements.map(_fromElementDescriptor)
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          return obj
        }

        function _toClassDescriptor(obj) {
          var kind = String(obj.kind)
          if (kind !== 'class') {
            throw new TypeError(
              'A class descriptor\'s .kind property must be "class", but a decorator' +
                ' created a class descriptor with .kind "' +
                kind +
                '"'
            )
          }
          _disallowProperty(obj, 'key', 'A class descriptor')
          _disallowProperty(obj, 'placement', 'A class descriptor')
          _disallowProperty(obj, 'descriptor', 'A class descriptor')
          _disallowProperty(obj, 'initializer', 'A class descriptor')
          _disallowProperty(obj, 'extras', 'A class descriptor')
          var finisher = _optionalCallableProperty(obj, 'finisher')
          var elements = _toElementDescriptors(obj.elements)
          return { elements: elements, finisher: finisher }
        }

        function _disallowProperty(obj, name, objectType) {
          if (obj[name] !== undefined) {
            throw new TypeError(
              objectType + " can't have a ." + name + ' property.'
            )
          }
        }

        function _optionalCallableProperty(obj, name) {
          var value = obj[name]
          if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function")
          }
          return value
        }

        function _runClassFinishers(constructor, finishers) {
          for (var i = 0; i < finishers.length; i++) {
            var newConstructor = (0, finishers[i])(constructor)
            if (newConstructor !== undefined) {
              if (typeof newConstructor !== 'function') {
                throw new TypeError('Finishers must return a constructor.')
              }
              constructor = newConstructor
            }
          }
          return constructor
        }

        function _toPropertyKey(arg) {
          var key = _toPrimitive(arg, 'string')
          return _typeof(key) === 'symbol' ? key : String(key)
        }

        function _toPrimitive(input, hint) {
          if (_typeof(input) !== 'object' || input === null) return input
          var prim = input[Symbol.toPrimitive]
          if (prim !== undefined) {
            var res = prim.call(input, hint || 'default')
            if (_typeof(res) !== 'object') return res
            throw new TypeError('@@toPrimitive must return a primitive value.')
          }
          return (hint === 'string' ? String : Number)(input)
        }

        function _toArray(arr) {
          return (
            _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
          )
        }

        function _nonIterableRest() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }

        function _iterableToArray(iter) {
          if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
          )
            return Array.from(iter)
        }

        function _arrayWithHoles(arr) {
          if (Array.isArray(arr)) return arr
        }

        var _require = require('../const'),
          KEYCODE = _require.KEYCODE,
          EDIT_TODO = _require.ACTION.EDIT_TODO

        var _require2 = require('capsid'),
          emits = _require2.emits,
          on = _require2.on,
          component = _require2.component
        /**
         * TodoEdit controls the edit area of each todo item.
         */

        var Edit = _decorate([component('edit')], function(_initialize) {
          var Edit = function Edit() {
            _classCallCheck(this, Edit)

            _initialize(this)
          }

          return {
            F: Edit,
            d: [
              {
                kind: 'method',
                key: 'onStart',
                value: function value() {
                  this.el.focus()
                }
              },
              {
                kind: 'method',
                key: 'onUpdate',
                value: function value(_value) {
                  this.el.value = _value
                  this.el.dataset.prevValue = _value
                }
              },
              {
                kind: 'method',
                decorators: [on('keypress'), on('keydown')],
                key: 'onKeypress',
                value: function value(e) {
                  if (e.which === KEYCODE.ENTER) {
                    this.onFinish()
                  } else if (e.which === KEYCODE.ESCAPE) {
                    this.onCancel()
                  }
                }
              },
              {
                kind: 'method',
                decorators: [on('blur'), emits(EDIT_TODO)],
                key: 'onFinish',
                value: function value() {
                  var value = this.el.value
                  this.onUpdate(value)
                  return value
                }
              },
              {
                kind: 'method',
                decorators: [emits(EDIT_TODO)],
                key: 'onCancel',
                value: function value() {
                  var value = this.el.dataset.prevValue
                  this.onUpdate(value)
                  return value
                }
              }
            ]
          }
        })

        module.exports = Edit
      },
      { '../const': 16, capsid: 3 }
    ],
    10: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _decorate(decorators, factory, superClass) {
          var r = factory(function initialize(O) {
            _initializeInstanceElements(O, decorated.elements)
          }, superClass)
          var decorated = _decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
          )
          _initializeClassElements(r.F, decorated.elements)
          return _runClassFinishers(r.F, decorated.finishers)
        }

        function _createElementDescriptor(def) {
          var key = _toPropertyKey(def.key)
          var descriptor
          if (def.kind === 'method') {
            descriptor = {
              value: def.value,
              writable: true,
              configurable: true,
              enumerable: false
            }
            Object.defineProperty(def.value, 'name', {
              value: _typeof(key) === 'symbol' ? '' : key,
              configurable: true
            })
          } else if (def.kind === 'get') {
            descriptor = {
              get: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'set') {
            descriptor = {
              set: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'field') {
            descriptor = {
              configurable: true,
              writable: true,
              enumerable: true
            }
          }
          var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static
              ? 'static'
              : def.kind === 'field'
                ? 'own'
                : 'prototype',
            descriptor: descriptor
          }
          if (def.decorators) element.decorators = def.decorators
          if (def.kind === 'field') element.initializer = def.value
          return element
        }

        function _coalesceGetterSetter(element, other) {
          if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get
          } else {
            other.descriptor.set = element.descriptor.set
          }
        }

        function _coalesceClassElements(elements) {
          var newElements = []
          var isSameElement = function isSameElement(other) {
            return (
              other.kind === 'method' &&
              other.key === element.key &&
              other.placement === element.placement
            )
          }
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            var other
            if (
              element.kind === 'method' &&
              (other = newElements.find(isSameElement))
            ) {
              if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
              ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                  throw new ReferenceError(
                    'Duplicated methods (' +
                      element.key +
                      ") can't be decorated."
                  )
                }
                other.descriptor = element.descriptor
              } else {
                if (_hasDecorators(element)) {
                  if (_hasDecorators(other)) {
                    throw new ReferenceError(
                      "Decorators can't be placed on different accessors with for " +
                        'the same property (' +
                        element.key +
                        ').'
                    )
                  }
                  other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
              }
            } else {
              newElements.push(element)
            }
          }
          return newElements
        }

        function _hasDecorators(element) {
          return element.decorators && element.decorators.length
        }

        function _isDataDescriptor(desc) {
          return (
            desc !== undefined &&
            !(desc.value === undefined && desc.writable === undefined)
          )
        }

        function _initializeClassElements(F, elements) {
          var proto = F.prototype
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              var placement = element.placement
              if (
                element.kind === kind &&
                (placement === 'static' || placement === 'prototype')
              ) {
                var receiver = placement === 'static' ? F : proto
                _defineClassElement(receiver, element)
              }
            })
          })
        }

        function _initializeInstanceElements(O, elements) {
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              if (element.kind === kind && element.placement === 'own') {
                _defineClassElement(O, element)
              }
            })
          })
        }

        function _defineClassElement(receiver, element) {
          var descriptor = element.descriptor
          if (element.kind === 'field') {
            var initializer = element.initializer
            descriptor = {
              enumerable: descriptor.enumerable,
              writable: descriptor.writable,
              configurable: descriptor.configurable,
              value:
                initializer === void 0 ? void 0 : initializer.call(receiver)
            }
          }
          Object.defineProperty(receiver, element.key, descriptor)
        }

        function _decorateClass(elements, decorators) {
          var newElements = []
          var finishers = []
          var placements = { static: [], prototype: [], own: [] }
          elements.forEach(function(element) {
            _addElementPlacement(element, placements)
          })
          elements.forEach(function(element) {
            if (!_hasDecorators(element)) return newElements.push(element)
            var elementFinishersExtras = _decorateElement(element, placements)
            newElements.push(elementFinishersExtras.element)
            newElements.push.apply(newElements, elementFinishersExtras.extras)
            finishers.push.apply(finishers, elementFinishersExtras.finishers)
          })
          if (!decorators) {
            return { elements: newElements, finishers: finishers }
          }
          var result = _decorateConstructor(newElements, decorators)
          finishers.push.apply(finishers, result.finishers)
          result.finishers = finishers
          return result
        }

        function _addElementPlacement(element, placements, silent) {
          var keys = placements[element.placement]
          if (!silent && keys.indexOf(element.key) !== -1) {
            throw new TypeError('Duplicated element (' + element.key + ')')
          }
          keys.push(element.key)
        }

        function _decorateElement(element, placements) {
          var extras = []
          var finishers = []
          for (
            var decorators = element.decorators, i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var keys = placements[element.placement]
            keys.splice(keys.indexOf(element.key), 1)
            var elementObject = _fromElementDescriptor(element)
            var elementFinisherExtras = _toElementFinisherExtras(
              (0, decorators[i])(elementObject) || elementObject
            )
            element = elementFinisherExtras.element
            _addElementPlacement(element, placements)
            if (elementFinisherExtras.finisher) {
              finishers.push(elementFinisherExtras.finisher)
            }
            var newExtras = elementFinisherExtras.extras
            if (newExtras) {
              for (var j = 0; j < newExtras.length; j++) {
                _addElementPlacement(newExtras[j], placements)
              }
              extras.push.apply(extras, newExtras)
            }
          }
          return { element: element, finishers: finishers, extras: extras }
        }

        function _decorateConstructor(elements, decorators) {
          var finishers = []
          for (var i = decorators.length - 1; i >= 0; i--) {
            var obj = _fromClassDescriptor(elements)
            var elementsAndFinisher = _toClassDescriptor(
              (0, decorators[i])(obj) || obj
            )
            if (elementsAndFinisher.finisher !== undefined) {
              finishers.push(elementsAndFinisher.finisher)
            }
            if (elementsAndFinisher.elements !== undefined) {
              elements = elementsAndFinisher.elements
              for (var j = 0; j < elements.length - 1; j++) {
                for (var k = j + 1; k < elements.length; k++) {
                  if (
                    elements[j].key === elements[k].key &&
                    elements[j].placement === elements[k].placement
                  ) {
                    throw new TypeError(
                      'Duplicated element (' + elements[j].key + ')'
                    )
                  }
                }
              }
            }
          }
          return { elements: elements, finishers: finishers }
        }

        function _fromElementDescriptor(element) {
          var obj = {
            kind: element.kind,
            key: element.key,
            placement: element.placement,
            descriptor: element.descriptor
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          if (element.kind === 'field') obj.initializer = element.initializer
          return obj
        }

        function _toElementDescriptors(elementObjects) {
          if (elementObjects === undefined) return
          return _toArray(elementObjects).map(function(elementObject) {
            var element = _toElementDescriptor(elementObject)
            _disallowProperty(
              elementObject,
              'finisher',
              'An element descriptor'
            )
            _disallowProperty(elementObject, 'extras', 'An element descriptor')
            return element
          })
        }

        function _toElementDescriptor(elementObject) {
          var kind = String(elementObject.kind)
          if (kind !== 'method' && kind !== 'field') {
            throw new TypeError(
              'An element descriptor\'s .kind property must be either "method" or' +
                ' "field", but a decorator created an element descriptor with' +
                ' .kind "' +
                kind +
                '"'
            )
          }
          var key = _toPropertyKey(elementObject.key)
          var placement = String(elementObject.placement)
          if (
            placement !== 'static' &&
            placement !== 'prototype' &&
            placement !== 'own'
          ) {
            throw new TypeError(
              'An element descriptor\'s .placement property must be one of "static",' +
                ' "prototype" or "own", but a decorator created an element descriptor' +
                ' with .placement "' +
                placement +
                '"'
            )
          }
          var descriptor = elementObject.descriptor
          _disallowProperty(elementObject, 'elements', 'An element descriptor')
          var element = {
            kind: kind,
            key: key,
            placement: placement,
            descriptor: Object.assign({}, descriptor)
          }
          if (kind !== 'field') {
            _disallowProperty(
              elementObject,
              'initializer',
              'A method descriptor'
            )
          } else {
            _disallowProperty(
              descriptor,
              'get',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'set',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'value',
              'The property descriptor of a field descriptor'
            )
            element.initializer = elementObject.initializer
          }
          return element
        }

        function _toElementFinisherExtras(elementObject) {
          var element = _toElementDescriptor(elementObject)
          var finisher = _optionalCallableProperty(elementObject, 'finisher')
          var extras = _toElementDescriptors(elementObject.extras)
          return { element: element, finisher: finisher, extras: extras }
        }

        function _fromClassDescriptor(elements) {
          var obj = {
            kind: 'class',
            elements: elements.map(_fromElementDescriptor)
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          return obj
        }

        function _toClassDescriptor(obj) {
          var kind = String(obj.kind)
          if (kind !== 'class') {
            throw new TypeError(
              'A class descriptor\'s .kind property must be "class", but a decorator' +
                ' created a class descriptor with .kind "' +
                kind +
                '"'
            )
          }
          _disallowProperty(obj, 'key', 'A class descriptor')
          _disallowProperty(obj, 'placement', 'A class descriptor')
          _disallowProperty(obj, 'descriptor', 'A class descriptor')
          _disallowProperty(obj, 'initializer', 'A class descriptor')
          _disallowProperty(obj, 'extras', 'A class descriptor')
          var finisher = _optionalCallableProperty(obj, 'finisher')
          var elements = _toElementDescriptors(obj.elements)
          return { elements: elements, finisher: finisher }
        }

        function _disallowProperty(obj, name, objectType) {
          if (obj[name] !== undefined) {
            throw new TypeError(
              objectType + " can't have a ." + name + ' property.'
            )
          }
        }

        function _optionalCallableProperty(obj, name) {
          var value = obj[name]
          if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function")
          }
          return value
        }

        function _runClassFinishers(constructor, finishers) {
          for (var i = 0; i < finishers.length; i++) {
            var newConstructor = (0, finishers[i])(constructor)
            if (newConstructor !== undefined) {
              if (typeof newConstructor !== 'function') {
                throw new TypeError('Finishers must return a constructor.')
              }
              constructor = newConstructor
            }
          }
          return constructor
        }

        function _toPropertyKey(arg) {
          var key = _toPrimitive(arg, 'string')
          return _typeof(key) === 'symbol' ? key : String(key)
        }

        function _toPrimitive(input, hint) {
          if (_typeof(input) !== 'object' || input === null) return input
          var prim = input[Symbol.toPrimitive]
          if (prim !== undefined) {
            var res = prim.call(input, hint || 'default')
            if (_typeof(res) !== 'object') return res
            throw new TypeError('@@toPrimitive must return a primitive value.')
          }
          return (hint === 'string' ? String : Number)(input)
        }

        function _toArray(arr) {
          return (
            _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
          )
        }

        function _nonIterableRest() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }

        function _iterableToArray(iter) {
          if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
          )
            return Array.from(iter)
        }

        function _arrayWithHoles(arr) {
          if (Array.isArray(arr)) return arr
        }

        var _require = require('../domain'),
          Filter = _require.Filter

        var _require2 = require('../const'),
          _require2$ACTION = _require2.ACTION,
          MODEL_UPDATE = _require2$ACTION.MODEL_UPDATE,
          CLEAR_COMPLETED = _require2$ACTION.CLEAR_COMPLETED

        var _require3 = require('capsid'),
          on = _require3.on,
          emits = _require3.emits,
          wired = _require3.wired,
          component = _require3.component

        var Footer = _decorate([component('footer')], function(_initialize) {
          var Footer = function Footer() {
            _classCallCheck(this, Footer)

            _initialize(this)
          }

          return {
            F: Footer,
            d: [
              {
                kind: 'field',
                decorators: [wired('.clear-completed')],
                key: 'clearCompletedButton',
                value: void 0
              },
              {
                kind: 'field',
                decorators: [wired('a[href="#/active"]')],
                key: 'activeFilterButton',
                value: void 0
              },
              {
                kind: 'field',
                decorators: [wired('a[href="#/completed"]')],
                key: 'completedFilterButton',
                value: void 0
              },
              {
                kind: 'field',
                decorators: [wired('a[href="#/"]')],
                key: 'allFilterButton',
                value: void 0
              },
              {
                kind: 'field',
                decorators: [wired('.todo-count')],
                key: 'todoCountLabel',
                value: void 0
              },
              {
                kind: 'method',
                decorators: [
                  on('click', {
                    at: '.clear-completed'
                  }),
                  emits(CLEAR_COMPLETED)
                ],
                key: 'clearCompletedTodos',
                value: function value() {}
              },
              {
                kind: 'method',
                decorators: [on(MODEL_UPDATE)],
                key: 'onUpdate',
                value: function value(_ref) {
                  var _ref$detail = _ref.detail,
                    todoCollection = _ref$detail.todoCollection,
                    filter = _ref$detail.filter
                  var countLeft = todoCollection.uncompleted().length
                  this.clearCompletedButton.style.display = todoCollection
                    .completed()
                    .isEmpty()
                    ? 'none'
                    : 'inline'
                  this.activeFilterButton.classList.toggle(
                    'selected',
                    filter === Filter.ACTIVE
                  )
                  this.completedFilterButton.classList.toggle(
                    'selected',
                    filter === Filter.COMPLETED
                  )
                  this.allFilterButton.classList.toggle(
                    'selected',
                    filter === Filter.ALL
                  )
                  this.todoCountLabel.innerHTML = '<strong>'
                    .concat(countLeft, ' item')
                    .concat(countLeft === 1 ? '' : 's', ' left</strong>')
                  this.el.style.display = todoCollection.isEmpty()
                    ? 'none'
                    : 'block'
                }
              }
            ]
          }
        })

        module.exports = Footer
      },
      { '../const': 16, '../domain': 18, capsid: 3 }
    ],
    11: [
      function(require, module, exports) {
        'use strict'

        require('./todo-item')

        require('./new-todo')

        require('./todo-list')

        require('./main')

        require('./edit')

        require('./footer')
      },
      {
        './edit': 9,
        './footer': 10,
        './main': 12,
        './new-todo': 13,
        './todo-item': 14,
        './todo-list': 15
      }
    ],
    12: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _decorate(decorators, factory, superClass) {
          var r = factory(function initialize(O) {
            _initializeInstanceElements(O, decorated.elements)
          }, superClass)
          var decorated = _decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
          )
          _initializeClassElements(r.F, decorated.elements)
          return _runClassFinishers(r.F, decorated.finishers)
        }

        function _createElementDescriptor(def) {
          var key = _toPropertyKey(def.key)
          var descriptor
          if (def.kind === 'method') {
            descriptor = {
              value: def.value,
              writable: true,
              configurable: true,
              enumerable: false
            }
            Object.defineProperty(def.value, 'name', {
              value: _typeof(key) === 'symbol' ? '' : key,
              configurable: true
            })
          } else if (def.kind === 'get') {
            descriptor = {
              get: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'set') {
            descriptor = {
              set: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'field') {
            descriptor = {
              configurable: true,
              writable: true,
              enumerable: true
            }
          }
          var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static
              ? 'static'
              : def.kind === 'field'
                ? 'own'
                : 'prototype',
            descriptor: descriptor
          }
          if (def.decorators) element.decorators = def.decorators
          if (def.kind === 'field') element.initializer = def.value
          return element
        }

        function _coalesceGetterSetter(element, other) {
          if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get
          } else {
            other.descriptor.set = element.descriptor.set
          }
        }

        function _coalesceClassElements(elements) {
          var newElements = []
          var isSameElement = function isSameElement(other) {
            return (
              other.kind === 'method' &&
              other.key === element.key &&
              other.placement === element.placement
            )
          }
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            var other
            if (
              element.kind === 'method' &&
              (other = newElements.find(isSameElement))
            ) {
              if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
              ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                  throw new ReferenceError(
                    'Duplicated methods (' +
                      element.key +
                      ") can't be decorated."
                  )
                }
                other.descriptor = element.descriptor
              } else {
                if (_hasDecorators(element)) {
                  if (_hasDecorators(other)) {
                    throw new ReferenceError(
                      "Decorators can't be placed on different accessors with for " +
                        'the same property (' +
                        element.key +
                        ').'
                    )
                  }
                  other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
              }
            } else {
              newElements.push(element)
            }
          }
          return newElements
        }

        function _hasDecorators(element) {
          return element.decorators && element.decorators.length
        }

        function _isDataDescriptor(desc) {
          return (
            desc !== undefined &&
            !(desc.value === undefined && desc.writable === undefined)
          )
        }

        function _initializeClassElements(F, elements) {
          var proto = F.prototype
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              var placement = element.placement
              if (
                element.kind === kind &&
                (placement === 'static' || placement === 'prototype')
              ) {
                var receiver = placement === 'static' ? F : proto
                _defineClassElement(receiver, element)
              }
            })
          })
        }

        function _initializeInstanceElements(O, elements) {
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              if (element.kind === kind && element.placement === 'own') {
                _defineClassElement(O, element)
              }
            })
          })
        }

        function _defineClassElement(receiver, element) {
          var descriptor = element.descriptor
          if (element.kind === 'field') {
            var initializer = element.initializer
            descriptor = {
              enumerable: descriptor.enumerable,
              writable: descriptor.writable,
              configurable: descriptor.configurable,
              value:
                initializer === void 0 ? void 0 : initializer.call(receiver)
            }
          }
          Object.defineProperty(receiver, element.key, descriptor)
        }

        function _decorateClass(elements, decorators) {
          var newElements = []
          var finishers = []
          var placements = { static: [], prototype: [], own: [] }
          elements.forEach(function(element) {
            _addElementPlacement(element, placements)
          })
          elements.forEach(function(element) {
            if (!_hasDecorators(element)) return newElements.push(element)
            var elementFinishersExtras = _decorateElement(element, placements)
            newElements.push(elementFinishersExtras.element)
            newElements.push.apply(newElements, elementFinishersExtras.extras)
            finishers.push.apply(finishers, elementFinishersExtras.finishers)
          })
          if (!decorators) {
            return { elements: newElements, finishers: finishers }
          }
          var result = _decorateConstructor(newElements, decorators)
          finishers.push.apply(finishers, result.finishers)
          result.finishers = finishers
          return result
        }

        function _addElementPlacement(element, placements, silent) {
          var keys = placements[element.placement]
          if (!silent && keys.indexOf(element.key) !== -1) {
            throw new TypeError('Duplicated element (' + element.key + ')')
          }
          keys.push(element.key)
        }

        function _decorateElement(element, placements) {
          var extras = []
          var finishers = []
          for (
            var decorators = element.decorators, i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var keys = placements[element.placement]
            keys.splice(keys.indexOf(element.key), 1)
            var elementObject = _fromElementDescriptor(element)
            var elementFinisherExtras = _toElementFinisherExtras(
              (0, decorators[i])(elementObject) || elementObject
            )
            element = elementFinisherExtras.element
            _addElementPlacement(element, placements)
            if (elementFinisherExtras.finisher) {
              finishers.push(elementFinisherExtras.finisher)
            }
            var newExtras = elementFinisherExtras.extras
            if (newExtras) {
              for (var j = 0; j < newExtras.length; j++) {
                _addElementPlacement(newExtras[j], placements)
              }
              extras.push.apply(extras, newExtras)
            }
          }
          return { element: element, finishers: finishers, extras: extras }
        }

        function _decorateConstructor(elements, decorators) {
          var finishers = []
          for (var i = decorators.length - 1; i >= 0; i--) {
            var obj = _fromClassDescriptor(elements)
            var elementsAndFinisher = _toClassDescriptor(
              (0, decorators[i])(obj) || obj
            )
            if (elementsAndFinisher.finisher !== undefined) {
              finishers.push(elementsAndFinisher.finisher)
            }
            if (elementsAndFinisher.elements !== undefined) {
              elements = elementsAndFinisher.elements
              for (var j = 0; j < elements.length - 1; j++) {
                for (var k = j + 1; k < elements.length; k++) {
                  if (
                    elements[j].key === elements[k].key &&
                    elements[j].placement === elements[k].placement
                  ) {
                    throw new TypeError(
                      'Duplicated element (' + elements[j].key + ')'
                    )
                  }
                }
              }
            }
          }
          return { elements: elements, finishers: finishers }
        }

        function _fromElementDescriptor(element) {
          var obj = {
            kind: element.kind,
            key: element.key,
            placement: element.placement,
            descriptor: element.descriptor
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          if (element.kind === 'field') obj.initializer = element.initializer
          return obj
        }

        function _toElementDescriptors(elementObjects) {
          if (elementObjects === undefined) return
          return _toArray(elementObjects).map(function(elementObject) {
            var element = _toElementDescriptor(elementObject)
            _disallowProperty(
              elementObject,
              'finisher',
              'An element descriptor'
            )
            _disallowProperty(elementObject, 'extras', 'An element descriptor')
            return element
          })
        }

        function _toElementDescriptor(elementObject) {
          var kind = String(elementObject.kind)
          if (kind !== 'method' && kind !== 'field') {
            throw new TypeError(
              'An element descriptor\'s .kind property must be either "method" or' +
                ' "field", but a decorator created an element descriptor with' +
                ' .kind "' +
                kind +
                '"'
            )
          }
          var key = _toPropertyKey(elementObject.key)
          var placement = String(elementObject.placement)
          if (
            placement !== 'static' &&
            placement !== 'prototype' &&
            placement !== 'own'
          ) {
            throw new TypeError(
              'An element descriptor\'s .placement property must be one of "static",' +
                ' "prototype" or "own", but a decorator created an element descriptor' +
                ' with .placement "' +
                placement +
                '"'
            )
          }
          var descriptor = elementObject.descriptor
          _disallowProperty(elementObject, 'elements', 'An element descriptor')
          var element = {
            kind: kind,
            key: key,
            placement: placement,
            descriptor: Object.assign({}, descriptor)
          }
          if (kind !== 'field') {
            _disallowProperty(
              elementObject,
              'initializer',
              'A method descriptor'
            )
          } else {
            _disallowProperty(
              descriptor,
              'get',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'set',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'value',
              'The property descriptor of a field descriptor'
            )
            element.initializer = elementObject.initializer
          }
          return element
        }

        function _toElementFinisherExtras(elementObject) {
          var element = _toElementDescriptor(elementObject)
          var finisher = _optionalCallableProperty(elementObject, 'finisher')
          var extras = _toElementDescriptors(elementObject.extras)
          return { element: element, finisher: finisher, extras: extras }
        }

        function _fromClassDescriptor(elements) {
          var obj = {
            kind: 'class',
            elements: elements.map(_fromElementDescriptor)
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          return obj
        }

        function _toClassDescriptor(obj) {
          var kind = String(obj.kind)
          if (kind !== 'class') {
            throw new TypeError(
              'A class descriptor\'s .kind property must be "class", but a decorator' +
                ' created a class descriptor with .kind "' +
                kind +
                '"'
            )
          }
          _disallowProperty(obj, 'key', 'A class descriptor')
          _disallowProperty(obj, 'placement', 'A class descriptor')
          _disallowProperty(obj, 'descriptor', 'A class descriptor')
          _disallowProperty(obj, 'initializer', 'A class descriptor')
          _disallowProperty(obj, 'extras', 'A class descriptor')
          var finisher = _optionalCallableProperty(obj, 'finisher')
          var elements = _toElementDescriptors(obj.elements)
          return { elements: elements, finisher: finisher }
        }

        function _disallowProperty(obj, name, objectType) {
          if (obj[name] !== undefined) {
            throw new TypeError(
              objectType + " can't have a ." + name + ' property.'
            )
          }
        }

        function _optionalCallableProperty(obj, name) {
          var value = obj[name]
          if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function")
          }
          return value
        }

        function _runClassFinishers(constructor, finishers) {
          for (var i = 0; i < finishers.length; i++) {
            var newConstructor = (0, finishers[i])(constructor)
            if (newConstructor !== undefined) {
              if (typeof newConstructor !== 'function') {
                throw new TypeError('Finishers must return a constructor.')
              }
              constructor = newConstructor
            }
          }
          return constructor
        }

        function _toPropertyKey(arg) {
          var key = _toPrimitive(arg, 'string')
          return _typeof(key) === 'symbol' ? key : String(key)
        }

        function _toPrimitive(input, hint) {
          if (_typeof(input) !== 'object' || input === null) return input
          var prim = input[Symbol.toPrimitive]
          if (prim !== undefined) {
            var res = prim.call(input, hint || 'default')
            if (_typeof(res) !== 'object') return res
            throw new TypeError('@@toPrimitive must return a primitive value.')
          }
          return (hint === 'string' ? String : Number)(input)
        }

        function _toArray(arr) {
          return (
            _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
          )
        }

        function _nonIterableRest() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }

        function _iterableToArray(iter) {
          if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
          )
            return Array.from(iter)
        }

        function _arrayWithHoles(arr) {
          if (Array.isArray(arr)) return arr
        }

        var _require = require('../const'),
          _require$ACTION = _require.ACTION,
          TOGGLE_ALL = _require$ACTION.TOGGLE_ALL,
          MODEL_UPDATE = _require$ACTION.MODEL_UPDATE

        var _require2 = require('capsid'),
          component = _require2.component,
          wired = _require2.wired,
          emits = _require2.emits,
          on = _require2.on

        var Main = _decorate([component('main')], function(_initialize) {
          var Main = function Main() {
            _classCallCheck(this, Main)

            _initialize(this)
          }

          return {
            F: Main,
            d: [
              {
                kind: 'field',
                decorators: [wired('.toggle-all')],
                key: 'toggleAllButton',
                value: void 0
              },
              {
                kind: 'method',
                decorators: [
                  on('click', {
                    at: '.toggle-all'
                  }),
                  emits(TOGGLE_ALL)
                ],
                key: 'toggleAll',
                value: function value() {
                  return this.toggleAllButton.checked
                }
              },
              {
                kind: 'method',
                decorators: [on(MODEL_UPDATE)],
                key: 'onUpdate',
                value: function value(_ref) {
                  var todoCollection = _ref.detail.todoCollection
                  this.toggleAllButton.checked = todoCollection
                    .uncompleted()
                    .isEmpty()
                  this.el.style.display = todoCollection.isEmpty()
                    ? 'none'
                    : 'block'
                }
              }
            ]
          }
        })

        module.exports = Main
      },
      { '../const': 16, capsid: 3 }
    ],
    13: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _decorate(decorators, factory, superClass) {
          var r = factory(function initialize(O) {
            _initializeInstanceElements(O, decorated.elements)
          }, superClass)
          var decorated = _decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
          )
          _initializeClassElements(r.F, decorated.elements)
          return _runClassFinishers(r.F, decorated.finishers)
        }

        function _createElementDescriptor(def) {
          var key = _toPropertyKey(def.key)
          var descriptor
          if (def.kind === 'method') {
            descriptor = {
              value: def.value,
              writable: true,
              configurable: true,
              enumerable: false
            }
            Object.defineProperty(def.value, 'name', {
              value: _typeof(key) === 'symbol' ? '' : key,
              configurable: true
            })
          } else if (def.kind === 'get') {
            descriptor = {
              get: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'set') {
            descriptor = {
              set: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'field') {
            descriptor = {
              configurable: true,
              writable: true,
              enumerable: true
            }
          }
          var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static
              ? 'static'
              : def.kind === 'field'
                ? 'own'
                : 'prototype',
            descriptor: descriptor
          }
          if (def.decorators) element.decorators = def.decorators
          if (def.kind === 'field') element.initializer = def.value
          return element
        }

        function _coalesceGetterSetter(element, other) {
          if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get
          } else {
            other.descriptor.set = element.descriptor.set
          }
        }

        function _coalesceClassElements(elements) {
          var newElements = []
          var isSameElement = function isSameElement(other) {
            return (
              other.kind === 'method' &&
              other.key === element.key &&
              other.placement === element.placement
            )
          }
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            var other
            if (
              element.kind === 'method' &&
              (other = newElements.find(isSameElement))
            ) {
              if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
              ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                  throw new ReferenceError(
                    'Duplicated methods (' +
                      element.key +
                      ") can't be decorated."
                  )
                }
                other.descriptor = element.descriptor
              } else {
                if (_hasDecorators(element)) {
                  if (_hasDecorators(other)) {
                    throw new ReferenceError(
                      "Decorators can't be placed on different accessors with for " +
                        'the same property (' +
                        element.key +
                        ').'
                    )
                  }
                  other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
              }
            } else {
              newElements.push(element)
            }
          }
          return newElements
        }

        function _hasDecorators(element) {
          return element.decorators && element.decorators.length
        }

        function _isDataDescriptor(desc) {
          return (
            desc !== undefined &&
            !(desc.value === undefined && desc.writable === undefined)
          )
        }

        function _initializeClassElements(F, elements) {
          var proto = F.prototype
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              var placement = element.placement
              if (
                element.kind === kind &&
                (placement === 'static' || placement === 'prototype')
              ) {
                var receiver = placement === 'static' ? F : proto
                _defineClassElement(receiver, element)
              }
            })
          })
        }

        function _initializeInstanceElements(O, elements) {
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              if (element.kind === kind && element.placement === 'own') {
                _defineClassElement(O, element)
              }
            })
          })
        }

        function _defineClassElement(receiver, element) {
          var descriptor = element.descriptor
          if (element.kind === 'field') {
            var initializer = element.initializer
            descriptor = {
              enumerable: descriptor.enumerable,
              writable: descriptor.writable,
              configurable: descriptor.configurable,
              value:
                initializer === void 0 ? void 0 : initializer.call(receiver)
            }
          }
          Object.defineProperty(receiver, element.key, descriptor)
        }

        function _decorateClass(elements, decorators) {
          var newElements = []
          var finishers = []
          var placements = { static: [], prototype: [], own: [] }
          elements.forEach(function(element) {
            _addElementPlacement(element, placements)
          })
          elements.forEach(function(element) {
            if (!_hasDecorators(element)) return newElements.push(element)
            var elementFinishersExtras = _decorateElement(element, placements)
            newElements.push(elementFinishersExtras.element)
            newElements.push.apply(newElements, elementFinishersExtras.extras)
            finishers.push.apply(finishers, elementFinishersExtras.finishers)
          })
          if (!decorators) {
            return { elements: newElements, finishers: finishers }
          }
          var result = _decorateConstructor(newElements, decorators)
          finishers.push.apply(finishers, result.finishers)
          result.finishers = finishers
          return result
        }

        function _addElementPlacement(element, placements, silent) {
          var keys = placements[element.placement]
          if (!silent && keys.indexOf(element.key) !== -1) {
            throw new TypeError('Duplicated element (' + element.key + ')')
          }
          keys.push(element.key)
        }

        function _decorateElement(element, placements) {
          var extras = []
          var finishers = []
          for (
            var decorators = element.decorators, i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var keys = placements[element.placement]
            keys.splice(keys.indexOf(element.key), 1)
            var elementObject = _fromElementDescriptor(element)
            var elementFinisherExtras = _toElementFinisherExtras(
              (0, decorators[i])(elementObject) || elementObject
            )
            element = elementFinisherExtras.element
            _addElementPlacement(element, placements)
            if (elementFinisherExtras.finisher) {
              finishers.push(elementFinisherExtras.finisher)
            }
            var newExtras = elementFinisherExtras.extras
            if (newExtras) {
              for (var j = 0; j < newExtras.length; j++) {
                _addElementPlacement(newExtras[j], placements)
              }
              extras.push.apply(extras, newExtras)
            }
          }
          return { element: element, finishers: finishers, extras: extras }
        }

        function _decorateConstructor(elements, decorators) {
          var finishers = []
          for (var i = decorators.length - 1; i >= 0; i--) {
            var obj = _fromClassDescriptor(elements)
            var elementsAndFinisher = _toClassDescriptor(
              (0, decorators[i])(obj) || obj
            )
            if (elementsAndFinisher.finisher !== undefined) {
              finishers.push(elementsAndFinisher.finisher)
            }
            if (elementsAndFinisher.elements !== undefined) {
              elements = elementsAndFinisher.elements
              for (var j = 0; j < elements.length - 1; j++) {
                for (var k = j + 1; k < elements.length; k++) {
                  if (
                    elements[j].key === elements[k].key &&
                    elements[j].placement === elements[k].placement
                  ) {
                    throw new TypeError(
                      'Duplicated element (' + elements[j].key + ')'
                    )
                  }
                }
              }
            }
          }
          return { elements: elements, finishers: finishers }
        }

        function _fromElementDescriptor(element) {
          var obj = {
            kind: element.kind,
            key: element.key,
            placement: element.placement,
            descriptor: element.descriptor
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          if (element.kind === 'field') obj.initializer = element.initializer
          return obj
        }

        function _toElementDescriptors(elementObjects) {
          if (elementObjects === undefined) return
          return _toArray(elementObjects).map(function(elementObject) {
            var element = _toElementDescriptor(elementObject)
            _disallowProperty(
              elementObject,
              'finisher',
              'An element descriptor'
            )
            _disallowProperty(elementObject, 'extras', 'An element descriptor')
            return element
          })
        }

        function _toElementDescriptor(elementObject) {
          var kind = String(elementObject.kind)
          if (kind !== 'method' && kind !== 'field') {
            throw new TypeError(
              'An element descriptor\'s .kind property must be either "method" or' +
                ' "field", but a decorator created an element descriptor with' +
                ' .kind "' +
                kind +
                '"'
            )
          }
          var key = _toPropertyKey(elementObject.key)
          var placement = String(elementObject.placement)
          if (
            placement !== 'static' &&
            placement !== 'prototype' &&
            placement !== 'own'
          ) {
            throw new TypeError(
              'An element descriptor\'s .placement property must be one of "static",' +
                ' "prototype" or "own", but a decorator created an element descriptor' +
                ' with .placement "' +
                placement +
                '"'
            )
          }
          var descriptor = elementObject.descriptor
          _disallowProperty(elementObject, 'elements', 'An element descriptor')
          var element = {
            kind: kind,
            key: key,
            placement: placement,
            descriptor: Object.assign({}, descriptor)
          }
          if (kind !== 'field') {
            _disallowProperty(
              elementObject,
              'initializer',
              'A method descriptor'
            )
          } else {
            _disallowProperty(
              descriptor,
              'get',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'set',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'value',
              'The property descriptor of a field descriptor'
            )
            element.initializer = elementObject.initializer
          }
          return element
        }

        function _toElementFinisherExtras(elementObject) {
          var element = _toElementDescriptor(elementObject)
          var finisher = _optionalCallableProperty(elementObject, 'finisher')
          var extras = _toElementDescriptors(elementObject.extras)
          return { element: element, finisher: finisher, extras: extras }
        }

        function _fromClassDescriptor(elements) {
          var obj = {
            kind: 'class',
            elements: elements.map(_fromElementDescriptor)
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          return obj
        }

        function _toClassDescriptor(obj) {
          var kind = String(obj.kind)
          if (kind !== 'class') {
            throw new TypeError(
              'A class descriptor\'s .kind property must be "class", but a decorator' +
                ' created a class descriptor with .kind "' +
                kind +
                '"'
            )
          }
          _disallowProperty(obj, 'key', 'A class descriptor')
          _disallowProperty(obj, 'placement', 'A class descriptor')
          _disallowProperty(obj, 'descriptor', 'A class descriptor')
          _disallowProperty(obj, 'initializer', 'A class descriptor')
          _disallowProperty(obj, 'extras', 'A class descriptor')
          var finisher = _optionalCallableProperty(obj, 'finisher')
          var elements = _toElementDescriptors(obj.elements)
          return { elements: elements, finisher: finisher }
        }

        function _disallowProperty(obj, name, objectType) {
          if (obj[name] !== undefined) {
            throw new TypeError(
              objectType + " can't have a ." + name + ' property.'
            )
          }
        }

        function _optionalCallableProperty(obj, name) {
          var value = obj[name]
          if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function")
          }
          return value
        }

        function _runClassFinishers(constructor, finishers) {
          for (var i = 0; i < finishers.length; i++) {
            var newConstructor = (0, finishers[i])(constructor)
            if (newConstructor !== undefined) {
              if (typeof newConstructor !== 'function') {
                throw new TypeError('Finishers must return a constructor.')
              }
              constructor = newConstructor
            }
          }
          return constructor
        }

        function _toPropertyKey(arg) {
          var key = _toPrimitive(arg, 'string')
          return _typeof(key) === 'symbol' ? key : String(key)
        }

        function _toPrimitive(input, hint) {
          if (_typeof(input) !== 'object' || input === null) return input
          var prim = input[Symbol.toPrimitive]
          if (prim !== undefined) {
            var res = prim.call(input, hint || 'default')
            if (_typeof(res) !== 'object') return res
            throw new TypeError('@@toPrimitive must return a primitive value.')
          }
          return (hint === 'string' ? String : Number)(input)
        }

        function _toArray(arr) {
          return (
            _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
          )
        }

        function _nonIterableRest() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }

        function _iterableToArray(iter) {
          if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
          )
            return Array.from(iter)
        }

        function _arrayWithHoles(arr) {
          if (Array.isArray(arr)) return arr
        }

        var Const = require('../const')

        var KEYCODE = Const.KEYCODE,
          NEW_ITEM = Const.ACTION.NEW_ITEM

        var _require = require('capsid'),
          emits = _require.emits,
          on = _require.on,
          component = _require.component
        /**
         * TodoInput class controls the input for adding todos.
         */

        var NewTodo = _decorate([component('new-todo')], function(_initialize) {
          var NewTodo = function NewTodo() {
            _classCallCheck(this, NewTodo)

            _initialize(this)
          }

          return {
            F: NewTodo,
            d: [
              {
                kind: 'method',
                decorators: [on('keypress')],
                key: 'onKeypress',
                value: function value(e) {
                  if (e.which !== KEYCODE.ENTER) {
                    return
                  }

                  var title = this.el.value && this.el.value.trim()

                  if (!title) {
                    return
                  }

                  this.emitNewItem(title)
                }
              },
              {
                kind: 'method',
                decorators: [emits(NEW_ITEM)],
                key: 'emitNewItem',
                value: function value(title) {
                  this.el.value = ''
                  return title
                }
              }
            ]
          }
        })

        module.exports = NewTodo
      },
      { '../const': 16, capsid: 3 }
    ],
    14: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _decorate(decorators, factory, superClass) {
          var r = factory(function initialize(O) {
            _initializeInstanceElements(O, decorated.elements)
          }, superClass)
          var decorated = _decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
          )
          _initializeClassElements(r.F, decorated.elements)
          return _runClassFinishers(r.F, decorated.finishers)
        }

        function _createElementDescriptor(def) {
          var key = _toPropertyKey(def.key)
          var descriptor
          if (def.kind === 'method') {
            descriptor = {
              value: def.value,
              writable: true,
              configurable: true,
              enumerable: false
            }
            Object.defineProperty(def.value, 'name', {
              value: _typeof(key) === 'symbol' ? '' : key,
              configurable: true
            })
          } else if (def.kind === 'get') {
            descriptor = {
              get: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'set') {
            descriptor = {
              set: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'field') {
            descriptor = {
              configurable: true,
              writable: true,
              enumerable: true
            }
          }
          var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static
              ? 'static'
              : def.kind === 'field'
                ? 'own'
                : 'prototype',
            descriptor: descriptor
          }
          if (def.decorators) element.decorators = def.decorators
          if (def.kind === 'field') element.initializer = def.value
          return element
        }

        function _coalesceGetterSetter(element, other) {
          if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get
          } else {
            other.descriptor.set = element.descriptor.set
          }
        }

        function _coalesceClassElements(elements) {
          var newElements = []
          var isSameElement = function isSameElement(other) {
            return (
              other.kind === 'method' &&
              other.key === element.key &&
              other.placement === element.placement
            )
          }
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            var other
            if (
              element.kind === 'method' &&
              (other = newElements.find(isSameElement))
            ) {
              if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
              ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                  throw new ReferenceError(
                    'Duplicated methods (' +
                      element.key +
                      ") can't be decorated."
                  )
                }
                other.descriptor = element.descriptor
              } else {
                if (_hasDecorators(element)) {
                  if (_hasDecorators(other)) {
                    throw new ReferenceError(
                      "Decorators can't be placed on different accessors with for " +
                        'the same property (' +
                        element.key +
                        ').'
                    )
                  }
                  other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
              }
            } else {
              newElements.push(element)
            }
          }
          return newElements
        }

        function _hasDecorators(element) {
          return element.decorators && element.decorators.length
        }

        function _isDataDescriptor(desc) {
          return (
            desc !== undefined &&
            !(desc.value === undefined && desc.writable === undefined)
          )
        }

        function _initializeClassElements(F, elements) {
          var proto = F.prototype
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              var placement = element.placement
              if (
                element.kind === kind &&
                (placement === 'static' || placement === 'prototype')
              ) {
                var receiver = placement === 'static' ? F : proto
                _defineClassElement(receiver, element)
              }
            })
          })
        }

        function _initializeInstanceElements(O, elements) {
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              if (element.kind === kind && element.placement === 'own') {
                _defineClassElement(O, element)
              }
            })
          })
        }

        function _defineClassElement(receiver, element) {
          var descriptor = element.descriptor
          if (element.kind === 'field') {
            var initializer = element.initializer
            descriptor = {
              enumerable: descriptor.enumerable,
              writable: descriptor.writable,
              configurable: descriptor.configurable,
              value:
                initializer === void 0 ? void 0 : initializer.call(receiver)
            }
          }
          Object.defineProperty(receiver, element.key, descriptor)
        }

        function _decorateClass(elements, decorators) {
          var newElements = []
          var finishers = []
          var placements = { static: [], prototype: [], own: [] }
          elements.forEach(function(element) {
            _addElementPlacement(element, placements)
          })
          elements.forEach(function(element) {
            if (!_hasDecorators(element)) return newElements.push(element)
            var elementFinishersExtras = _decorateElement(element, placements)
            newElements.push(elementFinishersExtras.element)
            newElements.push.apply(newElements, elementFinishersExtras.extras)
            finishers.push.apply(finishers, elementFinishersExtras.finishers)
          })
          if (!decorators) {
            return { elements: newElements, finishers: finishers }
          }
          var result = _decorateConstructor(newElements, decorators)
          finishers.push.apply(finishers, result.finishers)
          result.finishers = finishers
          return result
        }

        function _addElementPlacement(element, placements, silent) {
          var keys = placements[element.placement]
          if (!silent && keys.indexOf(element.key) !== -1) {
            throw new TypeError('Duplicated element (' + element.key + ')')
          }
          keys.push(element.key)
        }

        function _decorateElement(element, placements) {
          var extras = []
          var finishers = []
          for (
            var decorators = element.decorators, i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var keys = placements[element.placement]
            keys.splice(keys.indexOf(element.key), 1)
            var elementObject = _fromElementDescriptor(element)
            var elementFinisherExtras = _toElementFinisherExtras(
              (0, decorators[i])(elementObject) || elementObject
            )
            element = elementFinisherExtras.element
            _addElementPlacement(element, placements)
            if (elementFinisherExtras.finisher) {
              finishers.push(elementFinisherExtras.finisher)
            }
            var newExtras = elementFinisherExtras.extras
            if (newExtras) {
              for (var j = 0; j < newExtras.length; j++) {
                _addElementPlacement(newExtras[j], placements)
              }
              extras.push.apply(extras, newExtras)
            }
          }
          return { element: element, finishers: finishers, extras: extras }
        }

        function _decorateConstructor(elements, decorators) {
          var finishers = []
          for (var i = decorators.length - 1; i >= 0; i--) {
            var obj = _fromClassDescriptor(elements)
            var elementsAndFinisher = _toClassDescriptor(
              (0, decorators[i])(obj) || obj
            )
            if (elementsAndFinisher.finisher !== undefined) {
              finishers.push(elementsAndFinisher.finisher)
            }
            if (elementsAndFinisher.elements !== undefined) {
              elements = elementsAndFinisher.elements
              for (var j = 0; j < elements.length - 1; j++) {
                for (var k = j + 1; k < elements.length; k++) {
                  if (
                    elements[j].key === elements[k].key &&
                    elements[j].placement === elements[k].placement
                  ) {
                    throw new TypeError(
                      'Duplicated element (' + elements[j].key + ')'
                    )
                  }
                }
              }
            }
          }
          return { elements: elements, finishers: finishers }
        }

        function _fromElementDescriptor(element) {
          var obj = {
            kind: element.kind,
            key: element.key,
            placement: element.placement,
            descriptor: element.descriptor
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          if (element.kind === 'field') obj.initializer = element.initializer
          return obj
        }

        function _toElementDescriptors(elementObjects) {
          if (elementObjects === undefined) return
          return _toArray(elementObjects).map(function(elementObject) {
            var element = _toElementDescriptor(elementObject)
            _disallowProperty(
              elementObject,
              'finisher',
              'An element descriptor'
            )
            _disallowProperty(elementObject, 'extras', 'An element descriptor')
            return element
          })
        }

        function _toElementDescriptor(elementObject) {
          var kind = String(elementObject.kind)
          if (kind !== 'method' && kind !== 'field') {
            throw new TypeError(
              'An element descriptor\'s .kind property must be either "method" or' +
                ' "field", but a decorator created an element descriptor with' +
                ' .kind "' +
                kind +
                '"'
            )
          }
          var key = _toPropertyKey(elementObject.key)
          var placement = String(elementObject.placement)
          if (
            placement !== 'static' &&
            placement !== 'prototype' &&
            placement !== 'own'
          ) {
            throw new TypeError(
              'An element descriptor\'s .placement property must be one of "static",' +
                ' "prototype" or "own", but a decorator created an element descriptor' +
                ' with .placement "' +
                placement +
                '"'
            )
          }
          var descriptor = elementObject.descriptor
          _disallowProperty(elementObject, 'elements', 'An element descriptor')
          var element = {
            kind: kind,
            key: key,
            placement: placement,
            descriptor: Object.assign({}, descriptor)
          }
          if (kind !== 'field') {
            _disallowProperty(
              elementObject,
              'initializer',
              'A method descriptor'
            )
          } else {
            _disallowProperty(
              descriptor,
              'get',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'set',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'value',
              'The property descriptor of a field descriptor'
            )
            element.initializer = elementObject.initializer
          }
          return element
        }

        function _toElementFinisherExtras(elementObject) {
          var element = _toElementDescriptor(elementObject)
          var finisher = _optionalCallableProperty(elementObject, 'finisher')
          var extras = _toElementDescriptors(elementObject.extras)
          return { element: element, finisher: finisher, extras: extras }
        }

        function _fromClassDescriptor(elements) {
          var obj = {
            kind: 'class',
            elements: elements.map(_fromElementDescriptor)
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          return obj
        }

        function _toClassDescriptor(obj) {
          var kind = String(obj.kind)
          if (kind !== 'class') {
            throw new TypeError(
              'A class descriptor\'s .kind property must be "class", but a decorator' +
                ' created a class descriptor with .kind "' +
                kind +
                '"'
            )
          }
          _disallowProperty(obj, 'key', 'A class descriptor')
          _disallowProperty(obj, 'placement', 'A class descriptor')
          _disallowProperty(obj, 'descriptor', 'A class descriptor')
          _disallowProperty(obj, 'initializer', 'A class descriptor')
          _disallowProperty(obj, 'extras', 'A class descriptor')
          var finisher = _optionalCallableProperty(obj, 'finisher')
          var elements = _toElementDescriptors(obj.elements)
          return { elements: elements, finisher: finisher }
        }

        function _disallowProperty(obj, name, objectType) {
          if (obj[name] !== undefined) {
            throw new TypeError(
              objectType + " can't have a ." + name + ' property.'
            )
          }
        }

        function _optionalCallableProperty(obj, name) {
          var value = obj[name]
          if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function")
          }
          return value
        }

        function _runClassFinishers(constructor, finishers) {
          for (var i = 0; i < finishers.length; i++) {
            var newConstructor = (0, finishers[i])(constructor)
            if (newConstructor !== undefined) {
              if (typeof newConstructor !== 'function') {
                throw new TypeError('Finishers must return a constructor.')
              }
              constructor = newConstructor
            }
          }
          return constructor
        }

        function _toPropertyKey(arg) {
          var key = _toPrimitive(arg, 'string')
          return _typeof(key) === 'symbol' ? key : String(key)
        }

        function _toPrimitive(input, hint) {
          if (_typeof(input) !== 'object' || input === null) return input
          var prim = input[Symbol.toPrimitive]
          if (prim !== undefined) {
            var res = prim.call(input, hint || 'default')
            if (_typeof(res) !== 'object') return res
            throw new TypeError('@@toPrimitive must return a primitive value.')
          }
          return (hint === 'string' ? String : Number)(input)
        }

        function _toArray(arr) {
          return (
            _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
          )
        }

        function _nonIterableRest() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }

        function _iterableToArray(iter) {
          if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
          )
            return Array.from(iter)
        }

        function _arrayWithHoles(arr) {
          if (Array.isArray(arr)) return arr
        }

        var _require = require('../const'),
          _require$ACTION = _require.ACTION,
          EDIT_TODO = _require$ACTION.EDIT_TODO,
          TOGGLE_TODO = _require$ACTION.TOGGLE_TODO,
          DESTROY_TODO = _require$ACTION.DESTROY_TODO,
          FINISH_EDIT_TODO = _require$ACTION.FINISH_EDIT_TODO

        var _require2 = require('capsid'),
          on = _require2.on,
          emits = _require2.emits,
          prep = _require2.prep,
          wired = _require2.wired,
          component = _require2.component
        /**
         * TodoItem class controls todo item in a list.
         */

        var TodoItem = _decorate([component('todo-item')], function(
          _initialize
        ) {
          var TodoItem = function TodoItem() {
            _classCallCheck(this, TodoItem)

            _initialize(this)
          }

          return {
            F: TodoItem,
            d: [
              {
                kind: 'field',
                decorators: [wired('label')],
                key: 'label',
                value: void 0
              },
              {
                kind: 'field',
                decorators: [wired('.toggle')],
                key: 'toggle',
                value: void 0
              },
              {
                kind: 'field',
                decorators: [wired.component('edit')],
                key: 'edit',
                value: void 0
              },
              {
                kind: 'method',
                key: '__mount__',
                value: function value() {
                  this.el.innerHTML =
                    '\n      <div class="view">\n        <input type="checkbox" class="toggle"/>\n        <label></label>\n        <button class="destroy"></button>\n      </div>\n      <input class="edit" />\n    '
                  prep('edit', this.el)
                }
              },
              {
                kind: 'method',
                key: 'update',
                value: function value(todo) {
                  this.el.setAttribute('id', todo.id)
                  this.label.textContent = todo.title
                  this.edit.onUpdate(todo.title)
                  this.toggle.checked = todo.completed
                  this.el.classList.toggle('completed', todo.completed)
                }
              },
              {
                kind: 'method',
                decorators: [
                  on('click', {
                    at: '.toggle'
                  }),
                  emits(TOGGLE_TODO)
                ],
                key: 'toggleCompleted',
                value: function value() {
                  return this.el.getAttribute('id')
                }
              },
              {
                kind: 'method',
                decorators: [
                  on('click', {
                    at: '.destroy'
                  }),
                  emits(DESTROY_TODO)
                ],
                key: 'destroy',
                value: function value() {
                  return this.el.getAttribute('id')
                }
              },
              {
                kind: 'method',
                decorators: [
                  on('dblclick', {
                    at: 'label'
                  })
                ],
                key: 'startEditing',
                value: function value() {
                  this.el.classList.add('editing')
                  this.edit.onStart()
                }
              },
              {
                kind: 'method',
                decorators: [on(EDIT_TODO)],
                key: 'stopEditing',
                value: function value(_ref) {
                  var title = _ref.detail
                  this.el.classList.remove('editing')

                  if (!title) {
                    this.destroy()
                    return
                  }

                  this.finishEditTodo(title)
                }
              },
              {
                kind: 'method',
                decorators: [emits(FINISH_EDIT_TODO)],
                key: 'finishEditTodo',
                value: function value(title) {
                  return {
                    title: title,
                    id: this.el.getAttribute('id')
                  }
                }
              }
            ]
          }
        })

        module.exports = TodoItem
      },
      { '../const': 16, capsid: 3 }
    ],
    15: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _decorate(decorators, factory, superClass) {
          var r = factory(function initialize(O) {
            _initializeInstanceElements(O, decorated.elements)
          }, superClass)
          var decorated = _decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
          )
          _initializeClassElements(r.F, decorated.elements)
          return _runClassFinishers(r.F, decorated.finishers)
        }

        function _createElementDescriptor(def) {
          var key = _toPropertyKey(def.key)
          var descriptor
          if (def.kind === 'method') {
            descriptor = {
              value: def.value,
              writable: true,
              configurable: true,
              enumerable: false
            }
            Object.defineProperty(def.value, 'name', {
              value: _typeof(key) === 'symbol' ? '' : key,
              configurable: true
            })
          } else if (def.kind === 'get') {
            descriptor = {
              get: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'set') {
            descriptor = {
              set: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'field') {
            descriptor = {
              configurable: true,
              writable: true,
              enumerable: true
            }
          }
          var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static
              ? 'static'
              : def.kind === 'field'
                ? 'own'
                : 'prototype',
            descriptor: descriptor
          }
          if (def.decorators) element.decorators = def.decorators
          if (def.kind === 'field') element.initializer = def.value
          return element
        }

        function _coalesceGetterSetter(element, other) {
          if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get
          } else {
            other.descriptor.set = element.descriptor.set
          }
        }

        function _coalesceClassElements(elements) {
          var newElements = []
          var isSameElement = function isSameElement(other) {
            return (
              other.kind === 'method' &&
              other.key === element.key &&
              other.placement === element.placement
            )
          }
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            var other
            if (
              element.kind === 'method' &&
              (other = newElements.find(isSameElement))
            ) {
              if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
              ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                  throw new ReferenceError(
                    'Duplicated methods (' +
                      element.key +
                      ") can't be decorated."
                  )
                }
                other.descriptor = element.descriptor
              } else {
                if (_hasDecorators(element)) {
                  if (_hasDecorators(other)) {
                    throw new ReferenceError(
                      "Decorators can't be placed on different accessors with for " +
                        'the same property (' +
                        element.key +
                        ').'
                    )
                  }
                  other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
              }
            } else {
              newElements.push(element)
            }
          }
          return newElements
        }

        function _hasDecorators(element) {
          return element.decorators && element.decorators.length
        }

        function _isDataDescriptor(desc) {
          return (
            desc !== undefined &&
            !(desc.value === undefined && desc.writable === undefined)
          )
        }

        function _initializeClassElements(F, elements) {
          var proto = F.prototype
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              var placement = element.placement
              if (
                element.kind === kind &&
                (placement === 'static' || placement === 'prototype')
              ) {
                var receiver = placement === 'static' ? F : proto
                _defineClassElement(receiver, element)
              }
            })
          })
        }

        function _initializeInstanceElements(O, elements) {
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              if (element.kind === kind && element.placement === 'own') {
                _defineClassElement(O, element)
              }
            })
          })
        }

        function _defineClassElement(receiver, element) {
          var descriptor = element.descriptor
          if (element.kind === 'field') {
            var initializer = element.initializer
            descriptor = {
              enumerable: descriptor.enumerable,
              writable: descriptor.writable,
              configurable: descriptor.configurable,
              value:
                initializer === void 0 ? void 0 : initializer.call(receiver)
            }
          }
          Object.defineProperty(receiver, element.key, descriptor)
        }

        function _decorateClass(elements, decorators) {
          var newElements = []
          var finishers = []
          var placements = { static: [], prototype: [], own: [] }
          elements.forEach(function(element) {
            _addElementPlacement(element, placements)
          })
          elements.forEach(function(element) {
            if (!_hasDecorators(element)) return newElements.push(element)
            var elementFinishersExtras = _decorateElement(element, placements)
            newElements.push(elementFinishersExtras.element)
            newElements.push.apply(newElements, elementFinishersExtras.extras)
            finishers.push.apply(finishers, elementFinishersExtras.finishers)
          })
          if (!decorators) {
            return { elements: newElements, finishers: finishers }
          }
          var result = _decorateConstructor(newElements, decorators)
          finishers.push.apply(finishers, result.finishers)
          result.finishers = finishers
          return result
        }

        function _addElementPlacement(element, placements, silent) {
          var keys = placements[element.placement]
          if (!silent && keys.indexOf(element.key) !== -1) {
            throw new TypeError('Duplicated element (' + element.key + ')')
          }
          keys.push(element.key)
        }

        function _decorateElement(element, placements) {
          var extras = []
          var finishers = []
          for (
            var decorators = element.decorators, i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var keys = placements[element.placement]
            keys.splice(keys.indexOf(element.key), 1)
            var elementObject = _fromElementDescriptor(element)
            var elementFinisherExtras = _toElementFinisherExtras(
              (0, decorators[i])(elementObject) || elementObject
            )
            element = elementFinisherExtras.element
            _addElementPlacement(element, placements)
            if (elementFinisherExtras.finisher) {
              finishers.push(elementFinisherExtras.finisher)
            }
            var newExtras = elementFinisherExtras.extras
            if (newExtras) {
              for (var j = 0; j < newExtras.length; j++) {
                _addElementPlacement(newExtras[j], placements)
              }
              extras.push.apply(extras, newExtras)
            }
          }
          return { element: element, finishers: finishers, extras: extras }
        }

        function _decorateConstructor(elements, decorators) {
          var finishers = []
          for (var i = decorators.length - 1; i >= 0; i--) {
            var obj = _fromClassDescriptor(elements)
            var elementsAndFinisher = _toClassDescriptor(
              (0, decorators[i])(obj) || obj
            )
            if (elementsAndFinisher.finisher !== undefined) {
              finishers.push(elementsAndFinisher.finisher)
            }
            if (elementsAndFinisher.elements !== undefined) {
              elements = elementsAndFinisher.elements
              for (var j = 0; j < elements.length - 1; j++) {
                for (var k = j + 1; k < elements.length; k++) {
                  if (
                    elements[j].key === elements[k].key &&
                    elements[j].placement === elements[k].placement
                  ) {
                    throw new TypeError(
                      'Duplicated element (' + elements[j].key + ')'
                    )
                  }
                }
              }
            }
          }
          return { elements: elements, finishers: finishers }
        }

        function _fromElementDescriptor(element) {
          var obj = {
            kind: element.kind,
            key: element.key,
            placement: element.placement,
            descriptor: element.descriptor
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          if (element.kind === 'field') obj.initializer = element.initializer
          return obj
        }

        function _toElementDescriptors(elementObjects) {
          if (elementObjects === undefined) return
          return _toArray(elementObjects).map(function(elementObject) {
            var element = _toElementDescriptor(elementObject)
            _disallowProperty(
              elementObject,
              'finisher',
              'An element descriptor'
            )
            _disallowProperty(elementObject, 'extras', 'An element descriptor')
            return element
          })
        }

        function _toElementDescriptor(elementObject) {
          var kind = String(elementObject.kind)
          if (kind !== 'method' && kind !== 'field') {
            throw new TypeError(
              'An element descriptor\'s .kind property must be either "method" or' +
                ' "field", but a decorator created an element descriptor with' +
                ' .kind "' +
                kind +
                '"'
            )
          }
          var key = _toPropertyKey(elementObject.key)
          var placement = String(elementObject.placement)
          if (
            placement !== 'static' &&
            placement !== 'prototype' &&
            placement !== 'own'
          ) {
            throw new TypeError(
              'An element descriptor\'s .placement property must be one of "static",' +
                ' "prototype" or "own", but a decorator created an element descriptor' +
                ' with .placement "' +
                placement +
                '"'
            )
          }
          var descriptor = elementObject.descriptor
          _disallowProperty(elementObject, 'elements', 'An element descriptor')
          var element = {
            kind: kind,
            key: key,
            placement: placement,
            descriptor: Object.assign({}, descriptor)
          }
          if (kind !== 'field') {
            _disallowProperty(
              elementObject,
              'initializer',
              'A method descriptor'
            )
          } else {
            _disallowProperty(
              descriptor,
              'get',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'set',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'value',
              'The property descriptor of a field descriptor'
            )
            element.initializer = elementObject.initializer
          }
          return element
        }

        function _toElementFinisherExtras(elementObject) {
          var element = _toElementDescriptor(elementObject)
          var finisher = _optionalCallableProperty(elementObject, 'finisher')
          var extras = _toElementDescriptors(elementObject.extras)
          return { element: element, finisher: finisher, extras: extras }
        }

        function _fromClassDescriptor(elements) {
          var obj = {
            kind: 'class',
            elements: elements.map(_fromElementDescriptor)
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          return obj
        }

        function _toClassDescriptor(obj) {
          var kind = String(obj.kind)
          if (kind !== 'class') {
            throw new TypeError(
              'A class descriptor\'s .kind property must be "class", but a decorator' +
                ' created a class descriptor with .kind "' +
                kind +
                '"'
            )
          }
          _disallowProperty(obj, 'key', 'A class descriptor')
          _disallowProperty(obj, 'placement', 'A class descriptor')
          _disallowProperty(obj, 'descriptor', 'A class descriptor')
          _disallowProperty(obj, 'initializer', 'A class descriptor')
          _disallowProperty(obj, 'extras', 'A class descriptor')
          var finisher = _optionalCallableProperty(obj, 'finisher')
          var elements = _toElementDescriptors(obj.elements)
          return { elements: elements, finisher: finisher }
        }

        function _disallowProperty(obj, name, objectType) {
          if (obj[name] !== undefined) {
            throw new TypeError(
              objectType + " can't have a ." + name + ' property.'
            )
          }
        }

        function _optionalCallableProperty(obj, name) {
          var value = obj[name]
          if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function")
          }
          return value
        }

        function _runClassFinishers(constructor, finishers) {
          for (var i = 0; i < finishers.length; i++) {
            var newConstructor = (0, finishers[i])(constructor)
            if (newConstructor !== undefined) {
              if (typeof newConstructor !== 'function') {
                throw new TypeError('Finishers must return a constructor.')
              }
              constructor = newConstructor
            }
          }
          return constructor
        }

        function _toPropertyKey(arg) {
          var key = _toPrimitive(arg, 'string')
          return _typeof(key) === 'symbol' ? key : String(key)
        }

        function _toPrimitive(input, hint) {
          if (_typeof(input) !== 'object' || input === null) return input
          var prim = input[Symbol.toPrimitive]
          if (prim !== undefined) {
            var res = prim.call(input, hint || 'default')
            if (_typeof(res) !== 'object') return res
            throw new TypeError('@@toPrimitive must return a primitive value.')
          }
          return (hint === 'string' ? String : Number)(input)
        }

        function _toArray(arr) {
          return (
            _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
          )
        }

        function _nonIterableRest() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }

        function _iterableToArray(iter) {
          if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
          )
            return Array.from(iter)
        }

        function _arrayWithHoles(arr) {
          if (Array.isArray(arr)) return arr
        }

        var _require = require('../const'),
          MODEL_UPDATE = _require.ACTION.MODEL_UPDATE

        var _require2 = require('capsid'),
          component = _require2.component,
          get = _require2.get,
          make = _require2.make,
          on = _require2.on
        /**
         * The todo list component.
         */

        var TodoList = _decorate([component('todo-list')], function(
          _initialize
        ) {
          var TodoList = function TodoList() {
            _classCallCheck(this, TodoList)

            _initialize(this)
          }

          return {
            F: TodoList,
            d: [
              {
                kind: 'method',
                decorators: [on(MODEL_UPDATE)],
                key: 'onRefresh',
                value: function value(_ref) {
                  var _this = this

                  var _ref$detail = _ref.detail,
                    todoCollection = _ref$detail.todoCollection,
                    filter = _ref$detail.filter
                  var visibleTodos = todoCollection.filterBy(filter)

                  if (this.shouldResetContents(filter, visibleTodos)) {
                    this.el.innerHTML = ''
                    visibleTodos.forEach(function(todo) {
                      _this.appendTodoItem(todo)
                    })
                  } else {
                    visibleTodos.forEach(function(todo) {
                      get(
                        'todo-item',
                        _this.el.querySelector('[id="'.concat(todo.id, '"]'))
                      ).update(todo)
                    })
                  }
                }
              },
              {
                kind: 'method',
                key: 'shouldResetContents',
                value: function value(filter, todos) {
                  return (
                    !filter.isAll() ||
                    todos.length !==
                      this.el.querySelectorAll('.todo-item').length
                  )
                }
              },
              {
                kind: 'method',
                key: 'appendTodoItem',
                value: function value(todo) {
                  var li = document.createElement('li')
                  this.el.appendChild(li)
                  make('todo-item', li).update(todo)
                }
              }
            ]
          }
        })

        module.exports = TodoList
      },
      { '../const': 16, capsid: 3 }
    ],
    16: [
      function(require, module, exports) {
        'use strict'

        module.exports = {
          KEYCODE: {
            ENTER: 13,
            ESCAPE: 27
          },
          STORAGE_KEY: {
            TODO_LIST: 'todos-capsid'
          },
          ACTION: {
            CLEAR_COMPLETED: 'todo-clear-completed',
            CHANGE_FILTER: 'change-filter',
            DESTROY_TODO: 'destroy-todo',
            EDIT_TODO: 'edit-todo',
            FINISH_EDIT_TODO: 'finish-edit-todo',
            MODEL_UPDATE: 'model-update',
            NEW_ITEM: 'todo-new-item',
            TOGGLE_ALL: 'todo-toggle-all',
            TOGGLE_TODO: 'todo-toggle-item'
          }
        }
      },
      {}
    ],
    17: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _possibleConstructorReturn(self, call) {
          if (
            call &&
            (_typeof(call) === 'object' || typeof call === 'function')
          ) {
            return call
          }
          return _assertThisInitialized(self)
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            )
          }
          return self
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o)
              }
          return _getPrototypeOf(o)
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError(
              'Super expression must either be null or a function'
            )
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                writable: true,
                configurable: true
              }
            }
          )
          if (superClass) _setPrototypeOf(subClass, superClass)
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf =
            Object.setPrototypeOf ||
            function _setPrototypeOf(o, p) {
              o.__proto__ = p
              return o
            }
          return _setPrototypeOf(o, p)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || false
            descriptor.configurable = true
            if ('value' in descriptor) descriptor.writable = true
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps)
          if (staticProps) _defineProperties(Constructor, staticProps)
          return Constructor
        }

        var Filter =
          /*#__PURE__*/
          (function() {
            function Filter() {
              _classCallCheck(this, Filter)
            }

            _createClass(Filter, [
              {
                key: 'isAll',

                /**
                 * @return {boolean}
                 */
                value: function isAll() {
                  return false
                }
              }
            ])

            return Filter
          })()

        var AllFilter =
          /*#__PURE__*/
          (function(_Filter) {
            _inherits(AllFilter, _Filter)

            function AllFilter() {
              _classCallCheck(this, AllFilter)

              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(AllFilter).apply(this, arguments)
              )
            }

            _createClass(AllFilter, [
              {
                key: 'isAll',
                value: function isAll() {
                  return true
                }
              }
            ])

            return AllFilter
          })(Filter)

        Filter.ALL = new AllFilter()
        Filter.ACTIVE = new Filter()
        Filter.COMPLETED = new Filter()
        module.exports = Filter
      },
      {}
    ],
    18: [
      function(require, module, exports) {
        'use strict'

        exports.Filter = require('./filter')
        exports.Todo = require('./todo')
        exports.Todo.Collection = require('./todo-collection')
        exports.Todo.Repository = require('./todo-repository')
        exports.Todo.Factory = require('./todo-factory')
      },
      {
        './filter': 17,
        './todo': 22,
        './todo-collection': 19,
        './todo-factory': 20,
        './todo-repository': 21
      }
    ],
    19: [
      function(require, module, exports) {
        'use strict'

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || false
            descriptor.configurable = true
            if ('value' in descriptor) descriptor.writable = true
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps)
          if (staticProps) _defineProperties(Constructor, staticProps)
          return Constructor
        }

        var Filter = require('./filter')
        /**
         * TodoCollection is the colleciton model of the todo model.
         */

        var TodoCollection =
          /*#__PURE__*/
          (function() {
            /**
             * @param {Todo[]} todos The todo items
             */
            function TodoCollection(todos) {
              var _this = this

              _classCallCheck(this, TodoCollection)

              todos = todos || []
              this.items = todos
              this.map = {}
              this.items.forEach(function(todo) {
                _this.map[todo.id] = todo
              })
            }
            /**
             * Gets the todo by the id.
             *
             * @param {String} id The todo id
             * @return {Todo}
             */

            _createClass(TodoCollection, [
              {
                key: 'getById',
                value: function getById(id) {
                  return this.map[id]
                }
                /**
                 * Toggles the todo's completed flag by the given id.
                 * @param {String} id The todo id
                 */
              },
              {
                key: 'toggleById',
                value: function toggleById(id) {
                  var todo = this.getById(id)
                  todo.completed = !todo.completed
                }
                /**
                 * Iterates calling of func in the given context.
                 * @param {Function} func The iteration function
                 * @param {Object} ctx The context
                 */
              },
              {
                key: 'forEach',
                value: function forEach(func, ctx) {
                  this.items.forEach(func, ctx)
                }
                /**
                 * Pushes (appends) the given todo at the end of the list
                 *
                 * @param {Todo} todo The todo
                 */
              },
              {
                key: 'push',
                value: function push(todo) {
                  this.items.push(todo)
                  this.map[todo.id] = todo
                }
                /**
                 * Removes the todo.
                 * @param {Todo} todo The todo to remvoe
                 */
              },
              {
                key: 'remove',
                value: function remove(todo) {
                  if (!this.has(todo)) {
                    throw new Error(
                      'The colletion does not have the todo: ' + todo.toString()
                    )
                  }

                  this.items.splice(this.items.indexOf(todo), 1)
                  delete this.map[todo.id]
                }
                /**
                 * Removes the item by the id.
                 * @param {String} id The todo id
                 */
              },
              {
                key: 'removeById',
                value: function removeById(id) {
                  var todo = this.getById(id)

                  if (todo) {
                    this.remove(todo)
                  }
                }
                /**
                 * Checks if the given todo is included by the list
                 * @private
                 * @param {Todo} todo The todo
                 */
              },
              {
                key: 'has',
                value: function has(todo) {
                  return this.items.indexOf(todo) !== -1
                }
                /**
                 * Returns a todo subcollection of completed items.
                 * @return {TodoCollection}
                 */
              },
              {
                key: 'completed',
                value: function completed() {
                  return new TodoCollection(
                    this.items.filter(function(todo) {
                      return todo.completed
                    })
                  )
                }
                /**
                 * Returns a todo subcollection of uncompleted items.
                 * @return {TodoCollection}
                 */
              },
              {
                key: 'uncompleted',
                value: function uncompleted() {
                  return new TodoCollection(
                    this.items.filter(function(todo) {
                      return !todo.completed
                    })
                  )
                }
                /**
                 * Gets the array of todos
                 * @return {Todo[]}
                 */
              },
              {
                key: 'toArray',
                value: function toArray() {
                  return this.items.slice(0)
                }
                /**
                 * Checks if the collection is empty.
                 * @param {Boolean}
                 */
              },
              {
                key: 'isEmpty',
                value: function isEmpty() {
                  return this.length === 0
                }
                /**
                 * Returns the length.
                 * @return {number}
                 */
              },
              {
                key: 'completeAll',

                /**
                 * Completes all the todos.
                 */
                value: function completeAll() {
                  this.items.forEach(function(todo) {
                    todo.completed = true
                  })
                }
                /**
                 * Uncompletes all the todos.
                 */
              },
              {
                key: 'uncompleteAll',
                value: function uncompleteAll() {
                  this.items.forEach(function(todo) {
                    todo.completed = false
                  })
                }
                /**
                 * Returns the filtered todos by the given filter object.
                 * @param {Filter} filter The filter
                 * @return {TodoCollection}
                 */
              },
              {
                key: 'filterBy',
                value: function filterBy(filter) {
                  if (filter === Filter.ACTIVE) {
                    return this.uncompleted()
                  } else if (filter === Filter.COMPLETED) {
                    return this.completed()
                  }

                  return this
                }
              },
              {
                key: 'length',
                get: function get() {
                  return this.items.length
                }
              }
            ])

            return TodoCollection
          })()

        module.exports = TodoCollection
      },
      { './filter': 17 }
    ],
    20: [
      function(require, module, exports) {
        'use strict'

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || false
            descriptor.configurable = true
            if ('value' in descriptor) descriptor.writable = true
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps)
          if (staticProps) _defineProperties(Constructor, staticProps)
          return Constructor
        }

        var Todo = require('./todo')
        /**
         * TodoFactory is the factory for todo.
         */

        var TodoFactory =
          /*#__PURE__*/
          (function() {
            function TodoFactory() {
              _classCallCheck(this, TodoFactory)
            }

            _createClass(TodoFactory, [
              {
                key: 'createByTitle',

                /**
                 * Creates a todo model from the given todo title.
                 *
                 * @param {String} title The todo title
                 * @return {Todo}
                 */
                value: function createByTitle(title) {
                  return this.createFromObject({
                    id: this.generateId(),
                    title: title,
                    completed: false
                  })
                }
                /**
                 * Creates Todo model from the object
                 * @param {Object} obj The source object
                 * @return {Todo}
                 */
              },
              {
                key: 'createFromObject',
                value: function createFromObject(obj) {
                  return new Todo(obj.id, obj.title, obj.completed)
                }
                /**
                 * Generates a random id.
                 * @private
                 */
              },
              {
                key: 'generateId',
                value: function generateId() {
                  return (
                    'todo-' + Math.floor(Math.random() * 1000000000).toString()
                  )
                }
              }
            ])

            return TodoFactory
          })()

        module.exports = TodoFactory
      },
      { './todo': 22 }
    ],
    21: [
      function(require, module, exports) {
        'use strict'

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || false
            descriptor.configurable = true
            if ('value' in descriptor) descriptor.writable = true
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps)
          if (staticProps) _defineProperties(Constructor, staticProps)
          return Constructor
        }

        var Const = require('../const')

        var TodoCollection = require('./todo-collection')

        var TodoRepository =
          /*#__PURE__*/
          (function() {
            function TodoRepository() {
              _classCallCheck(this, TodoRepository)
            }

            _createClass(TodoRepository, [
              {
                key: 'getAll',

                /**
                 * Gets all the todo items.
                 *
                 * @return {TodoList}
                 */
                value: function getAll() {
                  var json = window.localStorage[Const.STORAGE_KEY.TODO_LIST]

                  if (!json) {
                    return new TodoCollection([])
                  }

                  var array

                  try {
                    array = JSON.parse(json)
                  } catch (err) {
                    array = []
                  }

                  return new TodoCollection(array)
                }
                /**
                 * Saves all the todo items.
                 * @param {domain.TodoCollection} todos
                 */
              },
              {
                key: 'saveAll',
                value: function saveAll(todos) {
                  var json = JSON.stringify(this.collectionToArray(todos))
                  window.localStorage[Const.STORAGE_KEY.TODO_LIST] = json
                }
                /**
                 * Converts the todo collections into js array of objects.
                 * @private
                 * @param {TodoCollection} todos The todo collection
                 * @return {Array<Object>}
                 */
              },
              {
                key: 'collectionToArray',
                value: function collectionToArray(todos) {
                  var _this = this

                  return todos.toArray().map(function(todo) {
                    return _this.toObject(todo)
                  })
                }
                /**
                 * Converts the todo item into js object.
                 * @private
                 * @param {Todo} todo The todo item
                 * @return {Object}
                 */
              },
              {
                key: 'toObject',
                value: function toObject(todo) {
                  return {
                    id: todo.id,
                    title: todo.title,
                    completed: todo.completed
                  }
                }
              }
            ])

            return TodoRepository
          })()

        module.exports = TodoRepository
      },
      { '../const': 16, './todo-collection': 19 }
    ],
    22: [
      function(require, module, exports) {
        'use strict'

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        /**
         * Todo class is the model of single todo item.
         */
        var Todo =
          /**
           * @param {String} id The todo's id
           * @param {String} title The todo's title
           * @param {Boolean} completed The flag indicates if it's done or not
           */
          function Todo(id, title, completed) {
            _classCallCheck(this, Todo)

            this.id = id
            this.title = title
            this.completed = completed
          }

        module.exports = Todo
      },
      {}
    ],
    23: [
      function(require, module, exports) {
        'use strict'

        require('./component')

        require('./service')
      },
      { './component': 11, './service': 24 }
    ],
    24: [
      function(require, module, exports) {
        'use strict'

        require('./router')

        require('./todoapp')
      },
      { './router': 25, './todoapp': 26 }
    ],
    25: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _decorate(decorators, factory, superClass) {
          var r = factory(function initialize(O) {
            _initializeInstanceElements(O, decorated.elements)
          }, superClass)
          var decorated = _decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
          )
          _initializeClassElements(r.F, decorated.elements)
          return _runClassFinishers(r.F, decorated.finishers)
        }

        function _createElementDescriptor(def) {
          var key = _toPropertyKey(def.key)
          var descriptor
          if (def.kind === 'method') {
            descriptor = {
              value: def.value,
              writable: true,
              configurable: true,
              enumerable: false
            }
            Object.defineProperty(def.value, 'name', {
              value: _typeof(key) === 'symbol' ? '' : key,
              configurable: true
            })
          } else if (def.kind === 'get') {
            descriptor = {
              get: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'set') {
            descriptor = {
              set: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'field') {
            descriptor = {
              configurable: true,
              writable: true,
              enumerable: true
            }
          }
          var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static
              ? 'static'
              : def.kind === 'field'
                ? 'own'
                : 'prototype',
            descriptor: descriptor
          }
          if (def.decorators) element.decorators = def.decorators
          if (def.kind === 'field') element.initializer = def.value
          return element
        }

        function _coalesceGetterSetter(element, other) {
          if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get
          } else {
            other.descriptor.set = element.descriptor.set
          }
        }

        function _coalesceClassElements(elements) {
          var newElements = []
          var isSameElement = function isSameElement(other) {
            return (
              other.kind === 'method' &&
              other.key === element.key &&
              other.placement === element.placement
            )
          }
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            var other
            if (
              element.kind === 'method' &&
              (other = newElements.find(isSameElement))
            ) {
              if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
              ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                  throw new ReferenceError(
                    'Duplicated methods (' +
                      element.key +
                      ") can't be decorated."
                  )
                }
                other.descriptor = element.descriptor
              } else {
                if (_hasDecorators(element)) {
                  if (_hasDecorators(other)) {
                    throw new ReferenceError(
                      "Decorators can't be placed on different accessors with for " +
                        'the same property (' +
                        element.key +
                        ').'
                    )
                  }
                  other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
              }
            } else {
              newElements.push(element)
            }
          }
          return newElements
        }

        function _hasDecorators(element) {
          return element.decorators && element.decorators.length
        }

        function _isDataDescriptor(desc) {
          return (
            desc !== undefined &&
            !(desc.value === undefined && desc.writable === undefined)
          )
        }

        function _initializeClassElements(F, elements) {
          var proto = F.prototype
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              var placement = element.placement
              if (
                element.kind === kind &&
                (placement === 'static' || placement === 'prototype')
              ) {
                var receiver = placement === 'static' ? F : proto
                _defineClassElement(receiver, element)
              }
            })
          })
        }

        function _initializeInstanceElements(O, elements) {
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              if (element.kind === kind && element.placement === 'own') {
                _defineClassElement(O, element)
              }
            })
          })
        }

        function _defineClassElement(receiver, element) {
          var descriptor = element.descriptor
          if (element.kind === 'field') {
            var initializer = element.initializer
            descriptor = {
              enumerable: descriptor.enumerable,
              writable: descriptor.writable,
              configurable: descriptor.configurable,
              value:
                initializer === void 0 ? void 0 : initializer.call(receiver)
            }
          }
          Object.defineProperty(receiver, element.key, descriptor)
        }

        function _decorateClass(elements, decorators) {
          var newElements = []
          var finishers = []
          var placements = { static: [], prototype: [], own: [] }
          elements.forEach(function(element) {
            _addElementPlacement(element, placements)
          })
          elements.forEach(function(element) {
            if (!_hasDecorators(element)) return newElements.push(element)
            var elementFinishersExtras = _decorateElement(element, placements)
            newElements.push(elementFinishersExtras.element)
            newElements.push.apply(newElements, elementFinishersExtras.extras)
            finishers.push.apply(finishers, elementFinishersExtras.finishers)
          })
          if (!decorators) {
            return { elements: newElements, finishers: finishers }
          }
          var result = _decorateConstructor(newElements, decorators)
          finishers.push.apply(finishers, result.finishers)
          result.finishers = finishers
          return result
        }

        function _addElementPlacement(element, placements, silent) {
          var keys = placements[element.placement]
          if (!silent && keys.indexOf(element.key) !== -1) {
            throw new TypeError('Duplicated element (' + element.key + ')')
          }
          keys.push(element.key)
        }

        function _decorateElement(element, placements) {
          var extras = []
          var finishers = []
          for (
            var decorators = element.decorators, i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var keys = placements[element.placement]
            keys.splice(keys.indexOf(element.key), 1)
            var elementObject = _fromElementDescriptor(element)
            var elementFinisherExtras = _toElementFinisherExtras(
              (0, decorators[i])(elementObject) || elementObject
            )
            element = elementFinisherExtras.element
            _addElementPlacement(element, placements)
            if (elementFinisherExtras.finisher) {
              finishers.push(elementFinisherExtras.finisher)
            }
            var newExtras = elementFinisherExtras.extras
            if (newExtras) {
              for (var j = 0; j < newExtras.length; j++) {
                _addElementPlacement(newExtras[j], placements)
              }
              extras.push.apply(extras, newExtras)
            }
          }
          return { element: element, finishers: finishers, extras: extras }
        }

        function _decorateConstructor(elements, decorators) {
          var finishers = []
          for (var i = decorators.length - 1; i >= 0; i--) {
            var obj = _fromClassDescriptor(elements)
            var elementsAndFinisher = _toClassDescriptor(
              (0, decorators[i])(obj) || obj
            )
            if (elementsAndFinisher.finisher !== undefined) {
              finishers.push(elementsAndFinisher.finisher)
            }
            if (elementsAndFinisher.elements !== undefined) {
              elements = elementsAndFinisher.elements
              for (var j = 0; j < elements.length - 1; j++) {
                for (var k = j + 1; k < elements.length; k++) {
                  if (
                    elements[j].key === elements[k].key &&
                    elements[j].placement === elements[k].placement
                  ) {
                    throw new TypeError(
                      'Duplicated element (' + elements[j].key + ')'
                    )
                  }
                }
              }
            }
          }
          return { elements: elements, finishers: finishers }
        }

        function _fromElementDescriptor(element) {
          var obj = {
            kind: element.kind,
            key: element.key,
            placement: element.placement,
            descriptor: element.descriptor
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          if (element.kind === 'field') obj.initializer = element.initializer
          return obj
        }

        function _toElementDescriptors(elementObjects) {
          if (elementObjects === undefined) return
          return _toArray(elementObjects).map(function(elementObject) {
            var element = _toElementDescriptor(elementObject)
            _disallowProperty(
              elementObject,
              'finisher',
              'An element descriptor'
            )
            _disallowProperty(elementObject, 'extras', 'An element descriptor')
            return element
          })
        }

        function _toElementDescriptor(elementObject) {
          var kind = String(elementObject.kind)
          if (kind !== 'method' && kind !== 'field') {
            throw new TypeError(
              'An element descriptor\'s .kind property must be either "method" or' +
                ' "field", but a decorator created an element descriptor with' +
                ' .kind "' +
                kind +
                '"'
            )
          }
          var key = _toPropertyKey(elementObject.key)
          var placement = String(elementObject.placement)
          if (
            placement !== 'static' &&
            placement !== 'prototype' &&
            placement !== 'own'
          ) {
            throw new TypeError(
              'An element descriptor\'s .placement property must be one of "static",' +
                ' "prototype" or "own", but a decorator created an element descriptor' +
                ' with .placement "' +
                placement +
                '"'
            )
          }
          var descriptor = elementObject.descriptor
          _disallowProperty(elementObject, 'elements', 'An element descriptor')
          var element = {
            kind: kind,
            key: key,
            placement: placement,
            descriptor: Object.assign({}, descriptor)
          }
          if (kind !== 'field') {
            _disallowProperty(
              elementObject,
              'initializer',
              'A method descriptor'
            )
          } else {
            _disallowProperty(
              descriptor,
              'get',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'set',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'value',
              'The property descriptor of a field descriptor'
            )
            element.initializer = elementObject.initializer
          }
          return element
        }

        function _toElementFinisherExtras(elementObject) {
          var element = _toElementDescriptor(elementObject)
          var finisher = _optionalCallableProperty(elementObject, 'finisher')
          var extras = _toElementDescriptors(elementObject.extras)
          return { element: element, finisher: finisher, extras: extras }
        }

        function _fromClassDescriptor(elements) {
          var obj = {
            kind: 'class',
            elements: elements.map(_fromElementDescriptor)
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          return obj
        }

        function _toClassDescriptor(obj) {
          var kind = String(obj.kind)
          if (kind !== 'class') {
            throw new TypeError(
              'A class descriptor\'s .kind property must be "class", but a decorator' +
                ' created a class descriptor with .kind "' +
                kind +
                '"'
            )
          }
          _disallowProperty(obj, 'key', 'A class descriptor')
          _disallowProperty(obj, 'placement', 'A class descriptor')
          _disallowProperty(obj, 'descriptor', 'A class descriptor')
          _disallowProperty(obj, 'initializer', 'A class descriptor')
          _disallowProperty(obj, 'extras', 'A class descriptor')
          var finisher = _optionalCallableProperty(obj, 'finisher')
          var elements = _toElementDescriptors(obj.elements)
          return { elements: elements, finisher: finisher }
        }

        function _disallowProperty(obj, name, objectType) {
          if (obj[name] !== undefined) {
            throw new TypeError(
              objectType + " can't have a ." + name + ' property.'
            )
          }
        }

        function _optionalCallableProperty(obj, name) {
          var value = obj[name]
          if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function")
          }
          return value
        }

        function _runClassFinishers(constructor, finishers) {
          for (var i = 0; i < finishers.length; i++) {
            var newConstructor = (0, finishers[i])(constructor)
            if (newConstructor !== undefined) {
              if (typeof newConstructor !== 'function') {
                throw new TypeError('Finishers must return a constructor.')
              }
              constructor = newConstructor
            }
          }
          return constructor
        }

        function _toPropertyKey(arg) {
          var key = _toPrimitive(arg, 'string')
          return _typeof(key) === 'symbol' ? key : String(key)
        }

        function _toPrimitive(input, hint) {
          if (_typeof(input) !== 'object' || input === null) return input
          var prim = input[Symbol.toPrimitive]
          if (prim !== undefined) {
            var res = prim.call(input, hint || 'default')
            if (_typeof(res) !== 'object') return res
            throw new TypeError('@@toPrimitive must return a primitive value.')
          }
          return (hint === 'string' ? String : Number)(input)
        }

        function _toArray(arr) {
          return (
            _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
          )
        }

        function _nonIterableRest() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }

        function _iterableToArray(iter) {
          if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
          )
            return Array.from(iter)
        }

        function _arrayWithHoles(arr) {
          if (Array.isArray(arr)) return arr
        }

        var _require = require('hash-route'),
          route = _require.route,
          dispatch = _require.dispatch

        var _require2 = require('../const'),
          CHANGE_FILTER = _require2.ACTION.CHANGE_FILTER

        var _require3 = require('../domain'),
          Filter = _require3.Filter

        var _require4 = require('capsid'),
          component = _require4.component,
          emits = _require4.emits
        /**
         * The observer of the filter and invokes filterchange event when it's changed.
         */

        var Router = _decorate([component('router')], function(_initialize) {
          var Router = function Router() {
            _classCallCheck(this, Router)

            _initialize(this)
          }

          return {
            F: Router,
            d: [
              {
                kind: 'method',
                key: 'onHashchange',
                value: function value() {
                  dispatch(this)
                }
              },
              {
                kind: 'method',
                decorators: [route, emits(CHANGE_FILTER)],
                key: '#/all',
                value: function value() {
                  return Filter.ALL
                }
              },
              {
                kind: 'method',
                decorators: [route, emits(CHANGE_FILTER)],
                key: '#/active',
                value: function value() {
                  return Filter.ACTIVE
                }
              },
              {
                kind: 'method',
                decorators: [route, emits(CHANGE_FILTER)],
                key: '#/completed',
                value: function value() {
                  return Filter.COMPLETED
                }
              },
              {
                kind: 'method',
                decorators: [route, emits(CHANGE_FILTER)],
                key: '(.*)',
                value: function value() {
                  return Filter.ALL
                }
              }
            ]
          }
        })

        module.exports = Router
      },
      { '../const': 16, '../domain': 18, capsid: 3, 'hash-route': 6 }
    ],
    26: [
      function(require, module, exports) {
        'use strict'

        function _typeof(obj) {
          if (
            typeof Symbol === 'function' &&
            typeof Symbol.iterator === 'symbol'
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj
            }
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
          }
          return _typeof(obj)
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function')
          }
        }

        function _decorate(decorators, factory, superClass) {
          var r = factory(function initialize(O) {
            _initializeInstanceElements(O, decorated.elements)
          }, superClass)
          var decorated = _decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
          )
          _initializeClassElements(r.F, decorated.elements)
          return _runClassFinishers(r.F, decorated.finishers)
        }

        function _createElementDescriptor(def) {
          var key = _toPropertyKey(def.key)
          var descriptor
          if (def.kind === 'method') {
            descriptor = {
              value: def.value,
              writable: true,
              configurable: true,
              enumerable: false
            }
            Object.defineProperty(def.value, 'name', {
              value: _typeof(key) === 'symbol' ? '' : key,
              configurable: true
            })
          } else if (def.kind === 'get') {
            descriptor = {
              get: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'set') {
            descriptor = {
              set: def.value,
              configurable: true,
              enumerable: false
            }
          } else if (def.kind === 'field') {
            descriptor = {
              configurable: true,
              writable: true,
              enumerable: true
            }
          }
          var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static
              ? 'static'
              : def.kind === 'field'
                ? 'own'
                : 'prototype',
            descriptor: descriptor
          }
          if (def.decorators) element.decorators = def.decorators
          if (def.kind === 'field') element.initializer = def.value
          return element
        }

        function _coalesceGetterSetter(element, other) {
          if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get
          } else {
            other.descriptor.set = element.descriptor.set
          }
        }

        function _coalesceClassElements(elements) {
          var newElements = []
          var isSameElement = function isSameElement(other) {
            return (
              other.kind === 'method' &&
              other.key === element.key &&
              other.placement === element.placement
            )
          }
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i]
            var other
            if (
              element.kind === 'method' &&
              (other = newElements.find(isSameElement))
            ) {
              if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
              ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                  throw new ReferenceError(
                    'Duplicated methods (' +
                      element.key +
                      ") can't be decorated."
                  )
                }
                other.descriptor = element.descriptor
              } else {
                if (_hasDecorators(element)) {
                  if (_hasDecorators(other)) {
                    throw new ReferenceError(
                      "Decorators can't be placed on different accessors with for " +
                        'the same property (' +
                        element.key +
                        ').'
                    )
                  }
                  other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
              }
            } else {
              newElements.push(element)
            }
          }
          return newElements
        }

        function _hasDecorators(element) {
          return element.decorators && element.decorators.length
        }

        function _isDataDescriptor(desc) {
          return (
            desc !== undefined &&
            !(desc.value === undefined && desc.writable === undefined)
          )
        }

        function _initializeClassElements(F, elements) {
          var proto = F.prototype
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              var placement = element.placement
              if (
                element.kind === kind &&
                (placement === 'static' || placement === 'prototype')
              ) {
                var receiver = placement === 'static' ? F : proto
                _defineClassElement(receiver, element)
              }
            })
          })
        }

        function _initializeInstanceElements(O, elements) {
          ;['method', 'field'].forEach(function(kind) {
            elements.forEach(function(element) {
              if (element.kind === kind && element.placement === 'own') {
                _defineClassElement(O, element)
              }
            })
          })
        }

        function _defineClassElement(receiver, element) {
          var descriptor = element.descriptor
          if (element.kind === 'field') {
            var initializer = element.initializer
            descriptor = {
              enumerable: descriptor.enumerable,
              writable: descriptor.writable,
              configurable: descriptor.configurable,
              value:
                initializer === void 0 ? void 0 : initializer.call(receiver)
            }
          }
          Object.defineProperty(receiver, element.key, descriptor)
        }

        function _decorateClass(elements, decorators) {
          var newElements = []
          var finishers = []
          var placements = { static: [], prototype: [], own: [] }
          elements.forEach(function(element) {
            _addElementPlacement(element, placements)
          })
          elements.forEach(function(element) {
            if (!_hasDecorators(element)) return newElements.push(element)
            var elementFinishersExtras = _decorateElement(element, placements)
            newElements.push(elementFinishersExtras.element)
            newElements.push.apply(newElements, elementFinishersExtras.extras)
            finishers.push.apply(finishers, elementFinishersExtras.finishers)
          })
          if (!decorators) {
            return { elements: newElements, finishers: finishers }
          }
          var result = _decorateConstructor(newElements, decorators)
          finishers.push.apply(finishers, result.finishers)
          result.finishers = finishers
          return result
        }

        function _addElementPlacement(element, placements, silent) {
          var keys = placements[element.placement]
          if (!silent && keys.indexOf(element.key) !== -1) {
            throw new TypeError('Duplicated element (' + element.key + ')')
          }
          keys.push(element.key)
        }

        function _decorateElement(element, placements) {
          var extras = []
          var finishers = []
          for (
            var decorators = element.decorators, i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var keys = placements[element.placement]
            keys.splice(keys.indexOf(element.key), 1)
            var elementObject = _fromElementDescriptor(element)
            var elementFinisherExtras = _toElementFinisherExtras(
              (0, decorators[i])(elementObject) || elementObject
            )
            element = elementFinisherExtras.element
            _addElementPlacement(element, placements)
            if (elementFinisherExtras.finisher) {
              finishers.push(elementFinisherExtras.finisher)
            }
            var newExtras = elementFinisherExtras.extras
            if (newExtras) {
              for (var j = 0; j < newExtras.length; j++) {
                _addElementPlacement(newExtras[j], placements)
              }
              extras.push.apply(extras, newExtras)
            }
          }
          return { element: element, finishers: finishers, extras: extras }
        }

        function _decorateConstructor(elements, decorators) {
          var finishers = []
          for (var i = decorators.length - 1; i >= 0; i--) {
            var obj = _fromClassDescriptor(elements)
            var elementsAndFinisher = _toClassDescriptor(
              (0, decorators[i])(obj) || obj
            )
            if (elementsAndFinisher.finisher !== undefined) {
              finishers.push(elementsAndFinisher.finisher)
            }
            if (elementsAndFinisher.elements !== undefined) {
              elements = elementsAndFinisher.elements
              for (var j = 0; j < elements.length - 1; j++) {
                for (var k = j + 1; k < elements.length; k++) {
                  if (
                    elements[j].key === elements[k].key &&
                    elements[j].placement === elements[k].placement
                  ) {
                    throw new TypeError(
                      'Duplicated element (' + elements[j].key + ')'
                    )
                  }
                }
              }
            }
          }
          return { elements: elements, finishers: finishers }
        }

        function _fromElementDescriptor(element) {
          var obj = {
            kind: element.kind,
            key: element.key,
            placement: element.placement,
            descriptor: element.descriptor
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          if (element.kind === 'field') obj.initializer = element.initializer
          return obj
        }

        function _toElementDescriptors(elementObjects) {
          if (elementObjects === undefined) return
          return _toArray(elementObjects).map(function(elementObject) {
            var element = _toElementDescriptor(elementObject)
            _disallowProperty(
              elementObject,
              'finisher',
              'An element descriptor'
            )
            _disallowProperty(elementObject, 'extras', 'An element descriptor')
            return element
          })
        }

        function _toElementDescriptor(elementObject) {
          var kind = String(elementObject.kind)
          if (kind !== 'method' && kind !== 'field') {
            throw new TypeError(
              'An element descriptor\'s .kind property must be either "method" or' +
                ' "field", but a decorator created an element descriptor with' +
                ' .kind "' +
                kind +
                '"'
            )
          }
          var key = _toPropertyKey(elementObject.key)
          var placement = String(elementObject.placement)
          if (
            placement !== 'static' &&
            placement !== 'prototype' &&
            placement !== 'own'
          ) {
            throw new TypeError(
              'An element descriptor\'s .placement property must be one of "static",' +
                ' "prototype" or "own", but a decorator created an element descriptor' +
                ' with .placement "' +
                placement +
                '"'
            )
          }
          var descriptor = elementObject.descriptor
          _disallowProperty(elementObject, 'elements', 'An element descriptor')
          var element = {
            kind: kind,
            key: key,
            placement: placement,
            descriptor: Object.assign({}, descriptor)
          }
          if (kind !== 'field') {
            _disallowProperty(
              elementObject,
              'initializer',
              'A method descriptor'
            )
          } else {
            _disallowProperty(
              descriptor,
              'get',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'set',
              'The property descriptor of a field descriptor'
            )
            _disallowProperty(
              descriptor,
              'value',
              'The property descriptor of a field descriptor'
            )
            element.initializer = elementObject.initializer
          }
          return element
        }

        function _toElementFinisherExtras(elementObject) {
          var element = _toElementDescriptor(elementObject)
          var finisher = _optionalCallableProperty(elementObject, 'finisher')
          var extras = _toElementDescriptors(elementObject.extras)
          return { element: element, finisher: finisher, extras: extras }
        }

        function _fromClassDescriptor(elements) {
          var obj = {
            kind: 'class',
            elements: elements.map(_fromElementDescriptor)
          }
          var desc = { value: 'Descriptor', configurable: true }
          Object.defineProperty(obj, Symbol.toStringTag, desc)
          return obj
        }

        function _toClassDescriptor(obj) {
          var kind = String(obj.kind)
          if (kind !== 'class') {
            throw new TypeError(
              'A class descriptor\'s .kind property must be "class", but a decorator' +
                ' created a class descriptor with .kind "' +
                kind +
                '"'
            )
          }
          _disallowProperty(obj, 'key', 'A class descriptor')
          _disallowProperty(obj, 'placement', 'A class descriptor')
          _disallowProperty(obj, 'descriptor', 'A class descriptor')
          _disallowProperty(obj, 'initializer', 'A class descriptor')
          _disallowProperty(obj, 'extras', 'A class descriptor')
          var finisher = _optionalCallableProperty(obj, 'finisher')
          var elements = _toElementDescriptors(obj.elements)
          return { elements: elements, finisher: finisher }
        }

        function _disallowProperty(obj, name, objectType) {
          if (obj[name] !== undefined) {
            throw new TypeError(
              objectType + " can't have a ." + name + ' property.'
            )
          }
        }

        function _optionalCallableProperty(obj, name) {
          var value = obj[name]
          if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function")
          }
          return value
        }

        function _runClassFinishers(constructor, finishers) {
          for (var i = 0; i < finishers.length; i++) {
            var newConstructor = (0, finishers[i])(constructor)
            if (newConstructor !== undefined) {
              if (typeof newConstructor !== 'function') {
                throw new TypeError('Finishers must return a constructor.')
              }
              constructor = newConstructor
            }
          }
          return constructor
        }

        function _toPropertyKey(arg) {
          var key = _toPrimitive(arg, 'string')
          return _typeof(key) === 'symbol' ? key : String(key)
        }

        function _toPrimitive(input, hint) {
          if (_typeof(input) !== 'object' || input === null) return input
          var prim = input[Symbol.toPrimitive]
          if (prim !== undefined) {
            var res = prim.call(input, hint || 'default')
            if (_typeof(res) !== 'object') return res
            throw new TypeError('@@toPrimitive must return a primitive value.')
          }
          return (hint === 'string' ? String : Number)(input)
        }

        function _toArray(arr) {
          return (
            _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
          )
        }

        function _nonIterableRest() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }

        function _iterableToArray(iter) {
          if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
          )
            return Array.from(iter)
        }

        function _arrayWithHoles(arr) {
          if (Array.isArray(arr)) return arr
        }

        var _require = require('../domain'),
          Todo = _require.Todo

        var _require2 = require('../const'),
          _require2$ACTION = _require2.ACTION,
          CHANGE_FILTER = _require2$ACTION.CHANGE_FILTER,
          CLEAR_COMPLETED = _require2$ACTION.CLEAR_COMPLETED,
          DESTROY_TODO = _require2$ACTION.DESTROY_TODO,
          FINISH_EDIT_TODO = _require2$ACTION.FINISH_EDIT_TODO,
          MODEL_UPDATE = _require2$ACTION.MODEL_UPDATE,
          NEW_ITEM = _require2$ACTION.NEW_ITEM,
          TOGGLE_ALL = _require2$ACTION.TOGGLE_ALL,
          TOGGLE_TODO = _require2$ACTION.TOGGLE_TODO

        var _require3 = require('capsid'),
          notifies = _require3.notifies,
          make = _require3.make,
          on = _require3.on,
          component = _require3.component
        /**
         * The todo application class.
         */

        var Todoapp = _decorate([component('todoapp')], function(_initialize) {
          var Todoapp = function Todoapp() {
            _classCallCheck(this, Todoapp)

            _initialize(this)
          }

          return {
            F: Todoapp,
            d: [
              {
                kind: 'method',
                key: '__mount__',
                value: function value() {
                  this.todoFactory = new Todo.Factory()
                  this.todoRepository = new Todo.Repository()
                  this.todoCollection = this.todoRepository.getAll()
                  var router = make('router', this.el)
                  setTimeout(function() {
                    return router.onHashchange()
                  })
                  window.addEventListener('hashchange', function() {
                    return router.onHashchange()
                  })
                }
              },
              {
                kind: 'method',
                decorators: [notifies(MODEL_UPDATE, '.is-model-observer')],
                key: 'save',
                value: function value() {
                  this.todoRepository.saveAll(this.todoCollection)
                  return this
                }
              },
              {
                kind: 'method',
                decorators: [on(CHANGE_FILTER)],
                key: 'onFilterchange',
                value: function value(_ref) {
                  var filter = _ref.detail
                  this.filter = filter
                  this.save()
                }
              },
              {
                kind: 'method',
                decorators: [on(NEW_ITEM)],
                key: 'addTodo',
                value: function value(_ref2) {
                  var title = _ref2.detail
                  this.todoCollection.push(
                    this.todoFactory.createByTitle(title)
                  )
                  this.save()
                }
              },
              {
                kind: 'method',
                decorators: [on(TOGGLE_TODO)],
                key: 'toggle',
                value: function value(_ref3) {
                  var id = _ref3.detail
                  this.todoCollection.toggleById(id)
                  this.save()
                }
              },
              {
                kind: 'method',
                decorators: [on(DESTROY_TODO)],
                key: 'remove',
                value: function value(_ref4) {
                  var id = _ref4.detail
                  this.todoCollection.removeById(id)
                  this.save()
                }
              },
              {
                kind: 'method',
                decorators: [on(FINISH_EDIT_TODO)],
                key: 'editItem',
                value: function value(_ref5) {
                  var _ref5$detail = _ref5.detail,
                    id = _ref5$detail.id,
                    title = _ref5$detail.title
                  this.todoCollection.getById(id).title = title
                  this.save()
                }
              },
              {
                kind: 'method',
                decorators: [on(CLEAR_COMPLETED)],
                key: 'clearCompleted',
                value: function value() {
                  this.todoCollection = this.todoCollection.uncompleted()
                  this.save()
                }
              },
              {
                kind: 'method',
                decorators: [on(TOGGLE_ALL)],
                key: 'toggleAll',
                value: function value(_ref6) {
                  var toggle = _ref6.detail

                  if (toggle) {
                    this.todoCollection.completeAll()
                  } else {
                    this.todoCollection.uncompleteAll()
                  }

                  this.save()
                }
              }
            ]
          }
        })

        module.exports = Todoapp
      },
      { '../const': 16, '../domain': 18, capsid: 3 }
    ]
  },
  {},
  [23]
)
