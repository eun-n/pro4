var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  //All the web scraping magic will happen here


    url = 'http://www.melon.com/chart/';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
            var results = [];

            // Finally, we'll define the variables we're going to capture

            var title, artist, album;
            var json = { title : "", artist : "", album : ""};

            $('.wrap_song_info').each(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.
                var data = $(this);

           // In examining the DOM we notice that the title rests within the third child element of the rank tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                var title = data.children().first().children().children().children().text();
                var artist = data.children().next().children().first().children().first().children().text();
                var album = data.children().next().children().next().children().first().text();
      			// console.log(album);



           // Once we have our title, we'll store it to the our json object.

                json.title = title;
                json.artist = artist;
                json.album = album;
                var metadata = {
				        title: title,
				        artist: artist,
				        album: album,
				      };

				    results.push(metadata);
              
            })
        }

        fs.writeFile('output.json', JSON.stringify(results, null, 4), function(err){

		    console.log('File successfully written! - Check your project directory for the output.json file');

		});

		// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
		res.send('Check your console!');
    });

})

app.listen('3000')

console.log('Successfully launched on localhost');

exports = module.exports = app;

