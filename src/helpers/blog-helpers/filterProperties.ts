export function filterProperties(optionalProperties: any){
    for (let prop in optionalProperties) {
        if (optionalProperties[prop] === undefined) {
            delete optionalProperties[prop];
        }
    }
    return optionalProperties
}