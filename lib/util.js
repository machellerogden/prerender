/*jshint sub: true */
var url = require('url');
var querystring = require('querystring');
var util = exports = module.exports = {};

// Normalizes unimportant differences in URLs - e.g. ensures
// http://google.com/ and http://google.com normalize to the same string
util.normalizeUrl = function(u) {
    return url.format(url.parse(u, true));
};

// Gets the URL to prerender from a request, stripping out unnecessary parts
util.getUrl = function(req) {
    var decodedUrl, parts;

     try {
        decodedUrl = decodeURIComponent(req.url.slice(1));
    } catch (e) {
        decodedUrl = req.url.slice(1);
    }

    parts = url.parse(decodedUrl, true);
    // console.log(parts)

    // Remove the _escaped_fragment_ query parameter, ignoring the other params
    if (parts.query && parts.query.hasOwnProperty('_escaped_fragment_')) {
        if (parts.query['_escaped_fragment_']) {
            parts.hash = '#!' + parts.query['_escaped_fragment_']
        }
        parts.ugly = parts.pathname + parts.hash;
        delete parts.hash
        delete parts.query['_escaped_fragment_'];
    }

    var newUrl = parts.protocol + "//" + parts.hostname 
    if (parts.port) {
        newUrl += ":" + parts.port
    }
    newUrl += parts.ugly;
    if (parts.query) {
        newUrl += "?" + querystring.stringify(parts.query)    
    }
    console.log("--------------------calling url: ", newUrl);

    if (newUrl[0] === '/') newUrl = newUrl.substr(1);
    return newUrl;
};

util.log = function() {
    if (process.env.DISABLE_LOGGING) {
        return;
    }

    console.log.apply(console.log, [new Date().toISOString()].concat(Array.prototype.slice.call(arguments, 0)));
};
