const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("dotenv").config();  // Load environment variables

exports.Shuffleconverter = (html) => {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const cards = [];

    const cardElements = document.querySelectorAll('.product.Mob');
    cardElements.forEach((element) => {
        if (element.querySelector('.productPrice')?.innerHTML.includes('Out')) {
            return;
        }

        // Extract basic info
        //const dataId = element.getAttribute('data-id');\
        const dataName = element.querySelector('.productTitle');

        // Extract image info
        const imageElement = element.querySelector('.imgWrapper img');
        const imageUrl = imageElement?.getAttribute('src') || '';
        const imageAlt = imageElement?.getAttribute('alt') || '';

        // Extract Shuffle internal link
        const cardLinkElement = element.querySelector('.image a');
        const cardLink = cardLinkElement?.getAttribute('href') || '';
        const fullCardLink = cardLink ? `${process.env.SHUFFLEBASEURL}${cardLink}` : '';

        // Extract price
        const priceElement = element.querySelector('.productPrice');
        const priceText = priceElement?.textContent?.trim() || '';
        const price = parseFloat((priceText?.replace('$', '') || ''));


        const addToCartButton = element.querySelector('.addNow');
        let dataId = null;
        let stockInfo = 'Unknown';

        if (addToCartButton) {
            const onclickAttr = addToCartButton.getAttribute('onclick');
            if (onclickAttr) {
                // Parse addToCart('cardId','cardName','stockAmount',quantity)
                const match = onclickAttr.match(/addToCart\('(\d+)','([^']+)','(\d+)',\d+\)/);
                if (match) {
                    dataId = match[1]; // First parameter: card ID
                    const cardName = match[2]; // Second parameter: card name with condition
                    const stockAmount = parseInt(match[3]); // Third parameter: stock amount

                    // Extract condition from card name
                    const condition = cardName.includes('Near Mint') ? 'Near Mint' :
                        cardName.includes('Lightly Played') ? 'Lightly Played' :
                            cardName.includes('Moderately Played') ? 'Moderately Played' :
                                cardName.includes('Heavily Played') ? 'Heavily Played' :
                                    cardName.includes('Damaged') ? 'Damaged' : 'Unknown Condition';

                    stockInfo = `${stockAmount} in stock - ${condition}`;
                }
            }
        }

        if (!dataId && fullCardLink) {
            const urlMatch = fullCardLink.match(/products\/([^?]+)/);
            dataId = urlMatch ? urlMatch[1] : null;
        }

        cards.push(
            {
                //name: dataName,
                id: dataId,
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
                //html: element.innerHTML // Include original HTML if needed
            }
        );
    });

    //adds 100ms to response time
    return cards.sort((a, b) => a.price - b.price);
}

