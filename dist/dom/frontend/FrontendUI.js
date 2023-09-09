"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontendUI = void 0;
var jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * A class to handle the html frontend UI. The frontent
 * is wrapped in a DIV overlay and used for storytelling
 * and text dialogues.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-09
 * @version 1.0.0
 */
// import { render, h } from "preact";
var hooks_1 = require("preact/hooks");
/** @jsx h */
var App = function (props) {
    var _a = (0, hooks_1.useState)(""), input = _a[0], setInput = _a[1];
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: "Do you agree to the statement: \"Preact is awesome\"?" }), (0, jsx_runtime_1.jsx)("input", { value: input, onInput: function (e) { return setInput(e.target.value); } }), (0, jsx_runtime_1.jsx)("span", { children: input })] }));
};
var FrontendUI = /** @class */ (function () {
    function FrontendUI(globalLibs) {
        // globalLibs.preact.render(<App globalLibs={globalLibs} />, document.getElementById("overlay"));
        console.log("[FrontendUI] Rendering frontend App ...", globalLibs.preact.render);
        globalLibs.preact.render((0, jsx_runtime_1.jsx)(App, { globalLibs: globalLibs }), document.getElementById("overlay"));
    }
    return FrontendUI;
}());
exports.FrontendUI = FrontendUI;
//# sourceMappingURL=FrontendUI.js.map