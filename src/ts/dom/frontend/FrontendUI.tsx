/**
 * A class to handle the html frontend UI. The frontent
 * is wrapped in a DIV overlay and used for storytelling
 * and text dialogues.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-09
 * @version 1.0.0
 */

// import { render, h } from "preact";
import { useState } from "preact/hooks";
import { IGlobalLibs } from "../../components/interfaces";

/** @jsx h */

const App = (props: { globalLibs: IGlobalLibs }) => {
  const [input, setInput] = useState("");

  return (
    <div>
      <p>Do you agree to the statement: "Preact is awesome"?</p>
      <input value={input} onInput={e => setInput((e.target as HTMLInputElement).value)} />
      <span>{input}</span>
    </div>
  );
};

export class FrontendUI {
  constructor(globalLibs: IGlobalLibs) {
    // globalLibs.preact.render(<App globalLibs={globalLibs} />, document.getElementById("overlay"));
    console.log("[FrontendUI] Rendering frontend App ...", globalLibs.preact.render);
    globalLibs.preact.render(<App globalLibs={globalLibs} />, document.getElementById("overlay"));
  }
}
