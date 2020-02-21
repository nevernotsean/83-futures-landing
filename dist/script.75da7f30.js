// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"script.js":[function(require,module,exports) {
function createTitles(e) {
  var titleCount = 5;
  var $el = $(this),
      $parent;
  $el.wrap('<span class="mouse-track-container"></span>');
  $parent = $el.parent();

  for (var i = 0; i < titleCount; i++) {
    var clone = $el.clone();
    clone.addClass('mouse-track').attr('data-distance', i);
    $parent.append(clone);
  }

  if (window.innerWidth < 768) {
    window.addEventListener('scroll', function (e) {
      var x = window.innerWidth / 2;
      var y = window.scrollY % (this.window.innerWidth * 2); // 800

      var alt = (window.scrollY - y) / (this.window.innerWidth * 2) % 2;
      if (alt == 0) y = this.window.innerWidth * 2 - y;
      updateElements($parent, x, y);
    });
  } else {
    window.addEventListener('mousemove', function (e) {
      var x = e.clientX;
      var y = e.clientY;
      updateElements($parent, x, y);
    });
  }
}

function updateElements(parent, x, y) {
  var els = parent.find('.mouse-track');
  var newX = linearmap(x, 0, window.innerWidth, -1, 1);
  var newY = linearmap(y, 0, window.innerHeight, -1, 1);
  var spacing = 30;
  var opacityStep = 1 / els.length;
  TweenMax.set(els, {
    x: function x(i, el) {
      return newX * i * spacing;
    },
    y: function y(i, el) {
      return newY * i * spacing;
    },
    opacity: function opacity(i, el) {
      return (1 - i * opacityStep) / 2;
    },
    scale: function scale(i) {
      return 1 + i * opacityStep / 4;
    }
  });
}

function linearmap(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var handleScroll = function handleScroll(e) {
  TweenMax.to('.desktop nav .site-logo', 0.2, {
    transformOrigin: 'top left',
    scale: window.scrollY > 100 ? 0.5 : 1
  });
};

var handleResize = function handleResize(e) {
  var _window = window,
      innerHeight = _window.innerHeight,
      innerWidth = _window.innerWidth;

  if (innerWidth > 1024) {
    $('body').addClass('desktop');
  } else {
    $('body').removeClass('desktop');
  }
};

var runTicker = function runTicker() {
  var amount = $('.ticker-inner .box:not(.clone)').length;

  var getLength = function getLength() {
    var length = 0;
    $('.ticker-inner .box:not(.clone)').each(function () {
      length = length + $(this).outerWidth();
    });
    return length;
  };

  var clones1 = $('.ticker-inner .box').clone().addClass('clone');
  clones1.appendTo('.ticker-inner');
  TweenMax.fromTo('.ticker-inner', amount * 8, {
    x: '0%'
  }, {
    x: -getLength() + 'px',
    repeat: -1,
    ease: 'linear'
  });
};

var handleRegistration = function handleRegistration() {
  // registration form
  var $registerForm = $('#registerForm'); // handle submit

  $registerForm.submit(function (e) {
    e.preventDefault();
    handleSuccess();
    var formData = $registerForm.serialize();
    var request = $.ajax({
      type: 'POST',
      url: $registerForm.attr('action'),
      data: formData,
      success: handleSuccess,
      error: handleErr
    });
  });

  var handleSuccess = function handleSuccess(e) {
    // console.log(e);
    $('.modal').modal('hide');
    $('#registrationSuccess').modal();
  };

  var handleErr = function handleErr(e) {
    console.log(e);
  };
};

var handleVerification = function handleVerification() {
  var form = $('#verifyForm');
  var failCount = 0;
  form.submit(function (e) {
    e.preventDefault();
    var formData = form.serialize();
    var request = $.ajax({
      type: 'POST',
      url: form.attr('action'),
      data: formData,
      success: handleSuccess,
      error: handleErr
    }); // handleSuccess();
    // handleErr();
  });

  var handleSuccess = function handleSuccess(e) {
    failCount = 0;
    console.log(e);
    $('.modal').modal('hide');
    $('#verifySuccess').modal();
  };

  var handleErr = function handleErr(e) {
    failCount = failCount + 1;
    console.log(e);
    $('.modal').modal('hide');

    if (failCount == 1) {
      // $('#verifyFail pre').html(e.responseText);
      $('#verifyFail').modal();
    }

    if (failCount == 2) {
      // $('#verifyFailTwo pre').html(e.responseText);
      $('#verifyFailTwo').modal();
      failCount = 0;
    }
  };
};

$(document).ready(function () {
  $('.big-title').each(createTitles); // ticker animation

  runTicker();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  handleResize();
  handleRegistration();
  handleVerification();

  if (window.location.hash) {
    var hash = window.location.hash;
    var isModal = $(hash).hasClass('modal');

    if (isModal) {
      $(hash).modal('toggle');
    }
  }

  $('a').on('click', function (event) {
    if (this.hash !== '') {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function () {
        window.location.hash = hash;
      });
    }
  });
  $('.modal').on('hide.bs.modal', function (e) {
    $('html').css({
      overflow: 'scroll'
    });
  });
  $('.modal').on('shown.bs.modal', function (e) {
    $('html').css({
      overflow: 'hidden'
    });
  });
});
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65391" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map