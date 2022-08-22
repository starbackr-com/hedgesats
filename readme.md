# hedgesats
## Ability to call lightning exchange APIs ( kollider.xyz and Lnmarkets.com) to hedge sats. To hold USD$ position for your sats, simply open a short position with 1x leverage.

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

hedgesats is a nodejs API client with code to call APIs and interact with lightning exchanges such as Kollider and lnmarkets

Steps to install and run

1) download source
2) Register with lightning exchange and create API keys
3) copy config-sample.js to config.js and update the API keys
4) node index.js to execute the code.

Notes:

Call kollider API with this info(Method, path, params, body)
method = GET, POST (All caps)
path = without /v1 e.g. '/user/account'
params = get parameters e.g. 'symbol=BTCUSD.PERP&limit=10'
body = post body in JSON e.g. { type: 'Ln', amount: 1000 }

API docs: https://docs-api.kollider.xyz/#section/Introduction

call Lnmarkets API with this info(Method, path, params, body)
method = GET, POST (All caps)
path = without /v1 e.g. '/user/account'
params = get parameters e.g. 'symbol=BTCUSD.PERP&limit=10'
body = post body in JSON e.g. { type: 'm', side: 's', quantity: 1, leverage: 1 };

API docs: https://docs.lnmarkets.com/api/v1/#section/Introduction

## key differences between both APIs (Kollider Vs Lnmarkets)

1) Kollider secret key must be decoded base64 before SIGNATURE
2) Kollider uses timestamp in seconds
3) Kollider does not include /v1/ in the path for SIGNATURE
4) Kollider requires body JSON params to be alphabetically ordered
