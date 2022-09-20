const crypto = require("crypto")
const rp = require("request-promise-native");

class Tokovoucher {
  /**
   * @param {string} merchant - Member Code
   * @param {string} secret - Secret Key
   **/
  constructor(merchant, secret) {
    this._merchant = merchant;
    this._secret = secret;
    this._endpoint = "https://api.tokovoucher.id"
  }

  cekSaldo() {
    let signature = crypto
      .createHash('md5')
      .update(`${this._merchant}:${this._secret}`)
      .digest('hex')

    const options = {
      method: "GET",
      uri: `${this._endpoint}/member?member_code=${this._merchant}&signature=${signature}`,
      json: true,
    };
    return rp(options)
      .then(function (resp) {

        if (resp.data) {
          if (typeof resp.data.saldo !== undefined) {
            return resp.data.saldo;
          } else {
            throw Error(resp.data.error_msg);
          }
        }
      })
      .catch(function (err) {
        throw Error(err);
      });
  }
}

module.exports = Tokovoucher;
