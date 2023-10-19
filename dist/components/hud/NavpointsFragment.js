"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavpointsFragment = void 0;
var THREE = __importStar(require("three"));
var Helpers_1 = require("../../utils/Helpers");
var plotboilerplate_1 = require("plotboilerplate");
var NavpointsFragment = /** @class */ (function () {
    function NavpointsFragment(hudComponent) {
        this.hudComponent = hudComponent;
        this.screenBounds = new plotboilerplate_1.Bounds(new plotboilerplate_1.Vertex(), new plotboilerplate_1.Vertex());
        this.updateSize(this.hudComponent.hudCanvas.width, this.hudComponent.hudCanvas.height);
    }
    NavpointsFragment.prototype.toScreenPosition = function (sceneContainer, obj, camera) {
        var vector = new THREE.Vector3();
        var widthHalf = 0.5 * sceneContainer.rendererSize.width;
        var heightHalf = 0.5 * sceneContainer.rendererSize.height;
        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        // vector.applyMatrix4(obj.matrixWorld);
        vector.project(camera);
        vector.x = vector.x * widthHalf + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;
        var seemsInsideView = vector.x >= 0 &&
            vector.x < sceneContainer.rendererSize.width &&
            vector.y >= 0 &&
            vector.y < sceneContainer.rendererSize.height;
        // var style =
        //   "translate(-50%,-50%) translate(" +
        //   (vector.x * widthHalf + widthHalf) +
        //   "px," +
        //   (-vector.y * heightHalf + heightHalf) +
        //   "px)";
        // Check if in view
        camera.updateMatrix();
        camera.updateMatrixWorld();
        var frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        // Your 3d point to check
        var pos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
        var isInCameraFrustum = frustum.containsPoint(pos);
        if (seemsInsideView && !isInCameraFrustum) {
            // // if (!frustum.containsPoint(pos)) {
            // // Do something with the position...
            // // vector.x = -1;
            // // vector.y = widthHalf;
            // // Reverse position and project to the border+1
            // vector.x = sceneContainer.rendererSize.width - vector.x;
            // vector.y = sceneContainer.rendererSize.height - vector.y;
            // // Now project to edge of the screen
            // // ... todo in plotboilerplate
            // const lineFromCenter = new Line(
            //   this.screenBounds.getCenter(),
            //   new Vertex(vector.x, vector.y) // TODO: check if Vertex(THREE.Vector) is working
            //   // new Vertex(vector.x - this.screenBounds.getCenter().x, vector.y),
            // );
            // const screenIntersection = this.screenBounds.toPolygon().closestLineIntersection(lineFromCenter, false);
            // return {
            //   isInCameraFrustum: true, // isInCameraFrustum,
            //   seemsInsideView: true, // seemsInsideView,
            //   x: screenIntersection ? screenIntersection.x : 0,
            //   y: screenIntersection ? screenIntersection.y : 0
            // };
        }
        return {
            x: vector.x,
            y: vector.y,
            isInCameraFrustum: isInCameraFrustum,
            seemsInsideView: seemsInsideView
        };
    };
    NavpointsFragment.prototype.toScreenPosition2 = function (sceneContainer, obj, camera) {
        var vector1 = camera.position.clone().sub(obj.position);
        var vector2 = camera.getWorldDirection(new THREE.Vector3());
        // let angle = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x)
        // if(angle < 0) left.push
        // else right.push
        return vector2;
    };
    NavpointsFragment.prototype.drawNavpoint = function (sceneContainer, navpoint) {
        // Compute position on screen
        if (navpoint.isDisabled) {
            return;
        }
        // TODO: reuse the vector somehow!
        var vector = new THREE.Vector3(navpoint.position.x, navpoint.position.y, navpoint.position.z);
        var distance = sceneContainer.camera.position.distanceTo(vector);
        var difference = vector.y - sceneContainer.camera.position.y;
        // How to converting world coordinates to 2D mouse coordinates in ThreeJS
        // Found at
        //    https://discourse.threejs.org/t/how-to-converting-world-coordinates-to-2d-mouse-coordinates-in-threejs/2251
        // vector.project(sceneContainer.camera);
        // //  This only converts a vector to normalized device space. You still have to map the vector to 2D screen space. Something like:
        // // TODO: fetch real renderer size here!
        // vector.x = ((vector.x + 1) * sceneContainer.rendererSize.width) / 2;
        // vector.y = (-(vector.y - 1) * sceneContainer.rendererSize.height) / 2;
        // vector.z = 0;
        var vector2d = this.toScreenPosition(sceneContainer, navpoint.object3D, sceneContainer.camera);
        var colorMarker = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        // if (this.currentFragmentBounds.contains(vector2d)) {
        if (vector2d.seemsInsideView && vector2d.isInCameraFrustum) {
            // Navpoint is in visible area
            this.drawMarkerAt(vector2d, colorMarker, navpoint.type);
            this.drawLabelAt(vector2d.x, vector2d.y, "".concat(navpoint.label, " (").concat(distance.toFixed(1), "m)"));
        }
        else {
            if (vector2d.seemsInsideView) {
                // const directionPoint = {
                //   x: Math.min(Math.max(vector2d.x, this.currentFragmentBounds.min.x), this.currentFragmentBounds.max.x),
                //   y: Math.min(Math.max(vector2d.y, this.currentFragmentBounds.min.y), this.currentFragmentBounds.max.y)
                // };
                // this.drawMarkerAt(directionPoint, "red", navpoint.type);
                // this.drawLabelAt(directionPoint.x, directionPoint.y, `${navpoint.label} (${distance.toFixed(1)}m)`);
                var lineFromCenter = new plotboilerplate_1.Line(new plotboilerplate_1.Vertex(vector2d.x, vector2d.y), // TODO: check if Vertex(THREE.Vector) is working
                this.screenBounds.getCenter()
                // new Vertex(this.screenBounds.width - vector2d.x, this.screenBounds.height - vector2d.y)
                );
                var screenIntersection = this.screenBounds.toPolygon().closestLineIntersection(lineFromCenter, false);
                // screenIntersection.x = sceneContainer.rendererSize.width - screenIntersection.x;
                // console.log("screenIntersection", screenIntersection);
                this.drawMarkerAt(screenIntersection, "orange", navpoint.type);
                this.drawLabelAt(screenIntersection.x, screenIntersection.y, "".concat(navpoint.label, " (").concat(distance.toFixed(1), "m)"));
            }
            else {
                var lineFromCenter = new plotboilerplate_1.Line(new plotboilerplate_1.Vertex(vector2d.x, vector2d.y), // TODO: check if Vertex(THREE.Vector) is working
                this.screenBounds.getCenter()
                // new Vertex(this.screenBounds.width - vector2d.x, this.screenBounds.height - vector2d.y)
                );
                var screenIntersection = this.screenBounds.toPolygon().closestLineIntersection(lineFromCenter, false);
                this.drawMarkerAt(screenIntersection, "red", navpoint.type);
                this.drawLabelAt(screenIntersection.x, screenIntersection.y, "".concat(navpoint.label, " (").concat(distance.toFixed(1), "m)"));
            }
        }
        this.drawLabelAt(vector2d.x, vector2d.y + 12, " (".concat(difference < 0 ? "﹀" : "︿", " ").concat(difference.toFixed(1), "m)"));
    };
    NavpointsFragment.prototype.drawMarkerAt = function (center, color, navPointType) {
        this.hudComponent.hudBitmap.strokeStyle = color;
        this.hudComponent.hudBitmap.beginPath();
        if (navPointType === "nav") {
            this.hudComponent.hudBitmap.moveTo(center.x + 5, center.y - 5);
            this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
            this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
            this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
            this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
        }
        else {
            this.hudComponent.hudBitmap.moveTo(center.x - 5, center.y - 5);
            this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y + 5);
            this.hudComponent.hudBitmap.lineTo(center.x + 5, center.y - 5);
            this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y + 5);
            this.hudComponent.hudBitmap.lineTo(center.x - 5, center.y - 5);
        }
        this.hudComponent.hudBitmap.stroke();
        this.hudComponent.hudBitmap.closePath();
    };
    NavpointsFragment.prototype.drawLabelAt = function (x, y, label) {
        this.hudComponent.hudBitmap.beginPath();
        this.hudComponent.hudBitmap.fillText(label, x + 10, y - 8);
        // this.hudComponent.hudBitmap.fill();
        this.hudComponent.hudBitmap.closePath();
    };
    /**
     * @implement RenderableComponent.befoRerender
     */
    NavpointsFragment.prototype.beforeRender = function (sceneContainer, _data, tweakParams) {
        // console.log("[NavpointsFragment] beforeRender");
        this.hudComponent.hudBitmap.save();
        if (tweakParams.highlightHudFragments) {
            var colorStyleBg = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.25);
            this.hudComponent.hudBitmap.fillStyle = colorStyleBg;
            this.hudComponent.hudBitmap.fillRect(this.currentFragmentBounds.min.x, this.currentFragmentBounds.min.y, this.currentFragmentBounds.width, this.currentFragmentBounds.height);
        }
        // TODO: buffer color style string in class variable (is rarely changed)
        var colorStrokeStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 1.0);
        this.hudComponent.hudBitmap.strokeStyle = colorStrokeStyle;
        var colorFillStyle = (0, Helpers_1.getColorStyle)(this.hudComponent.primaryColor, 0.5);
        this.hudComponent.hudBitmap.fillStyle = colorFillStyle;
        var center = this.currentFragmentBounds.getCenter();
        this.drawMarkerAt(center, colorStrokeStyle, "default");
        for (var i = 0; i < sceneContainer.navpoints.length; i++) {
            this.drawNavpoint(sceneContainer, sceneContainer.navpoints[i]);
        }
        this.hudComponent.hudBitmap.restore();
    };
    /**
     * @implement RenderableComponent.renderFragment
     */
    NavpointsFragment.prototype.renderFragment = function (_renderer) {
        // NOOP
    };
    /**
     * @implement RenderableComponent.updateSize
     */
    NavpointsFragment.prototype.updateSize = function (width, height) {
        // TODO: use params here
        console.log("[NavpointsFragment] Resized", this.hudComponent.hudCanvas.width);
        // When the viewport sizes changes then then the HUD fragment bounds
        // need to be re-calculated as well.
        // Use 10% safe area from the frame borders
        var safeAreaPct = 0.1;
        this.currentFragmentBounds = new Helpers_1.Bounds2Immutable(width * safeAreaPct, height * safeAreaPct, width * (1.0 - 2 * safeAreaPct), height * (1.0 - 2 * safeAreaPct));
        this.screenBounds.min.x = width * safeAreaPct;
        this.screenBounds.min.y = height * safeAreaPct;
        this.screenBounds.max.x = width * (1.0 - 2 * safeAreaPct); // this.hudComponent.hudCanvas.width;
        this.screenBounds.max.y = height * (1.0 - 2 * safeAreaPct); // this.hudComponent.hudCanvas.height;
    };
    return NavpointsFragment;
}());
exports.NavpointsFragment = NavpointsFragment;
//# sourceMappingURL=NavpointsFragment.js.map