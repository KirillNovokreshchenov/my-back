import {BSON} from "mongodb";
export function formatIdInObjectId(id: string){
    return new BSON.ObjectId(id)
}
