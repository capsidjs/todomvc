(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//      


/**
 * The mapping from class-component name to its initializer function.
 */
var ccc = {};

//      
/**
 * Asserts the given condition holds, otherwise throws.
 * @param assertion The assertion expression
 * @param message The assertion message
 */
function check(assertion, message) {
  if (!assertion) {
    throw new Error(message);
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
  check(typeof name === 'string', 'The name should be a string');
  check(!!ccc[name], 'The coelement of the given name is not registered: ' + name);
}

//      

var READY_STATE_CHANGE = 'readystatechange';
var doc = document;

var ready = new Promise(function (resolve) {
  var checkReady = function checkReady() {
    if (doc.readyState === 'complete') {
      resolve();
      doc.removeEventListener(READY_STATE_CHANGE, checkReady);
    }
  };

  doc.addEventListener(READY_STATE_CHANGE, checkReady);

  checkReady();
});

var documentElement = doc.documentElement;

//      
/**
 * Initializes the class components of the given name in the range of the given element.
 * @param name The class name
 * @param el The dom where class componets are initialized
 * @throws when the class name is invalid type.
 */
var prep = function prep(name, el) {
  var classNames = void 0;

  if (!name) {
    classNames = Object.keys(ccc);
  } else {
    checkComponentNameIsValid(name);

    classNames = [name];
  }

  classNames.map(function (className) {
    [].map.call((el || doc).querySelectorAll(ccc[className].sel), ccc[className]);
  });
};

//      


var pluginHooks = [];

//      
var COELEMENT_DATA_KEY_PREFIX = '__coelement:';
var KEY_EVENT_LISTENERS = '__cc_listeners__';
var INITIALIZED_KEY = '__cc_initialized__';

//      

var initConstructor = function initConstructor(constructor) {
  constructor[INITIALIZED_KEY] = true;

  // Expose capsid here
  constructor.capsid = capsid;

  // If the constructor has the static __init__, then calls it.
  if (typeof constructor.__init__ === 'function') {
    constructor.__init__();
  }
};

//      

/**
 * Initialize component.
 * @param Constructor The coelement class
 * @param el The element
 * @param name The coelement name
 * @return The created coelement instance
 */
var mount = function mount(Constructor, el, name) {
  if (!Constructor[INITIALIZED_KEY]) {
    initConstructor(Constructor);
  }

  var coelem = new Constructor();

  // Assigns element to coelement's .el property
  coelem.el = el;

  if (name) {
    // Assigns coelement to element's "hidden" property
    el[COELEMENT_DATA_KEY_PREFIX + name] = coelem;
  }

  // Initialize event listeners defined by @emit decorator
  (Constructor[KEY_EVENT_LISTENERS] || []).map(function (listenerBinder) {
    listenerBinder(el, coelem);
  });

  // Executes plugin hooks
  pluginHooks.forEach(function (pluginHook) {
    pluginHook(el, coelem);
  });

  if (typeof coelem.__init__ === 'function') {
    coelem.__init__();
  }

  return coelem;
};

//      

/**
 * Registers the class-component for the given name and constructor and returns the constructor.
 * @param name The component name
 * @param Constructor The constructor of the class component
 * @return The registered component class
 */
var def = function def(name, Constructor) {
  check(typeof name === 'string', '`name` of a class component has to be a string.');
  check(typeof Constructor === 'function', '`Constructor` of a class component has to be a function');

  var initClass = name + '-initialized';

  /**
   * Initializes the html element by the configuration.
   * @param el The html element
   * @param coelem The dummy parameter, don't use
   */
  var initializer = function initializer(el, coelem) {
    var classList = el.classList;

    if (!classList.contains(initClass)) {
      classList.add(name, initClass);

      mount(Constructor, el, name);
    }
  };

  // The selector
  initializer.sel = '.' + name + ':not(.' + initClass + ')';

  ccc[name] = initializer;

  ready.then(function () {
    prep(name);
  });
};

//      

/**
 * Gets the eoelement instance of the class-component of the given name
 * @param name The class-component name
 * @param el The element
 */
var get = function get(name, el) {
  checkComponentNameIsValid(name);

  var coelement = el[COELEMENT_DATA_KEY_PREFIX + name];

  check(coelement, 'no coelement named: ' + name + ', on the dom: ' + el.tagName);

  return coelement;
};

//      

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 */
var init = function init(name, el) {
  checkComponentNameIsValid(name);

  ccc[name](el);
};

//      

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 * @return
 */
var make = function make(name, elm) {
  init(name, elm);

  return get(name, elm);
};

//

//      
/**
 * The decorator for registering event listener info to the method.
 * @param event The event name
 * @param at The selector
 * @param target The target prototype (decorator interface)
 * @param key The decorator target key (decorator interface)
 */
var on = function on(event) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      at = _ref.at;

  return function (target, key) {
    var Constructor = target.constructor;

    /**
     * @param el The element
     * @param coelem The coelement
     */
    Constructor[KEY_EVENT_LISTENERS] = (Constructor[KEY_EVENT_LISTENERS] || []).concat(function (el, coelem) {
      el.addEventListener(event, function (e) {
        if (!at || [].some.call(el.querySelectorAll(at), function (node) {
          return node === e.target || node.contains(e.target);
        })) {
          coelem[key](e);
        }
      });
    });
  };
};

var onClick = on('click');

//      
/**
 * Triggers the event.
 * @param el The element
 * @param type The event type
 * @param detail The optional detail object
 */
var trigger = function trigger(el, type, bubbles, detail) {
  el.dispatchEvent(new CustomEvent(type, { detail: detail, bubbles: bubbles }));
};

//      

/**
 * `@emit(event)` decorator
 *
 * This decorator adds the event emission at the end of the method.
 * If the method returns the promise, then the event is emitted when it is resolved.
 * @param event The event name
 */
var emit = function emit(event) {
  return function (target, key, descriptor) {
    var method = descriptor.value;

    descriptor.value = function () {
      var _this = this;

      var result = method.apply(this, arguments);

      var emit = function emit(x) {
        return trigger(_this.el, event, true, x);
      };

      if (result && result.then) {
        result.then(emit);
      } else {
        emit(result);
      }

      return result;
    };
  };
};

/**
 * `@emit.first(event)` decorator.
 * This decorator adds the event emission at the beginning of the method.
 * @param event The event name
 */
emit.first = function (event) {
  return function (target, key, descriptor) {
    var method = descriptor.value;

    descriptor.value = function () {
      trigger(this.el, event, true, arguments[0]);

      return method.apply(this, arguments);
    };
  };
};

//      

var matches = documentElement.matches || documentElement.webkitMatchesSelector || documentElement.msMatchesSelector;

//      
/**
 * Transform camelCase string to kebab-case string
 * @param camelString The string in camelCase
 * @return The string in kebab-case
 */
var camelToKebab = function camelToKebab(camelString) {
  return camelString.replace(/(?!^)[A-Z]/g, '-$&').toLowerCase();
};

//      

/**
 * Replaces the getter with the function which accesses the class-component of the given name.
 * @param {string} name The class component name
 * @param {string} [selector] The selector to access class component dom. Optional. Default is '.[name]'.
 * @param {object} target The prototype of the target class
 * @param {string} key The name of the property
 * @param {object} descriptor The property descriptor
 */
var wireByNameAndSelector = function wireByNameAndSelector(name, selector) {
  return function (target, key, descriptor) {
    var sel = selector || '.' + name;

    descriptor.get = function () {
      if (matches.call(this.el, sel)) {
        return get(name, this.el);
      }

      var nodes = this.el.querySelectorAll(sel);

      if (nodes.length) {
        return get(name, nodes[0]);
      }

      throw new Error('wired class-component "' + name + '" is not available at ' + this.el.tagName + '(class=[' + this.constructor.name + ']');
    };
  };
};

/**
 * Wires the class component of the name of the key to the property of the same name.
 */
var wireComponent = function wireComponent(target, key, descriptor) {
  if (typeof target === 'string') {
    // If target is a string, then we suppose this is called as @wire(componentName, selector) and therefore
    // we need to return the following expression (it works as another decorator).
    return wireByNameAndSelector(target, key);
  }

  wireByNameAndSelector(camelToKebab(key))(target, key, descriptor);
};

var wireElement = function wireElement(sel) {
  return function (target, key, descriptor) {
    descriptor.get = function () {
      return this.el.querySelector(sel);
    };
  };
};

var wireElementAll = function wireElementAll(sel) {
  return function (target, key, descriptor) {
    descriptor.get = function () {
      return this.el.querySelectorAll(sel);
    };
  };
};

wireComponent.el = wireElement;
wireComponent.elAll = wireElementAll;

//      

/**
 * The decorator for class component registration.
 *
 * if `name` is function, then use it as class itself and the component name is kebabized version of its name.
 * @param name The class name or the implementation class itself
 * @return The decorator if the class name is given, undefined if the implementation class is given
 */
var component = function component(name) {
  if (typeof name !== 'function') {
    return function (Cls) {
      def(name, Cls);
      return Cls;
    };
  }

  return component(camelToKebab(name.name))(name);
};

//      

/**
 * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
 */
var pub = function pub(event, selector) {
  return function (target, key, descriptor) {
    var method = descriptor.value;

    descriptor.value = function () {
      var _this2 = this;

      var result = method.apply(this, arguments);
      var forEach = [].forEach;

      var emit = function emit(x) {
        forEach.call(_this2.el.querySelectorAll(selector), function (el) {
          return trigger(el, event, false, x);
        });
      };

      if (result && result.then) {
        result.then(emit);
      } else {
        emit(result);
      }

      return result;
    };
  };
};

on.click = onClick;

//      


var capsid = Object.freeze({
  def: def,
  prep: prep,
  make: make,
  mount: mount,
  get: get,
  on: on,
  emit: emit,
  wire: wireComponent,
  component: component,
  pub: pub,
  __ccc__: ccc,
  pluginHooks: pluginHooks
});

exports.def = def;
exports.prep = prep;
exports.make = make;
exports.mount = mount;
exports.get = get;
exports.on = on;
exports.emit = emit;
exports.wire = wireComponent;
exports.component = component;
exports.pub = pub;
exports.__ccc__ = ccc;
exports.pluginHooks = pluginHooks;
},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Returns the object from the given array which sutisfies the given predicate first.
 * @param {object[]} array The array to test
 * @param {Function} predicate The predicate
 */
