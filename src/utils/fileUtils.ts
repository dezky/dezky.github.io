export const base64toFile = (dataUrl: any, filename: string) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = window.atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    // eslint-disable-next-line
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    // eslint-disable-next-line no-undef
    return new File([u8arr], filename, { type: mime });
};
