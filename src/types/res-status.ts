export enum RESPONSE_STATUS {
    NOT_FOUND_404 = 404,
    NO_CONTENT_204 = 204,
    OK_200 = 200,
    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 =401,
    FORBIDDEN_403 = 403,
    SERVER_ERROR_500 =500,
    CREATED_201 = 201
}

export enum RESPONSE_OPTIONS{
    NO_CONTENT = 'No Content',
    FORBIDDEN = 'Forbidden',
    NOT_FOUND = 'Not Found'
}