var _first = function _first(array, predicate) {
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
};

/**
 * The collection model of HashRoutes.
 */

var HashRouteCollection = function () {
  function HashRouteCollection() {
    _classCallCheck(this, HashRouteCollection);

    this.routes = [];
  }

  /**
   * @param {HashRoute}
   */


  _createClass(HashRouteCollection, [{
    key: "add",
    value: function add(route) {
      this.routes.push(route);
    }

    /**
     * @param {object} obj The object
     * @param {string} path The path
     */

  }, {
    key: "dispatch",
    value: function dispatch(obj, path) {
      var route = this.first(path);

      if (route == null) {
        return;
      }

      route.dispatch(obj, path);
    }
  }, {
    key: "first",
    value: function first(path) {
      return _first(this.routes, function (route) {
        return route.test(path);
      });
    }
  }]);

  return HashRouteCollection;
}();

module.exports = HashRouteCollection;
},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pathToRegexp = require('path-to-regexp');

/**
 * The route model.
 */

var HashRoute = function () {
  /**
   * @param {string} pattern The pattern string
   * @param {RegExp} re The regexp
   * @param {object[]} keys The key informations
   */

  function HashRoute(_ref) {
    var pattern = _ref.pattern;
    var re = _ref.re;
    var keys = _ref.keys;
    var property = _ref.property;

    _classCallCheck(this, HashRoute);

    this.pattern = pattern;
    this.re = re;
    this.keys = keys;
    this.property = property;
  }

  /**
   * Creates the hash route object from the given pattern and property name.
   * @param {string} pattern The route pattern
   * @param {string} property The property name
   */


  _createClass(HashRoute, [{
    key: 'match',


    /**
     * Returns the params object if the path matches the pattern and returns null otherwise.
     * @param {string} path The path to test
     * @return {object}
     */
    value: function match(path) {
      var result = {};

      var match = path.match(this.re);

      if (match == null) {
        return null;
      }

      this.keys.forEach(function (keyInfo, i) {
        result[keyInfo.name] = match[i + 1];
      });

      return result;
    }

    /**
     * Tests if the path matches the route pattern.
     * @param {string} path The path
     * @return {boolean}
     */

  }, {
    key: 'test',
    value: function test(path) {
      return this.re.test(path);
    }

    /**
     * Dispatches the route with the given path.
     * @param {string} path The path
     */

  }, {
    key: 'dispatch',
    value: function dispatch(obj, path) {
      var params = this.match(path);

      return obj[this.property](params, path, this);
    }
  }], [{
    key: 'createFromPatternAndProperty',
    value: function createFromPatternAndProperty(pattern, property) {
      var keys = [];
      var re = pathToRegexp(pattern, keys);

      return new HashRoute({ pattern: pattern, re: re, keys: keys, property: property });
    }
  }]);

  return HashRoute;
}();

