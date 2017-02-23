var request, request2;
request = request2 = require("tinyreq");
var cheerio, cheerio2;
cheerio = cheerio2 = require("cheerio");
var fs = require('fs');
var http = require('http');

var rootUrl = 'http://t3chfest.uc3m.es';
var year = "/2017";
var agendaUrl = rootUrl + year + '/programa';
var slidesFolder = "SlidesT3chFest2017/";
if (!fs.existsSync(slidesFolder)){
    fs.mkdirSync(slidesFolder);
}
request(agendaUrl, function (err, body) {
    if(!err){
        var $ = cheerio.load(body);
        $('a').each(function(i, presentation) {
            if(($(this).hasClass('track1') || $(this).hasClass('track2') || $(this).hasClass('track3') || $(this).hasClass('track4')) 
               && ($(this).attr('href')!=undefined)){
                var presentationUrl = rootUrl + year + $(this).attr('href');
                request2(presentationUrl, function (err, body) {
                    if(!err){
                        var $2 = cheerio2.load(body);
                        $2('a').each(function(i, slides) {
                            if($2(this).hasClass('button') && ($2(this).attr('href')!=undefined)){
                                var slidesUrl = rootUrl + $2(this).attr('href');
                                console.log(slidesUrl);
                                var pdfName = slidesUrl.substring(slidesUrl.lastIndexOf("/")+1);
                                var pdfFile = fs.createWriteStream(slidesFolder + pdfName);
                                http.get(slidesUrl, function(response) {
                                  response.pipe(pdfFile);
                                  console.log(pdfName);
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});