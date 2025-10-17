import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY;

export const Crypto = {
    encryptData: (data: string): string => {
        return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    },

    decryptData: (encryptedData: string): string => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
};