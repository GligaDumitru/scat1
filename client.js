const net = require('net');
const PORT = 3000;
const socket = net.createConnection(PORT);
const Helpers = require('./Helpers');
const customerKeys = Helpers.returnObjWithKeys('customer');
const merchantKeys = Helpers.returnObjWithKeys('merchant');
const paymentKeys = Helpers.returnObjWithKeys('customer');


socket.on('data', (data) => onReceiveData(data))

const onReceiveData = data => {
  data = JSON.parse(data)
  const { step } = data;

  if (step === 'step1') {
    // receive session ID 
    console.log('Preparing to finish setup...')
    data = JSON.parse(Helpers.getMessageDecrypted(data, customerKeys.privateKey))
    console.log('Compare the hash variables...')
    if (Helpers.returnHashForMessage(data.sessionID) === data.hash) {
      console.log('Successfully authenticated....')
      onExchange(data.sessionID)
    } else {
      console.log('Error on login...')
    }
  } else if (step === 'step2') {
    // getting ready for exchange
    console.log('Preparing to finish setup...')
  }
}

const onExchange = sessionID => {
  console.log('Preparing for exchange...')

  const generateRandom32KeyForEncryption = Helpers.returnRandomBytesKey()
  const PI = {
    cardNumber: "4510 6459 8301 6543",
    cardExpiryDate: "03 / 2021",
    challengeCode: "8484",
    sid: sessionID,
    amount: 12,
    publicKey: customerKeys.publicKey,
    nonce: Helpers.returnRandomBytesKey(9).toString('hex'),
    merchantId: Helpers.returnRandomBytesKey(25).toString('hex')
  }

  console.log('Created PI...')
  const PO1 = {
    orderDesc: 'Iphone 11 Pro Max',
    sid: sessionID,
    amount: 12,
    nonce: Helpers.returnRandomBytesKey(4).toString('hex')
  }

  const PO = {
    details: PO1,
    hash: Helpers.returnHashForMessage(PO1)
  }
  console.log('Created PO, hash of PO...')
  const PM1 = {
    details: PI,
    hash: Helpers.returnHashForMessage(PI)
  }
  const PM = Helpers.getMessageEncrypted(PM1, generateRandom32KeyForEncryption, paymentKeys.publicKey, 'step2')
  const messageToSend = Helpers.getMessageEncrypted(JSON.stringify({ PM, PO }), generateRandom32KeyForEncryption, merchantKeys.publicKey, 'step2')
  send(messageToSend)
}


const send = msg => {
  socket.write(JSON.stringify(msg))
}

const close = () => {
  socket.destroy();
}

const init = () => {
  console.log('Start setup....')
  const generateRandom32KeyForEncryption = Helpers.returnRandomBytesKey()
  const messageToSend = Helpers.getMessageEncrypted(customerKeys.publicKey, generateRandom32KeyForEncryption, merchantKeys.publicKey, 'step1')
  send(messageToSend)
}

init();