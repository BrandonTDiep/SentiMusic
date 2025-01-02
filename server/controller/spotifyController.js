const SpotifyWebApi = require('spotify-web-api-node');


// Initialize the Spotify API with credentials from environment variables.
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
});


module.exports = {
    getLogin: async (req, res) => {

        let state = generateRandomString(16);
        const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state']

      
        // Create the authorization URL
        res.redirect(spotifyApi.createAuthorizeURL(scopes, state))
        

    },

    getCallback: async (req, res) => {
        

        // Extract the error, code, and state from the query parameters.
        const error = req.query.error;
        const code = req.query.code;

        if (error) {
            console.error('Authorization error:', error);
            return res.status(400).send('Authorization failed: ' + error);
        }

        spotifyApi.authorizationCodeGrant(code).then(data => {
            const accessToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];
            const expiresIn = data.body['expires_in'];

            console.log('The token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            console.log('The refresh token is ' + data.body['refresh_token']);
    
            // Set the access token and refresh token on the Spotify API object.
            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);

            // Send a success message to the user.
            res.send('Login successful!');

            // Refresh the access token periodically before it expires.
            setInterval(async () => {
                try{
                    const data = await spotifyApi.refreshAccessToken();
                    const accessTokenRefreshed = data.body['access_token'];
                    spotifyApi.setAccessToken(accessTokenRefreshed);
                } catch (error) {
                    console.error('Could not refresh the access token:', error)

                }
                
            }, expiresIn / 2 * 1000); // Refresh halfway before expiration.

        }).catch(error =>{
            console.error('Error getting Tokens:', error);
            res.send('Error getting tokens');
        })
    }
    
}
