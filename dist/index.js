// index.tsx
globalThis["define"] = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log("DEFINE", args);
};
//# sourceMappingURL=index.js.map