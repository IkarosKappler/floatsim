/**
 * Idea: write one program file for each chapter to keep the main
 * file small.
 *
 * @author  Ikaros Kappler
 * @date    2023-10-21
 * @version 1.0.0
 */
import { SceneContainer } from "../../components/SceneContainer";
import { PerlinTerrain } from "../../components/environment/PerlinTerrain";
export declare class Chapter00 {
    private sceneContainer;
    private anningPosition;
    private dockingBuoyAdded;
    constructor(sceneContainer: SceneContainer, terrain: PerlinTerrain);
    loadDockingStation(terrain: PerlinTerrain): void;
    private requestAddDockingNavpoint;
    private addDockingBuoy;
    private requestDockingPossible;
}
