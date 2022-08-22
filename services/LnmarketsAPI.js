const crypto = require('crypto');
const config = require('../config');
const https = require('https');
const { URLSearchParams } = require('url')
const timestamp = parseInt(new Date().getTime());

const signature = (secret, timestamp, method, path, params, body) => {

      let data = ''
      if (method.match(/^(GET|DELETE)$/) && params) {
        data = new URLSearchParams(params).toString()
      } else if (method.match(/^(POST)$/)) {
        data = JSON.stringify(body)
      }

      const payload = `${timestamp}${method}${path}${data}`;

      return crypto.createHmac('SHA256', secret).update(payload).digest('base64');
};

const requestAPI = (options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')

      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('error', (error) => {
        reject(error)
      })

      res.on('end', () => {
        if (this.debug) {
          return resolve({ req, res })
        }

        try {

          const body = JSON.parse(data);

          if (res.statusCode === 200) {
            resolve(body)
          } else {
            console.error(body)
            reject(new Error(res.statusCode, body))
          }
        } catch (error) {
          error.data = data
          reject(error)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (options.method.match(/^(PUT|POST)$/) && options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

const lnmarkets = async (method, path, params, body) => {

      //Add this before signature is computed.
      path = '/v1' + path;


      const headers = {
          'Content-Type': 'application/json',
          'LNM-ACCESS-KEY': config.lnmarkets.key,
          'LNM-ACCESS-PASSPHRASE': config.lnmarkets.pass,
          'LNM-ACCESS-TIMESTAMP': timestamp,
          'LNM-ACCESS-SIGNATURE': signature(config.lnmarkets.secret, timestamp, method, path, params, body),
      }



      const options = {
          port: 443,
          hostname: config.lnmarkets.url,
          method,
          path,
          headers,
          body,
        }

        if (method.match(/^(GET|DELETE)$/) && params) {
          options.path += `?${new URLSearchParams(params).toString()}`
        }

        console.log(options);

        return await requestAPI(options);


}

module.exports = {
  lnmarkets: lnmarkets

};
