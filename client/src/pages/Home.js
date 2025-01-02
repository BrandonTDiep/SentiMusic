import { useState } from 'react';
import { getSongRecommendation } from '../services/musicRecommenderService'

const Home = () => {
    const [mood, setMood] = useState("");
    const [recommendation, setRecommendation] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = getSongRecommendation(mood);
        setRecommendation(response);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        setRecommendation("Failed to get a recommendation.");
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
        {recommendation && <p>Recommended Song: {recommendation}</p>}
      </div>
    );
}

export default Home