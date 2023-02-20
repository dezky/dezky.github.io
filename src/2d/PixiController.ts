import {
  Graphics,
  Text,
  ITextStyle,
  IPoint,
  utils as pixiUtils,
} from "pixi.js";
import { Assets } from "@pixi/assets";
import palette from "../themes/palette";
import type { ProviderName } from "./types";
import { base64toFile } from "../utils/fileUtils";
import { getDataMapper as getAwsDataMapper } from "../config/aws.config";
import { EventEmitter } from "../lib/eventEmitter";
import { setWorldValues } from "../lib/hacks";
import PixiRenderer from "./PixiRenderer";
import manifest from "./assets/manifest";
import Layer from "./components/Layer";
import Column from "./components/Column";
import Tooltip, { TooltipPositionTarget } from "./components/Tooltip";
import MainScene, { LayoutType } from "./scene/MainScene";
import SceneNode from "./scene/SceneNode";
import { scaleColor } from "./utils";

const HOVER_COLOR_SCALING = 30;
const HOVER_COLOR_FOCUS = 12843157;

const COMPLIANCE_WARNING_COLOR = 0xffff00;
const COMPLIANCE_DANGER_COLOR = 0xff0000;

const fitPosition = { x: 200, y: 90 };

interface VersionData {
  sumerianUiData: any;
  uiData: any;
  iamData: any;
  summary: any;
  benchmarksData: any;
}

type Line = [IPoint, IPoint];

export class PixiController {
  private renderer: PixiRenderer;
  private provider: ProviderName;
  private data: VersionData;
  private emitter: EventEmitter<any>;
  private scene?: MainScene;
  private connectionLines: Graphics;
  private complianceLayer: Layer;
  private connectionsLayer: Layer;
  private topLayer: Layer;
  private hoverLayer: Layer;
  private complianceEntities: {
    warning: Set<SceneNode>;
    danger: Set<SceneNode>;
  };

  constructor(
    provider: ProviderName,
    data: VersionData,
    emitter: EventEmitter<any>,
    canvas: HTMLCanvasElement,
    cullingMode: string,
    onLoadFinished: () => void
  ) {
    this.provider = provider;
    this.emitter = emitter;
    this.data = data;
    this.renderer = new PixiRenderer(cullingMode, onLoadFinished, {
      view: canvas,
      //   resizeTo: window,
      resizeTo: canvas,
      antialias: false,
      useContextAlpha: false,
      backgroundAlpha: 0, // transparent
    });
    this.connectionLines = new Graphics();
    this.complianceLayer = new Layer();
    this.connectionsLayer = new Layer();
    this.topLayer = new Layer();
    this.hoverLayer = new Layer();
    this.complianceEntities = {
      warning: new Set(),
      danger: new Set(),
    };
  }

  /**
   * Prepares the assets to be used in the scene
   */
  public async prepare() {
    await Assets.init({ manifest });
    Assets.backgroundLoadBundle(this.provider);

    // @TODO: revisit where to initialize interactions
    // if it is initialized in the render method, we will need to figure out how to remove the previous listeners
    //this.initInteractions();
  }

  /**
   * Renders the complete scene or a partial representation of it
   *
   * @param partialData partial data to render
   */
  public render(partialData?: VersionData) {
    this.clear();

    this.scene = this.buildScene(partialData ?? this.data);
    this.renderer.render(this.scene, {
      plugins: ["drag", "pinch", "wheel", "decelerate"],
      // fit everything on the screen
      fit: true,
      fitPosition,
      layers: [
        this.connectionsLayer,
        this.complianceLayer,
        this.topLayer,
        this.hoverLayer,
      ],
    });

    // this.initSceneInteractions();
  }

  changeCullingMode(newCullingMode: string) {
    this.destroy();
    this.renderer.changeCullingMode(newCullingMode);
    this.render();
  }

  /**
   * Notifies the HUD that the diagram is ready and set the world values for the HUD
   */
  public ready(context: any) {
    if (!this.scene) {
      throw new Error(
        "Scene not initialized. Call prepare() and then render() first"
      );
    }

    setWorldValues(context, this.data, this.scene.entitiesMap);
    //this.emitter.emit("diagramCompleted");
  }

