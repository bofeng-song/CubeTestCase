
import { _decorator, Component, Vec3, Prefab, instantiate, Node, CCInteger, math, Label, RenderableComponent, Material } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CubeManager
 * DateTime = Wed Nov 03 2021 14:28:09 GMT+0800 (中国标准时间)
 * Author = freely0417
 * FileBasename = CubeManager.ts
 * FileBasenameNoExtension = CubeManager
 * URL = db://assets/Scripts/CubeManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;
let speedFactor = 0.2;

@ccclass('CubeManager')
export class CubeManager extends Component {

    @property({ type: Prefab })
    public cubePrfb: Prefab = null;

    @property({ type: CCInteger })
    private countStep: Number = 50;

    @property({ type: Label })
    private countTitle: Label = null;

    @property({ type: Node })
    private topLeftNode: Node = null;

    @property({ type: Node })
    private topRightNode: Node = null;

    @property({ type: Node })
    private bottomLeftNode: Node = null;

    @property({ type: Node })
    private bottomRightNode: Node = null;

    @property({ type: Material })
    private redMaterial: Material = null;

    @property({ type: Material })
    private blueMaterial: Material = null;

    @property({ type: Material })
    private greenMaterial: Material = null;

    private _currentCount = 0;
    private _nodeCache: Node[] = [];
    private _rotateAnxisX = new math.Quat(360, 0, 0, 1);
    private _rotateAnxisY = new math.Quat(0, 360, 0, 1);
    private _rotateAnxisZ = new math.Quat(0, 0, 360, 1);

    onLoad() {
        maxX = this.topRightNode.getPosition().x;
        maxY = this.topRightNode.getPosition().y;
        minX = this.topLeftNode.getPosition().x;
        minY = this.bottomLeftNode.getPosition().y;
    }

    start() {
        this.onAddButtonClicked();
    }

    onAddButtonClicked() {
        for (let i = 0; i < this.countStep; i++) {
            let cubeNode: Node = instantiate(this.cubePrfb);
            let renderable: RenderableComponent = cubeNode.getComponent(RenderableComponent);
            let val = i % 4;
            if (val == 0) {
                cubeNode.speedX = math.random() * speedFactor;
                cubeNode.speedY = math.random() * speedFactor;
                renderable.material = this.greenMaterial;
            } else if (val == 1) {
                cubeNode.speedX = math.random() * -speedFactor;
                cubeNode.speedY = math.random() * speedFactor;
                renderable.material = this.redMaterial;
            } else if (val == 2) {
                cubeNode.speedX = math.random() * speedFactor;
                cubeNode.speedY = math.random() * -speedFactor;
                renderable.material = this.blueMaterial;
            } else {
                cubeNode.speedX = math.random() * -speedFactor;
                cubeNode.speedY = math.random() * -speedFactor;
            }

            cubeNode.setPosition(-maxX + Math.random() * maxX * 2, -maxY + Math.random() * maxY * 2, 0);
            cubeNode.setRotation(0, 0, 0, 1);
            let scale = 0.1 + Math.random() * 1;
            cubeNode.setScale(scale, scale, 1);
            this._nodeCache.push(cubeNode);
            this.node.addChild(cubeNode);
            this._currentCount += 1;
        }
        this.countTitle.string = "" + this._currentCount;
    }

    onDeleteButtonClicked() {
        if (this._currentCount < 1) {
            return;
        }
        for (let i = 0; i < this.countStep; i++) {
            if (this._nodeCache.length > 0) {
                let toRemoveNode = this._nodeCache.pop();
                this.node.removeChild(toRemoveNode);
            }
            this._currentCount -= 1;
            if (this._currentCount <= 0) {
                break;
            }
        }
        this.countTitle.string = "" + this._currentCount;
    }

    update(deltaTime: number) {
        this._nodeCache.forEach((cubeNode, index) => {
            let pos = cubeNode.getPosition();
            if (pos.x > maxX || pos.x < minX) {
                cubeNode.speedX *= -1;
            }
            if (pos.y > maxY || pos.y < minY) {
                cubeNode.speedY *= -1;
            }

            let val = index % 3;
            if (val == 0) {
                cubeNode.rotate(this._rotateAnxisX);
                // cubeNode.angle = cubeNode.angle + 1;
            } else if (val == 1) {
                cubeNode.rotate(this._rotateAnxisY);
            } else {
                cubeNode.rotate(this._rotateAnxisZ);
            }
            cubeNode.setScale(Math.abs(Math.sin(pos.x)) + 0.1, (Math.abs(Math.sin(pos.y)) + 0.1));
            cubeNode.setPosition(pos.x + cubeNode.speedX, pos.y + cubeNode.speedY);
        });
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
