import { useState } from 'react';
import { getGenres } from '../services/openaiService'

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