/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';

const Wreck = require('@hapi/wreck');

const getStockPrice = async function (apiUrl) {

  const { res, payload } = await Wreck.get(apiUrl);
  return payload;
};

let cache = {};

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: {

      security: true,
      cors: {
        origin: [
          'http://localhost:4200',
          'http://localhost'
        ],
        additionalHeaders: [
          'Access-Control-Allow-Origin',
          'Access-Control-Request-Method',
          'Allow-Origin',
          'Origin',
          'access-control-allow-origin',
          'access-control-request-method',
          'allow-origin',
          'origin',
        ]
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/beta/stock/{chart}/{symbol}/{time}',
    handler: async (req, h) => {

      const token = req.query.token;
      const chart = req.params.chart;
      const time = req.params.time;

      const apiUrl = 'https://sandbox.iexapis.com/beta/stock/' + chart + '/chart/' + time + '?token=' + token;

      // If the request is cached in memory then return the cached version.
      if(cache[token+chart+time]){
        return {
          ...JSON.parse(cache[token+chart+time])
        };
      }else{
        try {
          const body = await getStockPrice(apiUrl);
          cache[token+chart+time] = body;
          return { ...JSON.parse(body) }
        } catch (ex) {
          console.error(ex);
        }
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
