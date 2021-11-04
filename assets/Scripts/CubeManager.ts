
import { _decorator, Component, Vec3, Prefab, instantiate, Node, CCInteger, math, Label } from 'cc';
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

    private _currentCount = 0;
    private _deltaPos: Vec3 = new Vec3(0.01, 0, 0);
    private _nodeCache: Node[] = [];
    private _rotateQuat = new math.Quat(360, 0, 0, 1);
    private _scaleFactor2 = new math.Vec3(2, 1, 1);
    private _scaleFactor1_5 = new math.Vec3(1.5, 1, 1);
    private _scaleNormalFactor = new math.Vec3(1, 1, 1);
    private _scaleFactor0_5 = new math.Vec3(0.5, 1, 1);
    private _scaleFactor0_1 = new math.Vec3(0.1, 1, 1);


    start() {
        this.onAddButtonClicked();
    }

    onAddButtonClicked() {
        for (let i = 0; i < this.countStep; i++) {
            if (this._currentCount < this.maxCount) {
                let cubeNode: Node = instantiate(this.cubePrfb);
                cubeNode.setPosition(-25 + Math.random() * 50, -5 + Math.random() * 20, -5 + Math.random() * 20);
                cubeNode.setRotation(0, 0, 0, 1);
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
            // if (pos.x > 30) {
            //     pos.x = -pos.x;
            //     cubeNode.scale = this._scaleFactor0_1;
            //     cubeNode.setPosition(pos);
            // } else if (pos.x > 25) {
            //     cubeNode.scale = this._scaleFactor0_5;
            // } else if (pos.x > 15) {
            //     cubeNode.scale = this._scaleNormalFactor;
            // } else if (pos.x >= 10) {
            //     cubeNode.scale = this._scaleFactor1_5;
            // } else if (pos.x > 5) {
            //     cubeNode.scale = this._scaleFactor2;
            // } else if (pos.x > -10) {
            //     cubeNode.scale = this._scaleNormalFactor;
            // }
            cubeNode.setScale(math.absMax(2 - Math.abs(pos.x) / 20, 0), 1);
            cubeNode.translate(this._deltaPos);
            cubeNode.rotate(this._rotateQuat);
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
