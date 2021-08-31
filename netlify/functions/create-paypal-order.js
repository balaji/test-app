const fetch = require('node-fetch')

// Variables to first retrieve a PayPal access token
const authUrl = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
const base64 = Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET).toString('base64')

// Variables to call the Orders API 
const ordersURL = 'https://api-m.sandbox.paypal.com/v2/checkout/orders'

exports.handler = async function (event, context) {
    let {amount_total, currency, return_url, custom_id, shipping} = JSON.parse(event.body);
    // PayPal's API expects 'USD', while Stripe provides 'usd'
    currency = currency.toUpperCase()

    // PayPal's API expects a float value like 20.00, while Stripe provides minor units like 2000
    amount_total = (amount_total/100).toFixed(2)

    const paypalOrderPayload = {
        "intent":"CAPTURE",
        "purchase_units":[
            {
                "amount":{
                    "currency_code": currency,
                    "value": amount_total
                },
                "shipping":{
                    "name":{
                        "full_name":shipping.name
                    },
                    "type": "SHIPPING",
                    "address":{
                        "address_line_1":shipping.address.line_1,
                        "address_line_2":shipping.address.line_2,
                        "admin_area_2":shipping.address.city,
                        "postal_code":shipping.address.postal_code,
                        "country_code":shipping.address.country,
                    }
                }
            }
        ],
        "application_context":{
            "return_url":return_url,
            "cancel_url":return_url
        }
    }

    // Fetch a PayPal acess token 
    const paypalAccessToken = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'Authorization': `Basic ${base64}`,
        },
        body: 'grant_type=client_credentials'
    }).then (res => res.json())
    .then(json => json.access_token)
    .catch(error => console.log(error));

    const paypalReturnURL = await fetch(ordersURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${paypalAccessToken}`
        },
        body: JSON.stringify(paypalOrderPayload)
    }).then (res => res.json())
    .then(json => json.links[1].href)
    .catch(error => console.log(error));

    return {
        statusCode: 200,
        body: JSON.stringify({
            redirect_url: paypalReturnURL,
        })
    }
}