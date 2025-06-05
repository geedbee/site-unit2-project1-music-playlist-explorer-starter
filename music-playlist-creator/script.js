// JavaScript for Opening and Closing the Modal
const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];


//Shuffle implementation
document.getElementById('shuffle-button').addEventListener('click', function(event) {
   ShuffleSongs(event);
});

function ShuffleSongs(event){
   let playlist = playlistData.find(x => x.playlistID == document.getElementById('playlistModal').dataset.currid);
   let shuffledSongs = shuffle(playlist.songs);
   //TODO: shuffle songs affects the json data
   document.querySelector('.modal-playlist-cards').innerHTML = '';
   for (const x of playlist.songs){
      AddSong(x);
   }
}

function shuffle(array) {
   for (let i = array.length - 1; i > 0; i--) {
     let j = Math.floor(Math.random() * (i + 1));
     let temp = array[i];
     array[i] = array[j];
     array[j] = temp;
   }
   return array;
 }


//Modal handling
function openModal(playlist) {
   // Clear existing cards
   document.querySelector('.modal-playlist-cards').innerHTML = '';

   //header
   document.getElementById('playlistModal').dataset.currid = String(playlist.playlistID || '');
   document.getElementById('playlistName').textContent = playlist.playlist_name;
   document.querySelector('.modal-playlist-header h2').textContent = playlist.playlist_author;
   document.getElementById('playlistImage').src = playlist.playlist_art || 'assets/img/playlist.png';

   //check visibility
   document.getElementById('shuffle-button').classList.remove('hidden');
   document.getElementById('addSettings').classList.add('hidden');

   //add songs
   for (const x of playlist.songs){
      AddSong(x);
   }
   modal.style.display = "block";
}

function AddSong(x){
   let modalPlaylistCard = document.createElement('div');
   modalPlaylistCard.className = 'modal-playlist-card';
   document.querySelector('.modal-playlist-cards').appendChild(modalPlaylistCard);
   modalPlaylistCard.innerHTML = `
                 <img src="${x.art || 'assets/img/playlist.png'}" alt="song Image" class="modal-playlist-image">
                 <div class="modal-playlist-info">
                     <h3>${x.title}</h3>
                     <p>${x.author}</p>
                 </div>
                 <p>${x.duration}</p>`;

}

span.onclick = function() {
   modal.style.display = "none";
}
window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}

//like button handling
function ToggleLikes(event){
   event.stopPropagation(); // Stop the event from bubbling up to parent elements
   if (event.srcElement.dataset.hasliked === "false"){
      let likes = parseInt(event.srcElement.dataset.likes) + 1;
      event.srcElement.dataset.likes = likes;
      event.srcElement.innerHTML = `&#x2665 ${likes}`;
      event.srcElement.dataset.hasliked = "true";
   }
   else {
      let likes = parseInt(event.srcElement.dataset.likes) - 1;
      event.srcElement.dataset.likes = likes;
      event.srcElement.innerHTML = `&#x2661 ${likes}`;
      event.srcElement.dataset.hasliked = "false";
   }
}

//renders the playlists on the page
async function RenderPlaylists(){
   await LoadPlaylistData();
   for (const x of playlistData){
      AddPlaylist(x);
   }
}
function AddPlaylist(x){
   let playlist = document.createElement('div');
   playlist.className = 'card-container';
   document.getElementById('playlist-cards').appendChild(playlist);
   let card = document.createElement('div');
   card.className = 'card';
   card.addEventListener('click', function() {
     openModal(x);
   });
   playlist.appendChild(card);
   card.innerHTML = `<img src="${x.playlist_art || 'assets/img/playlist.png'}" alt="Playlist Image" class="playlist-image">
    <h2>${x.playlist_name}</h2>
    <h3>${x.playlist_author}</h3>
    <button class="like-button" data-likes=${x.playlist_likes || 0} data-hasLiked=${false} onclick="ToggleLikes(event)">&#x2661 ${x.playlist_likes || 0}</button>`;
}

RenderPlaylists();

//Add button handling
document.getElementById('add-btn').addEventListener('click', function(event) {
   //open modal
   document.getElementById('playlistModal').style.display = 'block';
   document.getElementById('addSettings').classList.remove('hidden');
   //hide shuffle button
   document.getElementById('shuffle-button').classList.add('hidden');

   //clear existing stuff
   document.getElementById('playlistName').textContent = 'New Playlist';
   document.getElementById('playlistCreator').textContent = 'me';
   document.getElementById('playlistImage').src = 'assets/img/playlist.png';
   document.querySelector('.modal-playlist-cards').innerHTML = '';

   newSongs = [];
});

//adding event listeners to the add playlist form
document.addEventListener("DOMContentLoaded", function(event) {
   console.log("DOM fully loaded and parsed");
   document.getElementById("addPlaylistForm").addEventListener("submit", function(event) {
      HandleAddPlaylist(event);
   });
   document.getElementById("addSongForm").addEventListener("submit", function(event) {
      HandleAddSong(event);
   });
   document.getElementById("save-btn").addEventListener("click", function(event) {
      let newPlaylist = {
         playlistID: playlistData.length,
         playlist_name: document.getElementById('addPlaylistName').value,
         playlist_author: document.getElementById('addPlaylistCreator').value,
         playlist_art: '',
         playlist_likes: 0,
         songs: newSongs};
      playlistData.push(newPlaylist);
      AddPlaylist(newPlaylist);
   });

});

function HandleAddPlaylist(event){
   event.preventDefault(); // Prevent the default form submission behavior
   let playlistName = document.getElementById('addPlaylistName').value;
   let creatorName = document.getElementById('addPlaylistCreator').value;
   document.getElementById('playlistName').textContent = playlistName;
   document.getElementById('playlistCreator').textContent = creatorName;
}

let newSongs = [];

function HandleAddSong(event){
   event.preventDefault(); // Prevent the default form submission behavior
   let newSong = {
      title: document.getElementById('addSongName').value,
      author: document.getElementById('addSongArtist').value,
      album: document.getElementById('addSongAlbum').value,
      duration: document.getElementById('addSongDuration').value,
      art: '',
   }
   AddSong(newSong);
   newSongs.push(newSong);
}
