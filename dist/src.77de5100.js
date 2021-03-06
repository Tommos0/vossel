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
})({"shaders/vertex.glsl":[function(require,module,exports) {
module.exports = "#version 300 es\n#define GLSLIFY 1\n\nlayout (location=0) in vec3 position;\nlayout (location=1) in float index;\nlayout (location=2) in vec3 color;\n\nout vec3 vColor;\n\nuniform vec3 camera_position;\nuniform float some_angle;\n\nvec3 vertex_offsets[36] = vec3[36](\n    //front\n    vec3(-1.,  1.,  1.),\n    vec3(-1., -1.,  1.),\n    vec3( 1.,  1.,  1.),\n\n    vec3(-1., -1.,  1.),\n    vec3( 1., -1.,  1.),\n    vec3( 1.,  1.,  1.),\n\n    //back\n    vec3(-1.,  1.,  -1.),\n    vec3(-1., -1.,  -1.),\n    vec3( 1.,  1.,  -1.),\n\n    vec3(-1., -1.,  -1.),\n    vec3( 1., -1.,  -1.),\n    vec3( 1.,  1.,  -1.),\n\n    //top\n    vec3(-1.,  1.,  1.),\n    vec3(-1.,  1., -1.),\n    vec3( 1.,  1.,  1.),\n\n    vec3( 1.,  1., -1.),\n    vec3(-1.,  1., -1.),\n    vec3( 1.,  1.,  1.),\n\n    //bottom\n    vec3(-1., -1.,  1.),\n    vec3(-1., -1., -1.),\n    vec3( 1., -1.,  1.),\n\n    vec3( 1., -1., -1.),\n    vec3(-1., -1., -1.),\n    vec3( 1., -1.,  1.),\n\n    //left\n    vec3(-1., -1.,  1.),\n    vec3(-1.,  1.,  1.),\n    vec3(-1.,  1., -1.),\n\n    vec3(-1., -1.,  1.),\n    vec3(-1., -1., -1.),\n    vec3(-1.,  1., -1.),\n\n    //right\n    vec3( 1., -1.,  1.),\n    vec3( 1.,  1.,  1.),\n    vec3( 1.,  1., -1.),\n\n    vec3( 1., -1.,  1.),\n    vec3( 1., -1., -1.),\n    vec3( 1.,  1., -1.)\n);\n\nfloat[6] colorScale = float[6](\n    1.0, //front\n    0.3, //back\n    0.4, //top\n    0.7, //bottom\n    0.6, //left\n    0.8  //right\n);\n\nfloat[6] depth = float[6](\n     1.0, //front\n     1.0, //back\n     1.0, //top\n     1.0, //bottom\n     1.0, //left\n     1.0  //right\n);\n\nvoid main() {\n    vec4 local_position = vec4(vertex_offsets[uint(index)], 1.);\n\n    mat4 positioner = mat4(\n        1.,             0.,             0.,             0.,\n        0.,             1.,             0.,             0.,\n        0.,             0.,             1.,             0.,\n        position[0],    position[1],    position[2],    1.\n    );\n\n    vec4 world_position = positioner * local_position;\n\n    mat4 camera_translation_matrix = mat4(\n        1.,                 0.,                 0.,                 0.,\n        0.,                 1.,                 0.,                 0.,\n        .5,                 .5,                 -1.,                0.,\n        camera_position[0], camera_position[1], camera_position[2], camera_position[2]\n    );\n\n    mat4 camera_rotation_matrix = mat4(\n        cos(some_angle),    -sin(some_angle),   0.,     0.,\n        sin(some_angle),    cos(some_angle),    0.,     0.,\n        0,                  0,                  1.,     0.,\n        0.,                 0.,                 0.,     1.\n    );\n\n    gl_Position = camera_rotation_matrix * camera_translation_matrix * world_position;\n\n//    gl_Position = vec4(\n//        camera_position + vec3(\n//            position[0] + .5 * position[2],  // x\n//            position[1] + .5 * position[2],  // y\n//            -position[2]                    // z\n//        ),\n//        2. + camera_position[2]                               // w\n//    );\n    vColor = colorScale[uint(index/6.)] * vec3(color[0], color[1], color[2]);\n}\n\n/*\n   y\n   |\n   |    z\n   |   /\n   |  /\n   | /\n   |/_______x\n\n*/\n";
},{}],"shaders/fragment.glsl":[function(require,module,exports) {
module.exports = "#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\nin vec3 vColor;\nout vec4 fragColor;\n\nvoid main() {\n    fragColor = vec4(vColor, 1.0);\n}\n";
},{}],"controls.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initControls = void 0;

exports.initControls = function (state) {
  var intervalSpeed = 10;
  var KEYS;

  (function (KEYS) {
    KEYS["FORWARD"] = "w";
    KEYS["BACKWARD"] = "s";
    KEYS["LEFT"] = "a";
    KEYS["RIGHT"] = "d";
  })(KEYS || (KEYS = {}));

  var keyState = {};

  var clearKeyState = function clearKeyState() {
    return Object.values(KEYS).forEach(function (k) {
      return keyState[k] = false;
    });
  };

  clearKeyState();

  var keyDownHandler = function keyDownHandler(e) {
    if (Object.values(KEYS).includes(e.key)) {
      keyState[e.key] = true;
    }
  };

  document.addEventListener("keydown", keyDownHandler);

  var keyupHandler = function keyupHandler(e) {
    if (Object.values(KEYS).includes(e.key)) {
      keyState[e.key] = false;
    }
  };

  document.addEventListener("keyup", keyupHandler);
  var interval = setInterval(function () {
    if (keyState[KEYS.FORWARD]) {
      state.cameraZ += state.movementSpeed;
    }

    if (keyState[KEYS.BACKWARD]) {
      state.cameraZ -= state.movementSpeed;
    }

    if (keyState[KEYS.LEFT]) {
      state.cameraX -= state.movementSpeed;
    }

    if (keyState[KEYS.RIGHT]) {
      state.cameraX += state.movementSpeed;
    }
  }, intervalSpeed);
  return function () {
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyDownHandler);
    clearInterval(interval);
  };
};
},{}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var vertex_glsl_1 = __importDefault(require("./shaders/vertex.glsl"));

