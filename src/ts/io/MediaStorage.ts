/**
 * A global class for storing media.
 * Try to avoid loading the same resource multiple times, use this storage.
 *
 * @author Ikaros Kappler
 * @date    2023-09-24
 * @version 1.0.0
 */

import { IGlobalLibs } from "../components/interfaces";

// This is intended to be used as a singleton.
class MediaStorageImpl {
  audioResources: Record<string, HTMLAudioElement>;
  globalLibs: IGlobalLibs;

  constructor() {
    this.audioResources = {};
  }

  getText(path: string): Promise<string> {
    return new Promise<string>((accept, reject) => {
      this.globalLibs.axios
        .get(path)
        .then(response => {
          // console.log(response);
          accept(response.data);
        })
        .catch(error => {
          // console.log(error);
          reject(error);
        })
        .finally(() => {
          // always executed
          // NOOP
        });
    });
  }

  getAudio(path: string): Promise<HTMLAudioElement> {
    return new Promise<HTMLAudioElement>((accept, reject) => {
      let audio = this.audioResources[path];
      if (!audio) {
        audio = new Audio("resources/audio/custom-sounds/typewriter-01.wav");
        audio.addEventListener("canplay", () => {
          accept(audio);
        });
        this.audioResources[path] = audio;
      } else {
        accept(audio);
      }
    });
  }
}

// CURRENTLY NOT IN USE
export const MediaStorage = new MediaStorageImpl();
