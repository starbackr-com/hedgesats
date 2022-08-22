const kollider = require('./services/KolliderAPI.js').kollider;
const lnmarkets = require('./services/LnmarketsAPI.js').lnmarkets;



const main = async () => {

    let body = '';

    /*
      call kollider API with this info(Method, path, params, body)
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

      key differences between both APIs (Kollider Vs Lnmarkets)

      1) Kollider secret key must be decoded base64 before SIGNATURE
      2) Kollider uses timestamp in seconds
      3) Kollider does not include /v1/ in the path for SIGNATURE
      4) Kollider requires body JSON params to be alphabetically ordered



    */

    /*
    1. Kollider - get user Account information

    response:
    {
          "created_at": {
            "nanos_since_epoch": 105729000,
            "secs_since_epoch": 1616581331
          },
          "email": "user@email.com",
          "user_type": 1,
          "username": "username",
          "validated_email": false
        }

    */

    console.log(await kollider('GET', '/user/account'));

    /*

    2. Kollider - make a deposit

    input:

    body = {
          amount: 1000,
          type: "Ln"

    };

    response: {
        "payment_request": "lntb1u1pwz5w78pp5e8w8cr5c30xzws92v36sk45znhjn098rtc4pea6ertnmvu25ng3sdpywd6hyetyvf5hgueqv3jk6meqd9h8vmmfvdjsxqrrssy29mzkzjfq27u67evzu893heqex737dhcapvcuantkztg6pnk77nrm72y7z0rs47wzc09vcnugk2ve6sr2ewvcrtqnh3yttv847qqvqpvv398"
      }

    */

    body = {
          amount: 1000,
          type: "Ln"

    };

    console.log(await kollider('POST', '/wallet/deposit', '', body));

    /*
      3. Kollider - Place a new order_type

      NOTE: leverage 100 = 1x

      input:

      body = {

              "leverage": 100,
              "margin_type": "Isolated",
              "order_type": "Limit",
              "price": 23000,
              "quantity": 1,
              "settlement_type": "instant"
              "side": "Ask",
              "symbol": "BTCUSD.PERP",
            }

      response:

      {
            timestamp: 1661125006432,
            order_id: 111,
            ext_order_id: 'xxx',
            uid: 111,
            symbol: 'BTCUSD.PERP',
            quantity: 1,
            order_type: 'Limit',
            price: 23000,
            leverage: 100
          }


    */

    body = {

            "leverage": 100,
            "margin_type": "Isolated",
            "order_type": "Limit",
            "price": 23000,
            "quantity": 1,
            "settlement_type": "Instant",
            "side": "Ask",
            "symbol": "BTCUSD.PERP",
          }

    //console.log(await kollider('POST', '/orders', '', body));


    /*

      4. Lnmarkets - get user information

      response: {
            "uid": "d068f829-26e6-4743-b10d-ebb5a83b3624",
            "balance": 361086,
            "account_type": "Joule",
            "username": "Satoshi",
            "linkingpublickey": "035555cbdd2b5642bbd196b31df477fad20125ae99119fd5ffb1d42c7f4811dd3a"
          }

    */

    console.log(await lnmarkets('GET', '/user'));

    /*
      5. Lnmarkets - New Futures position with leverage 1x short to hold $$ position

      response: {
              "pid": "249dc818-f8a5-4713-a3a3-8fe85f2e8969",
              "id": 666,
              "type": "m",
              "takeprofit_wi": "running",
              "takeprofit": 13337,
              "stoploss_wi": "running",
              "stoploss": 1337,
              "side": "s",
              "quantity": 42,
              "price": 8888,
              "pl": -13640,
              "market_wi": "filled",
              "market_filled_ts": "020-09-15T10:50:40.332Z",
              "margin_wi": "running",
              "margin": 424242,
              "liquidation": 1000,
              "leverage": 50,
              "creation_ts": "020-09-15T10:50:40.332Z"
            }

    */

    body = { type: 'm', side: 's', quantity: 1, leverage: 1 };

    console.log(await lnmarkets('POST', '/futures', '', body));



};

main();
