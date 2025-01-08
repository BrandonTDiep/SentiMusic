import { useState, useEffect } from 'react';
import { getGenres } from '../services/openaiService'
import { getSpotifyUserData } from '../services/spotifyService'

const Home = () => {
    const [mood, setMood] = useState("")
    const [genres, setGenres] = useState("")
    const [userData, setUserData] = useState(null)
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = getGenres(mood);
        setGenres(response);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        setGenres("Failed to get a recommendation.")
      }
    };

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const user = await getSpotifyUserData()
          setUserData(user)
        } catch (error) {
          console.error("Error fetching Spotify user data:", error);
        }
  
      };
      fetchUserData();
    }, []);

    return (
      <div>
        <h1>Music Recommender</h1>
        {userData && <p>Welcome, {userData.display_name}!</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your mood or feelings"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <button type="submit">Get Recommendation</button>
        </form>
        {genres && <p>Recommended Genres: {genres}</p>}
      </div>
    );
}

export default Home