var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var imageXpertLib = require('/lib/image-xpert');
var parentPath = './';
var view = resolve(parentPath + 'main.page.html');

function handleGet(req) {

    var site = portal.getSite();
    var reqContent = portal.getContent();
    var renameAlbumServiceUrl = portal.serviceUrl({service: "rename-album"});

    var randomImage = imageXpertLib.getRandomImage();
    var backgroundImageUrl = portal.attachmentUrl({
        id: randomImage._id
    });
    var backgroundImageStyle = "background-image: url('" + backgroundImageUrl + "');";
    var albumId;

    if (req.params.albumId && imageXpertLib.getContentByKey(req.params.albumId)) {
        albumId = req.params.albumId;
    }
    
    var params = {
        context: req,
        site: site,
        reqContent: reqContent,
        mainRegion: reqContent.page.regions["main"],
        backgroundImageStyle: backgroundImageStyle,
        renameAlbumServiceUrl: renameAlbumServiceUrl,
        searchPageUrl: portal.serviceUrl({service: "search"}),
        spinnerUrl: portal.assetUrl({path: 'img/spinner.svg'}),
        albumId: albumId
    };
    var body = thymeleaf.render(view, params);

    return {
        contentType: 'text/html',
        body: body
    };
}

exports.get = handleGet;


