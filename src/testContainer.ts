import { Container, Application, Graphics, Ticker, UPDATE_PRIORITY, Text } from "pixi.js";
import { addStats } from "pixi-stats";
import Icon from "./2d/scene/Icon";

export const testContainer = () => {
    const app = new Application({
        backgroundColor: 0xd3d3d3,
        width: 800,
        height: 800,
    });
    document.body.appendChild(app.view);
    app.stage.addChild(test1());
    // app.stage.addChild(test2());
    // app.stage.addChild(test3());
    // app.stage.addChild(test4());
    // app.stage.addChild(graphics);
    // app.stage.addChild(graphics2);
    // app.stage.addChild(graphics3);
    const stats = addStats(document, app);
    const ticker: Ticker = Ticker.shared;
    ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);
};

const test1 = () => {
    const container1 = new Container();

    const graphics = new Graphics();
    graphics.beginFill(0xf8c574);
    graphics.drawCircle(100, 300, 60);
    graphics.endFill();
    container1.addChild(graphics);

    const graphics2 = new Graphics();
    graphics2.beginFill(0xf8c574);
    graphics2.drawCircle(500, 300, 60);
    graphics2.endFill();
    container1.addChild(graphics2);

    const graphics3 = new Graphics();
    graphics3.beginFill(0xf8c574);
    graphics3.drawCircle(100, 100, 60);
    graphics3.endFill();
    container1.addChild(graphics3);

    const graphics4 = new Graphics();
    graphics4.beginFill(0xf8c574);
    graphics4.drawCircle(500, 100, 60);
    graphics4.endFill();
    container1.addChild(graphics4);

    return container1;
};

const test2 = () => {
    const container1 = new Container();

    const graphics = new Graphics();
    graphics.beginFill(0xf8c574);
    graphics.drawCircle(100, 300, 60);
    graphics.endFill();
    container1.addChild(graphics);

    graphics.beginFill(0xf8c574);
    graphics.drawCircle(500, 300, 60);
    graphics.endFill();
    container1.addChild(graphics);

    graphics.beginFill(0xf8c574);
    graphics.drawCircle(100, 100, 60);
    graphics.endFill();
    container1.addChild(graphics);

    graphics.beginFill(0xf8c574);
    graphics.drawCircle(500, 100, 60);
    graphics.endFill();
    container1.addChild(graphics);

    return container1;
};

const test3 = () => {
    const container1 = new Container();
    const player = new PlayerPixiView("demian");

    container1.addChild(player);
    return container1;
};

class PlayerPixiView extends Container {
    constructor(playerName: string) {
        super();
        this.createSprites(playerName);
    }

    private createSprites(playerName: string) {
        const graphics = new Graphics();
        graphics.beginFill(0xf8c574);
        graphics.drawCircle(500, 300, 60);
        graphics.endFill();

        const graphics2 = new Graphics();
        graphics2.beginFill(0xf8c574);
        graphics2.drawCircle(500, 300, 60);
        graphics2.endFill();

        const graphics3 = new Graphics();
        graphics3.beginFill(0xf8c574);
        graphics3.drawCircle(500, 300, 60);
        graphics3.endFill();

        //this.addChild(graphics);

        const name2 = new Text("kokoko", { fontSize: 30 });
        name2.position.set(40, 40);
        name2.anchor.set(0, 0.5);
        this.addChild(name2);

        this.addChild(graphics);
        this.addChild(graphics2);
        this.addChild(graphics3);

        const name = new Text(playerName, { fontSize: 30 });
        name.position.set(0, 40);
        name.anchor.set(0, 0.5);
        this.addChild(name);
    }
}

const test4 = () => {
    const container = new Container();
    const container1 = new Container();
    const container2 = new Container();
    const container3 = new Container();

    const graphics = new Graphics();
    graphics.beginFill(0xf8c574);
    graphics.drawCircle(100, 300, 60);
    graphics.endFill();
    container1.addChild(graphics);

    graphics.beginFill(0xf8c574);
    graphics.drawCircle(500, 300, 60);
    graphics.endFill();
    container2.addChild(graphics);

    graphics.beginFill(0xf8c574);
    graphics.drawCircle(100, 100, 60);
    graphics.endFill();
    container3.addChild(graphics);

    container.addChild(container1);
    container.addChild(container2);
    container.addChild(container3);

    return container;
};
