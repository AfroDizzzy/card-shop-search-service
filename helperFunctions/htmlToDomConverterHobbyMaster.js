const jsdom = require("jsdom");
const { parseCardName } = require("./cardNameParser");
const { JSDOM } = jsdom;
require("dotenv").config();  // Load environment variables

exports.HobbyMasterConverter = (html) => {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const cards = [];

    const cardElements = document.querySelectorAll('.item.card-cart');
    cardElements.forEach((element) => {

        if (element.querySelector('.stock')?.innerHTML.includes('Out')) {
            return;
        }
        // Extract id and name
        const dataId = element.getAttribute('data-id');
        const dataName = element.getAttribute('data-name') || '';
        // const baseName = dataName?.replace(/\([^)]+\)/g, '') // Remove round brackets and contents
        //     .trim()
        //     .replace(/\s+/g, ' '); // Normalize whitespace

        const parsedCardName = parseCardName(dataName);
        const setName = parsedCardName?.setName || '';
        const cardName = parsedCardName.baseName;
        const treatment = parsedCardName.treatment;

        // Extract Condition
        const condition =
            dataName.includes('LP') ? 'Lightly Played' :
                dataName.includes('MP') ? 'Moderately Played' : 'Near Mint';

        // Extract image info
        const imageElement = element.querySelector('.image img');
        const imageUrl = imageElement?.getAttribute('src') || '';
        const imageAlt = imageElement?.getAttribute('alt') || '';

        // Extract hobbymaster internal link
        const cardLinkElement = element.querySelector('.overview');
        const cardLink = cardLinkElement?.querySelector('a') || '';
        const fullCardLink = cardLink ? `${process.env.HOBBYMASTERBASEURL}${cardLink}` : '';

        // Extract price
        const priceElement = element.querySelector('.price .price-new');
        const priceText = priceElement ? priceElement.textContent?.trim() : '';
        const price = parseFloat((priceText?.replace('$', '') || ''));

        // Extract stock info
        const stockElement = element.querySelector('.stock');
        const stockTextElement = stockElement?.querySelector('.col-xs-7');
        const stockText = stockTextElement?.textContent?.trim();
        const stockInfo = {
            inStock: true,
            // @ts-ignore
            quantity: parseInt(stockText[0]) || 0,
        };

        cards.push(
            {
                shop: 'Hobby Master',
                id: dataId,
                //name: dataName,
                title: cardName,
                set: setName ? setName : '',
                treatment: treatment,
                condition: condition,
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

    //adds 100ms to response time
    return cards
}

