import { Play, CircleX, CirclePlus } from 'lucide-react';

const SongList = ({ songs, playlist, handlePlayingTrack, handleTogglePlaylistTrack}) => {
  const formatDuration = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <ul className='grid grid-cols-1 gap-5'>
    {songs.map((song) => (
        <li key={`${song.id}`} className='pr-5 flex items-center relative group rounded hover:bg-zinc-600 hover:bg-opacity-30' onClick={() => handlePlayingTrack(song.uri)} >
          <div className='relative group' >
            <img 
              src={song.album.image} 
              alt={`album cover ${song.name}`} 
              className='rounded hover:opacity-75' 
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <i className='text-white'> <Play /></i>
            </div>
          </div>

          <div className='flex-grow pl-4'>
            <h2 className='font-bold'>{song.name}</h2>
            <p>{song.artists.join(", ")}</p>
          </div>

          <div className='flex flex-row gap-6 not:group-hover'>
            <button onClick={(e) => {
                e.stopPropagation()  // prevent li onClick from being triggered
                handleTogglePlaylistTrack(song)
              }} className='tooltip' data-tip={playlist.some((track) => track.id === song.id) ? 'Remove from playlist' : 'Add to playlist'}>
              {playlist.some((track) => track.id === song.id) ? 
              (                        
                <CircleX />
              ): 
                <CirclePlus/>
              }
            </button>
            {formatDuration(song.duration)}
            
          </div>
          
        </li>
      ))
    }
    </ul>
  )
}

export default SongList