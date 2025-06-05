const { HobbyMasterConverter } = require("../helperFunctions/htmlToDomConverterHobbyMaster");
const { Shuffleconverter } = require("../helperFunctions/htmlToDomConverterShuffle");
const { CardSearch } = require("../services/getCardsSearch");
require("dotenv").config();

exports.cardSearchController = async (req, res) => {

  const { name } = req.query;
  const hobbymasterSearch = CardSearch(process.env.HOBBYMASTERSEARCHURL + name, HobbyMasterConverter);
  const shuffleSearch = CardSearch(process.env.SHUFFLESEARCHURL + name + process.env.SHUFFLEENDURL, Shuffleconverter);

  Promise.all([hobbymasterSearch, shuffleSearch]).then((values) => {
    let valuesEmploded = new Array;
    values.forEach((element) => {
      console.log(element)
      valuesEmploded.push(...element.cards);
    });
    res.json(valuesEmploded.sort((a, b) => a.price - b.price))
  })

}

