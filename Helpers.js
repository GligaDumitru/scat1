const crypto = require('crypto');
const fs = require('fs');
const IV_LENGTH = 16; // For AES, this is always 16

const returnRandomBytesKey = (number = 32) => {
    return crypto.randomBytes(number)
}
const ENCRYPTION_KEY = returnRandomBytesKey(); // Must be 256 bits (32 characters)

const generateKeysPublicPrivate = () => {
    crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'top secret'
        }
    }, (err, publicKey, privateKey) => {
        console.log('public', publicKey)
        console.log('private', privateKey)
    });
}


//sym encryption
const encryptText = (text, key) => {
    // for AES is 16
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
    let encrypted = cipher.update(text)

    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
}

//sym decryption
const decryptText = (text, key) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

const encryptWithPublicKey = (message, publicKey) => {
    return crypto.publicEncrypt(publicKey, Buffer.from(message)).toString("base64")
}

const decryptWithPrivateKey = (message, privateKey) => {
    const res = crypto.privateDecrypt({ key: privateKey.toString(), passphrase: 'top secret' }, Buffer.from(message, "base64")).toString("utf8")
    return res
}

const getMessageEncrypted = (message, symmetricKey, publicKey, step) => {
    let encryptedMessage = encryptText(JSON.stringify(message), symmetricKey)
    let encryptedKey = encryptWithPublicKey(symmetricKey.toString('hex'), publicKey)
    return { encryptedMessage, encryptedKey, step }
}

const getMessageDecrypted = (message, privateKey) => {
    const keyDecrypted = Buffer.from(decryptWithPrivateKey(message.encryptedKey, privateKey), 'hex')
    const messageDecrypted = JSON.parse(decryptText(message.encryptedMessage, keyDecrypted))
    return messageDecrypted
}

const returnObjWithKeys = (nameOfFile) => {
    const publicKey = fs.readFileSync(__dirname + '/keys/' + nameOfFile + '.public-key.public', 'utf8');
    const privateKey = fs.readFileSync(__dirname + '/keys/' + nameOfFile + '.private-key.private', 'utf8');
    return { publicKey, privateKey }
}

const returnHashForMessage = (message) => {
    return crypto.createHash('sha256').update(JSON.stringify(message)).digest('base64')
}

module.exports = {
    generateKeysPublicPrivate,
    returnObjWithKeys,
    encryptText,
    decryptText,
    encryptWithPublicKey,
    decryptWithPrivateKey,
    getMessageEncrypted,
    getMessageDecrypted,
    returnRandomBytesKey,
    returnHashForMessage
}
