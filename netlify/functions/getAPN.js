
const parcelFact = require("./ParcelFact");

exports.handler = async function (event, context) {

  const body = JSON.parse(event.body); // postencoded
  // const body = event.body
  // const apn = '110067270';
  const lat = body.lat;
  const lon = body.lon;
  console.log('starting ', body);
  console.log('lat ', lat);
  console.log('lon ', lon);

// 
//   const lat = req.query.lat;
//   const lon = req.query.lon;
  const response = await parcelFact.getOneAPN(lat, lon);
  console.log(response);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: response,
    }),
  };
};