  /**
   * Removes everything
   */
  public clear() {
    this.connectionLines.clear();
    this.complianceLayer.clear();
    this.topLayer.clear();
    this.hoverLayer.clear();
    this.renderer.clear();
  }

  /**
   * Destroys the renderer (PIXI Applicaiton)
   */
  public destroy() {
    // @TODO: remove emitter listeners
    return this.renderer.destroy();
  }

  private initInteractions() {
    // @TODO: we should change this after sumerian is deprecated. The function should receive the entity id
    this.emitter.addListener("entitiesHighlighted", (entities: any) => {
      const id = entities[0].getId();
      const entity = this.scene?.getFirstEntity(id);

      if (entity) {
        this.focusOnEntity(entity);
      }
    });

    this.emitter.addListener("rerenderDiagram", (versionData: VersionData) => {
      this.render(versionData);
      this.emitter.emit("diagramUpdatingEventFinished");
    });

    this.emitter.addListener("restoreOriginalDiagram", () => {
      this.render();
    });

    this.emitter.addListener("clearDecoloring", () => {
      this.reset(false);
    });

    this.emitter.addListener("highlightForTags", (ids: string[]) => {
      this.reset();
      this.scene?.getEntities(ids).forEach((entity) => {
        entity.addToLayer(this.topLayer);
      });
    });

    // For legend we receive the ids of the entities that shouldn't be highlighted  ¯\_(ツ)_/¯
    this.emitter.addListener("highlightForLegend", (ids: string[]) => {
      const idsSet = new Set(ids);
      this.reset();
      this.scene?.getEntities().forEach((entity) => {
        if (
          entity.data._type !== "clusterNode" &&
          !idsSet.has(entity.getId())
        ) {
          entity.addToLayer(this.topLayer);
        }
      });
    });

    this.emitter.addListener(
      "complianceHighlight",
      ({
        warningIds,
        dangerIds,
      }: {
        warningIds: string[];
        dangerIds: string[];
      }) => {
        this.reset();

        this.scene?.getEntities(warningIds).forEach((entity) => {
          entity.addToLayer(this.complianceLayer);
          entity.applyColor(COMPLIANCE_WARNING_COLOR);
          this.complianceEntities.warning.add(entity);
        });
        this.scene?.getEntities(dangerIds).forEach((entity) => {
          entity.addToLayer(this.complianceLayer);
          entity.applyColor(COMPLIANCE_DANGER_COLOR);
          this.complianceEntities.danger.add(entity);
        });
      }
    );

    this.emitter.addListener(
      "changedIsReportColorEnabled",
      (enabled: boolean) => {
        if (!enabled && !this.complianceLayer.isEmpty()) {
          this.reset(false);
        }
      }
    );

    this.emitter.addListener(
      "makeConnections",
      ({
        primaryEntityId,
        connectedEntityIds,
      }: {
        primaryEntityId: string;
        connectedEntityIds: string[];
      }) => {
        this.reset();
        this.clearConnectionLines();

        const primaryEntities = this.scene?.getEntity(primaryEntityId) || [];
        const connectedEntities =
          this.scene?.getEntities(connectedEntityIds).flat() || [];

        primaryEntities?.forEach((entity) => {
          entity.addToLayer(this.topLayer);
        });
        connectedEntities?.forEach((entity) => {
          entity.addToLayer(this.topLayer);
        });

        this.getConnectionLines(connectedEntities, primaryEntities).forEach(
          ({ line: [startPoint, endPoint], color }) => {
            this.connectionLines.lineStyle(4, color);
            this.connectionLines.moveTo(startPoint.x, startPoint.y);
            this.connectionLines.lineTo(endPoint.x, endPoint.y);
          }
        );

        this.scene?.addChild(this.connectionLines);
        this.connectionsLayer.add(this.connectionLines);
      }
    );

    this.emitter.addListener("removeConnections", () => {
      this.reset(false);
      this.clearConnectionLines();
    });

    this.emitter.addListener("outputImage", () => {
      this.generateImage();
    });

    this.emitter.addListener("startUpdateThumbnail", () => {
      this.generateSnapshot();
    });
  }

