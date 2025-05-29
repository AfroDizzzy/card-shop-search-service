function converter(dom) {
    if (dom.nodeType === Node.TEXT_NODE) {
        return dom.nodeValue;
    }
    if (dom.nodeType === Node.DOCUMENT_NODE) {
        dom = dom.documentElement;
    }
    const obj = {};
    obj.nodeType = dom.nodeType;
    if (dom.nodeType === Node.ELEMENT_NODE) {
        obj.tagName = dom.tagName;
        obj.attributes = []; // Array.from(obj.attributes) gives us a lot of things we don't want
        for (let i = 0, len = dom.attributes.length; i < len; ++i) {
            const attr = dom.attributes[i];
            obj.attributes.push({name: attr.name, value: attr.value});
        }
        obj.children = [];
        for (let child = dom.firstChild; child; child = child.nextSibling) {
            obj.children.push(converter(child));
        }
    } else {
        obj.nodeValue = dom.nodeValue;
    }
    return obj;
}

module.exports = converter;