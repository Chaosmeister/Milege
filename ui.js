document.getElementById('input').addEventListener("input", createStory);

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

//override paste
var input = document.getElementById("input");

input.addEventListener("paste", e => {
  //cancel paste
  e.preventDefault();
  //get plaintext from clipboard
  let text = (e.originalEvent || e).clipboardData.getData('text/plain');
  //insert text manually
  insertTextAtSelection(input, text);
});

function insertTextAtSelection(div, txt)
{
  //get selection area so we can position insert
  let sel = window.getSelection();
  let text = div.textContent;
  let before = Math.min(sel.focusOffset, sel.anchorOffset);
  let after = Math.max(sel.focusOffset, sel.anchorOffset);
  //ensure string ends with \n so it displays properly
  let afterStr = text.substring(after);
  if (afterStr == "") afterStr = "\n";
  //insert content
  div.textContent = text.substring(0, before) + txt + afterStr;
  //restore cursor at correct position
  sel.removeAllRanges();
  let range = document.createRange();
  //childNodes[0] should be all the text
  range.setStart(div.childNodes[0], before + txt.length);
  range.setEnd(div.childNodes[0], before + txt.length);
  sel.addRange(range);
  
    createStory();
}

function clickElem(elem) {
    // Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
    var eventMouse = document.createEvent("MouseEvents")
    eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    elem.dispatchEvent(eventMouse)
}

function changefiles(e) {
    readFiles(e.target.files)
}

function readFiles(files) {
    Array.from(files).forEach(file => {
        if (!file) {
            return;
        }
        var imageType = /image.*/;
        if (file.type.match(imageType)) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var contents = e.target.result;
                addImage({ name: file.name.replace(/\.[^/.]+$/, ""), data: contents });
            }
            reader.readAsDataURL(file);
        }
    });
}

function openFile(func) {
    fileInput = document.createElement("input");
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.setAttribute("multiple", "");
    fileInput.setAttribute("accept", "image/png, image/jpeg");
    fileInput.onchange = changefiles;
    document.body.appendChild(fileInput);

    clickElem(fileInput);

    document.body.removeChild(fileInput);
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

    createStory();
}

function removeImage(image) {
    image.parentElement.parentElement.removeChild(image.parentElement);
    createStory();
}

function addPill(newpillbutton, text) {
    var newpill = document.createElement("div");
    newpill.setAttribute("id", "pill");
    newpill.setAttribute("class", "pill");

    var newContent = document.createElement("div");
    newContent.setAttribute("contenteditable", "true");
    newContent.setAttribute("onInput", "");

    if (text) {
        newContent.innerText = text;
    } else {
        newContent.innerText = 'new';
    }

    newpill.appendChild(newContent);

    newpill.innerHTML += '<img class="close" width="20" height="20" src="SVG/PlusWhite.svg" onclick=removePill(this);>'

    newpillbutton.parentElement.insertBefore(newpill, newpillbutton);

    newpill.addEventListener('input', (e) => {
        createStory();
    });
    
    newpill.addEventListener('keydown', (e) => {
        console.log(e)
        if (e.key === "Enter") {
            e.preventDefault();
            e.path[0].blur();

            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        }
    });
    
    newpill.addEventListener("paste", e => {
  //cancel paste
  e.preventDefault();
  //get plaintext from clipboard
  let text = (e.originalEvent || e).clipboardData.getData('text/plain');
  //insert text manually
  insertTextAtSelection(newpill, text);
});
}

function removePill(pill) {
    pill.parentElement.parentElement.removeChild(pill.parentElement);
    createStory();
}
