const fetch = require('node-fetch')

exports.handler = async function (event, context) {
    const requestBody = JSON.parse(event.body);
    console.log(requestBody)
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: process.env.GREETING,
        })
    }
}