const addressHelper = require('./addresses');
const SignedMessageHandler = require('./signed-message-handler');

module.exports = {
    addressHelper: addressHelper,
    getSignedMessageHandler: (message) => new SignedMessageHandler(message)
};