  private getConnectionLines(
    connectedEntities: SceneNode[] | undefined,
    primaryEntities: SceneNode[] | undefined
  ): { line: Line; color: number }[] {
    const connectionLines: { line: Line; color: number }[] = [];
    const offsetY = 20;

    connectedEntities?.forEach((connectedEntity) => {
      const startPoint = this.renderer.getWorldPosition(connectedEntity);

      primaryEntities?.forEach((primaryEntity) => {
        const endPoint = this.renderer.getWorldPosition(primaryEntity);

        if (startPoint.y > endPoint.y) {
          // connectedEntity is closer to the bottom than primaryEntity in the screen
          startPoint.y -= offsetY;
          endPoint.y += primaryEntity.height + offsetY;
        } else {
          // primaryEntity is closer to the bottom than connectedEntity in the screen
          startPoint.y += connectedEntity.height + offsetY;
          endPoint.y -= offsetY;
        }

        startPoint.x = this.getEntityStartXPoint(startPoint, connectedEntity);
        endPoint.x = this.getEntityStartXPoint(endPoint, primaryEntity);

        connectionLines.push({
          line: [startPoint, endPoint],
          color: primaryEntity.color,
        });
      });
    });

    return connectionLines;
  }

  private initSceneInteractions() {
    const commonWhite = pixiUtils.string2hex(palette.common.white);
    const tooltipStyle = {
      background: { color: 0x353550, alpha: 70 },
      padding: 24,
      borderRadius: 4,
      shadow: true,
    };
    const tooltipTitleStyle: Partial<ITextStyle> = {
      fontSize: 16,
      fontWeight: "700",
      fontFamily: "Red Hat Text, sans-serif",
      fill: commonWhite,
    };
    const tooltiptextStyle: Partial<ITextStyle> = {
      fontSize: 16,
      fontWeight: "400",
      fontFamily: "Red Hat Text, sans-serif",
      fill: commonWhite,
    };

    // @TODO: I will probable move this into the entity itself. I need to think a little bit more about it
    // Meanwhile, I will leave it here and move forward
    this.scene?.getEntities().forEach((entity) => {
      const { title = "", name = "" } = entity.data;

      entity.onClick(() => {
        this.emitter.emit("entityClicked", entity.getId());
        // @TODO: fix me if you find the cause of the bug (EP-2327)
        // I've bought a ticket to hell with this workaround.
        // For some reason I couldn't figure out, the HUD is not working as expected when an entity is clicked
        // and the HUD is not being properly expanded into the nested sections.
        // Somehow it does work in the second click. So, I'm forcing the second click. ¯\_(ツ)_/¯
        // I wouldn't spend much more time on this since the HUD is going to be deprecated soon
        // PS: you know where I live if you want to kill me (Hernan)
        setTimeout(() => {
          this.emitter.emit("entityClicked", entity.getId());
        }, 100);
      });

      /**
       * Hover & Tooltip
       */
      const titleText = new Text(title.toUpperCase(), tooltipTitleStyle);
      const nameText = new Text(name, tooltiptextStyle);
      const content = new Column([titleText, nameText], {
        spacing: 8,
        align: "center",
      });

      const tooltip = new Tooltip(entity, content, {
        positionTarget: TooltipPositionTarget.POINTER,
        style: tooltipStyle,
        delay: 250,
        getCurrentScale: () => this.renderer.getCurrentScale(),
        onShow: () => {
          entity.applyColor(scaleColor(entity.color, HOVER_COLOR_SCALING));
          entity.addToLayer(this.hoverLayer);
          this.hoverLayer.add(tooltip);
        },
        onHide: () => {
          this.resetEntityColor(entity);
          entity.removeFromLayer(this.hoverLayer);
          this.hoverLayer.remove(tooltip);

          // @TODO: Improve after a layer manager is implemented
          if (this.topLayer.has(entity)) {
            entity.addToLayer(this.topLayer);
          } else if (
            this.complianceEntities.warning.has(entity) ||
            this.complianceEntities.danger.has(entity)
          ) {
            entity.addToLayer(this.complianceLayer);
          }
        },
      });
    });
  }

