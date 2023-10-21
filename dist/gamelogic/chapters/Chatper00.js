"use strict";
/**
 * Idea: write one program file for each chapter to keep the main
 * file small.
 *
 * @author  Ikaros Kappler
 * @date    2023-10-21
 * @version 1.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapter00 = void 0;
var three_1 = __importDefault(require("three"));
var Chapter00 = /** @class */ (function () {
    function Chapter00(sceneContainer, terrain) {
        this.anningPosition = null;
        this.dockingBuoyAdded = false;
        this.sceneContainer = sceneContainer;
        this.loadDockingStation(terrain);
    }
    Chapter00.prototype.loadDockingStation = function (terrain) {
        // At the same x-y position a the COLLADA object, just a bit above
        this.anningPosition = { x: -130.0, y: 0.0, z: -135.0 };
        this.anningPosition.y = this.sceneContainer.getGroundDepthAt(this.anningPosition.x, this.anningPosition.z, terrain);
        this.anningPosition.y += 70;
        // SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
        var baseSphereGeom = new three_1.default.SphereGeometry(30.0, 20, 20);
        baseSphereGeom.clearGroups();
        baseSphereGeom.addGroup(0, Infinity, 0);
        baseSphereGeom.addGroup(0, Infinity, 1);
        var baseSphereTexture = new three_1.default.TextureLoader().load("resources/img/textures/rusty-metal-plate-darker.jpg");
        baseSphereTexture.wrapS = three_1.default.RepeatWrapping;
        baseSphereTexture.wrapT = three_1.default.RepeatWrapping;
        baseSphereTexture.repeat.set(2, 1);
        var baseShpereWindowTexture = new three_1.default.TextureLoader().load("resources/img/textures/windowfront.png");
        baseShpereWindowTexture.wrapS = three_1.default.RepeatWrapping;
        baseShpereWindowTexture.wrapT = three_1.default.RepeatWrapping;
        baseShpereWindowTexture.repeat.set(8, 4);
        var baseSphereMat = new three_1.default.MeshBasicMaterial({
            map: baseSphereTexture
        });
        var baseSphereWindowMat = new three_1.default.MeshBasicMaterial({
            map: baseShpereWindowTexture,
            transparent: true
        });
        var baseSphereMesh = new three_1.default.Mesh(baseSphereGeom, [baseSphereMat, baseSphereWindowMat]);
        baseSphereMesh.position.set(this.anningPosition.x, this.anningPosition.y, this.anningPosition.z);
        this.sceneContainer.scene.add(baseSphereMesh);
        this.sceneContainer.addNavpoint({
            id: "anning-anchorage",
            position: { x: baseSphereMesh.position.x + 80, y: baseSphereMesh.position.y - 30, z: baseSphereMesh.position.z + 80 },
            label: "Anning Anchorage",
            detectionDistance: 25.0 / 2,
            isDisabled: false,
            type: "nav",
            userData: { isCurrentlyInRange: false },
            object3D: baseSphereMesh,
            onEnter: this.requestAddDockingNavpoint(),
            onLeave: null
        }, true);
        // this.sceneContainer.gameLogicManager.navigationManager.addNavigationEventListener(this);
    };
    Chapter00.prototype.requestAddDockingNavpoint = function () {
        var _this = this;
        var _self = this;
        return function (np) {
            var isCurrentRoutePoint = _self.sceneContainer.gameLogicManager.navpointRouter.isCurrentRoutePoint(np);
            console.log("Docking possible", "isCurrentRoutePoint", isCurrentRoutePoint);
            if (!_this.dockingBuoyAdded && isCurrentRoutePoint) {
                _this.addDockingBuoy();
            }
        };
    };
    Chapter00.prototype.addDockingBuoy = function () {
        var _this = this;
        this.dockingBuoyAdded = true;
        this.sceneContainer
            .addBuoyAt(new three_1.default.Vector3(this.anningPosition.x + 25, this.anningPosition.y - 30, this.anningPosition.z + 25))
            .then(function (buoyMesh) {
            _this.sceneContainer.addNavpoint({
                id: "anning-docking",
                position: { x: buoyMesh.position.x, y: buoyMesh.position.y, z: buoyMesh.position.z },
                label: "Dock at Anning Anchorage",
                detectionDistance: 25.0 / 2,
                isDisabled: false,
                type: "nav",
                userData: { isCurrentlyInRange: false },
                object3D: buoyMesh,
                onEnter: _this.requestDockingPossible(true),
                onLeave: _this.requestDockingPossible(false)
            }, false // NO ROUTE POINT
            );
        });
    };
    Chapter00.prototype.requestDockingPossible = function (dockingInRange) {
        var _this = this;
        var _self = this;
        return function (np) {
            //   const isCurrentRoutePoint = _self.sceneContainer.gameLogicManager.navpointRouter.isCurrentRoutePoint(np);
            var isRouteComplete = _self.sceneContainer.gameLogicManager.navpointRouter.isRouteComplete();
            console.log("Docking possible", "dockingInRange", dockingInRange, "isRouteComplete", isRouteComplete);
            if (dockingInRange && isRouteComplete) {
                console.log("DOCKIGN POSSIBLE");
                _this.sceneContainer.messageBox.showMessage("Docking possible. Press 'K' to dock.");
                _this.sceneContainer.hudData.isDockingPossible = true;
            }
            else {
                console.log("DOKCING NOT POSSIBLE");
                _this.sceneContainer.hudData.isDockingPossible = false;
            }
        };
    };
    return Chapter00;
}());
exports.Chapter00 = Chapter00;
//# sourceMappingURL=Chatper00.js.map