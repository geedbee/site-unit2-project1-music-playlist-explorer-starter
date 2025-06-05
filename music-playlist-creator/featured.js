async function CreateFeatured(){
   await LoadPlaylistData();
   const featuredIdx = Math.floor(playlistData.length * Math.random());
   const featured = playlistData[featuredIdx];
   document.getElementById("featured-playlist-name").textContent = featured.playlist_name;
   for (featuredSong of featured.songs){
      AddFeaturedSong(featuredSong);
   }
}

function AddFeaturedSong(song){
    const featuredSong = document.createElement("div");
    featuredSong.classList.add("featured-song");
    document.querySelector(".featured-songs").appendChild(featuredSong);
    featuredSong.innerHTML = `<img class="featured-song-image" src="assets/img/song.png" alt="song image">
                <div class="featured-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.author}</p>
                    <p>${song.album}</p>
                    <p>${song.duration}</p>
                </div>`;
}

CreateFeatured();
