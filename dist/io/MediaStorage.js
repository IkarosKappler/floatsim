"use strict";
/**
 * A global class for storing media.
 * Try to avoid loading the same resource multiple times, use this storage.
 *
 * @author Ikaros Kappler
 * @date    2023-09-24
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaStorage = void 0;
// This is intended to be used as a singleton.
var MediaStorageImpl = /** @class */ (function () {
    function MediaStorageImpl() {
        this.audioResources = {};
    }
    MediaStorageImpl.prototype.getText = function (path) {
        var _this = this;
        return new Promise(function (accept, reject) {
            _this.globalLibs.axios
                .get(path)
                .then(function (response) {
                // console.log(response);
                accept(response.data);
            })
                .catch(function (error) {
                // console.log(error);
                reject(error);
            })
                .finally(function () {
                // always executed
                // NOOP
            });
        });
    };
    MediaStorageImpl.prototype.getAudio = function (path) {
        var _this = this;
        return new Promise(function (accept, reject) {
            var audio = _this.audioResources[path];
            if (!audio) {
                audio = new Audio("resources/audio/custom-sounds/typewriter-01.wav");
                audio.addEventListener("canplay", function () {
                    accept(audio);
                });
                _this.audioResources[path] = audio;
            }
            else {
                accept(audio);
            }
        });
    };
    return MediaStorageImpl;
}());
// CURRENTLY NOT IN USE
exports.MediaStorage = new MediaStorageImpl();
//# sourceMappingURL=MediaStorage.js.map