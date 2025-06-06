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

//HELPER FUNCTIONS
function GetPlaylistByID(id){
   let playlist = playlistData.find(x => x.playlistID == id);
   return playlist;
}
//Deletes a playlist from the playlistData array
function Delete(playlistID){
   let index = playlistData.findIndex(x => x.playlistID == playlistID);
   playlistData.splice(index, 1);
   ReloadPlaylists();
}
function ReloadPlaylists(){
   document.getElementById('playlist-cards').innerHTML = '';
   for (const x of playlistData){
      AddPlaylist(x);
   }
}
function RenderPassedPlaylists(playlists){
   document.getElementById('playlist-cards').innerHTML = '';
   for (const x of playlists){
      AddPlaylist(x);
   }
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

span.onclick = function() {
   modal.style.display = "none";
}
window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}

//Add a song to the modal rendering
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

//Edit button handling
window.EditButton = function EditButton(event){
   console.log(event.srcElement.parentElement.dataset.currid);
   event.stopPropagation();
   //open modal
   document.getElementById('playlistModal').style.display = 'block';
   document.getElementById('addSettings').classList.remove('hidden');
   //hide shuffle button
   document.getElementById('shuffle-button').classList.add('hidden');

   //add information
   let playlist = GetPlaylistByID(event.srcElement.parentElement.dataset.currid);

   // Clear existing cards
   document.querySelector('.modal-playlist-cards').innerHTML = '';

   //header
   document.getElementById('playlistModal').dataset.currid = String(playlist.playlistID || '');
   document.getElementById('playlistName').textContent = playlist.playlist_name;
   document.querySelector('.modal-playlist-header h2').textContent = playlist.playlist_author;
   document.getElementById('playlistImage').src = playlist.playlist_art || 'assets/img/playlist.png';

   //add songs
   for (const x of playlist.songs){
      AddSong(x);
   }
   modal.style.display = "block";
}

//Delete button handling
window.DeleteButton = function DeleteButton(event){
   event.stopPropagation();
   Delete(event.srcElement.parentElement.dataset.currid);
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
   card.dataset.currid = String(x.playlistID || '');
   card.addEventListener('click', function() {
     openModal(x);
   });
   playlist.appendChild(card);
   card.innerHTML = `
   <button id="edit-btn" onclick="EditButton(event)">Edit</button>
   <button id="del-btn" onclick="DeleteButton(event)">Delete</button>
   <img src="${x.playlist_art || 'assets/img/playlist.png'}" alt="Playlist Image" class="playlist-image">
    <h2>${x.playlist_name}</h2>
    <h3>${x.playlist_author}</h3>
    <button class="like-button" data-likes=${x.playlist_likes || 0} data-hasLiked=${false} onclick="ToggleLikes(event)">&#x2661 ${x.playlist_likes || 0}</button>`;
   document.getElementById('edit-btn').addEventListener('click', function(event) {
      openModal(x);
      console.log("apple");
   });
}

RenderPlaylists();

//Add +  button handling
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
      HandleSave();
   });

});

//Save button handling
function HandleSave(event){
   //save will handle both an edit and a new playlist
   let id = parseInt(document.getElementById('playlistModal').dataset.currid);
   console.log(id);
   if (id !== undefined){
      console.log("editing playlist");
      let playlist = GetPlaylistByID(id);
      let playlistName = document.getElementById('addPlaylistName').value;
      let creatorName = document.getElementById('addPlaylistCreator').value;
      let index = playlistData.findIndex(x => x.playlistID == id);
      playlistData[index].playlist_name = playlistName;
      playlistData[index].playlist_author = creatorName;
      ReloadPlaylists();
   }
   else{
      console.log("new playlist");
      let newPlaylist = {
         playlistID: playlistData.length,
         playlist_name: document.getElementById('addPlaylistName').value || 'New Playlist',
         playlist_author: document.getElementById('addPlaylistCreator').value || 'me',
         playlist_art: '',
         playlist_likes: 0,
         songs: newSongs};
      playlistData.push(newPlaylist);
      AddPlaylist(newPlaylist);
      modal.style.display = "none";
      }
}


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
   AddSong(newsong)
   newSongs.push(newSong);
}

//TODO: submit and save
//TODO: clear inputs
//TODO: use featured for search
//TODO: bug where first playlist is not editable
//TODO: add support for likes. add support for dates.

//Search helpers
function DisplayResults(event){
   console.log(event.target.value);
   let matchingPlaylists = FindAllPlaylists(event.target.value);
   RenderPassedPlaylists(matchingPlaylists);
}

//given search input, finds all playlists that match
function FindAllPlaylists(searchInput){
   //playlist name
   return matchingPlaylists = playlistData.filter(x => x.playlist_name.toLowerCase().includes(searchInput.toLowerCase()) || x.playlist_author.toLowerCase().includes(searchInput.toLowerCase()));
}

function Search(event){
   event.preventDefault();
}

function Clear(event){
   event.preventDefault();
   event.srcElement.parentElement.firstElementChild.value = '';
   ReloadPlaylists();
}

//Sorting
function Sort(event){
   console.log(event.target.value);
   switch (event.target.value){
      case 'name':
         SortByName();
         break;
      case 'likes':
         SortByLikes();
         break;
      case 'none':
         ReloadPlaylists();
         break;
   }
}

function SortByName(){
   RenderPassedPlaylists(playlistData.sort((a, b) => a.playlist_name.localeCompare(b.playlist_name)));
}
