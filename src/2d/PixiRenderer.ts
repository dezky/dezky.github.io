import {
  Application,
  DisplayObject,
  Ticker,
  UPDATE_PRIORITY,
  Texture,
  type IApplicationOptions,
  type IPoint,
  type IPointData,
  type TickerCallback,
} from "pixi.js";
import {
  Viewport,
  type IViewportOptions,
  type IAnimateOptions,
} from "pixi-viewport";
import { Simple } from "pixi-cull";
import { Layer, Stage } from "@pixi/layers";
import { addStats } from "pixi-stats";
import { CustomCull } from "./CustomCull";

interface RenderOptions {
  plugins?: string[];
  fit?: boolean;
  fitPosition?: IPointData;
  culling?: boolean;
  layers?: Layer[];
}

class PixiRenderer {
  private app: Application;
  private viewport: Viewport;
  private cullingHandler?: TickerCallback<PixiRenderer>;
  private layers: Layer[] = [];
  private cullingMode: string = "withoutCulling";
  private onLoadFinished: () => void;

  constructor(
    cullingMode: string,
    onLoadFinished: () => void,
    applicationOptions: IApplicationOptions,
    viewportOptions: IViewportOptions = {}
  ) {
    this.app = new Application({
      autoStart: false,
      autoDensity: true,
      resolution: window.devicePixelRatio ?? 1,
      ...applicationOptions,
    });

    this.onLoadFinished = onLoadFinished;
    this.cullingMode = cullingMode;

    //const stats = addStats(document, this.app);
    //const ticker: Ticker = Ticker.shared;

    //ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);

    this.viewport = new Viewport({
      screenWidth: this.app.screen.width,
      screenHeight: this.app.screen.height,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      interaction: this.app.renderer.plugins.interaction,
      ...viewportOptions,
    });
  }

  getCurrentScale() {
    return this.viewport.scale;
  }

