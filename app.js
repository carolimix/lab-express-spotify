

require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  

  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

;
app.get('/', (req, res, next) => {
    res.render('index');
  });


app.get('/artist-search', (req, res, next) => {
    let search = req.query.artist
    spotifyApi
    .searchArtists(search)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", {artist: data.body.artists.items })

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
   })

 
app.get("/albums/:artistId", (req, res, next) => {
    let results = req.params.artistId
    spotifyApi
    .getArtistAlbums(results)
    .then(data => {
        console.log('Artist albums', data.body.items);
        res.render("albums", {results: data.body.items})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
}) 

/* app.get("tracks") */


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
