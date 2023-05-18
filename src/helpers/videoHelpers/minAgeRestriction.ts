export function correctAge(valueAge: number) {
    return valueAge > 18 ? false : valueAge < 1 ? false : true
}