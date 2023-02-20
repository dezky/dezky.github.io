import "./style.css";
import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { App } from "./App";

// declare const VERSION: string;

// const emitter: EventEmitter<any> = new EventEmitter();

// console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

window.onload = async (): Promise<void> => {
  document.body.innerHTML += '<div id="root"></div>';
  // document.body.innerHTML += '<canvas id="my-canvas"></canvas>';
  // const controller = new PixiController("aws", data, emitter);

  // // @TODO: initialize controller in another useEffect and call prepare so it starts loading
  // // icons before the data is ready. Once the data is ready, call render providing data.
  // controller.prepare().then(() => controller.render());

  // testContainer();
  const container = document.getElementById("root");
  const root = createRoot(container!); // createRoot(container!) if you use TypeScript
  root.render(<App />);
};
