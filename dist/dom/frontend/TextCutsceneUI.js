"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextCutsceneUI = void 0;
var jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * A UI class that can display text cutscenes.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-22
 * @version 1.0.0
 */
var hooks_1 = require("preact/hooks");
var useInterval = function (callback, delay) {
    var savedCallback = (0, hooks_1.useRef)();
    var _a = (0, hooks_1.useState)(false), clearRequested = _a[0], setClearRequested = _a[1];
    // Remember the latest callback.
    (0, hooks_1.useEffect)(function () {
        savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    (0, hooks_1.useEffect)(function () {
        var id = setInterval(function () {
            savedCallback.current();
        }, delay);
        if (clearRequested) {
            clearInterval(id);
        }
        return function () { return clearInterval(id); };
    }, [clearRequested, delay]);
    // Set up the cancel-requester
    var requestClear = function () {
        setClearRequested(true);
    };
    return requestClear;
};
var TextCutsceneUI = function (props) {
    var _a = (0, hooks_1.useState)(0), counter = _a[0], setCounter = _a[1];
    var _b = (0, hooks_1.useState)(false), isShowNextButton = _b[0], setShowNextButton = _b[1];
    var clearInterval = useInterval(function () {
        console.log("Counter");
        setCounter(counter + 20);
    }, 50);
    (0, hooks_1.useEffect)(function () {
        if (counter > props.text.length) {
            clearInterval();
            // props.onTerminated();
            setShowNextButton(true);
        }
    }, [counter, clearInterval]);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: [(0, jsx_runtime_1.jsx)("div", { children: props.text.substring(0, counter) }), isShowNextButton ? ((0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                    // setShowMap(true);
                    props.onTerminated();
                } }, { children: "Next" }))) : ((0, jsx_runtime_1.jsx)("span", {}))] })));
};
exports.TextCutsceneUI = TextCutsceneUI;
//# sourceMappingURL=TextCutsceneUI.js.map