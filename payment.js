const net = require('net');
const PORT = 3001;
const Helpers = require('./Helpers')
const paymentKeys = Helpers.returnObjWithKeys('payment')
const merchantKeys = Helpers.returnObjWithKeys('merchant')
const onReceiveDataFromCustomer = (data, socket) => {
    data = JSON.parse(data)
    console.log(data)
    if (data.step === "step3") {
        console.log('Payment start...')
        // const information = Helpers.getMessageDecrypted(data, paymentKeys.privateKey)

        const generateRandom32KeyForEncryption = Helpers.returnRandomBytesKey()

        const resp = {
            status: "ok"
        }

        // let SigPG = {
        //     resp,
        //     sid: messageFromCustomer.details.sid,
        //     amount: messageFromCustomer.details.amount,
        //     nonce: messageFromCustomer.details.nonce
        // }

        // SigPG = Helpers.returnHashForMessage(SigPG)

        // let returnResponse = {
        //     resp,
        //     sid: messageFromCustomer.details.sid,
        //     sig: SigPG
        // }

        console.log('Ready to responde back to merchant...')
        // socket.write(JSON.stringify(Helpers.getMessageEncrypted(returnResponse, generateRandom32KeyForEncryption, merchantKeys.publicKey, 'step4')))
    } else {
        console.log('Error on payment')
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
