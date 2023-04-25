/**
 * @author  Ikaros Kappler
 * @date    2023-03-21
 * @version 1.0.0
 */

export class AudioPlayer {
  private isPlayRequested: boolean;
  private isPlaying: boolean;
  private isReady: boolean;
  private audioNode: HTMLAudioElement;

  constructor(audioPath: string, audioType: string) {
    // var audio = new Audio(audioPath);
    // audio.play();

    this.audioNode = document.createElement("audio");
    this.audioNode.addEventListener("canplay", () => {
      // console.log("canplay", this.isPlayRequested);
      this.isReady = true;
      if (this.isPlayRequested) {
        this.play();
      }
    });
    this.audioNode.setAttribute("src", audioPath);
    this.audioNode.setAttribute("type", audioType);
    this.audioNode.setAttribute("loop", "loop");
    // this.audioNode.classList.add("d-none");
    document.querySelector("body").appendChild(this.audioNode);
  }

  play() {
    this.isPlayRequested = true;
    if (this.isPlaying || !this.isReady) {
      return;
    }
    this.audioNode.play();
    this.isPlaying = true;
  }
}
