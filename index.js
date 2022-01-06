const SignedMessageHandler = require('./modules/signed-message-handler');

function validateSignedMessage(message, address, payload) {
    try {
        const handler = new SignedMessageHandler(message);
        handler.verify(address, payload);
    } catch(err) {
        console.log('Invalid signed message', err);
        return false;
    }

    return true;
}

module.exports = {
    validateSignedMessage: validateSignedMessage
};