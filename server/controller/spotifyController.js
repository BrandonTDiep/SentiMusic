const SpotifyWebApi = require("spotify-web-api-node")

const generateRandomString = require('../utils/generateRandomString');


module.exports = {
    getLogin: async (req, res) => {

        const state = generateRandomString(16);
        const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state']

        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URL
        });

        // Create the authorization URL
        const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
        console.log(authorizeURL)
      
        res.redirect(authorizeURL)
    },

    getCallback: async (req, res) => {
        // Extract the error, code, and state from the query parameters.
        const error = req.query.error;
        const code = req.query.code;

        if (error) {
            console.error('Authorization error:', error);
            return res.status(400).send('Authorization failed: ' + error);
        }

        // Create a new SpotifyWebApi instance for this request
        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URL
        });


        spotifyApi.authorizationCodeGrant(code).then(data => {
            const accessToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];
            const expiresIn = data.body['expires_in'];

            console.log('The token expires in ' + data.body['expires_in'] + '\n');
            console.log('The access token is ' + data.body['access_token'] + '\n');
            console.log('The refresh token is ' + data.body['refresh_token'] + '\n');
    
            // Set the access token and refresh token on the Spotify API object.
            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);

            // Refresh the access token periodically before it expires.
            setInterval(async () => {
                try {
                    const data = await spotifyApi.refreshAccessToken();
                    const accessTokenRefreshed = data.body['access_token'];
                    spotifyApi.setAccessToken(accessTokenRefreshed);
                } catch (error) {
                    console.error('Could not refresh the access token:', error);
                }
            }, expiresIn / 2 * 1000); // Refresh halfway before expiration.

            // Send tokens and expiration time to the frontend
            res.redirect(`${process.env.CLIENT_REDIRECT}/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&expiresIn=${expiresIn}`);


        }).catch(error =>{
            console.error('Error getting Tokens:', error);
            res.send('Error getting tokens');
        })
    },

    refreshToken: async (req, res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send('Refresh token missing');
        }

        try {
            // Create a new SpotifyWebApi instance for this request
            const spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                redirectUri: process.env.SPOTIFY_REDIRECT_URL
            });

            // Set the refresh token on the Spotify API instance
            spotifyApi.setRefreshToken(refreshToken);

            const data = await spotifyApi.refreshAccessToken(refreshToken);
            const accessToken = data.body['access_token'];
            const expiresIn = data.body['expires_in'];

            res.json({ accessToken, expiresIn });
        } catch (err) {
            console.error('Error refreshing access token:', err);
            res.status(500).send('Error refreshing access token');
        }
    }, 
}
