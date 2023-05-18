export function filterProperties(optionalProperties: { [key: string]: any }) {
    let filteredProperties: { [key: string]: string } = {};
    for (let prop in optionalProperties) {
        if (optionalProperties[prop] !== undefined) {
            filteredProperties[prop] = optionalProperties[prop];
        }
    }
    return filteredProperties;
}


