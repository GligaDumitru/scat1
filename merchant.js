const net = require('net');
const PORT = 3000;
const Helpers = require('./Helpers')
const merchantKeys = Helpers.returnObjWithKeys('merchant');
let customerPublicKey = '';
const socketForPayment = net.createConnection(3001);
const paymentKeys = Helpers.returnObjWithKeys('payment')


const onReceiveDataFromCustomer = (data, socket) => {
    data = JSON.parse(data);
    const { step } = data;
    if (step === 'step1') {
        // preparing Setup
        console.log(`Get things ready....`)

        console.log(`Decrypt public key of customer...`);
        customerPublicKey = Helpers.getMessageDecrypted(data, merchantKeys.privateKey);

        const generateRandom32KeyForEncryption = Helpers.returnRandomBytesKey()

        const sessionID = Helpers.returnRandomBytesKey(25).toString('hex');
        console.log('Generate random session ID...');
        const hashOfMessage = Helpers.returnHashForMessage(sessionID)
        console.log('Generate hash of ID...');
        const information = JSON.stringify({ sessionID, hash: hashOfMessage })
        const encryptedMessage = JSON.stringify(Helpers.getMessageEncrypted(information, generateRandom32KeyForEncryption, customerPublicKey, 'step1'))
        socket.write(encryptedMessage)

    } else if (step === 'step2') {
        // preparing Exchange
        console.log(`Get ready for exchange...`)
        const dataDecrypted = JSON.parse(Helpers.getMessageDecrypted(data, merchantKeys.privateKey))
        const generateRandom32KeyForEncryption = Helpers.returnRandomBytesKey()
        let SigM = {
            sid: dataDecrypted.PO.details.sid,
            customerPublicKey,
            amount: dataDecrypted.PO.details.amount
        }
        SigM = Helpers.returnHashForMessage(SigM)

        const requestForPayment = {
            PM: dataDecrypted.PM,
            amount: dataDecrypted.PO.details.amount * 10,// total price
            sig: SigM
        }
        const messageToSend = Helpers.getMessageEncrypted(requestForPayment, generateRandom32KeyForEncryption, paymentKeys.publicKey, 'step3')
        socketForPayment.write(JSON.stringify(messageToSend))
    }
}


const server = net.createServer((socket) => {
    console.log('Server Created')
    socket.on('end', () => {
        console.log('[SERVER]:: A client conn ends.');
    })
    socket.on('data', (res) => {
        onReceiveDataFromCustomer(res, socket)
    })
})





server.listen(PORT, () => {
    console.log(`Server is running at port:${PORT}`)
})



onReceiveDataFromMerchant = (data) => {
    data = JSON.parse(data)
    // console.log('Received data from Payment...')

    const information = Helpers.getMessageDecrypted(data, merchantKeys.privateKey)
}

socketForPayment.on('data', (data) => onReceiveDataFromMerchant(data))
