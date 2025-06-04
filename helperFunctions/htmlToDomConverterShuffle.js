const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("dotenv").config();  // Load environment variables

exports.Shuffleconverter = (html) => {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const cards = [];

    const cardElements = document.querySelectorAll('.product.Mob');
    cardElements.forEach((element) => {

        const cardsPerItem = element.querySelectorAll('.addNow.single');
        //element.querySelector('.productPrice')?.innerHTML.includes('Out')
        if (!cardsPerItem.length) {
            return;
        }

        // // Extract basic info
        // //const dataId = element.getAttribute('data-id');\
        // const titleElement = element.querySelector('.productTitle');
        // const cardName = titleElement?.textContent?.trim().replace(/\s+/g, ' ') || '';
        // const cardSet = titleElement?.getAttribute('br') || '';

        // Extract image info
        const imageElement = element.querySelector('.imgWrapper img');
        const imageUrl = imageElement?.getAttribute('src') || '';

        // Extract Shuffle internal link
        const productLink = element.querySelector('.productLink');
        const cardLink = productLink ? productLink.getAttribute('href') : null;
        const fullCardLink = cardLink ? `${process.env.SHUFFLEBASEURL}${cardLink}` : '';

        // Extract price
        const priceElement = element.querySelector('.productPrice');
        const priceText = priceElement?.textContent?.trim() || '';
        const price = parseFloat((priceText?.replace('$', '') || ''));

        // Extract Card ID, Condition, Amount
        let dataId = null;
        let setName = '';
        let stockAmount = 0;
        let condition = '';
        let cardName = '';
        let treatment = '';
        const stockInfo = {
            inStock: true,
            // @ts-ignore
            quantity: 0
        };

        cardsPerItem.forEach((element) => {

        })
        const onclickAttr = element.getAttribute('onclick');
        if (onclickAttr) {
            // Parse addToCart(~squence~, 'cardId','cardName','stockAmount',quantity)
            const match = onclickAttr.match(/addToCart\('(\d+)','([^']+)','(\d+)',\d+\)/);
            if (match) {
                dataId = match[1];
                cardName = match[2];
                // Parse the card name to extract components
                const parsedCardName = parseCardName(cardName);
                setName = parsedCardName.setName;
                cardName = parsedCardName.baseName;
                treatment = parsedCardName.treatment;
                stockInfo.quantity = parseInt(match[3]);

                // Extract condition
                condition = cardName.includes('Near Mint') ? 'Near Mint' :
                    cardName.includes('Lightly Played') ? 'Lightly Played' :
                        cardName.includes('Moderately Played') ? 'Moderately Played' :
                            cardName.includes('Heavily Played') ? 'Heavily Played' :
                                cardName.includes('Damaged') ? 'Damaged' : 'Unknown Condition';
            }
        }

        // If no ID found in onclick, try to extract from URL or generate one
        if (!dataId && fullCardLink) {
            const urlMatch = fullCardLink.match(/products\/([^?]+)/);
            dataId = urlMatch ? urlMatch[1] : null;
        }



        cards.push(
            {
                //name: dataName,
                id: dataId,
                title: cardName,
                set: setName,
                treatment: treatment,
                price: price,
                priceFormatted: priceText,
                image: {
                    url: imageUrl,
                },
                links: {
                    card: fullCardLink,
                },
                stock: stockInfo
                //html: element.innerHTML // Include original HTML if needed
            }
        );
    });

    //adds 100ms to response time
    return cards.sort((a, b) => a.price - b.price);


}


function parseCardName(fullCardName) {
    // Remove condition suffix (e.g., " - Near Mint")
    const cardNameWithoutCondition = fullCardName.replace(/ - (Near Mint|Lightly Played|Moderately Played|Heavily Played|Damaged)$/, '');

    // Extract treatment (round brackets)
    const treatmentMatch = cardNameWithoutCondition.match(/\(([^)]+)\)/);
    const treatment = treatmentMatch ? treatmentMatch[1] : null;

    // Extract set name (square brackets)
    const setNameMatch = cardNameWithoutCondition.match(/\[([^\]]+)\]/);
    const setName = setNameMatch ? setNameMatch[1] : null;

    // Extract base card name (remove brackets and their contents)
    let baseName = cardNameWithoutCondition
        .replace(/\([^)]+\)/g, '') // Remove round brackets and contents
        .replace(/\[[^\]]+\]/g, '') // Remove square brackets and contents
        .trim()
        .replace(/\s+/g, ' '); // Normalize whitespace

    return {
        baseName: baseName,
        treatment: treatment,
        setName: setName,
        fullName: cardNameWithoutCondition
    };
}