module.exports = HashRoute;
},{"path-to-regexp":6}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var HashRoute = require('./hash-route');
var HashRouteCollection = require('./hash-route-collection');

var routes = void 0;

/**
 * Resets the route info.
 */
exports.reset = function () {
  routes = new HashRouteCollection();
};

exports.reset();

/**
 * @param {string} pattern The path pattern
 * @param {object} target The target of decorator
 * @param {string} key The key name
 * @param {object} descriptor The descriptor
 */
exports.route = function (target, key, descriptor) {
  if (typeof target === 'string') {
    var _ret = function () {
      // This is @route(routePattern) usage
      // So the first argument is the pattern string.
      var pattern = target;

      return {
        v: function v(target, key, descriptor) {
          routes.add(HashRoute.createFromPatternAndProperty(pattern, key));
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  // This is @route methodName() {} usage
  // Uses the key as the route pattern
  routes.add(HashRoute.createFromPatternAndProperty(key, key));
};

/**
 * Dispatches the route.
 * @param {object} obj The router methods host
 */
exports.dispatch = function (obj, path) {
  path = path || location.hash;

  routes.dispatch(obj, path);
};
},{"./hash-route":3,"./hash-route-collection":2}],5:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],6:[function(require,module,exports){
var isarray = require('isarray')

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = options && options.delimiter || '/'
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = res[2] || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
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
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
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
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
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
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      keys.push(token)

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  var delimiter = escapeString(options.delimiter || '/')
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

},{"isarray":5}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _require = require('../const'),
    KEYCODE = _require.KEYCODE,
    EDIT_TODO = _require.ACTION.EDIT_TODO;

var _require2 = require('capsid'),
    emit = _require2.emit,
    on = _require2.on,
    component = _require2.component;

/**
 * TodoEdit controls the edit area of each todo item.
 */


var Edit = (_dec = on('keypress'), _dec2 = on('keydown'), _dec3 = on('blur'), _dec4 = emit(EDIT_TODO), _dec5 = emit(EDIT_TODO), component(_class = (_class2 = function () {
  function Edit() {
    _classCallCheck(this, Edit);
  }

  _createClass(Edit, [{
    key: 'onStart',
    value: function onStart() {
      this.el.focus();
    }

    /**
     * Updates the view with the given value.
     */

  }, {
    key: 'onUpdate',
    value: function onUpdate(value) {
      this.el.value = value;
      this.el.dataset.prevValue = value;
    }

    /**
     * Handler for the key press events.
     *
     * @param {Event} e The event
     */

  }, {
    key: 'onKeypress',
    value: function onKeypress(e) {
      if (e.which === KEYCODE.ENTER) {
        this.onFinish();
      } else if (e.which === KEYCODE.ESCAPE) {
        this.onCancel();
      }
    }

    /**
     * Finishes editing with current value.
     */

  }, {
    key: 'onFinish',
    value: function onFinish() {
      var value = this.el.value;

      this.onUpdate(value);

      return value;
    }

    /**
     * Cancels editing and revert the change of the value.
     */

  }, {
    key: 'onCancel',
    value: function onCancel() {
      var value = this.el.dataset.prevValue;

      this.onUpdate(value);

      return value;
    }
  }]);

  return Edit;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'onKeypress', [_dec, _dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'onKeypress'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onFinish', [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'onFinish'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onCancel', [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, 'onCancel'), _class2.prototype)), _class2)) || _class);


module.exports = Edit;

},{"../const":14,"capsid":1}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _desc, _value, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _require = require('../domain'),
    Filter = _require.Filter;

var _require2 = require('../const'),
    _require2$ACTION = _require2.ACTION,
    MODEL_UPDATE = _require2$ACTION.MODEL_UPDATE,
    CLEAR_COMPLETED = _require2$ACTION.CLEAR_COMPLETED;

var _require3 = require('capsid'),
    on = _require3.on,
    emit = _require3.emit,
    wire = _require3.wire,
    component = _require3.component;

var Footer = (_dec = wire.el('.clear-completed'), _dec2 = wire.el('a[href="#/active"]'), _dec3 = wire.el('a[href="#/completed"]'), _dec4 = wire.el('a[href="#/"]'), _dec5 = wire.el('.todo-count'), _dec6 = on('click', { at: '.clear-completed' }), _dec7 = emit(CLEAR_COMPLETED), _dec8 = on(MODEL_UPDATE), component(_class = (_class2 = function () {
  function Footer() {
    _classCallCheck(this, Footer);
  }

  _createClass(Footer, [{
    key: 'clearCompletedTodos',
    value: function clearCompletedTodos() {}
  }, {
    key: 'onUpdate',
    value: function onUpdate(_ref) {
      var _ref$detail = _ref.detail,
          todoCollection = _ref$detail.todoCollection,
          filter = _ref$detail.filter;

      var countLeft = todoCollection.uncompleted().length;

      this.clearCompletedButton.style.display = todoCollection.completed().isEmpty() ? 'none' : 'inline';

      this.activeFilterButton.classList.toggle('selected', filter === Filter.ACTIVE);
      this.completedFilterButton.classList.toggle('selected', filter === Filter.COMPLETED);
      this.allFilterButton.classList.toggle('selected', filter === Filter.ALL);

      this.todoCountLabel.innerHTML = '<strong>' + countLeft + ' item' + (countLeft === 1 ? '' : 's') + ' left</strong>';

      this.el.style.display = todoCollection.isEmpty() ? 'none' : 'block';
    }
  }, {
    key: 'clearCompletedButton',
    get: function get() {}
  }, {
    key: 'activeFilterButton',
    get: function get() {}
  }, {
    key: 'completedFilterButton',
    get: function get() {}
  }, {
    key: 'allFilterButton',
    get: function get() {}
  }, {
    key: 'todoCountLabel',
    get: function get() {}
  }]);

  return Footer;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'clearCompletedButton', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'clearCompletedButton'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'activeFilterButton', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'activeFilterButton'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'completedFilterButton', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'completedFilterButton'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'allFilterButton', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'allFilterButton'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'todoCountLabel', [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, 'todoCountLabel'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'clearCompletedTodos', [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, 'clearCompletedTodos'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onUpdate', [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, 'onUpdate'), _class2.prototype)), _class2)) || _class);


module.exports = Footer;

},{"../const":14,"../domain":16,"capsid":1}],9:[function(require,module,exports){
'use strict';

require('./todo-item');
require('./new-todo');
require('./todo-list');
require('./main');
require('./edit');
require('./footer');

},{"./edit":7,"./footer":8,"./main":10,"./new-todo":11,"./todo-item":12,"./todo-list":13}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _require = require('../const'),
    _require$ACTION = _require.ACTION,
    TOGGLE_ALL = _require$ACTION.TOGGLE_ALL,
    MODEL_UPDATE = _require$ACTION.MODEL_UPDATE;

var _require2 = require('capsid'),
    component = _require2.component,
    wire = _require2.wire,
    emit = _require2.emit,
    on = _require2.on;

var Main = (_dec = wire.el('.toggle-all'), _dec2 = on('click', { at: '.toggle-all' }), _dec3 = emit(TOGGLE_ALL), _dec4 = on(MODEL_UPDATE), component(_class = (_class2 = function () {
  function Main() {
    _classCallCheck(this, Main);
  }

  _createClass(Main, [{
    key: 'toggleAll',
    value: function toggleAll() {
      return this.toggleAllButton.checked;
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(_ref) {
      var todoCollection = _ref.detail.todoCollection;

      this.toggleAllButton.checked = todoCollection.uncompleted().isEmpty();

      this.el.style.display = todoCollection.isEmpty() ? 'none' : 'block';
    }
  }, {
    key: 'toggleAllButton',
    get: function get() {}
  }]);

  return Main;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'toggleAllButton', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'toggleAllButton'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'toggleAll', [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'toggleAll'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onUpdate', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'onUpdate'), _class2.prototype)), _class2)) || _class);


module.exports = Main;

},{"../const":14,"capsid":1}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class, _desc, _value, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var Const = require('../const');

var KEYCODE = Const.KEYCODE,
    NEW_ITEM = Const.ACTION.NEW_ITEM;

var _require = require('capsid'),
    emit = _require.emit,
    on = _require.on,
    component = _require.component;

/**
 * TodoInput class controls the input for adding todos.
 */


var NewTodo = (_dec = on('keypress'), _dec2 = emit(NEW_ITEM), component(_class = (_class2 = function () {
  function NewTodo() {
    _classCallCheck(this, NewTodo);
  }

  _createClass(NewTodo, [{
    key: 'onKeypress',
    value: function onKeypress(e) {
      if (e.which !== KEYCODE.ENTER) {
        return;
      }

      var title = this.el.value && this.el.value.trim();

      if (!title) {
        return;
      }

      this.emitNewItem(title);
    }
  }, {
    key: 'emitNewItem',
    value: function emitNewItem(title) {
      this.el.value = '';

      return title;
    }
  }]);

  return NewTodo;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'onKeypress', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'onKeypress'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'emitNewItem', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'emitNewItem'), _class2.prototype)), _class2)) || _class);


module.exports = NewTodo;

},{"../const":14,"capsid":1}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _desc, _value, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _require = require('../const'),
    _require$ACTION = _require.ACTION,
    EDIT_TODO = _require$ACTION.EDIT_TODO,
    TOGGLE_TODO = _require$ACTION.TOGGLE_TODO,
    DESTROY_TODO = _require$ACTION.DESTROY_TODO,
    FINISH_EDIT_TODO = _require$ACTION.FINISH_EDIT_TODO;

var _require2 = require('capsid'),
    on = _require2.on,
    emit = _require2.emit,
    prep = _require2.prep,
    wire = _require2.wire,
    component = _require2.component;

/**
 * TodoItem class controls todo item in a list.
 */


var TodoItem = (_dec = wire.el('label'), _dec2 = wire.el('.toggle'), _dec3 = on('click', { at: '.toggle' }), _dec4 = emit(TOGGLE_TODO), _dec5 = on('click', { at: '.destroy' }), _dec6 = emit(DESTROY_TODO), _dec7 = on('dblclick', { at: 'label' }), _dec8 = on(EDIT_TODO), _dec9 = emit(FINISH_EDIT_TODO), component(_class = (_class2 = function () {
  function TodoItem() {
    _classCallCheck(this, TodoItem);
  }

  _createClass(TodoItem, [{
    key: '__init__',
    value: function __init__() {
      this.el.innerHTML = '\n      <div class="view">\n        <input type="checkbox" class="toggle"/>\n        <label></label>\n        <button class="destroy"></button>\n      </div>\n      <input class="edit" />\n    ';

      prep('edit', this.el);
    }

    /**
     * Updates the todo title by todo model.
     * @param {Todo} todo The todo
     * @param {String} todo.id The id
     * @param {String} todo.title The title
     * @param {Boolean} todo.completed If completed or not
     */

  }, {
    key: 'update',
    value: function update(todo) {
      this.el.setAttribute('id', todo.id);
      this.label.textContent = todo.title;
      this.edit.onUpdate(todo.title);

      this.toggle.checked = todo.completed;
      this.el.classList.toggle('completed', todo.completed);
    }

    /**
     * Toggles the completed state of the item.
     * @private
     */

  }, {
    key: 'toggleCompleted',
    value: function toggleCompleted() {
      return this.el.getAttribute('id');
    }

    /**
     * Destroys the item.
     * @private
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      return this.el.getAttribute('id');
    }

    /**
     * Starts editing.
     * @private
     */

  }, {
    key: 'startEditing',
    value: function startEditing() {
      this.el.classList.add('editing');
      this.edit.onStart();
    }

    /**
     * Stops editing.
     * @private
     */

  }, {
    key: 'stopEditing',
    value: function stopEditing(_ref) {
      var title = _ref.detail;

      this.el.classList.remove('editing');

      if (!title) {
        this.destroy();

        return;
      }

      this.finishEditTodo(title);
    }
  }, {
    key: 'finishEditTodo',
    value: function finishEditTodo(title) {
      return {
        title: title,
        id: this.el.getAttribute('id')
      };
    }
  }, {
    key: 'label',
    get: function get() {}
  }, {
    key: 'toggle',
    get: function get() {}
  }, {
    key: 'edit',
    get: function get() {}
  }]);

  return TodoItem;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'label', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'label'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'toggle', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'toggle'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'edit', [wire], Object.getOwnPropertyDescriptor(_class2.prototype, 'edit'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'toggleCompleted', [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'toggleCompleted'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'destroy', [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, 'destroy'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'startEditing', [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, 'startEditing'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'stopEditing', [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, 'stopEditing'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'finishEditTodo', [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, 'finishEditTodo'), _class2.prototype)), _class2)) || _class);


module.exports = TodoItem;

},{"../const":14,"capsid":1}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _desc, _value, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _require = require('../const'),
    MODEL_UPDATE = _require.ACTION.MODEL_UPDATE;

var _require2 = require('capsid'),
    component = _require2.component,
    get = _require2.get,
    make = _require2.make,
    on = _require2.on;

/**
 * The todo list component.
 */


var TodoList = (_dec = on(MODEL_UPDATE), component(_class = (_class2 = function () {
  function TodoList() {
    _classCallCheck(this, TodoList);
  }

  _createClass(TodoList, [{
    key: 'onRefresh',
    value: function onRefresh(_ref) {
      var _this = this;

      var _ref$detail = _ref.detail,
          todoCollection = _ref$detail.todoCollection,
          filter = _ref$detail.filter;

      var visibleTodos = todoCollection.filterBy(filter);

      if (visibleTodos.length === this.el.querySelectorAll('.todo-item').length) {
        visibleTodos.forEach(function (todo) {
          get('todo-item', _this.el.querySelector('[id="' + todo.id + '"')).update(todo);
        });
      } else {
        this.el.innerHTML = '';

        visibleTodos.forEach(function (todo) {
          _this.appendTodoItem(todo);
        });
      }
    }

    /**
     * Appends todo item by the todo model.
     * @param {Todo} todo The todo model
     */

  }, {
    key: 'appendTodoItem',
    value: function appendTodoItem(todo) {
      var li = document.createElement('li');
      this.el.appendChild(li);
      make('todo-item', li).update(todo);
    }
  }]);

  return TodoList;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'onRefresh', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'onRefresh'), _class2.prototype)), _class2)) || _class);


module.exports = TodoList;

},{"../const":14,"capsid":1}],14:[function(require,module,exports){
'use strict';

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
};

},{}],15:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Filter = function () {
  function Filter() {
    _classCallCheck(this, Filter);
  }

  _createClass(Filter, [{
    key: "isAll",

    /**
     * @return {boolean}
     */
    value: function isAll() {
      return false;
    }
  }]);

  return Filter;
}();

var AllFilter = function (_Filter) {
  _inherits(AllFilter, _Filter);

  function AllFilter() {
    _classCallCheck(this, AllFilter);

    return _possibleConstructorReturn(this, (AllFilter.__proto__ || Object.getPrototypeOf(AllFilter)).apply(this, arguments));
  }

  _createClass(AllFilter, [{
    key: "isAll",
    value: function isAll() {
      return true;
    }
  }]);

  return AllFilter;
}(Filter);

Filter.ALL = new AllFilter();
Filter.ACTIVE = new Filter();
Filter.COMPLETED = new Filter();

module.exports = Filter;

},{}],16:[function(require,module,exports){
'use strict';

exports.Filter = require('./filter');
exports.Todo = require('./todo');
exports.Todo.Collection = require('./todo-collection');
exports.Todo.Repository = require('./todo-repository');
exports.Todo.Factory = require('./todo-factory');

},{"./filter":15,"./todo":20,"./todo-collection":17,"./todo-factory":18,"./todo-repository":19}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Filter = require('./filter');

/**
 * TodoCollection is the colleciton model of the todo model.
 */

var TodoCollection = function () {
  /**
   * @param {Todo[]} todos The todo items
   */
  function TodoCollection(todos) {
    var _this = this;

    _classCallCheck(this, TodoCollection);

    todos = todos || [];

    this.items = todos;

    this.map = {};

    this.items.forEach(function (todo) {
      _this.map[todo.id] = todo;
    });
  }

  /**
   * Gets the todo by the id.
   *
   * @param {String} id The todo id
   * @return {Todo}
   */


  _createClass(TodoCollection, [{
    key: 'getById',
    value: function getById(id) {
      return this.map[id];
    }

    /**
     * Toggles the todo's completed flag by the given id.
     * @param {String} id The todo id
     */

  }, {
    key: 'toggleById',
    value: function toggleById(id) {
      var todo = this.getById(id);

      todo.completed = !todo.completed;
    }

    /**
     * Iterates calling of func in the given context.
     * @param {Function} func The iteration function
     * @param {Object} ctx The context
     */

  }, {
    key: 'forEach',
    value: function forEach(func, ctx) {
      this.items.forEach(func, ctx);
    }

    /**
     * Pushes (appends) the given todo at the end of the list
     *
     * @param {Todo} todo The todo
     */

  }, {
    key: 'push',
    value: function push(todo) {
      this.items.push(todo);

      this.map[todo.id] = todo;
    }

    /**
     * Removes the todo.
     * @param {Todo} todo The todo to remvoe
     */

  }, {
    key: 'remove',
    value: function remove(todo) {
      if (!this.has(todo)) {
        throw new Error('The colletion does not have the todo: ' + todo.toString());
      }

      this.items.splice(this.items.indexOf(todo), 1);
      delete this.map[todo.id];
    }

    /**
     * Removes the item by the id.
     * @param {String} id The todo id
     */

  }, {
    key: 'removeById',
    value: function removeById(id) {
      var todo = this.getById(id);

      if (todo) {
        this.remove(todo);
      }
    }

    /**
     * Checks if the given todo is included by the list
     * @private
     * @param {Todo} todo The todo
     */

  }, {
    key: 'has',
    value: function has(todo) {
      return this.items.indexOf(todo) !== -1;
    }

    /**
     * Returns a todo subcollection of completed items.
     * @return {TodoCollection}
     */

  }, {
    key: 'completed',
    value: function completed() {
      return new TodoCollection(this.items.filter(function (todo) {
        return todo.completed;
      }));
    }

    /**
     * Returns a todo subcollection of uncompleted items.
     * @return {TodoCollection}
     */

  }, {
    key: 'uncompleted',
    value: function uncompleted() {
      return new TodoCollection(this.items.filter(function (todo) {
        return !todo.completed;
      }));
    }

    /**
     * Gets the array of todos
     * @return {Todo[]}
     */

  }, {
    key: 'toArray',
    value: function toArray() {
      return this.items.slice(0);
    }

    /**
     * Checks if the collection is empty.
     * @param {Boolean}
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.length === 0;
    }

    /**
     * Returns the length.
     * @return {number}
     */

  }, {
    key: 'completeAll',


    /**
     * Completes all the todos.
     */
    value: function completeAll() {
      this.items.forEach(function (todo) {
        todo.completed = true;
      });
    }

    /**
     * Uncompletes all the todos.
     */

  }, {
    key: 'uncompleteAll',
    value: function uncompleteAll() {
      this.items.forEach(function (todo) {
        todo.completed = false;
      });
    }

    /**
     * Returns the filtered todos by the given filter object.
     * @param {Filter} filter The filter
     * @return {TodoCollection}
     */

  }, {
    key: 'filterBy',
    value: function filterBy(filter) {
      if (filter === Filter.ACTIVE) {
        return this.uncompleted();
      } else if (filter === Filter.COMPLETED) {
        return this.completed();
      }

      return this;
    }
  }, {
    key: 'length',
    get: function get() {
      return this.items.length;
    }
  }]);

  return TodoCollection;
}();

module.exports = TodoCollection;

},{"./filter":15}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Todo = require('./todo');

/**
 * TodoFactory is the factory for todo.
 */

var TodoFactory = function () {
  function TodoFactory() {
    _classCallCheck(this, TodoFactory);
  }

  _createClass(TodoFactory, [{
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
      });
    }

    /**
     * Creates Todo model from the object
     * @param {Object} obj The source object
     * @return {Todo}
     */

  }, {
    key: 'createFromObject',
    value: function createFromObject(obj) {
      return new Todo(obj.id, obj.title, obj.completed);
    }

    /**
     * Generates a random id.
     * @private
     */

  }, {
    key: 'generateId',
    value: function generateId() {
      return Math.floor(Math.random() * 1000000000).toString();
    }
  }]);

  return TodoFactory;
}();

module.exports = TodoFactory;

},{"./todo":20}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Const = require('../const');
var TodoCollection = require('./todo-collection');

