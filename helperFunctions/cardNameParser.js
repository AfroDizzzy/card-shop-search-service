exports.parseCardName = (fullCardName) => {
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
        .replace(/\s*-.*$/, '') // Remove - in sentences 
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