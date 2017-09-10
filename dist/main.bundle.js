/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(2);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_main_scss__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__style__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng__ = __webpack_require__(12);





/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./main.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./main.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/* RGB */\n.primary {\n  color: #016fb9 !important;\n  border-color: #016fb9 !important; }\n\n.primary::before, .primary::after {\n  color: #016fb9 !important;\n  border-color: #016fb9 !important;\n  background: #016fb9 !important; }\n\n.default {\n  color: #353531 !important;\n  border-color: #353531 !important; }\n\n.default::before, .default::after {\n  color: #353531 !important;\n  border-color: #353531 !important;\n  background: #353531 !important; }\n\n.danger {\n  color: #ec4e20 !important;\n  border-color: #ec4e20 !important; }\n\n.danger::before, .danger::after {\n  color: #ec4e20 !important;\n  border-color: #ec4e20 !important;\n  background: #ec4e20 !important; }\n\n.warning {\n  color: #ff9505 !important;\n  border-color: #ff9505 !important; }\n\n.warning::before, .warning::after {\n  color: #ff9505 !important;\n  border-color: #ff9505 !important;\n  background: #ff9505 !important; }\n\n.dark {\n  color: black !important;\n  border-color: black !important; }\n\n.dark::before, .dark::after {\n  color: black !important;\n  border-color: black !important;\n  background: black !important; }\n\n.info {\n  color: #470024 !important;\n  border-color: #470024 !important; }\n\n.info::before, .info::after {\n  color: #470024 !important;\n  border-color: #470024 !important;\n  background: #470024 !important; }\n\n.secondary {\n  color: #6e9075 !important;\n  border-color: #6e9075 !important; }\n\n.secondary::before, .secondary::after {\n  color: #6e9075 !important;\n  border-color: #6e9075 !important;\n  background: #6e9075 !important; }\n\n.secondary {\n  color: #6e9075 !important;\n  border-color: #6e9075 !important; }\n\n.secondary::before, .secondary::after {\n  color: #6e9075 !important;\n  border-color: #6e9075 !important;\n  background: #6e9075 !important; }\n\n.white {\n  color: #fafafa !important;\n  border-color: #fafafa !important; }\n\n.white::before, .white::after {\n  color: #fafafa !important;\n  border-color: #fafafa !important;\n  background: #fafafa !important; }\n\n.text-primary {\n  color: #016fb9; }\n\n.text-default {\n  color: #353531; }\n\n.text-danger {\n  color: #ec4e20; }\n\n.text-warning {\n  color: #ff9505; }\n\n.text-dark {\n  color: black; }\n\n.text-info {\n  color: #470024; }\n\n.text-secondary {\n  color: #6e9075; }\n\n.text-white {\n  color: #fafafa; }\n\n.btn {\n  appearance: none;\n  position: relative;\n  user-select: none;\n  display: inline;\n  border-style: solid;\n  border-width: 3px;\n  border-color: #016fb9;\n  padding: 18px 46px;\n  background: none;\n  margin: 4px;\n  z-index: 0;\n  font-family: 'Raleway', sans-serif, Verdana, Geneva, Tahoma;\n  color: #016fb9;\n  cursor: pointer;\n  text-decoration: none;\n  transition: color 0ms 30ms linear;\n  overflow: hidden;\n  border-spacing: 1;\n  line-height: 1.42rem; }\n\n.btn::before {\n  z-index: -1;\n  content: \" \";\n  top: 100%;\n  left: 0;\n  right: 0;\n  bottom: -2px;\n  position: absolute;\n  transition: top 100ms ease-out;\n  background: #016fb9; }\n\n.btn:active, .btn:hover, .btn.active {\n  color: #fafafa !important; }\n\n.btn:active::before, .btn:hover::before, .btn.active::before {\n  top: 0; }\n\n.btn.white:active, .btn.white:hover, .btn.white.active {\n  color: #474c55 !important; }\n\n.btn-sm {\n  padding: 9px 23px;\n  margin: 2px; }\n\n.btn-xs {\n  padding: 2px 16px;\n  margin: 1px; }\n\n#nav {\n  position: fixed;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  left: 0;\n  top: -60px;\n  height: 60px;\n  z-index: 4000;\n  font-family: 'Poiret One', cursive;\n  font-size: 40px;\n  background-color: rgba(255, 255, 255, 0);\n  transition: top 100ms ease-out, background-color 1200ms ease-in-out; }\n  @media screen and (max-width: 600px) {\n    #nav {\n      height: 124px;\n      top: -124px; } }\n\n#nav.show {\n  top: 0px;\n  background-color: rgba(255, 255, 255, 0.8); }\n\n@media screen and (max-width: 1200px) {\n  #nav {\n    font-size: 30px; } }\n\n#navbar {\n  display: block;\n  margin: 10px 20px; }\n\n#navbar #brand {\n  float: left;\n  width: 160px; }\n\n#navbar #brand img {\n  height: 40px; }\n\n#navbar ul#nav-items {\n  margin: 0;\n  padding: 0;\n  width: calc(100% - 161px);\n  float: right;\n  list-style: none;\n  text-align: right; }\n\n#navbar ul#nav-items li.nav-item {\n  float: right;\n  margin-left: 20px; }\n  @media screen and (max-width: 600px) {\n    #navbar ul#nav-items li.nav-item {\n      float: none; } }\n\ninput[type=text], input[type=email] {\n  padding: 18px 26px;\n  margin: 8px 4px;\n  box-sizing: border-box;\n  border: 2px solid rgba(0, 0, 0, 0.3);\n  border-radius: 4px;\n  font-family: 'Raleway';\n  width: 100%;\n  width: calc(100% - 4px); }\n\n.m-0 {\n  margin: 0; }\n\n.mt-0 {\n  margin-top: 0; }\n\n.mb-0 {\n  margin-bottom: 0; }\n\n.ml-0 {\n  margin-left: 0; }\n\n.mr-0 {\n  margin-right: 0; }\n\n.mx-0 {\n  margin-right: 0;\n  margin-left: 0; }\n\n.my-0 {\n  margin-top: 0;\n  margin-bottom: 0; }\n\n.p-0 {\n  padding: 0; }\n\n.pt-0 {\n  padding-top: 0; }\n\n.pb-0 {\n  padding-bottom: 0; }\n\n.pl-0 {\n  padding-left: 0; }\n\n.pr-0 {\n  padding-right: 0; }\n\n.px-0 {\n  padding-right: 0;\n  padding-left: 0; }\n\n.py-0 {\n  padding-top: 0;\n  padding-bottom: 0; }\n\n.m-1 {\n  margin: 6; }\n\n.mt-1 {\n  margin-top: 6; }\n\n.mb-1 {\n  margin-bottom: 6; }\n\n.ml-1 {\n  margin-left: 6; }\n\n.mr-1 {\n  margin-right: 6; }\n\n.mx-1 {\n  margin-right: 6;\n  margin-left: 6; }\n\n.my-1 {\n  margin-top: 6;\n  margin-bottom: 6; }\n\n.p-1 {\n  padding: 6; }\n\n.pt-1 {\n  padding-top: 6; }\n\n.pb-1 {\n  padding-bottom: 6; }\n\n.pl-1 {\n  padding-left: 6; }\n\n.pr-1 {\n  padding-right: 6; }\n\n.px-1 {\n  padding-right: 6;\n  padding-left: 6; }\n\n.py-1 {\n  padding-top: 6;\n  padding-bottom: 6; }\n\n.m-2 {\n  margin: 12; }\n\n.mt-2 {\n  margin-top: 12; }\n\n.mb-2 {\n  margin-bottom: 12; }\n\n.ml-2 {\n  margin-left: 12; }\n\n.mr-2 {\n  margin-right: 12; }\n\n.mx-2 {\n  margin-right: 12;\n  margin-left: 12; }\n\n.my-2 {\n  margin-top: 12;\n  margin-bottom: 12; }\n\n.p-2 {\n  padding: 12; }\n\n.pt-2 {\n  padding-top: 12; }\n\n.pb-2 {\n  padding-bottom: 12; }\n\n.pl-2 {\n  padding-left: 12; }\n\n.pr-2 {\n  padding-right: 12; }\n\n.px-2 {\n  padding-right: 12;\n  padding-left: 12; }\n\n.py-2 {\n  padding-top: 12;\n  padding-bottom: 12; }\n\n.m-3 {\n  margin: 28; }\n\n.mt-3 {\n  margin-top: 28; }\n\n.mb-3 {\n  margin-bottom: 28; }\n\n.ml-3 {\n  margin-left: 28; }\n\n.mr-3 {\n  margin-right: 28; }\n\n.mx-3 {\n  margin-right: 28;\n  margin-left: 28; }\n\n.my-3 {\n  margin-top: 28;\n  margin-bottom: 28; }\n\n.p-3 {\n  padding: 28; }\n\n.pt-3 {\n  padding-top: 28; }\n\n.pb-3 {\n  padding-bottom: 28; }\n\n.pl-3 {\n  padding-left: 28; }\n\n.pr-3 {\n  padding-right: 28; }\n\n.px-3 {\n  padding-right: 28;\n  padding-left: 28; }\n\n.py-3 {\n  padding-top: 28;\n  padding-bottom: 28; }\n\n.m-4 {\n  margin: 36; }\n\n.mt-4 {\n  margin-top: 36; }\n\n.mb-4 {\n  margin-bottom: 36; }\n\n.ml-4 {\n  margin-left: 36; }\n\n.mr-4 {\n  margin-right: 36; }\n\n.mx-4 {\n  margin-right: 36;\n  margin-left: 36; }\n\n.my-4 {\n  margin-top: 36;\n  margin-bottom: 36; }\n\n.p-4 {\n  padding: 36; }\n\n.pt-4 {\n  padding-top: 36; }\n\n.pb-4 {\n  padding-bottom: 36; }\n\n.pl-4 {\n  padding-left: 36; }\n\n.pr-4 {\n  padding-right: 36; }\n\n.px-4 {\n  padding-right: 36;\n  padding-left: 36; }\n\n.py-4 {\n  padding-top: 36;\n  padding-bottom: 36; }\n\n.m-5 {\n  margin: 60; }\n\n.mt-5 {\n  margin-top: 60; }\n\n.mb-5 {\n  margin-bottom: 60; }\n\n.ml-5 {\n  margin-left: 60; }\n\n.mr-5 {\n  margin-right: 60; }\n\n.mx-5 {\n  margin-right: 60;\n  margin-left: 60; }\n\n.my-5 {\n  margin-top: 60;\n  margin-bottom: 60; }\n\n.p-5 {\n  padding: 60; }\n\n.pt-5 {\n  padding-top: 60; }\n\n.pb-5 {\n  padding-bottom: 60; }\n\n.pl-5 {\n  padding-left: 60; }\n\n.pr-5 {\n  padding-right: 60; }\n\n.px-5 {\n  padding-right: 60;\n  padding-left: 60; }\n\n.py-5 {\n  padding-top: 60;\n  padding-bottom: 60; }\n\nbody {\n  font-family: 'Ubuntu', sans-serif, Verdana, Geneva, Tahoma;\n  color: #353531; }\n\n* {\n  box-sizing: border-box; }\n\n.clearfix {\n  clear: both; }\n\n/*\r\n$col-default: rgba(53, 53, 49, 1);\r\n$col-danger: rgba(236, 78, 32, 1);\r\n$col-warning: rgba(255, 149, 5, 1);\r\n$col-primary: rgba(1, 111, 185, 1);\r\n$col-dark: rgba(0, 0, 0, 1);\r\n$col-info: rgba(71, 0, 36, 1);\r\n$col-secondary: rgba(110, 144, 117, 1);\r\n$col-background: rgba(250, 250, 250, 1);\r\n*/\n/* Globals */\n* {\n  box-sizing: border-box; }\n\nhtml {\n  background: white;\n  font-family: 'Roboto', sans-serif, Verdana, Geneva, Tahoma; }\n\nbody {\n  width: 100vw;\n  margin: 0;\n  overflow-x: hidden; }\n\n#wrapper {\n  padding-bottom: 200px;\n  min-height: 100vh; }\n\n.contentwrapper {\n  margin: 10px;\n  transition: width 500ms ease; }\n\n.container {\n  max-width: 1024px;\n  margin: auto; }\n\n/* Banner */\n#masthead {\n  text-align: center;\n  width: 100vw;\n  background-color: rgba(255, 10, 10, 0.2);\n  background-image: -webkit-gradient(linear, left bottom, left top, from(rgba(255, 10, 10, 0.2)), to(rgba(10, 10, 255, 0.2)));\n  background-image: -webkit-linear-gradient(bottom, rgba(255, 10, 10, 0.2), rgba(10, 10, 255, 0.2));\n  background-image: -moz-linear-gradient(bottom, rgba(255, 10, 10, 0.2), rgba(10, 10, 255, 0.2));\n  background-image: linear-gradient(to top, rgba(255, 10, 10, 0.2), rgba(10, 10, 255, 0.2));\n  padding: 120px 0; }\n\n#masthead #profilepic {\n  display: block;\n  width: 180px;\n  max-width: 100%;\n  border-radius: 50%;\n  margin: auto; }\n\n#masthead #mastheadtitle {\n  margin-top: 0;\n  font-size: 80px;\n  font-weight: 400;\n  font-family: 'Poiret One', cursive; }\n\na {\n  text-decoration: none;\n  color: #353531; }\n\n.mesection {\n  margin-top: 80px;\n  text-align: center; }\n\n.bubble {\n  background: rgba(53, 53, 49, 0.3);\n  border-radius: 50%; }\n\n#techstackbubble {\n  width: 200px;\n  height: 200px;\n  max-width: 200px;\n  max-height: 200px;\n  margin: auto;\n  overflow: hidden; }\n\n#screensizes {\n  max-width: 700px; }\n\n#techstackbubble-content {\n  height: 200px;\n  width: 99999px;\n  margin-left: 200px;\n  animation: cycletechnologies 30s 0s linear infinite; }\n\n@keyframes cycletechnologies {\n  from {\n    margin-left: 200px; }\n  to {\n    margin-left: -2900px; } }\n\n#techstackbubble-content img {\n  display: block;\n  float: left;\n  margin: 40px;\n  max-height: 120px;\n  max-width: 120px; }\n\n.project-article .title {\n  margin-bottom: 5px; }\n\n.project-article .proj-type-colors .proj-type-color {\n  margin-left: 5px;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  float: left; }\n\n.project-article .proj-type-colors .proj-type-color.webapp {\n  background-color: #ff9505; }\n\n.project-article .proj-type-colors .proj-type-color.desktopapp {\n  background-color: #6e9075; }\n\n.project-article .proj-type-colors .proj-type-color.mobileapp {\n  background-color: #ec4e20; }\n\n.project-article .proj-type-colors .proj-type-color.util {\n  background-color: #470024; }\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

window.addEventListener('load', function () {
    (function _iffyNavbar() {
        var nav = document.getElementById('nav');
        var show = (nav && nav.classList.contains('show')) || false;
        var lockscroll = 0;
        var lscroll = 0;
        window.addEventListener('scroll', function (event) { return setTimeout(function () {
            if (!show && (window.scrollY < 600 || window.scrollY < lscroll) && nav !== null) {
                nav.classList.add('show');
                show = true;
                lockscroll = window.scrollY + 5;
            }
            else if (show && window.scrollY > 600 && window.scrollY > lscroll && nav !== null) {
                nav.classList.remove('show');
                show = false;
            }
            lscroll = window.scrollY;
        }, 0); });
    })();
    (function _iffyWrapper() {
        var contentwrappers = document.getElementsByClassName('contentwrapper');
        if (contentwrappers.length < 1) {
            console.log('cannot find contentwrapper');
            return;
        }
        window.addEventListener('resize', function (event) { return setTimeout(function () {
            for (var i = 0; i < contentwrappers.length; i++) {
                contentwrappers[i].style.width = window.innerWidth + 'px';
            }
        }, 0); });
    })();
}, false);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_project_component_project_component__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_projects_list_component_projects_list_component__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_contact_component_contact_component__ = __webpack_require__(16);



var angular = window.angular;
angular.module('portfolio', ['ngSanitize'])
    .service('projectsService', function ($http) {
    this.getProjects = function () {
        return $http.get('./projects.json');
    };
});
Object(__WEBPACK_IMPORTED_MODULE_1__components_projects_list_component_projects_list_component__["a" /* default */])(angular);
Object(__WEBPACK_IMPORTED_MODULE_0__components_project_component_project_component__["a" /* default */])(angular);
Object(__WEBPACK_IMPORTED_MODULE_2__components_contact_component_contact_component__["a" /* default */])(angular);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = projectComponent;
function projectComponent(angular) {
    angular.module('portfolio')
        .component('project', {
        templateUrl: './scripts/components/project-component/project-component.html',
        bindings: {
            project: '<',
        },
        controller: function () {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.project = $ctrl.project;
            };
        }
    });
}


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = projectsListComponent;
function projectsListComponent(angular) {
    angular.module('portfolio')
        .component('projectsList', {
        templateUrl: './scripts/components/projects-list-component/projects-list-component.html',
        controller: function (projectsService) {
            var $ctrl = this;
            $ctrl.filters = {};
            projectsService.getProjects()
                .then(function (projects) {
                $ctrl.projects = projects.data;
                $ctrl.filteredProjects = $ctrl.projects;
            });
            $ctrl.isFiltersEmpty = function () {
                return Object.keys($ctrl.filters).length < 1;
            };
            function escapeRegExp(str) {
                return (str || '').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            }
            function applyFilter() {
                var searchRegex = new RegExp(escapeRegExp($ctrl.searchStr), 'i');
                $ctrl.filteredProjects = $ctrl.projects.filter(function (p) {
                    return (p.webpApp == ($ctrl.filters['webApp'] || p.webpApp))
                        && (p.mobileApp == ($ctrl.filters['mobileApp'] || p.mobileApp))
                        && (p.desktopApp == ($ctrl.filters['desktopApp'] || p.desktopApp))
                        && (p.util == ($ctrl.filters['util'] || p.util))
                        && searchRegex.test(p.title);
                });
            }
            $ctrl.filter = function (appType) {
                $ctrl.filters[appType] = !$ctrl.filters[appType];
                applyFilter();
            };
            $ctrl.search = function () {
                applyFilter();
            };
            $ctrl.removeFilter = function () {
                $ctrl.filters = {};
                applyFilter();
            };
        }
    });
}


/***/ }),
/* 15 */,
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = contactComponent;
function contactComponent(angular) {
    angular.module('portfolio')
        .component('contact', {
        templateUrl: './scripts/components/contact-component/contact-component.html',
        bindings: {},
        controller: ['$http', function ($http) {
                var $ctrl = this;
                $ctrl.$onInit = function () {
                    $http.get('https://herokuapp.portfolioapi.com/api');
                };
                $ctrl.send = function () {
                    if ($ctrl.honeycomb !== '')
                        throw Error("Invalid request");
                    $http.post('https://herokuapp.portfolioapi.com/api/contactmail', {
                        name: $ctrl.name,
                        email: $ctrl.email,
                        msg: $ctrl.msg
                    });
                };
            }]
    });
}


/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map