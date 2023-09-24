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
exports.Typewriter = void 0;
var jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * A UI class that can display text cutscenes.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-24
 * @version 1.0.0
 */
var hooks_1 = require("preact/hooks");
var customHooks_1 = require("../customHooks");
var Typewriter = function (props) {
    var _a = (0, hooks_1.useState)(0), counter = _a[0], setCounter = _a[1];
    var _b = (0, hooks_1.useState)(false), hasStarted = _b[0], setHasStarted = _b[1];
    var _c = (0, hooks_1.useState)(false), isTerminated = _c[0], setTerminated = _c[1];
    var _d = (0, hooks_1.useState)(Date.now()), startingTime = _d[0], setStartingTime = _d[1];
    if (props.isRunning && hasStarted) {
        props.audio.play();
    }
    var isBeyondDelay = function () {
        return hasStarted && Date.now() - startingTime > 1500;
    };
    var clearInterval = (0, customHooks_1.useInterval)(function () {
        // console.log("Counter");
        if (props.isRunning && isBeyondDelay()) {
            // Consume n characters per interval step.
            setCounter(counter + 8);
        }
    }, 50);
    // Remember starging time when  triggered
    (0, hooks_1.useEffect)(function () {
        if (props.isRunning && !hasStarted) {
            setHasStarted(true);
            setStartingTime(Date.now());
        }
    }, [props.isRunning, hasStarted]);
    // Play/pause audio if requesed.
    (0, hooks_1.useEffect)(function () {
        if (props.isRunning && !isTerminated && hasStarted && isBeyondDelay()) {
            props.audio.play();
        }
        else {
            props.audio.pause();
        }
    }, [props.isRunning, props.audio, isTerminated, hasStarted, startingTime]);
    // Check if end was reached.
    (0, hooks_1.useEffect)(function () {
        if (counter > props.text.length) {
            clearInterval();
            props.audio.pause();
            if (!isTerminated) {
                setTerminated(true);
                props.onTerminated();
            }
        }
    }, [counter, clearInterval, props.isRunning, isTerminated]);
    return (0, jsx_runtime_1.jsx)("div", __assign({ className: "jsx-typewriter" }, { children: props.text.substring(0, counter) }));
};
exports.Typewriter = Typewriter;
//# sourceMappingURL=Typewriter.js.map