var TodoRepository = function () {
  function TodoRepository() {
    _classCallCheck(this, TodoRepository);
  }

  _createClass(TodoRepository, [{
    key: 'getAll',

    /**
     * Gets all the todo items.
     *
     * @return {TodoList}
     */
    value: function getAll() {
      var json = window.localStorage[Const.STORAGE_KEY.TODO_LIST];

      if (!json) {
        return new TodoCollection([]);
      }

      var array = void 0;

      try {
        array = JSON.parse(json);
      } catch (err) {
        array = [];
      }

      return new TodoCollection(array);
    }

    /**
     * Saves all the todo items.
     * @param {domain.TodoCollection} todos
     */

  }, {
    key: 'saveAll',
    value: function saveAll(todos) {
      var json = JSON.stringify(this.collectionToArray(todos));

      window.localStorage[Const.STORAGE_KEY.TODO_LIST] = json;
    }

    /**
     * Converts the todo collections into js array of objects.
     * @private
     * @param {TodoCollection} todos The todo collection
     * @return {Array<Object>}
     */

  }, {
    key: 'collectionToArray',
    value: function collectionToArray(todos) {
      var _this = this;

      return todos.toArray().map(function (todo) {
        return _this.toObject(todo);
      });
    }

    /**
     * Converts the todo item into js object.
     * @private
     * @param {Todo} todo The todo item
     * @return {Object}
     */

  }, {
    key: 'toObject',
    value: function toObject(todo) {
      return {
        id: todo.id,
        title: todo.title,
        completed: todo.completed
      };
    }
  }]);

  return TodoRepository;
}();

