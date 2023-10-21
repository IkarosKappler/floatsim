/**
 * A component for rendering chapter intros.
 *
 * @author  Ikaros Kappler
 * @date    2023-10-21
 * @version 1.0.0
 */
import { JSXInternal } from "preact/src/jsx";
import { IFrontendUIBaseProps } from "./FrontendUI";
import { StationData } from "../../components/interfaces";
interface StationRoomProps extends IFrontendUIBaseProps {
    resourcePath: string;
    onTerminated: () => void;
    isGameReady: boolean;
    station: StationData;
    isDockingInProgress: boolean;
}
export declare const StationRoom: (props: StationRoomProps) => JSXInternal.Element;
export {};
