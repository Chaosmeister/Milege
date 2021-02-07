document.getElementById('input').addEventListener("input", createStory);

function createStory() {
    var base64images = [];// convert(document.getElementById('pictures').files);
    createInlineImages(base64images);
    assembleStory(document.getElementById('input').textContent, base64images);
};

function convert(files) {
    var base64images = [];
    for (let i = 0; i < files.length; ++i) {
        const file = files[i];

        if (!file.type.startsWith('image/')) { continue }

        base64images.push({ name: file.name.replace(/\.[^/.]+$/, ""), data: toBase64(file) });
    }
    return base64images;
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

async function createInlineImages(base64images) {
    var style = "<style>";

    for (let i = 0; i < base64images.length; ++i) {
        const image = base64images[i];
        style += "\n ." + image.name + "{background: url(" + await image.data + ") no-repeat left center;background-size: 100% 100%;}";
    }

    style += "\n</style>";

    document.getElementById('preview').innerHTML = style + document.getElementById('preview').innerHTML;
}

async function assembleStory(text, images) {
    for (let i = 0; i < images.length; ++i) {
        const image = images[i];
        text = text.replaceAll(new RegExp("\\b" + image.name + "\\b", 'g'), "<div class=\"image " + image.name + "\"></div>");
    }

    text = text.replace(/(?:\r\n|\r|\n)/g, '</span><span>');
    text = text.replaceAll("</span><span></span><span>", '</span><span>');

    document.getElementById('result').innerHTML = "<span>" + text + "</span>";
}