var fragment_glsl_1 = __importDefault(require("./shaders/fragment.glsl"));

var controls_1 = require("./controls");

var state = {
  cameraX: 0,
  cameraY: 0,
  cameraZ: 5,
  cameraPhi: 0,
  cameraTheta: 0,
  movementSpeed: 0.04,
  someAngle: 0
}; //
// setInterval(() => {
//     console.log(state);
// }, 1000);

var repeat = function repeat(n) {
  return function (x) {
    var result = [];

    for (var i = 0; i < n; i++) {
      result = result.concat(x);
    }

    return result;
  };
};

var range = function range(n) {
  return Array(n).fill(null).map(function (_, i) {
    return i;
  });
};

var createGLContext = function createGLContext() {
  var canvas = document.createElement("canvas");
  canvas.height = window.innerHeight; // canvas.width = window.innerWidth;

  canvas.width = canvas.height;
  document.body.appendChild(canvas);
  var gl = canvas.getContext("webgl2");

  if (!gl) {
    throw new Error("WebGL 2.0 is not available in your browser :(");
  }

  return gl;
};

var charToColor = function charToColor(char) {
  var charMap = {
    R: [1, 0, 0],
    G: [0, 1, 0],
    B: [0, 0, 1],
    Y: [1, 1, 0],
    "1": [1, 1, 1],
    "0": [0, 0, 0]
  };
  return charMap[char];
};

var strToCubes = function strToCubes(str) {
  var cubes = [];
  str.split("\n").forEach(function (line, y) {
    return line.split("").forEach(function (char, x) {
      var color = charToColor(char);

      if (color) {
        cubes.push({
          position: [-x * 2, y * 2, 0],
          color: color
        });
        cubes.push({
          position: [-x * 2, y * 2, 4],
          color: color
        });
        cubes.push({
          position: [-x * 2, y * 2, 8],
          color: color
        });
        cubes.push({
          position: [-x * 2, y * 2, 12],
          color: color
        });
        cubes.push({
          position: [-x * 2, y * 2, 16],
          color: color
        });
      }
    });
  });
  return cubes;
}; // const cubes: Array<Cube> = [
//     {
//         position: [0, 0, 0],
//         color: [1, 0, 0],
//     },
//     {
//         position: [2, 0, 0],
//         color: [0, 0, 1],
//     },
//     {
//         position: [4, 0, 0],
//         color: [0, 1, 0],
//     },
// ];


