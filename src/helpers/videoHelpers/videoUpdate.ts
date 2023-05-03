import {VideoViewModel} from "../../models/video-model/VideoViewModel";
import {VideoCreateAndUpdateModel} from "../../models/video-model/VideoCreateModel";

export function videoUpdate(video: any, requestBody: any){
    Object.keys(requestBody).forEach((prop) => video[prop] = requestBody[prop])
}