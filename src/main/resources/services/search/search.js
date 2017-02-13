var mustacheLib = require('/lib/xp/mustache');
var imageXpertLib = require('/lib/image-xpert');
var portalLib = require('/lib/xp/portal');

exports.post = function (req) {

    //Retrieves the images for the current album or search query
    var getImagesParams = {
        searchQuery: req.params.search,
        albumId: req.params.albumId
    };

    var albumName;
    if (req.params.albumId) {
        albumName = imageXpertLib.getContentByKey(req.params.albumId).displayName
    }
    
    var images = imageXpertLib.getImages(getImagesParams).
        map(function (image) {
            var caption = image.data.caption ? image.data.caption.toString() : image.displayName;
            var artist = image.data.artist ? image.data.artist.toString() : undefined;
            var copyright = image.data.copyright ? image.data.copyright.toString() : undefined;

            if (artist && copyright && artist.toLowerCase() == copyright.toLowerCase()) {
                artist = null;
            }

            return {
                caption: caption,
                artist: artist,
                copyright: copyright,
                imageUrl: portalLib.imageUrl({
                    id: image._id,
                    scale: "square(200)"
                }),
                imagePageUrl: imageXpertLib.generateImagePageUrl({
                    imageId: image._id
                })
            };
        }).filter(function (image) {
            return !!image
        });

    var view = resolve('./search.html');
    var body = mustacheLib.render(view, {
        images: images,
        imageCount: images.length || 'no',
        searchQuery: req.params.search || undefined,
        albumName: albumName
    });

    return {
        status: 200,
        contentType: 'text/html',
        body: body
    };
};