var cubes = strToCubes("\n101010101010101010101010101010101010101010101010101010101010\n0                  10                  10                  1\n1                  01                  01                  0\n0  RRR GGG BBBBB   10  RRR GGG BBBBB   10  RRR GGG BBBBB   1\n1   R  G G B B B   01   R  G G B B B   01   R  G G B B B   0\n0   R  GGG B B B   10   R  GGG B B B   10   R  GGG B B B   1\n1                  01                  01                  0\n0                  10                  10                  1\n101010101010101010101010101010101010101010101010101010101010\n101010101010101010101010101010101010101010101010101010101010\n0                  10                  10                  1\n1                  01                  01                  0\n0  RRR GGG BBBBB   10  RRR GGG BBBBB   10  RRR GGG BBBBB   1\n1   R  G G B B B   01   R  G G B B B   01   R  G G B B B   0\n0   R  GGG B B B   10   R  GGG B B B   10   R  GGG B B B   1\n1                  01                  01                  0\n0                  10                  10                  1\n101010101010101010101010101010101010101010101010101010101010\n101010101010101010101010101010101010101010101010101010101010\n0                  10                  10                  1\n1                  01                  01                  0\n0  RRR GGG BBBBB   10  RRR GGG BBBBB   10  RRR GGG BBBBB   1\n1   R  G G B B B   01   R  G G B B B   01   R  G G B B B   0\n0   R  GGG B B B   10   R  GGG B B B   10   R  GGG B B B   1\n1                  01                  01                  0\n0                  10                  10                  1\n101010101010101010101010101010101010101010101010101010101010\n\n\n\n\n\n\n\n");
console.log(cubes);
var program;

var setup = function setup(gl) {
  var _a, _b; // Set background to solid grey


  gl.clearColor(0.25, 0.25, 0.25, 1); // Compile shaders

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertex_glsl_1.default);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader));
  }

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragment_glsl_1.default);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader));
  } // Link shaders to WebGL program


  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  } // Finally, activate WebGL program


  gl.useProgram(program); // Setup Geometry
  // Create a Vertex Buffer Object (VBO) and bind two buffers to it
  // 1. positions

  var positions = new Float32Array((_a = []).concat.apply(_a, cubes.map(function (cube) {
    return repeat(36)(cube.position);
  })));
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); // 3. indices
  // prettier-ignore

  var indices = new Float32Array(repeat(cubes.length)(range(36)));
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1); // 2. colours
  // prettier-ignore

  var colorData = (_b = []).concat.apply(_b, cubes.map(function (cube) {
    return repeat(36)(cube.color);
  }));

  console.log(colorData);
  var colors = new Float32Array(colorData);
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(2);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
};

var draw = function draw(gl) {
  state.someAngle += 0.01;
  var cam_loc = gl.getUniformLocation(program, "camera_position");
  gl.uniform3fv(cam_loc, [state.cameraX, state.cameraY, state.cameraZ]);
  var angle_loc = gl.getUniformLocation(program, "some_angle");
  gl.uniform1f(angle_loc, state.someAngle); // Fill background with one colour

  gl.clear(gl.COLOR_BUFFER_BIT); // Instruct WebGL to draw triangles with a set of 3 vertices

  gl.drawArrays(gl.TRIANGLES, 0, cubes.length * 36);
};

var init = function init() {
  var gl = createGLContext();
  setup(gl);
  setInterval(function () {
    return draw(gl);
  }, 16);
  controls_1.initControls(state);
};

window.addEventListener("DOMContentLoaded", init);
},{"./shaders/vertex.glsl":"shaders/vertex.glsl","./shaders/fragment.glsl":"shaders/fragment.glsl","./controls":"controls.ts"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "45707" + '/');

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
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map