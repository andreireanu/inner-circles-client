export function stringToHex(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

export function numberToHex(nr: number) {
    let result = nr.toString(16);
    if (result.length % 2 == 1) {
        result = '0' + result;
    }
    return result;
}