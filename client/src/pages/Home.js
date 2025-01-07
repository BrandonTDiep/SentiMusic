import { useState } from 'react';
import { getGenres } from '../services/openaiService'
import { refreshAccessToken } from '../services/spotifyService';

const Home = () => {
    const [mood, setMood] = useState("");
    const [genres, setGenres] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = getGenres(mood);
        setGenres(response);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        setGenres("Failed to get a recommendation.");
      }
    };

    // Use in your API call logic
    const getToken = async () => {
      const now = new Date().getTime();
      const expirationTime = localStorage.getItem('expirationTime');

      if (!expirationTime || now > expirationTime) {
          // Token has expired; refresh it
          const newToken = await refreshAccessToken();
          return newToken;
      }

      return localStorage.getItem('accessToken');
    };
  
    return (
      <div>
        <h1>Music Recommender</h1>
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