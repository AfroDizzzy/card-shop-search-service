const converter = require("../helperFunctions/htmlToDomConverter");

exports.cardSearch = async (req, res) => {
  try {
    const response = await fetch("https://hobbymaster.co.nz/search?search=craterhoof+", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "priority": "u=0, i",
        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "PHPSESSID=282itv3onvqja6dac4p468hjme; __utmc=261568276; __utma=261568276.635056935.1744284128.1747826260.1747832612.30; __utmz=261568276.1747832612.30.18.utmcsr=mtgsingles.co.nz|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt=1; __utmb=261568276.10.10.1747832612",
        "Referer": "https://hobbymaster.co.nz/search?search=craterhoof",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    res.json({cards: converter(await response.text())})
  }
  catch (e) {
    console.error('Error searching:', e);
    res.status(500).json({
      error: 'Failed to get sample cards',
      details: e.message
    });
  }
}

