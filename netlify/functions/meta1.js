const fetch = require('node-fetch')
var encoding = require("encoding");
const timestamp = require('unix-timestamp');


// const bluebird = require("bluebird");

const requestverificationtoken = "0xbRnb1lh0zsbjSOgva4NjhHpIQWU7rxcuPMcSMdiO49778S0T9agjJiWM-9_KEyZe8s88gvM9EiimY2hbek9YugWEUm4ZCuIDbZ3RmeqGY1:maXZc5_c4fezGSzpblzALRRY6gN-_wbHtqFnaGfvpM1fCMz9QJtKc8dwuDFMsx8IKI_HHHzwqXCwKJKcFqgBxLvA97uUHQNPOpBq2nktxCo1";
// "requestverificationtoken": "0xbRnb1lh0zsbjSOgva4NjhHpIQWU7rxcuPMcSMdiO49778S0T9agjJiWM-9_KEyZe8s88gvM9EiimY2hbek9YugWEUm4ZCuIDbZ3RmeqGY1:maXZc5_c4fezGSzpblzALRRY6gN-_wbHtqFnaGfvpM1fCMz9QJtKc8dwuDFMsx8IKI_HHHzwqXCwKJKcFqgBxLvA97uUHQNPOpBq2nktxCo1",
const verify = 'z2i5k58Fo5Q9oDevV%2bVFkm4CCNINh35pMET96%2fziejk%3d';

async function getSessionCookie(str) {

    // "body": "{\"parcelNumber\":\"123\",\"verify\":\"E%2bYuK0lWZ9n1mkYtup4CbR4q6q4mheYLdJXXuyOMilQ%3d\"}",
    // const b = '{\"taxPayer\":\"aaa\",\"verify\":\"KULNfBX43eEKDKSfYSbZr7gscQd0aBP%2bv5uRPjtKvdg%3d\"}';
    const b = '{\"parcelNumber\":\"110067270\",\"verify\":\"yP61BgjPMyqV76%2fdkAQKKqAelLhadoHtsCHvxC%2fkv9g%3d\"}';
    // let parsed = JSON.parse(b);
    let parsed = {};
    parsed.parcelNumber = str;
    parsed.verify = verify;
    console.log(parsed);
    const newBodyStr = JSON.stringify(parsed);
    console.log(newBodyStr);
    console.log(newBodyStr);

    try {

        const response = await fetch("https://www.asr.pima.gov/Parcel/CheckParcelHome", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                "credentials": "include",
                "requestverificationtoken": requestverificationtoken,
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Chrome OS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": "https://www.asr.pima.gov/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": newBodyStr,
            "method": "POST"
        });
        const body = await response.text();
        // const h = response.headers();
        // console.log(body);
        const cookieArr = response.headers.raw()['set-cookie'];
        console.log(response.headers.get('set-cookie'));


        // console.log(body);
        // console.table(res)
        const cookieStr = cookieArr.pop();
        const cookiePieces = cookieStr.split(';');
        // console.log(response.headers.raw()['set-cookie']);
        // console.log('cookiepieces', cookiePieces[0]);
        return cookiePieces[0];

    } catch (error) {
        console.log('cookie arr error!! -- if you get rgis you have to replace verify token in request')
        console.log("{taxPayer: 'aab', verify: 'yP61BgjPMyqV76%2fdkAQKKqAelLhadoHtsCHvxC%2fkv9g%3d'}");
        return false
    }

}


async function run6(apn) {
    const cookie = await getSessionCookie(apn);
    console.log(cookie);
    const cookie1 = "ASP.NET_SessionId=aonfqye5wi1k032y0mvgmbsj";
    const cookies = `${cookie}; __gsas=ID=f85f1dcbee47ae1f:T=1671230082:S=ALNI_MYTM1Yhx9nNPukf_PH8L1X5bKlSNA`;
    console.log(apn)
    const now = (timestamp.now() * 1000).toString().trim();
    // console.log(1669410712221);
    console.log(now);
    const b = '{\"parcelNumber\":\"110067270\"}';
    let parsed = JSON.parse(b);
    parsed.parcelNumber = apn;
    console.log(parsed);
    const newBodyStr = JSON.stringify(parsed);

    const r = await fetch(`https://www.asr.pima.gov/Parcel/GetSearchResults?ts=${now}&q=${apn}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Chrome OS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": `${cookie}`,
            "Referer": "https://www.asr.pima.gov/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    const body = await r.json()
    console.log(body);



    try {
        const r = await fetch("https://www.asr.pima.gov/Parcel/GetParcel", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                // "requestverificationtoken": requestverificationtoken,
                "requestverificationtoken": "0xbRnb1lh0zsbjSOgva4NjhHpIQWU7rxcuPMcSMdiO49778S0T9agjJiWM-9_KEyZe8s88gvM9EiimY2hbek9YugWEUm4ZCuIDbZ3RmeqGY1:maXZc5_c4fezGSzpblzALRRY6gN-_wbHtqFnaGfvpM1fCMz9QJtKc8dwuDFMsx8IKI_HHHzwqXCwKJKcFqgBxLvA97uUHQNPOpBq2nktxCo1",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Chrome OS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                // "cookie": "ASP.NET_SessionId=aonfqye5wi1k032y0mvgmbsj",
                "cookie": `${cookie}`,
                "Referer": "https://www.asr.pima.gov/Parcel/Index",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"parcelNumber\":\"110067270\"}",
            "method": "POST"
        });
        const body = await r.json()
        console.log(body.Data);
        return body.Data;




    } catch (error) {
        console.log(error);
    }

}



exports.handler = async function (event, context) {

    const body = JSON.parse(event.body); // postencoded
    // const apn = '110067270';
    const apn = body.apn;
    const _id = body._id;
    console.log('starting ', apn);
    const data = await run6(apn);
    let obj = {};
    obj.apn = apn;
    obj.parcelUse = data.Property.ParcelUse || false;
    obj.long = data.Area.Longitude || false;
    obj.lat = data.Area.Latitude || false;
    obj.LandSqFt = data.Area.LandSqFt || false;
    obj.PropType = data.Structure[0].PropType || false;
    obj.ParcelOwner = data.TaxPayer.ParcelOwner.trim() || false;
    obj.Mail2 = data.TaxPayer.Mail2.trim() || false;
    obj.Mail3 = data.TaxPayer.Mail3.trim()  || false;
    obj.Mail4 = data.TaxPayer.Mail4.trim() || false;
    obj.Mail5 = data.TaxPayer.Mail5.trim() || false;
    const Zip = data.TaxPayer.Zip.trim() || false;
    const Zip4 = data.TaxPayer.Zip4 || false;
    let zip 
    if (Zip4.length > 0) {
        zip = Zip + '-' + Zip4;
    } else {
        zip = Zip;
    }
    obj.zip = zip;
    obj._id = _id;
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: obj
        })
    }

}


