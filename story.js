document.getElementById('input').addEventListener("input", createStory);

function createStory() {
    var base64images = collectImages();
    createInlineImages(base64images);
    assembleStory(document.getElementById('input').textContent, base64images);
};

function collectImages() {
    var images = [];

    Array.from(document.getElementsByClassName("image")).forEach(function (element) {
        var image = extractData(element);
        var pills = extractWords(element);

        images.push({ names: pills, data: image });
    })

    return images;
}

function extractData(element) {
    var Preview = element.childNodes.item(1);
    var Image = Preview.childNodes.item(1);

    return Image.src;
}

function extractWords(element) {
    var words = [];

    var pills = element.childNodes.item(3).childNodes;

    Array.from(pills).forEach(function (pill) {
        if (pill.innerText) {
            words.push(pill.innerText);
        }
    });

    words.pop();

    return words;
}

function createInlineImages(base64images) {
    var style = "<style>";

    base64images.forEach(function (image) {
        var names = "";
        image.names.forEach(function (name) {
            names += "." + name + ", ";
        })

        names = names.slice(0,-2);

        style += "\n " + names + "{background: url(" + image.data + ") no-repeat left center;background-size: 100% 100%;}";
    });

    style += "\n</style>";

    document.getElementById('result').innerHTML = style;
}

function assembleStory(text, images) {
    for (let i = 0; i < images.length; ++i) {
        const image = images[i];
        
        image.names.forEach(function (name) {
            text = text.replaceAll(new RegExp("\\b" + name + "\\b", 'g'), "<div class=\"inlineimage " + name + "\"></div>");
        })
    }

    text = text.replace(/(?:\r\n|\r|\n)/g, '</span><span>');
    text = text.replaceAll("</span><span></span><span>", '</span><span>');

    document.getElementById('result').innerHTML += "<span>" + text + "</span>";
}