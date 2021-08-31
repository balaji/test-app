This repository includes 1 serverless function, which can be used to proxy a call to PayPal's sandbox environment to create a PayPal order. 

## Installation

Just hit the button below, and fill in **sandbox** PayPal API credentials when prompted.

[![Deploy to netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/theoBLT/netlify-functions-test)

## Usage 

Call the function generated at `http://{{base_url}}/.netlify/functions/create-paypal-order` with the following body: 

```
{
    "amount_total": 5000,
    "currency": "eur",
    "return_url": "https://www.example.com/complete",
    "custom_id": "abcd",
    "shipping": {
        "name": "Jean-Eudes Dupon",
        "address": {
            "line1": "2 rue des Alouettes",
            "line2": "Appt 202",
            "city": "Paris",
            "country": "FR",
            "postal_code": "75011"
        }
    }
}
```

This will in turn create a Sandbox PayPal order, and return back a 200 with the sandbox URL to which you can redirect your buyer.

You can then log in using a test sandbox buyer account to complete the payment. 