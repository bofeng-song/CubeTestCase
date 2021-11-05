
import { _decorator, Component, Vec3, Prefab, instantiate, Node, CCInteger, math, Label, renderer, RenderableComponent, Camera, Material } from 'cc';
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

@ccclass('CubeManager')
export class CubeManager extends Component {

    @property({ type: Prefab })
    public cubePrfb: Prefab = null;

    @property({ type: CCInteger })
    private maxCount: Number = 1000;

    @property({ type: CCInteger })
    private countStep: Number = 50;

    @property({ type: Label })
    private countTitle: Label = null;

    @property({ type: Camera })
    private cubeCamera: Camera = null;

    @property({ type: Material })
    private redMaterial: Material = null;

    @property({ type: Material })
    private blueMaterial: Material = null;

    @property({ type: Material })
    private greenMaterial: Material = null;

    private _currentCount = 0;
    private _deltaPos: Vec3 = new Vec3(0.05, 0.05, 0);
    private _nodeCache: Node[] = [];
    private _rotateAnxisX = new math.Quat(360, 0, 0, 1);
    private _rotateAnxisY = new math.Quat(0, 360, 0, 1);
    private _rotateAnxisZ = new math.Quat(0, 0, 0, 1);

    onLoad() {
        if (this.cubeCamera) {
            let cameraNode: renderer.scene.Camera = this.node.getChildByName("Camera");
            let distance = Math.abs(cameraNode.getPosition().z); // 摄像机到当前平面的距离
            let height = 2.0 * distance * Math.tan(math.toRadian(this.cubeCamera.fov * 0.5));// 视椎体在当前平面下的可视高度
            let aspect = cameraNode.aspect;
            if (aspect === undefined) {
                aspect = 1;
            }
            let width = height * aspect;// 视椎体在当前平面下的可视宽度
            maxX = width / 2;
            maxY = height / 2;
            minX = -maxX;
            minY = -maxY;
        }
    }

    start() {
        this.onAddButtonClicked();
    }

    onAddButtonClicked() {
        for (let i = 0; i < this.countStep; i++) {
            if (this._currentCount < this.maxCount) {
                let cubeNode: Node = instantiate(this.cubePrfb);
                let renderable: RenderableComponent = cubeNode.getComponent(RenderableComponent);
                let val = i % 4;
                if (val == 0) {
                    renderable.material = this.greenMaterial;
                } else if (val == 1) {
                    renderable.material = this.redMaterial;
                } else if (val == 2) {
                    renderable.material = this.blueMaterial;
                }
                cubeNode.setPosition(-maxX + Math.random() * maxX * 2, -maxY + Math.random() * maxY * 2, 0);
                cubeNode.setRotation(0, 0, 0, 1);
                let scale = 0.1 + Math.random() * 1;
                cubeNode.setScale(scale, scale, 1);
                this._nodeCache.push(cubeNode);
                this.node.addChild(cubeNode);
                this._currentCount += 1;
            }
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

    onScaleButtonClicked() {
        //
    }

    update(deltaTime: number) {
        this._nodeCache.forEach((cubeNode, index) => {
            let pos = cubeNode.getPosition();
            if (pos.x > maxX) {
                pos.x = minX;
                cubeNode.setPosition(pos);
            }
            if (pos.y > maxY) {
                pos.y = minY;
                cubeNode.setPosition(pos);
            }
            cubeNode.translate(this._deltaPos);
            let val = index % 3;
            if (val == 0) {
                cubeNode.rotate(this._rotateAnxisX);
            } else if (val == 1) {
                cubeNode.rotate(this._rotateAnxisY);
            } else {
                cubeNode.rotate(this._rotateAnxisZ);
            }
            cubeNode.setScale(Math.abs(Math.sin(pos.x)) + 0.1, (Math.abs(Math.sin(pos.y)) + 0.1));
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
