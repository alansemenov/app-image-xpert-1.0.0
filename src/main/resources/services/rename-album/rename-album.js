var contentLib = require('/lib/xp/content');

exports.post = function (req) {
    var result = contentLib.modify({
        key: req.params.id,
        editor: function (album) {
            album.displayName = req.params.name;
            return album;
        }
    });

    var responseObj = result ? {
            id: req.params.id,
            name: result.displayName
        } : {
            id: req.params.id,
            name: ""
        };

    return {
        contentType: "application/json",
        body: responseObj
    }
};
