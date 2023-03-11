"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-11
 * @version 1.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicsHandler = void 0;
var ammojs_typed_1 = __importDefault(require("ammojs-typed"));
var PhysicsHandler = /** @class */ (function () {
    function PhysicsHandler(sceneContainer) {
        this.sceneContainer = sceneContainer;
    }
    PhysicsHandler.prototype.start = function () {
        // Variable declaration
        function start() {
            // code goes here
            // ... huh?
        }
        // Ammojs Initialization
        // Ammo().then(start);
        var ammo = (0, ammojs_typed_1.default)();
        console.log("tmp", ammo, typeof ammo.then);
        ammo.then(start);
    };
    return PhysicsHandler;
}());
exports.PhysicsHandler = PhysicsHandler;
//# sourceMappingURL=PhysicsHandler.js.map