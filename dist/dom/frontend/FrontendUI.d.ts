/**
 * A class to handle the html frontend UI. The frontent
 * is wrapped in a DIV overlay and used for storytelling
 * and text dialogues.
 *
 * @author  Ikaros Kappler
 * @date    2033-09-09
 * @version 1.0.0
 */
import { IGlobalLibs } from "../../components/interfaces";
import { SceneContainer } from "../../components/SceneContainer";
import { Params } from "../../utils/Params";
export interface IFrontendUIBaseProps {
    sceneContainer: SceneContainer;
    globalLibs: IGlobalLibs;
}
export declare class FrontendUI {
    constructor(sceneContainer: SceneContainer, globalLibs: IGlobalLibs, params: Params);
}