module.exports = TodoRepository;

},{"../const":14,"./todo-collection":17}],20:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  _classCallCheck(this, Todo);

  this.id = id;
  this.title = title;
  this.completed = completed;
};

module.exports = Todo;

},{}],21:[function(require,module,exports){
'use strict';

require('./component');
require('./service');

},{"./component":9,"./service":22}],22:[function(require,module,exports){
'use strict';

require('./router');
require('./todoapp');

},{"./router":23,"./todoapp":24}],23:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _require = require('hash-route'),
    route = _require.route,
    dispatch = _require.dispatch;

var _require2 = require('../const'),
    CHANGE_FILTER = _require2.ACTION.CHANGE_FILTER;

var _require3 = require('../domain'),
    Filter = _require3.Filter;

var _require4 = require('capsid'),
    component = _require4.component,
    emit = _require4.emit;

/**
 * The observer of the filter and invokes filterchange event when it's changed.
 */


var Router = (_dec = emit(CHANGE_FILTER), _dec2 = emit(CHANGE_FILTER), _dec3 = emit(CHANGE_FILTER), _dec4 = emit(CHANGE_FILTER), component(_class = (_class2 = function () {
  function Router() {
    _classCallCheck(this, Router);
  }

  _createClass(Router, [{
    key: 'onHashchange',
    value: function onHashchange() {
      dispatch(this);
    }
  }, {
    key: '#/all',
    value: function all() {
      return Filter.ALL;
    }
  }, {
    key: '#/active',
    value: function active() {
      return Filter.ACTIVE;
    }
  }, {
    key: '#/completed',
    value: function completed() {
      return Filter.COMPLETED;
    }
  }, {
    key: '*',
    value: function _() {
      return Filter.ALL;
    }
  }]);

  return Router;
}(), (_applyDecoratedDescriptor(_class2.prototype, '#/all', [route, _dec], Object.getOwnPropertyDescriptor(_class2.prototype, '#/all'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '#/active', [route, _dec2], Object.getOwnPropertyDescriptor(_class2.prototype, '#/active'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '#/completed', [route, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, '#/completed'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '*', [route, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, '*'), _class2.prototype)), _class2)) || _class);


module.exports = Router;

},{"../const":14,"../domain":16,"capsid":1,"hash-route":4}],24:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _desc, _value, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _require = require('../domain'),
    Todo = _require.Todo;

var _require2 = require('../const'),
    _require2$ACTION = _require2.ACTION,
    CHANGE_FILTER = _require2$ACTION.CHANGE_FILTER,
    CLEAR_COMPLETED = _require2$ACTION.CLEAR_COMPLETED,
    DESTROY_TODO = _require2$ACTION.DESTROY_TODO,
    FINISH_EDIT_TODO = _require2$ACTION.FINISH_EDIT_TODO,
    MODEL_UPDATE = _require2$ACTION.MODEL_UPDATE,
    NEW_ITEM = _require2$ACTION.NEW_ITEM,
    TOGGLE_ALL = _require2$ACTION.TOGGLE_ALL,
    TOGGLE_TODO = _require2$ACTION.TOGGLE_TODO;

var _require3 = require('capsid'),
    pub = _require3.pub,
    make = _require3.make,
    on = _require3.on,
    component = _require3.component;

/**
 * The todo application class.
 */


var Todoapp = (_dec = pub(MODEL_UPDATE, '.is-model-observer'), _dec2 = on(CHANGE_FILTER), _dec3 = on(NEW_ITEM), _dec4 = on(TOGGLE_TODO), _dec5 = on(DESTROY_TODO), _dec6 = on(FINISH_EDIT_TODO), _dec7 = on(CLEAR_COMPLETED), _dec8 = on(TOGGLE_ALL), component(_class = (_class2 = function () {
  function Todoapp() {
    _classCallCheck(this, Todoapp);
  }

  _createClass(Todoapp, [{
    key: '__init__',
    value: function __init__() {
      this.todoFactory = new Todo.Factory();
      this.todoRepository = new Todo.Repository();
      this.todoCollection = this.todoRepository.getAll();

      var router = make('router', this.el);

      setTimeout(function () {
        return router.onHashchange();
      });

      window.addEventListener('hashchange', function () {
        return router.onHashchange();
      });
    }

    /**
     * Saves the current todo collection state.
     */

  }, {
    key: 'save',
    value: function save() {
      this.todoRepository.saveAll(this.todoCollection);

      return this;
    }
  }, {
    key: 'onFilterchange',
    value: function onFilterchange(_ref) {
      var filter = _ref.detail;

      this.filter = filter;
      this.save();
    }

    /**
     * Adds new item by the given title.
     * @private
     * @param {Object} e The event object
     * @param {String} title The todo title
     */

  }, {
    key: 'addTodo',
    value: function addTodo(_ref2) {
      var title = _ref2.detail;

      this.todoCollection.push(this.todoFactory.createByTitle(title));
      this.save();
    }

    /**
     * Toggles the todo state of the given id.
     * @param {object} e The event object
     * @param {String} id The todo id
     */

  }, {
    key: 'toggle',
    value: function toggle(_ref3) {
      var id = _ref3.detail;

      this.todoCollection.toggleById(id);
      this.save();
    }

    /**
     * Removes the todo of the given id.
     * @param {object} e The event object
     * @param {String} id The todo id
     */

  }, {
    key: 'remove',
    value: function remove(_ref4) {
      var id = _ref4.detail;

      this.todoCollection.removeById(id);
      this.save();
    }

    /**
     * Edits the todo item of the given id by the given title.
     * @param {object} e The event object
     * @param {string} id The todo id
     * @param {string} title The todo title
     */

  }, {
    key: 'editItem',
    value: function editItem(_ref5) {
      var _ref5$detail = _ref5.detail,
          id = _ref5$detail.id,
          title = _ref5$detail.title;

      this.todoCollection.getById(id).title = title;
      this.save();
    }

    /**
     * Clears the completed todos.
     */

  }, {
    key: 'clearCompleted',
    value: function clearCompleted() {
      this.todoCollection = this.todoCollection.uncompleted();
      this.save();
    }
  }, {
    key: 'toggleAll',
    value: function toggleAll(_ref6) {
      var toggle = _ref6.detail;

      if (toggle) {
        this.todoCollection.completeAll();
      } else {
        this.todoCollection.uncompleteAll();
      }

      this.save();
    }
  }]);

  return Todoapp;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'save', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'save'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'onFilterchange', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'onFilterchange'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'addTodo', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'addTodo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'toggle', [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, 'toggle'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'remove', [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, 'remove'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'editItem', [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, 'editItem'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'clearCompleted', [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, 'clearCompleted'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'toggleAll', [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, 'toggleAll'), _class2.prototype)), _class2)) || _class);


module.exports = Todoapp;

},{"../const":14,"../domain":16,"capsid":1}]},{},[21]);
