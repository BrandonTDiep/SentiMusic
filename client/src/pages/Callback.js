import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    const expiresIn = params.get('expiresIn')

    if (accessToken && refreshToken && expiresIn) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('expiresIn', expiresIn)
    }

    navigate('/')

  }, [navigate])

  


  return <div>Authenticating...</div>;
};

export default Callback;
