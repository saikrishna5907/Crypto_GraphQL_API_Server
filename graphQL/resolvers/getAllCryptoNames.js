
const rp = require('request-promise');
require('dotenv').config({ path: '../../values.env' });

const resolver = {
    Query: {
        getCryptoNames: async () => {
            let cryptoData= [];
            try {
                const requestOptions = {
                    method: 'GET',
                    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
                    qs: {
                        'start': '1',
                        'limit': '100',
                        'convert': 'AUD'
                    },
                    headers: {
                        'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_API_KEY
                    },
                    json: true,
                    gzip: true
                };
                await rp(requestOptions).then(response => {
                    response.data.map(crypto => {
                        cryptoData.push({
                            name: crypto.name,
                            symbol: crypto.symbol,
                            currentValueinAUD: crypto.quote.AUD.price? crypto.quote.AUD.price: 0
                        })
                    })

                }).catch((err) => {
                    console.log('API call error:', err.message);
                });
                return cryptoData;

            } catch (err) {
                throw err;
            }
        }
    }
}
export default resolver;

