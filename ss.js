//   // const messageEncrypted = Helpers.getMessageEncrypted(customerKeys.publicKey, generateRandom32KeyForEncryption, merchantKeys.publicKey, 'step1')
//   console.log(`Generate encrypted message...`)
//   // console.log(customerKeys.publicKey)
//   // console.log(JSON.stringify(customerKeys.publicKey))
//   const message = customerKeys.publicKey;
console.log(generateRandom32KeyForEncryption)
console.log(generateRandom32KeyForEncryption.toString('hex'))
console.log(Buffer.from(generateRandom32KeyForEncryption.toString('hex'),'hex'))
console.log(`Generate key...${generateRandom32KeyForEncryption.length}`);

//   // let encryptedMessage = Helpers.encryptText(message, generateRandom32KeyForEncryption)
//   // let decrryptM = Helpers.decryptText(encryptedMessage, generateRandom32KeyForEncryption)

//   let encryptedKey = Helpers.encryptWithPublicKey(generateRandom32KeyForEncryption.toString('hex'),  merchantKeys.publicKey)
// // 1
//   const keyDecrypted = Helpers.decryptWithPrivateKey(encryptedKey, merchantKeys.privateKey)
// // console.log('generateRandom32KeyForEncryption',generateRandom32KeyForEncryption)
//   console.log(Buffer.from(keyDecrypted,'hex'))
//   //   const getMessageEncrypted = (message, symmetricKey, publicKey, step) => {
//   //     let encryptedKey = encryptWithPublicKey(symmetricKey, publicKey)
//   //     return { encryptedMessage, encryptedKey, step }
//   // }

//   // const getMessageDecrypted = (message, privateKey) => {
//   //     
//   //     console.log(keyDecrypted.length)
//   //     const messageDecrypted = JSON.parse(decryptText(message.encryptedMessage, keyDecrypted))
//   //     return messageDecrypted
//   // }



//   // const msgTest = "hello";
//   // const c1 = Helpers.encryptWithPublicKey(msgTest, customerKeys.publicKey)
//   // const d1 = Helpers.decryptWithPrivateKey(c1, customerKeys.privateKey)

//   // const a1 = Helpers.encryptText(msgTest, generateRandom32KeyForEncryption)
//   // const b1 = Helpers.decryptText(a1, generateRandom32KeyForEncryption)
