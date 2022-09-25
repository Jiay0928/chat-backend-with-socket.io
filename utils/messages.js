const momemt = require('moment');
function formatMessage(person, word) {
    return {
        person,
        word,
        time: momemt().format('h:mm a')
    }

}
module.exports = formatMessage;