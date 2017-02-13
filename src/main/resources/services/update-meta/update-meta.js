var contentLib = require('/lib/xp/content');

exports.post = function (req) {
    var tags = req.params.tags.split(","),
        result;

    for (var i=0; i < tags.length; i++) {
        tags[i] = tags[i].trim();
    }

    result = contentLib.modify({
        key: req.params.id,
        editor: function (media) {
            media.data.caption = req.params.caption;
            media.data.artist = req.params.artist;
            media.data.tags = tags;
            return media;
        }
    });

    var responseObj = {
            id: req.params.id,
            success: result ? true : false
        };

    return {
        contentType: "application/json",
        body: responseObj
    }
};
