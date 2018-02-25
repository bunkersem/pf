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
/******/ 	__webpack_require__.p = "/bundle/";
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
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
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
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__particles_effect__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__particles_effect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__particles_effect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__d3_techs_bubblechart__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__d3_techs_bubblechart___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__d3_techs_bubblechart__);







/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
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
exports.push([module.i, "/* RGB */\n.primary {\n  color: #016fb9 !important;\n  border-color: #016fb9 !important; }\n\n.primary::before, .primary::after {\n  color: #016fb9 !important;\n  border-color: #016fb9 !important;\n  background: #016fb9 !important; }\n\n.default {\n  color: #353531 !important;\n  border-color: #353531 !important; }\n\n.default::before, .default::after {\n  color: #353531 !important;\n  border-color: #353531 !important;\n  background: #353531 !important; }\n\n.danger {\n  color: #ec4e20 !important;\n  border-color: #ec4e20 !important; }\n\n.danger::before, .danger::after {\n  color: #ec4e20 !important;\n  border-color: #ec4e20 !important;\n  background: #ec4e20 !important; }\n\n.warning {\n  color: #ff9505 !important;\n  border-color: #ff9505 !important; }\n\n.warning::before, .warning::after {\n  color: #ff9505 !important;\n  border-color: #ff9505 !important;\n  background: #ff9505 !important; }\n\n.dark {\n  color: black !important;\n  border-color: black !important; }\n\n.dark::before, .dark::after {\n  color: black !important;\n  border-color: black !important;\n  background: black !important; }\n\n.info {\n  color: #470024 !important;\n  border-color: #470024 !important; }\n\n.info::before, .info::after {\n  color: #470024 !important;\n  border-color: #470024 !important;\n  background: #470024 !important; }\n\n.secondary {\n  color: #6e9075 !important;\n  border-color: #6e9075 !important; }\n\n.secondary::before, .secondary::after {\n  color: #6e9075 !important;\n  border-color: #6e9075 !important;\n  background: #6e9075 !important; }\n\n.secondary {\n  color: #6e9075 !important;\n  border-color: #6e9075 !important; }\n\n.secondary::before, .secondary::after {\n  color: #6e9075 !important;\n  border-color: #6e9075 !important;\n  background: #6e9075 !important; }\n\n.white {\n  color: #fafafa !important;\n  border-color: #fafafa !important; }\n\n.white::before, .white::after {\n  color: #fafafa !important;\n  border-color: #fafafa !important;\n  background: #fafafa !important; }\n\n.container {\n  max-width: 1024px;\n  margin: auto; }\n\n.text-primary {\n  color: #016fb9; }\n\n.text-default {\n  color: #353531; }\n\n.text-danger {\n  color: #ec4e20; }\n\n.text-warning {\n  color: #ff9505; }\n\n.text-dark {\n  color: black; }\n\n.text-info {\n  color: #470024; }\n\n.text-secondary {\n  color: #6e9075; }\n\n.text-white {\n  color: #fafafa; }\n\n.text-center {\n  text-align: center; }\n\n.text-left {\n  text-align: left; }\n\n.text-right {\n  text-align: right; }\n\n.btn {\n  appearance: none;\n  position: relative;\n  user-select: none;\n  display: inline;\n  border-style: solid;\n  border-color: #016fb9;\n  border-width: 2px;\n  padding: 18px 46px;\n  background: none;\n  margin: 4px;\n  z-index: 0;\n  font-family: 'Raleway', sans-serif, Verdana, Geneva, Tahoma;\n  color: #016fb9;\n  cursor: pointer;\n  text-decoration: none;\n  transition: color 0ms 30ms linear;\n  border-spacing: 1;\n  line-height: 1.42rem;\n  outline: none; }\n\n.btn::before {\n  z-index: -1;\n  content: \" \";\n  top: 100%;\n  left: -1px;\n  right: -1px;\n  bottom: -1px;\n  position: absolute;\n  transition: top 100ms ease-out;\n  background: #016fb9; }\n\n.btn:active, .btn:hover, .btn.active {\n  color: #fafafa !important; }\n\n.btn:active::before, .btn:hover::before, .btn.active::before {\n  top: -1px; }\n\n.btn.white:active, .btn.white:hover, .btn.white.active {\n  color: #474c55 !important; }\n\n.btn:focus:hover:not(.active) {\n  color: #016fb9 !important; }\n\n.btn.secondary:hover:focus:not(.active) {\n  color: #6e9075 !important; }\n\n.btn.dark:focus:hover:not(.active) {\n  color: black !important; }\n\n.btn.danger:focus:hover:not(.active) {\n  color: #ec4e20 !important; }\n\n.btn.default:focus:hover:not(.active) {\n  color: #353531 !important; }\n\n.btn.info:focus:hover:not(.active) {\n  color: #470024 !important; }\n\n.btn.warning:focus:hover:not(.active) {\n  color: #ff9505 !important; }\n\n.btn.white:focus:hover:not(.active) {\n  color: #fafafa !important; }\n\n.btn:focus:hover:not(.active)::before {\n  top: 100%; }\n\n.btn-sm {\n  padding: 9px 23px;\n  margin: 2px; }\n\n.btn-xs {\n  padding: 2px 16px;\n  margin: 1px; }\n\n#nav {\n  position: fixed;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  left: 0;\n  top: -60px;\n  height: 60px;\n  z-index: 4000;\n  user-select: none;\n  font-family: 'Poiret One', cursive;\n  font-size: 30px;\n  transition: top 100ms ease-out, background-color 800ms ease-in-out;\n  background-color: rgba(255, 255, 255, 0); }\n  @media screen and (max-width: 600px) {\n    #nav {\n      height: 124px;\n      top: -124px; } }\n  #nav a:hover {\n    opacity: 0.8; }\n  #nav a:active {\n    opacity: 0.5; }\n\n#wrapper.shownav #nav {\n  top: 0px;\n  background-color: rgba(255, 255, 255, 0.5); }\n\n#navbar {\n  display: block;\n  margin: 10px 20px; }\n\n#navbar #brand {\n  float: left;\n  width: 160px; }\n\n#navbar #brand img {\n  height: 40px; }\n\n#navbar ul#nav-items {\n  margin: 0;\n  padding: 0;\n  width: calc(100% - 161px);\n  float: right;\n  list-style: none;\n  text-align: right; }\n\n#navbar ul#nav-items li.nav-item {\n  float: right;\n  margin-left: 20px; }\n  @media screen and (max-width: 600px) {\n    #navbar ul#nav-items li.nav-item {\n      float: none; } }\n\ninput[type=text], input[type=email], textarea {\n  padding: 18px 26px;\n  margin: 8px 4px;\n  box-sizing: border-box;\n  border: 2px solid rgba(0, 0, 0, 0.3);\n  border-radius: 4px;\n  font-family: 'Raleway';\n  width: 100%;\n  width: calc(100% - 4px);\n  resize: none; }\n\ninput[type=text].invalid, input[type=email].invalid, textarea.invalid {\n  border-color: #ec4e20; }\n\n.window * {\n  box-sizing: border-box; }\n\n.window {\n  box-shadow: 0 15px 40px 10px rgba(0, 0, 10, 0.2), 0 10px 10px -5px rgba(0, 0, 10, 0.5);\n  background-color: #28283c;\n  border-radius: 7px;\n  overflow: hidden;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  max-width: 100%;\n  width: 600px;\n  height: 280px;\n  position: absolute;\n  font-family: 'Roboto', sans-serif;\n  font-weight: bold;\n  position: relative;\n  margin-top: 10px; }\n\n.window .bar {\n  background: #aaa;\n  height: 32px;\n  overflow: hidden;\n  padding: 8px;\n  user-select: none;\n  cursor: pointer; }\n\n.window .bar .icon-container {\n  position: absolute;\n  left: 8px; }\n\n.window .bar .icon-container .icon {\n  margin-right: 4px;\n  height: 16px;\n  width: 16px;\n  border-radius: 8px;\n  display: inline-block;\n  user-select: none;\n  cursor: not-allowed; }\n\n.window .bar .icon-container .icon-red {\n  background-color: red; }\n\n.window .bar .icon-container .icon-orange {\n  background-color: orangered; }\n\n.window .bar .icon-container .icon-green {\n  background-color: #50ff50; }\n\n.window .bar .title {\n  text-align: center;\n  float: unset;\n  user-select: none; }\n\n.window .bar .title .title-label {\n  cursor: text; }\n\n.window .bar .title:focus {\n  outline: none; }\n\n.window .content {\n  margin: 0;\n  width: 100%;\n  height: 248px;\n  user-select: none;\n  overflow: hidden;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  cursor: text; }\n\n.window .content .innerContent {\n  padding: 8px;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  min-height: 100%; }\n\n.window .content pre, .window .content .writable {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  color: white;\n  font-family: 'Roboto', sans-serif;\n  font-size: 14px;\n  font-weight: 600;\n  overflow: hidden;\n  border: none;\n  outline: none;\n  background: transparent; }\n\n.window .content .writable:focus {\n  outline: none; }\n\n.alert {\n  background: rgba(53, 53, 49, 0.8);\n  color: #fafafa;\n  padding: 20px 30px;\n  border-radius: 3px; }\n\n.alert.alert-primary {\n  background: rgba(1, 111, 185, 0.8); }\n\n.alert.alert-warning {\n  background: rgba(255, 149, 5, 0.8); }\n\n.alert.alert-danger {\n  background: rgba(236, 78, 32, 0.8); }\n\n.alert.alert-dark {\n  background: rgba(0, 0, 0, 0.8); }\n\n.alert.alert-info {\n  background: rgba(71, 0, 36, 0.8); }\n\n.alert.alert-secondary {\n  background: rgba(110, 144, 117, 0.8); }\n\n/* Style the Image Used to Trigger the Modal */\n.modal-image {\n  cursor: pointer;\n  transition: 0.3s; }\n\n.modal-image:hover {\n  opacity: 0.7; }\n\n/* The Modal (background) */\n.modal {\n  position: fixed;\n  /* Stay in place */\n  z-index: 1000;\n  /* Sit on top */\n  padding-top: 100px;\n  /* Location of the box */\n  left: 0;\n  top: 0;\n  width: 100%;\n  /* Full width */\n  height: 100%;\n  /* Full height */\n  overflow: auto;\n  /* Enable scroll if needed */\n  background-color: black;\n  /* Fallback color */\n  background-color: rgba(0, 0, 0, 0.9);\n  /* Black w/ opacity */\n  transition: padding-top 100ms ease-out; }\n\n.modal#imgmodal {\n  display: none;\n  /* Hidden by default */ }\n\n#wrapper.shownav .modal {\n  padding-top: 160px; }\n\n.modal-content {\n  margin: auto;\n  display: block;\n  width: 80%;\n  max-width: 700px;\n  padding: 40px;\n  background: white; }\n\n/* Modal Content (Image) */\nimg.modal-content {\n  padding: 0;\n  background: transparent; }\n\n/* Caption of Modal Image (Image Text) - Same Width as the Image */\n#modal-caption {\n  margin: auto;\n  display: block;\n  width: 80%;\n  max-width: 700px;\n  text-align: center;\n  color: #ccc;\n  padding: 10px 0; }\n\n/* Add Animation - Zoom in the Modal */\n#imgmodal #modal-img, #modal-caption {\n  -webkit-animation-name: zoom;\n  -webkit-animation-duration: 0.6s;\n  animation-name: zoom;\n  animation-duration: 0.6s; }\n\n@-webkit-keyframes zoom {\n  from {\n    -webkit-transform: scale(0); }\n  to {\n    -webkit-transform: scale(1); } }\n\n@keyframes zoom {\n  from {\n    transform: scale(0); }\n  to {\n    transform: scale(1); } }\n\n/* The Close Button */\n#imgmodal .close {\n  position: absolute;\n  top: 15px;\n  right: 35px;\n  color: #f1f1f1;\n  font-size: 40px;\n  font-weight: bold;\n  transition: 0.3s;\n  transition: top 100ms ease-out; }\n\n#wrapper.shownav #imgmodal .close {\n  top: 75px; }\n\n#imgmodal .close:hover,\n#imgmodal .close:focus {\n  color: #bbb;\n  text-decoration: none;\n  cursor: pointer; }\n\n/* 100% Image Width on Smaller Screens */\n@media only screen and (max-width: 700px) {\n  #modal-img {\n    width: 100%; } }\n\n@media only screen and (max-width: 600px) {\n  #wrapper.shownav .modal {\n    padding-top: 224px; }\n  #wrapper.shownav #imgmodal .close {\n    top: 139px; } }\n\n.m-0 {\n  margin: 0; }\n\n.mt-0 {\n  margin-top: 0; }\n\n.mb-0 {\n  margin-bottom: 0; }\n\n.ml-0 {\n  margin-left: 0; }\n\n.mr-0 {\n  margin-right: 0; }\n\n.mx-0 {\n  margin-right: 0;\n  margin-left: 0; }\n\n.my-0 {\n  margin-top: 0;\n  margin-bottom: 0; }\n\n.p-0 {\n  padding: 0; }\n\n.pt-0 {\n  padding-top: 0; }\n\n.pb-0 {\n  padding-bottom: 0; }\n\n.pl-0 {\n  padding-left: 0; }\n\n.pr-0 {\n  padding-right: 0; }\n\n.px-0 {\n  padding-right: 0;\n  padding-left: 0; }\n\n.py-0 {\n  padding-top: 0;\n  padding-bottom: 0; }\n\n.m-1 {\n  margin: 6; }\n\n.mt-1 {\n  margin-top: 6; }\n\n.mb-1 {\n  margin-bottom: 6; }\n\n.ml-1 {\n  margin-left: 6; }\n\n.mr-1 {\n  margin-right: 6; }\n\n.mx-1 {\n  margin-right: 6;\n  margin-left: 6; }\n\n.my-1 {\n  margin-top: 6;\n  margin-bottom: 6; }\n\n.p-1 {\n  padding: 6; }\n\n.pt-1 {\n  padding-top: 6; }\n\n.pb-1 {\n  padding-bottom: 6; }\n\n.pl-1 {\n  padding-left: 6; }\n\n.pr-1 {\n  padding-right: 6; }\n\n.px-1 {\n  padding-right: 6;\n  padding-left: 6; }\n\n.py-1 {\n  padding-top: 6;\n  padding-bottom: 6; }\n\n.m-2 {\n  margin: 12; }\n\n.mt-2 {\n  margin-top: 12; }\n\n.mb-2 {\n  margin-bottom: 12; }\n\n.ml-2 {\n  margin-left: 12; }\n\n.mr-2 {\n  margin-right: 12; }\n\n.mx-2 {\n  margin-right: 12;\n  margin-left: 12; }\n\n.my-2 {\n  margin-top: 12;\n  margin-bottom: 12; }\n\n.p-2 {\n  padding: 12; }\n\n.pt-2 {\n  padding-top: 12; }\n\n.pb-2 {\n  padding-bottom: 12; }\n\n.pl-2 {\n  padding-left: 12; }\n\n.pr-2 {\n  padding-right: 12; }\n\n.px-2 {\n  padding-right: 12;\n  padding-left: 12; }\n\n.py-2 {\n  padding-top: 12;\n  padding-bottom: 12; }\n\n.m-3 {\n  margin: 28; }\n\n.mt-3 {\n  margin-top: 28; }\n\n.mb-3 {\n  margin-bottom: 28; }\n\n.ml-3 {\n  margin-left: 28; }\n\n.mr-3 {\n  margin-right: 28; }\n\n.mx-3 {\n  margin-right: 28;\n  margin-left: 28; }\n\n.my-3 {\n  margin-top: 28;\n  margin-bottom: 28; }\n\n.p-3 {\n  padding: 28; }\n\n.pt-3 {\n  padding-top: 28; }\n\n.pb-3 {\n  padding-bottom: 28; }\n\n.pl-3 {\n  padding-left: 28; }\n\n.pr-3 {\n  padding-right: 28; }\n\n.px-3 {\n  padding-right: 28;\n  padding-left: 28; }\n\n.py-3 {\n  padding-top: 28;\n  padding-bottom: 28; }\n\n.m-4 {\n  margin: 36; }\n\n.mt-4 {\n  margin-top: 36; }\n\n.mb-4 {\n  margin-bottom: 36; }\n\n.ml-4 {\n  margin-left: 36; }\n\n.mr-4 {\n  margin-right: 36; }\n\n.mx-4 {\n  margin-right: 36;\n  margin-left: 36; }\n\n.my-4 {\n  margin-top: 36;\n  margin-bottom: 36; }\n\n.p-4 {\n  padding: 36; }\n\n.pt-4 {\n  padding-top: 36; }\n\n.pb-4 {\n  padding-bottom: 36; }\n\n.pl-4 {\n  padding-left: 36; }\n\n.pr-4 {\n  padding-right: 36; }\n\n.px-4 {\n  padding-right: 36;\n  padding-left: 36; }\n\n.py-4 {\n  padding-top: 36;\n  padding-bottom: 36; }\n\n.m-5 {\n  margin: 60; }\n\n.mt-5 {\n  margin-top: 60; }\n\n.mb-5 {\n  margin-bottom: 60; }\n\n.ml-5 {\n  margin-left: 60; }\n\n.mr-5 {\n  margin-right: 60; }\n\n.mx-5 {\n  margin-right: 60;\n  margin-left: 60; }\n\n.my-5 {\n  margin-top: 60;\n  margin-bottom: 60; }\n\n.p-5 {\n  padding: 60; }\n\n.pt-5 {\n  padding-top: 60; }\n\n.pb-5 {\n  padding-bottom: 60; }\n\n.pl-5 {\n  padding-left: 60; }\n\n.pr-5 {\n  padding-right: 60; }\n\n.px-5 {\n  padding-right: 60;\n  padding-left: 60; }\n\n.py-5 {\n  padding-top: 60;\n  padding-bottom: 60; }\n\nhtml {\n  background: white;\n  font-family: 'Roboto', sans-serif, Verdana, Geneva, Tahoma; }\n\nbody {\n  font-family: 'Ubuntu', sans-serif, Verdana, Geneva, Tahoma;\n  color: #353531;\n  width: 100%;\n  margin: 0;\n  overflow-x: hidden; }\n\nfigure {\n  margin: 0; }\n\n* {\n  box-sizing: border-box; }\n\n.clearfix {\n  clear: both; }\n\niframe {\n  margin: 10px 0;\n  border: 0;\n  display: block; }\n\n.hidden {\n  display: none; }\n\nul {\n  text-align: left; }\n\n/*\r\n$col-default: rgba(53, 53, 49, 1);\r\n$col-danger: rgba(236, 78, 32, 1);\r\n$col-warning: rgba(255, 149, 5, 1);\r\n$col-primary: rgba(1, 111, 185, 1);\r\n$col-dark: rgba(0, 0, 0, 1);\r\n$col-info: rgba(71, 0, 36, 1);\r\n$col-secondary: rgba(110, 144, 117, 1);\r\n$col-background: rgba(250, 250, 250, 1);\r\n*/\n/* Page */\n#wrapper {\n  min-height: 100vh;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0; }\n\n/* Banner */\n.contentwrapper {\n  user-select: contain;\n  margin: 10px;\n  transition: width 500ms ease;\n  min-height: 100vh;\n  min-height: calc(100vh - 232px);\n  margin-bottom: 200px; }\n\n#masthead {\n  text-align: center;\n  width: 100vw;\n  background-color: rgba(255, 10, 10, 0.2);\n  background-image: -webkit-gradient(linear, left bottom, left top, from(rgba(255, 10, 10, 0.2)), to(rgba(10, 10, 255, 0.2)));\n  background-image: -webkit-linear-gradient(bottom, rgba(255, 10, 10, 0.2), rgba(10, 10, 255, 0.2));\n  background-image: -moz-linear-gradient(bottom, rgba(255, 10, 10, 0.2), rgba(10, 10, 255, 0.2));\n  background-image: linear-gradient(to top, rgba(255, 10, 10, 0.2), rgba(10, 10, 255, 0.2));\n  padding: 120px 0; }\n\n#masthead #profilepic {\n  display: block;\n  width: 180px;\n  max-width: 100%;\n  border-radius: 50%;\n  margin: auto; }\n\n#masthead #mastheadtitle {\n  margin-top: 0;\n  font-size: 80px;\n  font-weight: 400;\n  font-family: 'Poiret One', cursive; }\n\na {\n  text-decoration: none;\n  color: #016fb9; }\n\n.mesection {\n  margin-top: 80px;\n  text-align: center; }\n\n.bubble {\n  background: rgba(53, 53, 49, 0.3);\n  border-radius: 50%; }\n\n#techstackbubble {\n  width: 200px;\n  height: 200px;\n  max-width: 200px;\n  max-height: 200px;\n  margin: auto;\n  overflow: hidden; }\n\n#screensizes {\n  max-width: 700px; }\n\n#techstackbubble-inner {\n  overflow: visible;\n  display: inline-block; }\n\n#techstackbubble-content {\n  margin: 40px 0;\n  height: 200px;\n  animation: cycletechnologies 40s 0s linear infinite;\n  white-space: nowrap;\n  overflow: visible;\n  display: block; }\n\n@keyframes cycletechnologies {\n  from {\n    transform: translateX(200px); }\n  to {\n    transform: translateX(calc(-1000px - 100%)); } }\n\n#techstackbubble-content img {\n  display: inline-block;\n  max-height: 120px;\n  max-width: 180px;\n  padding-left: 60px; }\n\n.mesection ul {\n  margin: 20px auto;\n  padding: 20px 40px;\n  width: 300px;\n  max-width: 100%;\n  overflow: visible;\n  background: #eeeeee;\n  border-radius: 20px; }\n\n.mesection .card {\n  margin: 20px auto;\n  padding: 20px;\n  width: 500px;\n  max-width: 100%;\n  overflow: visible;\n  background: #eeeeee;\n  border-radius: 20px; }\n\n#rocket-text {\n  font-size: 160px;\n  position: absolute;\n  top: 40%;\n  top: calc(50% - 160px);\n  left: 0;\n  right: 0;\n  z-index: 200;\n  text-shadow: 0 0 3px black;\n  text-shadow: 0 0 3px rgba(0, 0, 0, 0.7); }\n\n.console {\n  margin-top: 10px; }\n\n@media screen and (max-width: 700px) {\n  #rocket-text {\n    font-size: 100px; } }\n\n@media screen and (max-width: 600px) {\n  #rocket-text {\n    font-size: 60px; } }\n\n#rocket-masthead {\n  width: 100vw;\n  position: relative; }\n  #rocket-masthead img {\n    width: 100vw; }\n\n.project-article {\n  margin-top: 60px;\n  box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.14), 0 0 40px 20px rgba(0, 0, 0, 0.05);\n  padding: 20px; }\n  .project-article h1.title {\n    margin-top: 7px; }\n  .project-article .proj-type-colors, .project-article .proj-techs {\n    display: block;\n    float: left; }\n  .project-article .proj-techs {\n    margin-left: 20px; }\n  .project-article .proj-type-colors .proj-type-color, .project-article .proj-techs .proj-tech {\n    margin-left: 5px;\n    width: 30px;\n    height: 30px;\n    border-radius: 50%;\n    float: left; }\n  .project-article .proj-techs .proj-tech {\n    background: rgba(110, 144, 117, 0.5);\n    text-align: center;\n    overflow: hidden;\n    background-position: center center;\n    background-size: 70%;\n    background-repeat: no-repeat; }\n  .project-article .proj-type-colors .proj-type-color.webapp {\n    background-color: #ff9505; }\n  .project-article .proj-type-colors .proj-type-color.desktopapp {\n    background-color: #6e9075; }\n  .project-article .proj-type-colors .proj-type-color.mobileapp {\n    background-color: #ec4e20; }\n  .project-article .proj-type-colors .proj-type-color.util {\n    background-color: #470024; }\n  .project-article .images {\n    float: left;\n    width: 90vw;\n    max-width: 1000px; }\n  .project-article .images img {\n    height: 160px;\n    display: block;\n    float: left;\n    margin: 10px; }\n\nfooter {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  user-select: contain; }\n\nul#footer-links {\n  list-style: none;\n  margin: 3px;\n  text-align: right; }\n\nul#footer-links li {\n  display: inline-block;\n  margin-right: 10px; }\n\nul#footer-links li::before {\n  font-family: Arial, Helvetica, sans-serif;\n  content: \" \\2022   \"; }\n\n.project-article iframe {\n  width: 100%;\n  height: 600px;\n  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3); }\n\n#particles-js {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute; }\n\n#masthead-header {\n  position: relative; }\n\nsvg#teck-stack-svg {\n  display: block;\n  margin: auto;\n  background: rgba(53, 53, 49, 0.3);\n  border-radius: 20px; }\n\n.circle-overlay {\n  font-size: 16px;\n  border-radius: 50%;\n  position: absolute;\n  overflow: hidden;\n  background-color: rgba(255, 255, 255, 0.5); }\n\n.circle-overlay__inner {\n  text-align: center;\n  width: 100%;\n  height: 100%; }\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

window.addEventListener('load', function () {
    (function _iffyNavbar() {
        var wrapper = document.getElementById('wrapper');
        var nav = document.getElementById('nav');
        var show = (nav && wrapper.classList.contains('navshow')) || false;
        var lockscroll = 0;
        var lscroll = 0;
        window.addEventListener('scroll', function (event) { return setTimeout(function () {
            if (!show && (window.scrollY < 600 || window.scrollY < lscroll) && nav !== null) {
                wrapper.classList.add('shownav');
                show = true;
                lockscroll = window.scrollY + 5;
            }
            else if (show && window.scrollY > 600 && window.scrollY > lscroll && nav !== null) {
                wrapper.classList.remove('shownav');
                show = false;
            }
            lscroll = window.scrollY;
        }, 0); });
    })();
    (function _iffyImageModal() {
        var modal = document.getElementById('imgmodal');
        if (modal === null)
            return;
        var modalImg = modal.querySelector("#modal-img");
        var captionText = modal.querySelector("#modal-caption");
        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('modal-image')) {
                modal.style.display = "block";
                modal.setAttribute('aria-expanded', 'true');
                modalImg.src = e.target.src;
                captionText.innerHTML = e.target.alt;
            }
        });
        var span = modal.querySelector('.close');
        span.onclick = function (e) {
            modal.style.display = "none";
            modal.setAttribute('aria-expanded', 'false');
        };
    })();
    (function _iffyWrapper() {
        var contentwrappers = document.getElementsByClassName('contentwrapper');
        if (contentwrappers.length < 1) {
            console.log('cannot find contentwrapper');
            return;
        }
        window.addEventListener('resize', function (event) { return setTimeout(function () {
            for (var i = 0; i < contentwrappers.length; i++) {
                contentwrappers[i].style.width = (window.innerWidth - 35) + 'px';
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_console_component_console_component__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_techstack_list_component_techstack_list_component__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_projects_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_technologies_service__ = __webpack_require__(18);






var angular = window.angular;
angular.module('portfolio', ['ngSanitize']);
Object(__WEBPACK_IMPORTED_MODULE_4__services_projects_service__["a" /* default */])(angular);
Object(__WEBPACK_IMPORTED_MODULE_5__services_technologies_service__["a" /* default */])(angular);
Object(__WEBPACK_IMPORTED_MODULE_1__components_projects_list_component_projects_list_component__["a" /* default */])(angular);
Object(__WEBPACK_IMPORTED_MODULE_0__components_project_component_project_component__["a" /* default */])(angular);
Object(__WEBPACK_IMPORTED_MODULE_2__components_console_component_console_component__["a" /* default */])(angular);
Object(__WEBPACK_IMPORTED_MODULE_3__components_techstack_list_component_techstack_list_component__["a" /* default */])(angular);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ProjectComponent;
function ProjectComponent(angular) {
    angular.module('portfolio')
        .component('project', {
        templateUrl: './scripts/components/project-component/project.component.html',
        bindings: {
            project: '<'
        },
        controller: ['technologiesService', '$sce', function (technologiesService, $sce) {
                var $ctrl = this;
                technologiesService.getTechnologies().then(function (response) {
                    var technologies = response.data;
                    var technologieNames = technologies.map(function (t) { return t.name; });
                    $ctrl.technologies = $ctrl.project.technologies
                        .map(function (pt) { return technologies
                        .find(function (t) { return t.name.toLowerCase() === pt.toLowerCase(); }); });
                });
                $ctrl.$onInit = function () {
                    $ctrl.project = $ctrl.project;
                    $ctrl.projContentText = $sce.trustAsHtml($ctrl.project.content.text);
                };
            }]
    });
}


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ProjectsListComponent;
function ProjectsListComponent(angular) {
    angular.module('portfolio')
        .component('projectsList', {
        templateUrl: './scripts/components/projects-list-component/projects.list.component.html',
        controller: ['projectsService', function (projectsService) {
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
                    return (str || '').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
                }
                function applyFilter() {
                    console.log('herer');
                    var searchRegex = new RegExp(escapeRegExp($ctrl.searchStr), 'i');
                    $ctrl.filteredProjects = $ctrl.projects.filter(function (p) {
                        return (p.webApp === ($ctrl.filters['webApp'] || p.webApp))
                            && (p.mobileApp === ($ctrl.filters['mobileApp'] || p.mobileApp))
                            && (p.desktopApp === ($ctrl.filters['desktopApp'] || p.desktopApp))
                            && (p.util === ($ctrl.filters['util'] || p.util))
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
            }]
    });
}


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ConsoleComponent;
function ConsoleComponent(angular) {
    angular.module('portfolio')
        .component('console', {
        templateUrl: './scripts/components/console-component/console.component.html',
        bindings: {
            name: '@',
            console: '<'
        },
        controller: ['$scope', '$http', function ($scope, $http) {
                var $ctrl = this;
                $ctrl.oldContent = 'Connecting to Server...';
                $ctrl.content = '';
                $scope.init = function () {
                    $http({
                        method: $ctrl.console.testConnection.method,
                        url: $ctrl.console.testConnection.url
                    }).then(function (response) {
                        $ctrl.oldContent = '';
                        $ctrl.content = $ctrl.content || $ctrl.console.hint || '';
                    }, function (error) {
                        $ctrl.oldContent = ($ctrl.oldContent + '\nfailed to connect to server').trim();
                    });
                };
                $ctrl.keyPressHandler = function (e) {
                    if (e.keyCode === 13) {
                        $ctrl.EnterKeyPressHandler(e);
                        e.preventDefault();
                    }
                };
                $ctrl.consoleClickHandler = function (e) {
                    var target = e.target;
                    if (target.parentElement !== null) {
                        var elem = target.parentElement.querySelector('.writable');
                        elem.focus();
                    }
                };
                $ctrl.EnterKeyPressHandler = function (e) {
                    $ctrl.oldContent = ($ctrl.oldContent + '\n' + $ctrl.content).trim();
                    var content = $ctrl.content || '';
                    $ctrl.content = '';
                    $http({
                        method: $ctrl.console.connection.method,
                        data: {
                            Debug: false,
                            Code: content
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        url: $ctrl.console.connection.url
                    }).then(function (response) {
                        console.log(response);
                        $ctrl.oldContent = ($ctrl.oldContent + '\n' + (response.data || 'Script was succesfull')).trim();
                    }, function (error) {
                        $ctrl.oldContent = ($ctrl.oldContent + '\nfailed to connect to server').trim();
                    });
                };
            }]
    });
}


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = TechStackListComponent;
function TechStackListComponent(angular) {
    angular.module('portfolio')
        .component('techstackList', {
        templateUrl: './scripts/components/techstack-list-component/techstack.list.component.html',
        controller: ['technologiesService', function (technologiesService) {
                var $ctrl = this;
                technologiesService.getTechnologies().then(function (response) {
                    console.log('response', response);
                    var allTechnologies = response.data;
                    $ctrl.technologies = allTechnologies.filter(function (t) { return t.value > 0 && t.icon; });
                });
            }]
    });
}


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ProjectsService;
function ProjectsService(angular) {
    angular.module('portfolio')
        .service('projectsService', function ($http) {
        this.getProjects = function () {
            return $http.get('./projects.json');
        };
    });
}


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = TechnologiesService;
function TechnologiesService(angular) {
    angular.module('portfolio')
        .service('technologiesService', function ($http) {
        var technologiesPromise = $http.get('./technologies.json');
        this.getTechnologies = function () {
            return technologiesPromise;
        };
    });
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

console.log(window.particlesJS);
var particlesJS = window.particlesJS;
window.addEventListener('load', function () {
    if (document.getElementById('particles-js') !== null) {
        particlesJS.load('particles-js', './particlesjs-config.json', function () {
            console.log('particles loaded');
        });
    }
});


/***/ }),
/* 20 */
/***/ (function(module, exports) {


window.initD3TechStackBubble = () => {
    d3.json("./technologies.json", initD3TechStackBubbleWithData);
}

window.initD3TechStackBubbleWithData = data => {
    if (document.getElementById('teck-stack-svg') === null)
        return;
    let svg = d3.select('#teck-stack-svg');
    let width = svg.property('clientWidth'); // get width in pixels
    let height = +svg.attr('height');
    let centerX = width * 0.5;
    let centerY = height * 0.5;
    let strength = 0.05;
    let focusedNode;
    console.log('width', width);

    let format = d3.format(',d');

    let scaleColor = d3.scaleOrdinal(d3.schemeCategory20);

    // use pack to calculate radius of the circle
    let pack = d3.pack()
        .size([width, height])
        .padding(1.5);

    let forceCollide = d3.forceCollide(d => d.r + 1);

    // use the force
    let simulation = d3.forceSimulation()
        // .force('link', d3.forceLink().id(d => d.id))
        .force('charge', d3.forceManyBody())
        .force('collide', forceCollide)
        // .force('center', d3.forceCenter(centerX, centerY))
        .force('x', d3.forceX(centerX).strength(strength))
        .force('y', d3.forceY(centerY).strength(strength));

    // reduce number of circles on mobile screen due to slow computation
    if ('matchMedia' in window && window.matchMedia('(max-device-width: 767px)').matches) {
        data = data.filter(el => {
            return el.value >= 50;
        });
    }

    // match image directory 
    data.forEach(item => {
        item.icon = './images/techs/' + item.icon;
    });

    let root = d3.hierarchy({ children: data })
        .sum(d => d.value);

    // we use pack() to automatically calculate radius conveniently only
    // and get only the leaves
    let nodes = pack(root).leaves().map(node => {
        // console.log('node:', node.x, (node.x - centerX) * 2);
        const data = node.data;
        return {
            x: centerX + (node.x - centerX) * 3, // magnify start position to have transition to center movement
            y: centerY + (node.y - centerY) * 3,
            r: 0, // for tweening
            radius: node.r, //original radius
            id: data.cat + '.' + (data.name.replace(/\s/g, '-')),
            cat: data.cat,
            name: data.name,
            value: data.value,
            icon: data.icon,
            desc: data.desc,
        };
    });
    simulation.nodes(nodes).on('tick', ticked);

    svg.style('background-color', '#eee');
    let node = svg.selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', (d) => {
                if (!d3.event.active) { simulation.alphaTarget(0.2).restart(); }
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (d) => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
            .on('end', (d) => {
                if (!d3.event.active) { simulation.alphaTarget(0); }
                d.fx = null;
                d.fy = null;
            }));

    node.append('circle')
        .attr('id', d => d.id)
        .attr('r', 0)
        .style('fill', d => scaleColor(d.cat))
        .transition().duration(2000).ease(d3.easeElasticOut)
        .tween('circleIn', (d) => {
            let i = d3.interpolateNumber(0, d.radius);
            return (t) => {
                d.r = i(t);
                simulation.force('collide', forceCollide);
            };
        });

    node.append('clipPath')
        .attr('id', d => `clip-${d.id}`)
        .append('use')
        .attr('xlink:href', d => `#${d.id}`);

    // display text as circle icon
    node.filter(d => ! d.icon)
        .append('text')
        .classed('node-icon', true)
        .attr('clip-path', d => `url(#clip-${d.id})`)
        .selectAll('tspan')
        .data(d => d.icon.split(';'))
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('y', (d, i, nodes) => (13 + (i - nodes.length / 2 - 0.5) * 10))
        .text(name => name);

    // display image as circle icon
    node.filter(d => d.icon)
        .append('image')
        .classed('node-icon', true)
        .attr('clip-path', d => `url(#clip-${d.id})`)
        .attr('xlink:href', d => d.icon)
        .attr('x', d => -d.radius * 0.7)
        .attr('y', d => -d.radius * 0.7)
        .attr('height', d => d.radius * 2 * 0.7)
        .attr('width', d => d.radius * 2 * 0.7);

    node.append('title')
        .text(d => (d.cat + '::' + d.name + '\n' + format(d.value)));

    let legendOrdinal = d3.legendColor()
        .scale(scaleColor)
        .shape('circle');

    // legend 1
    svg.append('g')
        .classed('legend-color', true)
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(20,30)')
        .style('font-size', '12px')
        .call(legendOrdinal);

    let sizeScale = d3.scaleOrdinal()
        .domain(['less skilled', 'more skilled'])
        .range([5, 10]);

    let legendSize = d3.legendSize()
        .scale(sizeScale)
        .shape('circle')
        .shapePadding(10)
        .labelAlign('end');

    // legend 2
    svg.append('g')
        .classed('legend-size', true)
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(150, 25)')
        .style('font-size', '12px')
        .call(legendSize);


    /*
    <foreignObject class="circle-overlay" x="10" y="10" width="100" height="150">
        <div class="circle-overlay__inner">
            <h2 class="circle-overlay__title">ReactJS</h2>
            <p class="circle-overlay__body">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam, sunt, aspernatur. Autem repudiandae, laboriosam. Nulla quidem nihil aperiam dolorem repellendus pariatur, quaerat sed eligendi inventore ipsa natus fugiat soluta doloremque!</p>
        </div>
    </foreignObject>
    */
    let infoBox = node.append('foreignObject')
        .classed('circle-overlay hidden', true)
        .attr('x', -350 * 0.5 * 0.8)
        .attr('y', -350 * 0.5 * 0.8)
        .attr('height', 350 * 0.8)
        .attr('width', 350 * 0.8)
        .append('xhtml:div')
        .classed('circle-overlay__inner', true);

    infoBox.append('h2')
        .classed('circle-overlay__title', true)
        .text(d => d.name);

    infoBox.append('p')
        .classed('circle-overlay__body', true)
        .html(d => d.desc);


    node.on('click', (currentNode) => {
        d3.event.stopPropagation();
        console.log('currentNode', currentNode);
        let currentTarget = d3.event.currentTarget; // the <g> el

        if (currentNode === focusedNode) {
            // no focusedNode or same focused node is clicked
            return;
        }
        let lastNode = focusedNode;
        focusedNode = currentNode;

        simulation.alphaTarget(0.2).restart();
        // hide all circle-overlay
        d3.selectAll('.circle-overlay').classed('hidden', true);
        d3.selectAll('.node-icon').classed('node-icon--faded', false);

        // don't fix last node to center anymore
        if (lastNode) {
            lastNode.fx = null;
            lastNode.fy = null;
            node.filter((d, i) => i === lastNode.index)
                .transition().duration(2000).ease(d3.easePolyOut)
                .tween('circleOut', () => {
                    let irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
                    return (t) => {
                        lastNode.r = irl(t);
                    };
                })
                .on('interrupt', () => {
                    lastNode.r = lastNode.radius;
                });
        }

        // if (!d3.event.active) simulation.alphaTarget(0.5).restart();

        d3.transition().duration(2000).ease(d3.easePolyOut)
            .tween('moveIn', () => {
                console.log('tweenMoveIn', currentNode);
                let ix = d3.interpolateNumber(currentNode.x, centerX);
                let iy = d3.interpolateNumber(currentNode.y, centerY);
                let ir = d3.interpolateNumber(currentNode.r, centerY * 0.5);
                return function (t) {
                    // console.log('i', ix(t), iy(t));
                    currentNode.fx = ix(t);
                    currentNode.fy = iy(t);
                    currentNode.r = ir(t);
                    simulation.force('collide', forceCollide);
                };
            })
            .on('end', () => {
                simulation.alphaTarget(0);
                let $currentGroup = d3.select(currentTarget);
                $currentGroup.select('.circle-overlay')
                    .classed('hidden', false);
                $currentGroup.select('.node-icon')
                    .classed('node-icon--faded', true);

            })
            .on('interrupt', () => {
                console.log('move interrupt', currentNode);
                currentNode.fx = null;
                currentNode.fy = null;
                simulation.alphaTarget(0);
            });

    });

    // blur
    d3.select(document).on('click', () => {
        let target = d3.event.target;
        // check if click on document but not on the circle overlay
        if (!target.closest('#circle-overlay') && focusedNode) {
            focusedNode.fx = null;
            focusedNode.fy = null;
            simulation.alphaTarget(0.2).restart();
            d3.transition().duration(2000).ease(d3.easePolyOut)
                .tween('moveOut', function () {
                    console.log('tweenMoveOut', focusedNode);
                    let ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
                    return function (t) {
                        focusedNode.r = ir(t);
                        simulation.force('collide', forceCollide);
                    };
                })
                .on('end', () => {
                    focusedNode = null;
                    simulation.alphaTarget(0);
                })
                .on('interrupt', () => {
                    simulation.alphaTarget(0);
                });

            // hide all circle-overlay
            d3.selectAll('.circle-overlay').classed('hidden', true);
            d3.selectAll('.node-icon').classed('node-icon--faded', false);
        }
    });

    function ticked() {
        node
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .select('circle')
            .attr('r', d => d.r);
    }

};



/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map