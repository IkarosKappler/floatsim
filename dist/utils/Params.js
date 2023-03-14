"use strict";
/**
 * Wraps a Record<string,string> and adds type conversion methpds.
 *
 * @author  Ikars Kappler
 * @version 1.0.0
 * @date    2023-03-13
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Params = void 0;
var Params = /** @class */ (function () {
    function Params(baseParams) {
        this.baseParams = baseParams;
    }
    Params.prototype.getString = function (name, fallback) {
        var value = this.baseParams[name];
        if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
            return fallback;
        }
        return value;
    };
    Params.prototype.getNumber = function (name, fallback) {
        var value = this.baseParams[name];
        if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
            return fallback;
        }
        return Number(value);
    };
    Params.prototype.getBoolean = function (name, fallback) {
        var value = this.baseParams[name];
        if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
            return fallback;
        }
        value = value.toLocaleLowerCase();
        if (value === "1" || value === "on" || value === "yes" || value === "y" || value === "hi" || value == "high") {
            return true;
        }
        else if (value === "0" || value === "off" || value === "no" || value === "n" || value === "lo" || value == "low") {
            return false;
        }
        else {
            return Boolean(value);
        }
    };
    return Params;
}());
exports.Params = Params;
//# sourceMappingURL=Params.js.map