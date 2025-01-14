import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import { getAccessToken } from "../services/spotifyService"

const Player = ({ trackUri }) => {
    const [accessToken, setAccessToken] = useState(null)
    const [play, setPlay] = useState(false)

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getAccessToken()
            setAccessToken(token)
        }
        fetchToken()
    }, [])

    useEffect(() => {        
        if (trackUri) setPlay(true)
    }, [trackUri])

    if (!accessToken) return <div>Loading...</div> // Show a loading state until the token is ready

    return (
        <SpotifyPlayer
            token={accessToken}
            showSaveIcon
            callback={state => {
                if (!state.isPlaying) setPlay(false)
            }}
            play={play}
            uris={trackUri ? [trackUri] : []}
            styles={{
                activeColor: '#fff',
                bgColor: '#15191E',
                color: '#fff',
                loaderColor: '#fff',
                sliderColor: '#1cb954',
                sliderHandleColor: '#fff',
                trackArtistColor: '#ccc',
                trackNameColor: '#fff',
            }}
        />
    )
}

export default Player
