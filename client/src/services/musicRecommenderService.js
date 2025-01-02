
import axiosInstance from '../utils/axiosInstance'

/**
 * Fetch song recommendation based on mood
 * @param {string} mood - User's mood or feelings
 * @returns {Promise<string>} - Recommended song
 */
export const getSongRecommendation = async (mood) => {
  const response = await axiosInstance.post('/api/recommend-song', { mood });
  return response.data.recommendation;
};