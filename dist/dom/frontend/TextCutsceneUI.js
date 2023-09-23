"use strict";
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
var customHooks_1 = require("../customHooks");
var TextCutsceneUI = function (props) {
    var _a = (0, hooks_1.useState)(0), counter = _a[0], setCounter = _a[1];
    var clearInterval = (0, customHooks_1.useInterval)(function () {
        console.log("Counter");
        setCounter(counter + 20);
    }, 50);
    (0, hooks_1.useEffect)(function () {
        if (counter > props.text.length) {
            clearInterval();
            props.onTerminated();
        }
    }, [counter, clearInterval]);
    return (0, jsx_runtime_1.jsx)("div", { children: props.text.substring(0, counter) });
};
exports.TextCutsceneUI = TextCutsceneUI;
//# sourceMappingURL=TextCutsceneUI.js.map