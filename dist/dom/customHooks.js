"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterval = void 0;
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
exports.useInterval = useInterval;
//# sourceMappingURL=customHooks.js.map