  private reset(fade = true) {
    this.complianceLayer.clear();
    this.topLayer.clear();
    this.clearComplianceColoring();
    this.scene?.fade(fade);
    this.renderer.fit(fitPosition);
  }

  private resetEntityColor(entity: SceneNode) {
    if (this.complianceEntities.warning.has(entity)) {
      entity.applyColor(COMPLIANCE_WARNING_COLOR);
    } else if (this.complianceEntities.danger.has(entity)) {
      entity.applyColor(COMPLIANCE_DANGER_COLOR);
    } else {
      entity.resetColor();
    }
  }

  private clearComplianceColoring() {
    this.complianceEntities.warning.forEach((entity) => entity.resetColor());
    this.complianceEntities.danger.forEach((entity) => entity.resetColor());
    this.complianceEntities.warning.clear();
    this.complianceEntities.danger.clear();
  }

  private focusOnEntity(entity: SceneNode) {
    // @TODO: we can make the zooming smarter depending on the size of the entity
    // and other factors (specially for entities that are containers)
    this.renderer.moveTo({
      position: entity.getGlobalPosition(),
      scale: 1,
      callbackOnComplete: () => {
        setTimeout(() => {
          entity.addToLayer(this.topLayer);
          entity.applyColor(HOVER_COLOR_FOCUS);
          setTimeout(() => {
            this.resetEntityColor(entity);
            entity.removeFromLayer(this.topLayer);
            if (
              this.complianceEntities.warning.has(entity) ||
              this.complianceEntities.danger.has(entity)
            ) {
              entity.addToLayer(this.complianceLayer);
            }
          }, 1500);
        }, 500);
      },
    });
  }

  private buildScene(data: VersionData): MainScene {
    const layout = this.getLayout(data);
    return new MainScene(layout);
  }

  private getLayout(data: VersionData) {
    console.log(data);
    const mapper = this.getDataMapper();
    const layout = mapper.getLayout(data.sumerianUiData);
    console.log(layout);

    return layout;
  }

  private getDataMapper() {
    return getAwsDataMapper();
  }

  private generateImage() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    let { height: heightScene, width: widthScene } =
      this.scene!.getLocalBounds();
    let maxTextureSize = heightScene > widthScene ? heightScene : widthScene;
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }

    if (heightScene > maxTextureSize || widthScene > maxTextureSize) {
      if (heightScene > widthScene) {
        const newScale = maxTextureSize / heightScene;
        heightScene = maxTextureSize;
        widthScene = widthScene * newScale;
      } else {
        const newScale = maxTextureSize / widthScene;
        heightScene = heightScene * newScale;
        widthScene = maxTextureSize;
      }
    }

    const rendererCloned = new PixiRenderer("", () => {}, {
      view: canvas,
      height: heightScene,
      width: widthScene,
    });
    const scene = this.buildScene(this.data);
    rendererCloned.render(scene, {
      fit: true,
    });
    const filename = this.data.uiData.name;

    rendererCloned.getFullImage(filename, () => {
      canvas.remove();
      rendererCloned.destroy();
      this.emitter.emit("diagramUpdatingEventFinished");
    });
  }

  private generateSnapshot() {
    const canvas = document.querySelector(
      "#visualizer-world"
    ) as HTMLCanvasElement;
    this.renderer.forceRender();
    const image = canvas.toDataURL("image/jpeg", 0.8);
    const imageName = `Image_${Date.now()}.jpeg`;
    const imageFile = base64toFile(image, imageName);
    const params = { imageFile, imageName };
    this.emitter.emit("screenshotTaken", params);
  }

  private clearConnectionLines() {
    this.scene?.removeChild(this.connectionLines);
    this.connectionsLayer.clear();
    this.connectionLines.clear();
  }

  private getEntityStartXPoint(startPoint: IPoint, entity: SceneNode) {
    const layoutType = entity.data.layout.type;

    if (layoutType === LayoutType.IconContainer) {
      const labeledIconChild = entity.children.find(
        (child) =>
          (child as SceneNode).data.layout.type === LayoutType.IconContainer
      ) as SceneNode;
      return startPoint.x + labeledIconChild.width / 2;
    }

    return startPoint.x + entity.width / 2;
  }
}
