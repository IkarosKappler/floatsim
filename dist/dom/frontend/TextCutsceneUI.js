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
var Typewriter_1 = require("./Typewriter");
var MediaStorage_1 = require("../../io/MediaStorage");
var TextCutsceneUI = function (props) {
    var _a = (0, hooks_1.useState)(0), textSegmentCounter = _a[0], setCounter = _a[1];
    var _b = (0, hooks_1.useState)(null), audio = _b[0], setAudio = _b[1];
    // const audio = MediaStorage.getAudio("resources/audio/custom-sounds/typewriter-01.wav");
    // audio.loop = true;
    MediaStorage_1.MediaStorage.getAudio("resources/audio/custom-sounds/typewriter-01.wav")
        .then(function (fetchedAudio) {
        console.log("audio fetched");
        fetchedAudio.loop = true;
        setAudio(fetchedAudio);
    })
        .catch(function (error) {
        console.error("[TextCutsceneUI] Failed to load typewriter audio effect.", error);
    });
    // Split text into paragraphs
    var textSegments = props.text.split(/\n(\n+)/g).filter(function (text) { return text.trim().length > 0; });
    console.log("textSegments", textSegments.length);
    var increaseTextSegmentCounter = function () {
        var hasTerminated = textSegmentCounter + 1 === textSegments.length;
        setCounter(textSegmentCounter + 1);
        if (hasTerminated) {
            globalThis.setTimeout(props.onTerminated, 1500);
        }
    };
    // return <div>{props.text}</div>;
    // console.log("textSegmentCounter", textSegmentCounter);
    return audio ? ((0, jsx_runtime_1.jsx)("div", __assign({ className: "jsx-typewriter-wrapper" }, { children: textSegments.map(function (text, index) {
            return ((0, jsx_runtime_1.jsx)(Typewriter_1.Typewriter, { audio: audio, text: text, onTerminated: increaseTextSegmentCounter, isRunning: textSegmentCounter === index }));
        }) }))) : null;
};
exports.TextCutsceneUI = TextCutsceneUI;
//# sourceMappingURL=TextCutsceneUI.js.map