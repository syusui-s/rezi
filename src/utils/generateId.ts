const generateId = () => {
  if (window.crypto?.getRandomValues != null) {
    const arr = crypto.getRandomValues(new Uint8Array(16));
    // Version: 4
    // eslint-disable-next-line no-bitwise
    arr[6] = (arr[6] & 0x0f) | 0x40;
    // Variant: 0b10 (RFC4122)
    // eslint-disable-next-line no-bitwise
    arr[8] = (arr[8] & 0x3f) | 0x80;
    const binaryString = String.fromCharCode(...arr);
    const b64String = btoa(binaryString);
    const urlSafeString = b64String.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
    return urlSafeString;
  }

  return Math.random().toString();
};

export default generateId;
