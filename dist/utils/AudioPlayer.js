"use strict";
/**
 * @author  Ikaros Kappler
 * @date    2023-03-21
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPlayer = void 0;
var AudioPlayer = /** @class */ (function () {
    function AudioPlayer(audioPath, audioType) {
        // var audio = new Audio(audioPath);
        // audio.play();
        var _this = this;
        this.audioNode = document.createElement("audio");
        this.audioNode.addEventListener("canplay", function () {
            console.log("canplay", _this.isPlayRequested);
            _this.isReady = true;
            if (_this.isPlayRequested) {
                _this.play();
            }
        });
        this.audioNode.setAttribute("src", audioPath);
        this.audioNode.setAttribute("type", audioType);
        this.audioNode.setAttribute("loop", "loop");
        // this.audioNode.classList.add("d-none");
        document.querySelector("body").appendChild(this.audioNode);
    }
    AudioPlayer.prototype.play = function () {
        this.isPlayRequested = true;
        if (this.isPlaying || !this.isReady) {
            return;
        }
        this.audioNode.play();
        this.isPlaying = true;
    };
    return AudioPlayer;
}());
exports.AudioPlayer = AudioPlayer;
//# sourceMappingURL=AudioPlayer.js.map