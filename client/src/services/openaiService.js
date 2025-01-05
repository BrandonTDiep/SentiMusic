
import axiosInstance from '../utils/axiosInstance'

/**
 * Fetch genre recommendation based on mood
 * @param {string} mood - User's mood or feelings
 * @returns {Promise<string>} - Genres
 */
export const getGenres = async (mood) => {
  const response = await axiosInstance.post('/api/recommend-genre', { mood });
  return response.data.recommendation;
};




// {
//   "recommendation": "Upbeat, Pop, Indie Dance, Electronic, Funk"
// }