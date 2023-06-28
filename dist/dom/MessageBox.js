"use strict";
/**
 * A simple message box to send messages to the player.
 *
 * @author  Ikaros Kappler
 * @date    2023-06-28
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBox = void 0;
var MessageBox = /** @class */ (function () {
    function MessageBox() {
        this.domElement = document.getElementById("messagebox");
    }
    MessageBox.prototype.showMessage = function (message) {
        var _this = this;
        console.log(message);
        this.domElement.innerHTML = "";
        if (this.currentTimerKey) {
            // Clear interval if some is running right now.
            window.clearInterval(this.currentTimerKey);
        }
        this.domElement.classList.add("popup");
        var offset = 1;
        var _self = this;
        window.setTimeout(function () {
            _this.currentTimerKey = window.setInterval(function () {
                if (offset < message.length) {
                    _this.domElement.innerHTML = message.substring(0, offset).replaceAll("\n", "<br>");
                    offset += 2;
                }
                else {
                    window.clearInterval(_self.currentTimerKey);
                    _this.domElement.innerHTML = message.replaceAll("\n", "<br>");
                    window.setTimeout(function () {
                        _this.domElement.classList.remove("popup");
                    }, 4000);
                }
            }, 10);
        }, 500);
    };
    return MessageBox;
}());
exports.MessageBox = MessageBox;
//# sourceMappingURL=MessageBox.js.map