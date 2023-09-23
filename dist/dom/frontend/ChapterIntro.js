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
 * @date    2033-09-23
 * @version 1.0.0
 */
var hooks_1 = require("preact/hooks");
var TextCutsceneUI_1 = require("./TextCutsceneUI");
// export const ChapterIntro = (props: ChapterIntroProps): JSXInternal.Element => {
//   return <span>A</span>;
// };
var ChapterIntro = function (props) {
    var _a = (0, hooks_1.useState)(false), isShowMap = _a[0], setShowMap = _a[1];
    var _b = (0, hooks_1.useState)(null), introText = _b[0], setIntroText = _b[1];
    var _c = (0, hooks_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, hooks_1.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, hooks_1.useState)(false), isShowNextButton = _e[0], setShowNextButton = _e[1];
    props.globalLibs.axios
        .get(props.resourcePath + "intro-text.txt")
        .then(function (response) {
        // handle success
        console.log(response);
        // Validate response data?
        // accept(response.data);
        setIntroText(response.data);
    })
        .catch(function (error) {
        // handle error
        console.log(error);
        // reject();
        setError(error);
    })
        .finally(function () {
        // always executed
        globalThis.setTimeout(function () {
            setIsLoading(false);
        }, 2000);
    });
    //   return <span>Y</span>;
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: (0, jsx_runtime_1.jsx)("span", { children: "Loading ..." }) })));
    }
    else if (error) {
        return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: (0, jsx_runtime_1.jsx)("span", __assign({ className: "jsx-error" }, { children: error })) })));
    }
    else if (introText) {
        if (isShowMap) {
            return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: "resources/chapters/00-north-sea/map-base.png" }), (0, jsx_runtime_1.jsx)("button", __assign({ id: "button-start", disabled: !props.isGameReady, onClick: function () {
                            // TODO: pass function directly
                            //   props.sceneContainer.startGame();
                            props.onTerminated();
                        } }, { children: "Start" }))] })));
        }
        else {
            return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "jsx-textcuscene-ui" }, { children: [(0, jsx_runtime_1.jsx)(TextCutsceneUI_1.TextCutsceneUI, { globalLibs: props.globalLibs, onTerminated: function () {
                            console.log("Intro terminated");
                            // setShowNextButton(true);
                            setShowNextButton(true);
                            //   setShowMap(true);
                        }, sceneContainer: props.sceneContainer, text: introText }), isShowNextButton ? ((0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                            // globalThis.setTimeout(() => {
                            //   setShowMap(true);
                            // }, 2000);
                            setShowMap(true);
                            // props.onTerminated();
                        } }, { children: "Next" }))) : ((0, jsx_runtime_1.jsx)("span", {}))] })));
        }
    }
};
exports.ChapterIntro = ChapterIntro;
//# sourceMappingURL=ChapterIntro.js.map