import { useState, useEffect } from 'react';
import SongList from '../components/SongList'
import { getGenres } from '../services/openaiService'
import { createSpotifyPlaylist, getSpotifySongs, refreshAccessToken } from '../services/spotifyService'
import { isUserAuthenticated, getRemainingTokenTime } from '../utils/authUtils';
import Player from '../components/Player';
import logo from '../assets/logo.png'
import { ToastContainer, toast, Bounce } from 'react-toastify';

const Home = () => {
    const [mood, setMood] = useState("")
    const [playlist, setPlaylist] = useState([])
    const [playlistName, setPlaylistName] = useState("")
    const [playlistDescription, setPlaylistDescription] = useState("")
    const [songs, setSongs] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [playingTrack, setPlayingTrack] = useState()

    const handleSubmit = async (e) => {
      // stay on same page without reloading
      e.preventDefault();
      setIsLoading(true)
      try {
        const response = await getGenres(mood);
        setMood('')
        const genreList = response.split(", ").map((genre) => genre.trim())
        console.log(genreList)
        const allSongs = []
        for(const genre of genreList){
          const genreSongs = await getSpotifySongs(genre)
          allSongs.push(...genreSongs)
        }
        setSongs(allSongs)

        
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        setSongs([])
      }
      finally{
        setIsLoading(false)
      }
    };

    const handlePlayingTrack = (trackUri) => {
      setPlayingTrack(trackUri)
    }

    const handleTogglePlaylistTrack = (track) => {
      setPlaylist((prevPlaylist) => 
        prevPlaylist.some((song) => song.id === track.id) ?
        prevPlaylist.filter((song) => song.id !== track.id) :
        [...prevPlaylist, track]
      )
    }

    const handlePlaylistSubmit = async (e) => {
        e.preventDefault()
        document.getElementById("playlist_modal").close()
        await createSpotifyPlaylist(playlistName, playlistDescription, playlist)
    }

    const notify = () => {
      if (playlistName) {
        toast.success('Saved to Playlist!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    };


    const TOKEN_CHECK_INTERVAL = 60 * 1000; // 1 minute

    useEffect(() => {
      setIsAuthenticated(isUserAuthenticated());

      // Set up an interval to refresh the token
      const tokenRefreshInterval = setInterval(async () => {
          const remainingTime = getRemainingTokenTime();

          // If less than 5 minutes remain, refresh the token
          if (remainingTime < 5 * 60 * 1000) {
              console.log("Token is about to expire, refreshing...");
              const newToken = await refreshAccessToken();
              if (!newToken) {
                  console.warn("Failed to refresh token, user might need to re-login.");
                  clearInterval(tokenRefreshInterval);
              }
          }
      }, TOKEN_CHECK_INTERVAL);

      // Clear interval on component unmount
      return () => clearInterval(tokenRefreshInterval);
    }, []);

    return (
      <div className='container mx-auto px-4 my-6'>
        <ToastContainer />

        <section className='text-center mb-5'>
          <img src={logo} alt="SentiMusic logo" className='mx-auto'/>
          <p className='text-lg font-extrabold'>Find songs based on your mood and add them to Spotify.</p>
        </section>
        
        {isAuthenticated ? (
          <div>
            {/* Search Form */}
            <form onSubmit={handleSubmit} className='flex justify-center gap-2' name='songGenerationForm'>
              <input 
                type="text" 
                id='mood'
                name='mood'
                placeholder="Enter your mood or feelings"  
                value={mood}  
                onChange={(e) => setMood(e.target.value)} 
                className="input input-bordered w-full max-w-md" 
              />
              <button type='submit' className="btn btn-primary">Search</button>
            </form>

            {songs.length > 0 && 
            <div className='grid grid-cols-1 gap-y-24 my-24 md:grid-cols-3 md:gap-24 md:my-32'>
              {/* Recommend Songs */}
              <section className='md: col-span-2'>
                <h2 className='text-2xl font-extrabold mb-10'>Recommended Songs</h2>
                  {isLoading ?
                  <span className="loading loading-bars loading-lg"></span>
                  :
                  <div>
                    <SongList songs={[...new Map(songs.map((song) => [song.uri, song])).values()]} playlist={playlist} handlePlayingTrack={handlePlayingTrack} handleTogglePlaylistTrack={handleTogglePlaylistTrack} />
                  </div>                   
                 }
              </section>
              
              {/* Playlist */}
              <aside className='md:col-span-1'>
                <h2 className='text-2xl font-extrabold mb-10'>Playlist</h2>
                <SongList songs={playlist} playlist={playlist} handlePlayingTrack={handlePlayingTrack} handleTogglePlaylistTrack={handleTogglePlaylistTrack} />
                {playlist.length > 0 && 
                  <button 
                    className="btn btn-block mt-5 btn-primary" 
                    type='button' 
                    onClick={()=>document.getElementById('playlist_modal').showModal()}>
                      Create Playlist
                  </button>
                }
                
                <dialog id="playlist_modal" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Create Playlist</h3>
                    
                    <form method="dialog" onSubmit={handlePlaylistSubmit} className='py-4' name='playlistCreationForm'>
                      <button type='button' 
                        onClick={() => document.getElementById("playlist_modal").close()} 
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                      </button>
                      <div className='mb-3'>
                        <label htmlFor="playlist-name" className="label label-text">Name:</label>
                        <input 
                          id='playlist-name'
                          name='playlist-name' 
                          type="text" 
                          placeholder="Type here" 
                          className="input input-bordered w-full max-w-lg" 
                          onChange={(e) => setPlaylistName(e.target.value)} 
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="playlist-description" className="label label-text">Description:</label>
                        <input 
                          id='playlist-description' 
                          name='playlist-description'
                          type="text" 
                          placeholder="Type here" 
                          className="input input-bordered w-full max-w-lg" 
                          onChange={(e) => setPlaylistDescription(e.target.value)} 
                        />
                      </div>

                      <div className='modal-action'>
                        <button type='button' className="btn" onClick={() => document.getElementById("playlist_modal").close()}>Close</button>
                        <button type='submit' className="btn btn-outline" onClick={notify}>Submit</button>
                      </div>                   
                    </form>
                  </div>
                </dialog>
              </aside>

            </div>}
                
            {/* Player */}
            <div className="player-wrapper">
              <Player trackUri={playingTrack} />
            </div>
        </div>
        ) : (
          <p className='text-center text-2xl font-extrabold'>Please login with your Spotify Account!</p>
        )}
        
      </div>
    );
}

export default Home