let playlistData;

//handle loading of data
async function LoadPlaylistData(){
    const data = await FetchData();
    playlistData = data.playlists;
 }

async function FetchData(){
   const response = await fetch("data/data.json");
   const data = await response.json();
   return data;
}
