const encodeToBase64 = (str) => {
    const utf8Bytes = new TextEncoder().encode(str);
    return btoa(String.fromCharCode(...utf8Bytes));
}

const decodeFromBase64 = (str) => {
    const binaryString = atob(str);
    const utf8Bytes = new Uint8Array([...binaryString].map(char => char.charCodeAt(0)));
    return new TextDecoder().decode(utf8Bytes);
}

const isBase64 = (str) => {
    if (typeof str !== 'string') return false;
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Regex.test(str) || str.length % 4 !== 0) return false;
    try {
        atob(str);
        return true;
    } catch (err) {
        return false;
    }
};

export { encodeToBase64, decodeFromBase64, isBase64 };