var contentLib = require('/lib/xp/content');
var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');
var mustacheLib = require('/lib/xp/mustache');

function handleGet(req) {
    var image = req.params.imageId ? imageXpertLib.getContentByKey(req.params.imageId) : imageXpertLib.getRandomImage();

    if (req.params.imageId && image.type != "media:image") {
        image = imageXpertLib.getRandomImage();
    }

    var binary = contentLib.get({
        key: image._id
    });

    var artist = "N/A",
        tags = "N/A",
        caption = image.displayName;

    if (binary.data.artist) {
        artist = binary.data.artist.toString();
    }
    if (binary.data.tags) {
        if (typeof binary.data.tags !== "string") {
            tags = binary.data.tags.join(', ');
        }
        else {
            tags = binary.data.tags;
        }
    }
    if (binary.data.caption) {
        caption = binary.data.caption;
    }

    var geoLocation = binary.x.base && binary.x.base.gpsInfo && binary.x.base.gpsInfo.geoPoint;

    var imageWidth = binary.x.media.imageInfo.imageWidth.toFixed(0);
    var imageHeight = binary.x.media.imageInfo.imageHeight.toFixed(0);

    var imageUrl = portalLib.attachmentUrl({
        id: image._id
    });

    var downloadImageServiceUrl = portalLib.serviceUrl({service: "download-image"});

    var view = resolve('image.page.html');
    var body = mustacheLib.render(view, {
        assetUrl: portalLib.assetUrl(''),
        downloadImageServiceUrl: downloadImageServiceUrl,
        updateMetaServiceUrl: portalLib.serviceUrl({service: "update-meta"}),
        imageUrl: imageUrl,
        binaryImageId: image._id,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        contentType: binary.x.media.imageInfo.contentType,
        caption: caption,
        createdDate: new Date(image.createdTime).toDateString(),
        artist: artist,
        lat: geoLocation ? geoLocation.split(",")[0] : "",
        lng: geoLocation ? geoLocation.split(",")[1] : "",
        geoLocation: geoLocation,
        takenDate: binary.x.media.cameraInfo && binary.x.media.cameraInfo.date
            ? new Date(binary.x.media.cameraInfo.date).toDateString()
            : "N/A",
        cameraMake: binary.x.media.cameraInfo && binary.x.media.cameraInfo.make ? binary.x.media.cameraInfo.make : "N/A",
        cameraModel: binary.x.media.cameraInfo && binary.x.media.cameraInfo.model ? binary.x.media.cameraInfo.model : "N/A",
        tags: tags,

    });
    
    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


