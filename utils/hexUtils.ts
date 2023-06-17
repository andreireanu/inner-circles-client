export function stringToHex(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

export function numberToHex(nr: any) {
    let result = parseInt(nr).toString(16);
    if (result.length % 2 == 1) {
        result = '0' + result;
    }
    return result;
}

export function hex2a(hexx: String) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    return str;
}