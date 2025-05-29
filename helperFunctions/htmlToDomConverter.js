const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("dotenv").config();  // Load environment variables

function converter(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const cards = [];

    const cardElements = document.querySelectorAll('.item.card-cart');
    cardElements.forEach((element) => {

        if (element.querySelector('.stock')?.innerHTML.includes('Out')) {
            return;
        }
        // Extract basic info
        const dataId = element.getAttribute('data-id');
        const dataName = element.getAttribute('data-name');

        // Extract image info
        const imageElement = element.querySelector('.image img');
        const imageUrl = imageElement?.getAttribute('src') || '';
        const imageAlt = imageElement?.getAttribute('alt') || '';

        // Extract hobbymaster internal link
        const cardLinkElement = element.querySelector('.image a');
        const cardLink = cardLinkElement?.getAttribute('href') || '';
        const fullCardLink = cardLink ? `${process.env.HOBBYMASTERBASEURL}${cardLink}` : '';

        // Extract price
        const priceElement = element.querySelector('.price .price-new');
        const priceText = priceElement ? priceElement.textContent?.trim() : '';
        const price = parseInt((priceText?.replace('$', '') || ''), 10);

        // Extract stock info
        const stockElement = element.querySelector('.stock');
        const stockTextElement = stockElement?.querySelector('.col-xs-7');
        const stockText = stockTextElement?.textContent?.trim();
        const stockInfo = {
            inStock: true,
            // @ts-ignore
            quantity: parseInt(stockText.match(/(\d+)\s+in\s+stock/i)[1]) || 0,
            stockText: stockText || '',
        };

        cards.push(
            {
            id: dataId,
            //name: dataName,
            title: dataName,
            price: price,
            priceFormatted: priceText,
            image: {
                url: imageUrl,
                alt: imageAlt
            },
            links: {
                card: fullCardLink,
            },
            stock: stockInfo,
            //html: element.innerHTML // Include original HTML if needed
        }
    );
    });

    return cards.sort((a, b) => a.price - b.price);
}


module.exports = converter;