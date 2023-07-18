export function videoUpdate(video: any, requestBody: any){
    Object.keys(requestBody).forEach((prop) => video[prop] = requestBody[prop])
}