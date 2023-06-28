/**
 * A simple message box to send messages to the player.
 *
 * @author  Ikaros Kappler
 * @date    2023-06-28
 * @version 1.0.0
 */

export class MessageBox {
  private domElement: HTMLDivElement;
  private currentTimerKey: number;

  constructor() {
    this.domElement = document.getElementById("messagebox") as HTMLDivElement;
  }

  showMessage(message: string) {
    console.log(message);
    this.domElement.innerHTML = "";
    if (this.currentTimerKey) {
      // Clear interval if some is running right now.
      window.clearInterval(this.currentTimerKey);
    }
    this.domElement.classList.add("popup");
    let offset = 1;
    const _self = this;
    window.setTimeout(() => {
      this.currentTimerKey = window.setInterval(() => {
        if (offset < message.length) {
          this.domElement.innerHTML = message.substring(0, offset).replaceAll("\n", "<br>");
          offset += 2;
        } else {
          window.clearInterval(_self.currentTimerKey);
          this.domElement.innerHTML = message.replaceAll("\n", "<br>");
          window.setTimeout(() => {
            this.domElement.classList.remove("popup");
          }, 4000);
        }
      }, 10);
    }, 500);
  }
}
