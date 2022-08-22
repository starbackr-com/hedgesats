const crypto = require('crypto');
const config = require('../config');
const https = require('https');
const { URLSearchParams } = require('url')
const timestamp = parseInt(new Date().getTime() / 1000);

const signature = (secret, timestamp, method, path, params, body) => {

      let data = ''
      if (method.match(/^(GET|DELETE)$/) && params) {
        data = new URLSearchParams(params).toString()
      } else if (method.match(/^(POST)$/)) {
        data = JSON.stringify(body)
      }

      const payload = `${timestamp}${method}${path}${data}`;

      return crypto.createHmac('SHA256', new Buffer.from(secret, 'base64')).update(payload).digest('base64');
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

const kollider = async (method, path, params, body) => {

      const headers = {
          'Content-Type': 'application/json',
          'K-API-KEY': config.kollider.key,
          'K-PASSPHRASE': config.kollider.pass,
          'K-TIMESTAMP': timestamp,
          'K-SIGNATURE': signature(config.kollider.secret, timestamp, method, path, params, body),
      }

      //Add this after signature is computed.
      path = '/v1' + path;

      const options = {
          port: 443,
          hostname: config.kollider.url,
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
  kollider: kollider

};