  render(
    displayObject: DisplayObject[] | DisplayObject,
    options: RenderOptions = {}
  ) {
    this.resumePlugin(...(options.plugins ?? []));

    const displayObjects = Array.isArray(displayObject)
      ? displayObject
      : [displayObject];

    for (const object of displayObjects) {
      // this.app.stage.addChild(object);
      this.viewport.addChild(object);
    }
    // Use Stage from @pixi/layers to render layers
    this.app.stage = new Stage();
    // Add the viewport to the stage
    this.app.stage.addChild(this.viewport);

    if (this.cullingMode !== "withoutCulling") {
      const customCull = new CustomCull().addAll(this.viewport.children);

      const viewport = this.viewport;
      const renderer = this.app.renderer;

      let firstLoad = true;
      this.viewport.on("frame-end", () => {
        if (firstLoad) {
          this.onLoadFinished();
          firstLoad = false;
        }
      });

      if (this.cullingMode === "cullingAlways") {
        this.viewport.on("frame-end", () => {
          if (viewport.dirty) {
            customCull.cull(renderer.screen);
            viewport.dirty = false;
          }
        });
      } else {
        let culling = false;
        let timeout: NodeJS.Timeout | undefined = undefined;
        this.viewport.on("zoomed", () => {
          if (!culling) {
            culling = true;
            customCull.cull(renderer.screen);
          }
        });

        this.viewport.on("zoomed-end", () => {
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
            customCull.uncull();
            culling = false;
          }, 500);
        });
        this.viewport.on("drag-start", () => {
          customCull.cull(renderer.screen);
        });
        this.viewport.on("drag-end", () => {
          customCull.uncull();
        });
      }
    }

    this.layers = options.layers ?? [];
    this.layers.forEach((layer) => this.app.stage.addChild(layer));

    if (options.fit) {
      this.fit(options.fitPosition);
    }

    if (options.culling) {
      this.enableCulling();
    }

    this.enableKeyboardNavigation();
    this.enableClamp();

    // Need to start manually because `autoStart` option was set to `false`
    this.app.start();
  }

  changeCullingMode(newCullingMode: string) {
    this.cullingMode = newCullingMode;
  }

  clear() {
    this.layers.forEach((layer) => layer.removeChildren());
    this.viewport.removeChildren();
  }

  destroy() {
    this.app.destroy(false, { children: true });
  }

  enableCulling() {
    if (this.cullingHandler) {
      return;
    }

    // TODO: Review. It's not working when a container wraps all the objects
    const simpleCull = new Simple();
    simpleCull.addList(this.viewport.children);
    simpleCull.cull(this.viewport.getVisibleBounds());

    // cull whenever the viewport moves
    this.cullingHandler = () => {
      if (this.viewport.dirty) {
        simpleCull.cull(this.viewport.getVisibleBounds());
        this.viewport.dirty = false;
      }
    };

    Ticker.shared.add(this.cullingHandler);
  }

  disableCulling() {
    if (this.cullingHandler) {
      Ticker.shared.remove(this.cullingHandler);
      delete this.cullingHandler;
    }

    this.makeAllVisible();
  }

  resumePlugin(...pluginNames: string[]) {
    for (const pluginName of pluginNames) {
      if (this.viewport.plugins.get(pluginName)) {
        this.viewport.plugins.resume(pluginName);
      } else {
        // activate plugin. It is the same as calling viewport.drag() etc
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.viewport[pluginName]();
      }
    }
  }

  pausePlugin(...pluginNames: string[]) {
    pluginNames.forEach((pluginName) =>
      this.viewport.plugins.pause(pluginName)
    );
  }

  fit(position: IPointData = { x: 0, y: 0 }) {
    this.viewport.left = 0;
    this.viewport.top = 0;

    if (this.cullingHandler) {
      this.makeAllVisible();
    }

    this.viewport.fit();

    const { x, y } = this.viewport.toWorld(position);
    this.viewport.left = -x;
    this.viewport.top = -y;
    this.viewport.clampZoom({
      minScale: this.getMinScale(),
      maxScale: 1,
    });
  }

  moveTo(options: IAnimateOptions) {
    const position = options.position
      ? this.viewport.toWorld(options.position)
      : undefined;
    this.viewport.animate({ ...options, position });
  }

  getWorldPosition(object: DisplayObject): IPoint {
    return this.viewport.toWorld(object.getGlobalPosition());
  }

  enableKeyboardNavigation() {
    console.log("koko");
    this.app.view.addEventListener("keydown", (event) => {
      console.log("lplp");
      const center = this.viewport.center;
      const position: IPointData = { x: center.x, y: center.y };
      let scaled = this.viewport.scaled;
      const shiftPositionPercentage = 0.1;
      const {
        screenHeightInWorldPixels, // world pixels that fit in screen's height
        screenWidthInWorldPixels, // world pixels that fit in screen's width
      } = this.viewport;
      const shiftPositionX = screenWidthInWorldPixels * shiftPositionPercentage;
      const shiftPositionY =
        screenHeightInWorldPixels * shiftPositionPercentage;

      switch (event.code) {
        case "ArrowUp":
        case "KeyW": {
          position.y -= shiftPositionY;
          break;
        }
        case "ArrowDown":
        case "KeyS": {
          position.y += shiftPositionY;
          break;
        }
        case "ArrowLeft":
        case "KeyA": {
          position.x -= shiftPositionX;
          break;
        }
        case "ArrowRight":
        case "KeyD": {
          position.x += shiftPositionX;
          break;
        }
        case "KeyQ": {
          scaled *= 1.2;
          break;
        }
        case "KeyE": {
          scaled *= 0.8;
          break;
        }
        default: {
          return;
        }
      }

      this.viewport.animate({
        position,
        time: 500,
        scale: scaled,
      });
    });
  }

  enableClamp() {
    this.setClamp();
    this.viewport.on("zoomed-end", () => this.setClamp());
  }

  setClamp() {
    const {
      worldHeight,
      worldWidth,
      screenHeightInWorldPixels, // world pixels that fit in screen's height
      screenWidthInWorldPixels, // world pixels that fit in screen's width
    } = this.viewport;
    let top, bottom, left, right;
    const worldWidthFitInScreen = screenWidthInWorldPixels > worldWidth;
    const worldHeightFitInScreen = screenHeightInWorldPixels > worldHeight;

    if (worldWidthFitInScreen) {
      const freeWidthSpace = screenWidthInWorldPixels - worldWidth;
      left = -worldWidth * 0.5 - freeWidthSpace;
      right = worldWidth * 1.5 + freeWidthSpace;
    } else {
      left = -screenWidthInWorldPixels * 0.5;
      right = worldWidth + screenWidthInWorldPixels * 0.5;
    }

    if (worldHeightFitInScreen) {
      const freeHeightSpace = screenHeightInWorldPixels - worldHeight;
      top = -worldHeight * 0.25 - freeHeightSpace;
      bottom = worldHeight * 1.25 + freeHeightSpace;
    } else {
      top = -screenHeightInWorldPixels * 0.75;
      bottom = worldHeight + screenHeightInWorldPixels * 0.75;
    }

    this.viewport.clamp({
      left,
      right,
      top,
      bottom,
      underflow: "none",
    });
  }

  getFullImage(filename: string, onComplete: () => void) {
    this.app.renderer.plugins.extract
      .canvas(this.app.stage)
      .toBlob(function (b: any) {
        const a = document.createElement("a");
        document.body.append(a);
        a.download = filename;
        a.href = URL.createObjectURL(b);
        a.click();
        a.remove();
        onComplete();
      }, "image/png");
  }

  forceRender() {
    this.app.render();
  }

  private makeAllVisible() {
    for (const child of this.viewport.children) {
      child.visible = true;
    }
  }

  private getMinScale() {
    const minScaleX = this.viewport.screenWidth / this.viewport.worldWidth;
    const minScaleY = this.viewport.screenHeight / this.viewport.worldHeight;
    const minScale = minScaleX < minScaleY ? minScaleX : minScaleY;
    const offset = 0.01;

    return Math.max(minScale - offset, 0);
  }
}

export default PixiRenderer;
