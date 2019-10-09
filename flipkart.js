const cheerio = require('cheerio')
const fetch = require('node-fetch');
const prompts = require('prompts');
const request = require('request');
(async () => {
    const questions=[{
        type: 'text',
        name: 'url',
        message: 'Enter Flipkart url?'
    },
    {
        type: 'text',
        name: 'channel',
        message: 'please enter notify channel id(name)?'
    }

];
    const response = await prompts(questions);
    console.log("Scanning for prices,if running in forever dont forgot to stop once you recieve push notification")
    doCheckPrice(response.url,response.channel);
})();

const doCheckPrice=(url,channel='') =>{

    var test = async () => {

        const res = await fetch(url);

        const html = await res.text();
        const $ = cheerio.load(html);

        return $;
    }

    test().then($ => {

        var price = $('._3qQ9m1', '._1uv9Cb').text();
        console.log(`price is ${price}`)
        var price = 100;
        if (price <= 200) {
             sendPush(channel);
            console.log("push send to devices")
        } else {
            console.log(price)
        }
    })

    setTimeout(doCheckPrice, 10 * 1000, url,channel);
}




const sendPush = async (channelId) => {

    var dataString = 'Price went below 200';

    var options = {
        url: `https://notify.run/${channelId}`,
        method: 'POST',
        body: dataString
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }

    request(options, callback);

}