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
exports.ChapterIntro = void 0;
var jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * A component for rendering chapter intros.
 *
 * @author  Ikaros Kappler
 * @date    2023-09-23
 * @version 1.0.0
 */
var hooks_1 = require("preact/hooks");
var TextCutsceneUI_1 = require("./TextCutsceneUI");
var MediaStorage_1 = require("../../io/MediaStorage");
var ChapterIntro = function (props) {
    var _a = (0, hooks_1.useState)(false), isShowMap = _a[0], setShowMap = _a[1];
    var _b = (0, hooks_1.useState)(null), introText = _b[0], setIntroText = _b[1];
    var _c = (0, hooks_1.useState)(false), introRequested = _c[0], setIntroRequested = _c[1];
    var _d = (0, hooks_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, hooks_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, hooks_1.useState)(false), isShowNextButton = _f[0], setShowNextButton = _f[1];
    var requestTextResource = function () {
        setIntroRequested(true);
        setIsLoading(true);
        MediaStorage_1.MediaStorage.getText(props.resourcePath + "intro-text.txt")
            .then(function (responseText) {
            // console.log(response);
            setIntroText(responseText);
        })
            .catch(function (error) {
            // console.log(error);
            setError(error);
        })
            .finally(function () {
            // always executed
            globalThis.setTimeout(function () {
                setIsLoading(false);
            }, 2000);
        });
    };
    if (!introRequested) {
        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: [(0, jsx_runtime_1.jsx)("img", { className: "jsx-game-logo spinning", src: "resources/img/logo-256x256.png" }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                        requestTextResource();
                    } }, { children: "Request location" })), (0, jsx_runtime_1.jsx)("span", { children: "Please click" })] })));
    }
    else if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: (0, jsx_runtime_1.jsx)("span", { children: "Loading ..." }) })));
    }
    else if (error) {
        return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: (0, jsx_runtime_1.jsx)("span", __assign({ className: "jsx-error" }, { children: error })) })));
    }
    else if (introText) {
        if (isShowMap) {
            return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-textcutscene-mapwrapper" }, { children: [(0, jsx_runtime_1.jsx)("div", { className: "jsx-chapterintro-map-base", style: { backgroundImage: "url('resources/chapters/00-north-sea/map-base.png')" } }), (0, jsx_runtime_1.jsx)("div", { className: "jsx-chapterintro-map-objectives blinking", style: { backgroundImage: "url('resources/chapters/00-north-sea/map-objectives.png')" } })] })), (0, jsx_runtime_1.jsx)("button", __assign({ id: "button-start", disabled: !props.isGameReady, onClick: props.onTerminated }, { children: "Start" }))] })));
        }
        else {
            return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: [(0, jsx_runtime_1.jsx)(TextCutsceneUI_1.TextCutsceneUI, { globalLibs: props.globalLibs, onTerminated: function () {
                            console.log("Intro terminated");
                            setShowNextButton(true);
                        }, sceneContainer: props.sceneContainer, text: introText }), isShowNextButton ? ((0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                            setShowMap(true);
                        } }, { children: "Next" }))) : ((0, jsx_runtime_1.jsx)("span", {}))] })));
        }
    }
};
exports.ChapterIntro = ChapterIntro;
//# sourceMappingURL=ChapterIntro.js.map