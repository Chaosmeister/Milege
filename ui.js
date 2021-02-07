const nonDropArea = document.getElementById("main");
nonDropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Style the drag-and-drop as a "copy file" operation.
    event.dataTransfer.dropEffect = 'none';
});

const dropArea = document.getElementById("addimage");

dropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Style the drag-and-drop as a "copy file" operation.
    event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();

    readFiles(event.dataTransfer.files);
});

function clickElem(elem) {
    // Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
    var eventMouse = document.createEvent("MouseEvents")
    eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    elem.dispatchEvent(eventMouse)
}

function changefiles(e)
{
    readFiles(e.target.files)
}

function readFiles(files) {
    Array.from(files).forEach(file => {
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            addImage({ name: file.name.replace(/\.[^/.]+$/, ""), data: contents });
        }
        reader.readAsDataURL(file)
    });
}

function openFile(func) {
    fileInput = document.createElement("input")
    fileInput.type = 'file'
    fileInput.style.display = 'none'
    fileInput.setAttribute("multiple", "");
    fileInput.setAttribute("accept", "image/png, image/jpeg")
    fileInput.onchange = changefiles
    document.body.appendChild(fileInput)

    clickElem(fileInput)

    document.body.removeChild(fileInput)
}

function showInNewTab() {
    var log = document.getElementById("result");
    var wnd = window.open("about:blank", "_blank");
    wnd.document.write(
        '<!doctype html>' +
        '<html><head>' +
        '<html style="font-family:verdana">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" /> ' +
        '<meta charset="UTF-8">' +
        '<title>Milege</title>' +
        '</head><body>' +
        '<style> @media print {' +
        '.noprint * {' +
        'display: none;' +
        '}' +
        '</style>' +
        '<div>' + log.innerHTML + '</div>' +
        '</body></html>'
    );
    wnd.document.close();
}

function addImage(image) {
    var prototype = document.getElementById("imageprototype");
    var newImage = prototype.cloneNode(true);
    newImage.setAttribute("id", "image");
    newImage.setAttribute("class", "image");
    prototype.parentElement.insertBefore(newImage, prototype);

    var pillsnode = newImage.childNodes.item(3);
    var button = pillsnode.childNodes.item(1);
    addPill(button, image.name);

    var previewtarget = newImage.childNodes.item(1).childNodes.item(1);
    previewtarget.src = image.data;
    previewtarget.setAttribute("class", "previewimage");
}

function removeImage(image) {
    image.parentElement.parentElement.removeChild(image.parentElement);
}

function addPill(newpillbutton, text) {
    var newpill = document.createElement("div");
    newpill.setAttribute("id", "pill");
    newpill.setAttribute("class", "pill");
    newpill.setAttribute("contenteditable", "plaintext-only");

    if (text) {
        newpill.innerText = text;
    } else {
        newpill.innerText = 'new';
    }

    newpill.innerHTML += '<img class="close" width="20" height="20" src="SVG/PlusWhite.svg" onclick=removePill(this);>'

    newpillbutton.parentElement.insertBefore(newpill, newpillbutton);
}

function removePill(pill) {
    pill.parentElement.parentElement.removeChild(pill.parentElement);
}