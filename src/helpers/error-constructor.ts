

export function errorConstructor(field: string) {
    return {
        "errorsMessages": [
            {
                "message": "string",
                "field": field
            }
        ]
    }
}