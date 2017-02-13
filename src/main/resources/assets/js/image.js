function toggleClass(cls, e) {
    var mainRegion = document.querySelector("#main-region");
    mainRegion.classList.remove("download", "info", "edit");
    if (cls) {
        if (typeof cls == "string") {
            cls = [cls];
        }
        cls.forEach(function(cl){
            mainRegion.classList.add(cl);
        });
    }
    if (e) {
        e.stopPropagation();
    }
}

function updateMetaInfo(mediaId) {
    var captionInputEl = document.querySelector('#input-caption'),
        artistInputEl = document.querySelector('#input-artist'),
        tagsInputEl = document.querySelector('#input-tags'),
        caption = captionInputEl.value.trim(),
        artist = artistInputEl.value.trim(),
        tags = tagsInputEl.value.trim(),
        captionEl = document.querySelector('.caption-stored'),
        artistEl = document.querySelector('.artist-stored'),
        tagsEl = document.querySelector('.tags-stored');

    if (!updateMetaServiceUrl || updateMetaServiceUrl == "" || mediaId.trim() == "" ||
        (captionEl.innerHTML == caption && artistEl.innerHTML == artist && tagsEl.innerHTML == tags)) {
        toggleClass("info");

        return;
    }

    var http = new XMLHttpRequest();
    http.open("POST", updateMetaServiceUrl, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {
        if (http.readyState == 4) {
            if (http.status == 200 && http.responseText !== "") {
                var responseObj = JSON.parse(http.responseText);
                if (responseObj.success) {
                    captionEl.innerHTML = caption;
                    artistEl.innerHTML = artist;
                    tagsEl.innerHTML = tags;
                }
                else {
                    captionInputEl.value = captionEl.innerHTML;
                    artistInputEl.value = artistEl.innerHTML;
                    tagsInputEl.value = tagsEl.innerHTML;
                }
            }
            toggleSpinner(false);
            toggleClass("info");
        }
    };
    toggleSpinner(true);
    http.send("id=" + mediaId + "&caption=" + caption + "&artist=" + artist + "&tags=" + tags);
}

function toggleSpinner(visible) {
    document.getElementById('ixp-spinner').classList.toggle("visible", visible);
}

function openEditMode(e) {
    toggleClass(['info', 'edit'], e);
    document.querySelector('#input-caption').focus();
}

function closeEditMode(mediaId, e) {
    var mainRegion = document.querySelector("#main-region");
    if (!mainRegion.classList.contains("edit") || e.srcElement.tagName == "INPUT") {
        return;
    }
    updateMetaInfo(mediaId);
}

function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function syncImage() {
    if (imgPlaceholder) {
        var img = document.querySelector(".fake-image");
        imgPlaceholder.style["background-image"] = "url('" + img.getAttribute("src") + "')";
    }
}

function syncImageSize() {
    if (imgPlaceholder) {
        imgPlaceholder.style["width"] = window.innerWidth + "px";
        imgPlaceholder.style["height"] = window.innerHeight + "px";
    }
}

function loadImage() {
    syncImageSize();
    scaleImage();
}


function requestImage(serviceUrl) {
    var form = document.querySelector(".download-form");
    var request = new XMLHttpRequest();

    toggleClass();

    request.onload = function () {
        if (request.responseText !== "") {
            downloadImage(request.responseText, form);
        }
    };

    request.open("POST", serviceUrl, true);
    request.send(new FormData(form));

    return false;
}

function downloadImage(imageUrl, form) {
    var a = document.createElement('a');
    a.setAttribute("download", "");
    a.setAttribute("href", imageUrl);
    form.appendChild(a);
    a.click();
    form.removeChild(a);
}

function onMetaInputKeyUp(mediaId, e) {
    if (!!e.keyCode && !(e.keyCode == 13 || e.keyCode == 27)) {
        return;
    }
    
    if (e.keyCode == 27) {
        toggleSpinner(false);
        toggleClass("info");
        
        return;
    }
    
    updateMetaInfo(mediaId);
}