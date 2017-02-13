var portalLib = require('/lib/xp/portal');
var imageXpertLib = require('/lib/image-xpert');

exports.post = function (req) {

    var imageUrl;
    if (req.params.size == "original" && req.params.format == "original") {
        imageUrl = portalLib.attachmentUrl({
            id: req.params.binary,
            download: true
        });
    } else {
        var scale;
        if (req.params.size == "original") {
            var binaryImage = imageXpertLib.getContentByKey(req.params.binary);
            var width = binaryImage.x.media.imageInfo.imageWidth;
            var height = binaryImage.x.media.imageInfo.imageHeight;
            scale = "block(" + width.toFixed(0) + "," + height.toFixed(0) + ")";
        } else {
            var width = req.params.width;
            var height = req.params.height;
            scale = "block(" + width + "," + height + ")";
        }

        var imageUrl = portalLib.imageUrl({
            id: req.params.binary,
            scale: scale,
            format: req.params.format == "custom" ? req.params.formatname : undefined
        });
    }


    return {
        contentType: 'text/plain',
        body: imageUrl
    }

};