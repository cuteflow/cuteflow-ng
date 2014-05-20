var url = require('url'),
    qs = require('querystring');

module.exports = function helpers() {

    return function(req, res, next) {

        res.locals.createPager = function(page, pages) {
            var parsedUrl = url.parse(req.url);
            var params = qs.parse(parsedUrl.query),
                str = '';

            str += "<ul class='pagination'>";

            page = params.page || 0;

            str += '<li><a href="'+parsedUrl.href+'?'+qs.stringify(params)+'">&laquo;</a></li>';

            for (var p=0; p <= pages; p++) {
                params.page = p;
                var clas = page == p ? "active" : "no";
                str += '<li class="'+clas+'"><a href="'+parsedUrl.href+'?'+qs.stringify(params)+'">'+ (p+1) +'</a></li>';
            }

            params.page = --p;
            str += '<li><a href="'+parsedUrl.href+'?'+qs.stringify(params)+'">&raquo;</a></li>';

            str += "</ul>";

            return str;
        }

        next();
    }
}
