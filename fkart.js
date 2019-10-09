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
        name: 'waiting_for_price',
        message: 'Enter expected Price to below ?'
    },
    
    {
        type: 'text',
        name: 'channel',
        message: 'please enter notify channel id(name)?'
    }

];
    const response = await prompts(questions);
    console.log("Scanning for prices,if running in forever dont forgot to stop once you reciev push notification")
    doCheckPrice(response.url,response.waiting_for_price,response.channel);
})();

const doCheckPrice = (url, leastAmount, channel = '') => {

    var test = async () => {

        const res = await fetch(url);

        const html = await res.text();
        const $_parsed_html = cheerio.load(html);

        return $_parsed_html;
    }

    test().then($_parsed_html => {

        flipkart($_parsed_html, leastAmount).then((data) => console.log(data));

        // var price = $_parsed_html('._3qQ9m1', '._1uv9Cb').text();
        // console.log(`price is ${price}`)
        // var price = 100;
        // if (price <= 200) {
        //      //sendPush(channel);
        //     console.log("push send to devices")
        // } else {
        //     console.log(price)
        // }
    })

    setTimeout(doCheckPrice, 10 * 1000, url,channel);
}



async function flipkart($_parsed_html,leastAmount){
    
//   var price = $_parsed_html('._3qQ9m1', '._1uv9Cb').text();
  const price = $_parsed_html("div").find("._3qQ9m1").text();
  const name = $_parsed_html("._9E25nV").find("._35KyD6").text();
  const shortName = name.substring(0, 10);
   var priceInt = Number(price.replace(/[^0-9.-]+/g, ""));
  console.log(`price is ${priceInt} - ${shortName} leaset amount is ${leastAmount}`);

  if (leastAmount <= priceInt) {
      //sendPush(channel);
      return ("push send to devices")
  } else {
   
     
    return ("No hope today, actively scanning for changes")
  }
}



const sendPush = async (channelId) => {

    var dataString = 'Price went below 200';

    var options = {
        url: `https://notify.run/${channelId}`,
        method: 'POST',
        body: dataString,
         headers: {
             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
         }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }

    request(options, callback);

}


// https://www.flipkart.com/i-kall-k3310/p/itmevt8krrtzu2yx

// https://www.flipkart.com/wrangler-skinny-women-blue-jeans/p/itmfcwzpnwuvdtkt
