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
//reloads playlist based on playlistData array
function ReloadPlaylists(){
   document.getElementById('playlist-cards').innerHTML = '';
   for (const x of playlistData){
      AddPlaylist(x);
   }
}
//renders ONLY the playlists in the argument
function RenderPassedPlaylists(playlists){
   document.getElementById('playlist-cards').innerHTML = '';
   for (const x of playlists){
      AddPlaylist(x);
   }
}
//sorting functions
function SortByName(){
   RenderPassedPlaylists(playlistData.sort((a, b) => a.playlist_name.localeCompare(b.playlist_name)));
}

function SortByLikes() {
   RenderPassedPlaylists(playlistData.sort((a, b) => b.playlist_likes - a.playlist_likes));
}

function SortByDates() {
   RenderPassedPlaylists(playlistData.sort((a, b) => b.playlist_dateadded - a.playlist_dateadded));
}


//Modal handling
function openModal(playlist) {
   // Clear existing cards
   document.querySelector('.modal-playlist-cards').innerHTML = '';

   //header
   document.getElementById('playlistModal').dataset.currid = String(playlist.playlistID || '');
   document.getElementById('playlistName').textContent = playlist.playlist_name;
   document.getElementById('playlistCreator').textContent = playlist.playlist_author;
   document.getElementById('playlistImage').src = playlist.playlist_art || 'assets/img/playlist.png';

   //check visibility
   document.getElementById('shuffle-button').classList.remove('hidden');
   document.getElementById('addSettings').classList.add('hidden');
   //add songs
   for (const x of playlist.songs){
      AddSong(x);
   }
   console.log(document.getElementsByClassName('remove-song-btn'));
   for (x of document.getElementsByClassName('remove-song-btn')) {
      x.classList.add('hidden');
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
   modalPlaylistCard.dataset.currid = String(x.song_id || '');
   modalPlaylistCard.innerHTML = `
                 <img src="${x.art || 'assets/img/playlist.png'}" alt="song Image" class="modal-playlist-image">
                 <div class="modal-playlist-info">
                     <h3>${x.title}</h3>
                     <p>${x.author}</p>
                     <button class='remove-song-btn' onclick="HandleRemoveSong(event)">Remove Song</button>
                 </div>
                 <p>${x.duration}</p>`;

}

//Edit button handling
window.EditButton = function EditButton(event){
   let targetElement = event.srcElement;
   if (event.srcElement.id !== 'edit-btn'){
      targetElement = event.srcElement.parentElement;
   }
   event.stopPropagation();
   //open modal
   document.getElementById('playlistModal').style.display = 'block';
   document.getElementById('addSettings').classList.remove('hidden');
   document.getElementById('shuffle-button').classList.add('hidden');

   for (x of document.getElementsByClassName('remove-song-btn')) {
      x.classList.remove('hidden');
   }

   //add information
   let playlist = GetPlaylistByID(parseInt(targetElement.parentElement.parentElement.dataset.currid));


   // Clear existing cards
   document.querySelector('.modal-playlist-cards').innerHTML = '';

   //header
   console.log(document.getElementById('playlistModal').dataset.currid);
   document.getElementById('playlistModal').dataset.currid = String(playlist.playlistID || '');
   document.getElementById('playlistName').textContent = playlist.playlist_name;
   document.getElementById('playlistCreator').textContent = playlist.playlist_author;
   document.getElementById('playlistImage').src = playlist.playlist_art || 'assets/img/playlist.png';
   document.getElementById('addPlaylistName').value = playlist.playlist_name;
   document.getElementById('addPlaylistCreator').value = playlist.playlist_author;
   document.getElementById('addSongForm').reset();

   //add songs
   for (const x of playlist.songs){
      AddSong(x);
   }
   newSongs = [];
}

//Add +  button handling
document.getElementById('add-btn').addEventListener('click', function(event) {
   //open modal
   document.getElementById('playlistModal').style.display = 'block';
   document.getElementById('addSettings').classList.remove('hidden');
   document.getElementById('shuffle-button').classList.add('hidden');

   for (x of document.getElementsByClassName('remove-song-btn')) {
      x.classList.remove('hidden');
   }
   //make sure id is invalid
   document.getElementById('playlistModal').dataset.currid = "-1";
   //clear existing stuff
   document.getElementById('playlistName').textContent = 'New Playlist';
   document.getElementById('playlistCreator').textContent = 'me';
   document.getElementById('playlistImage').src = 'assets/img/playlist.png';
   document.querySelector('.modal-playlist-cards').innerHTML = '';
   document.getElementById('addPlaylistName').value = 'New Playlist';
   document.getElementById('addPlaylistCreator').value = 'me';
   document.getElementById('addSongForm').reset();

   newSongs = [];
});

//Delete button handling
window.DeleteButton = function DeleteButton(event){
   event.stopPropagation();
   let targetElement = event.srcElement;
   if (event.srcElement.id !== 'del-btn'){
      targetElement = event.srcElement.parentElement;
   }
   Delete(targetElement.parentElement.parentElement.dataset.currid);
}

//like button handling
function ToggleLikes(event){
   console.log(event.srcElement);
   let targetElement = event.srcElement;
   if (!event.srcElement.classList.contains("like-button")){
      targetElement = event.srcElement.parentElement;
   }
   event.stopPropagation(); // Stop the event from bubbling up to parent elements
   if (targetElement.dataset.hasliked === "false"){
      let likes = parseInt(targetElement.dataset.likes) + 1;
      targetElement.dataset.likes = likes;
      targetElement.innerHTML = `<i class="fa-solid fa-heart"></i> ${likes}`;
      targetElement.dataset.hasliked = "true";
      let playlist = GetPlaylistByID(parseInt(targetElement.dataset.id));
      let index = playlistData.findIndex(x => x.playlistID == playlist.playlistID);
      playlistData[index].playlist_likes = likes;
   }
   else {
      let likes = parseInt(targetElement.dataset.likes) - 1;
      targetElement.dataset.likes = likes;
      targetElement.innerHTML = `<i class="fa-regular fa-heart"></i> ${likes}`;
      targetElement.dataset.hasliked = "false";
      let playlist = GetPlaylistByID(parseInt(targetElement.dataset.id));
      let index = playlistData.findIndex(x => x.playlistID == playlist.playlistID);
      playlistData[index].playlist_likes = likes;
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
   <div class="edit-del-container">
      <button id="edit-btn" onclick="EditButton(event)"><i class="fa-solid fa-pen"></i></button>
      <button id="del-btn" onclick="DeleteButton(event)"><i class="fa-solid fa-trash"></i></button>
   </div>
   <img src="${x.playlist_art || 'assets/img/playlist.png'}" alt="Playlist Image" class="playlist-image">
    <h2>${x.playlist_name}</h2>
    <h3>${x.playlist_author}</h3>
    <button class="like-button" data-id=${x.playlistID} data-likes=${x.playlist_likes || 0} data-hasliked=${false} onclick="ToggleLikes(event)">
      <i class="fa-regular fa-heart"></i> ${x.playlist_likes || 0}
    </button>`;
}

RenderPlaylists();



//adding event listeners to the add playlist form
document.addEventListener("DOMContentLoaded", function(event) {
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
   if (id !== -1){
      let playlist = GetPlaylistByID(id);
      let playlistName = document.getElementById('addPlaylistName').value;
      let creatorName = document.getElementById('addPlaylistCreator').value;
      let index = playlistData.findIndex(x => x.playlistID == id);
      playlistData[index].playlist_name = playlistName;
      playlistData[index].playlist_author = creatorName;
      playlistData[index].songs = [...playlistData[index].songs, ...newSongs];
      ReloadPlaylists();
   }
   else{
      let newPlaylist = {
         playlistID: playlistData.length,
         playlist_name: document.getElementById('addPlaylistName').value || 'New Playlist',
         playlist_author: document.getElementById('addPlaylistCreator').value || 'me',
         playlist_art: '',
         playlist_likes: 0,
         playlist_dateadded: Date.now(),
         songs: newSongs};
      playlistData.push(newPlaylist);
      AddPlaylist(newPlaylist);
   }
   modal.style.display = "none";
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
   let playlistId = event.srcElement.parentElement.parentElement.parentElement.dataset.currid;
   playlistId = parseInt(playlistId);
   let index = playlistData.findIndex(x => x.playlistID == playlistId);
   let newSong = {
      song_id: playlistData[index].songs.length + newSongs.length + 1,
      title: document.getElementById('addSongName').value,
      author: document.getElementById('addSongArtist').value,
      album: document.getElementById('addSongAlbum').value,
      duration: document.getElementById('addSongDuration').value,
      art: '',
   }
   AddSong(newSong)
   newSongs.push(newSong);
}

//Search helpers
function DisplayResults(event){
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
   switch (event.target.value){
      case 'name':
         SortByName();
         break;
      case 'likes':
         SortByLikes();
         break;
      case 'dates':
         SortByDates();
         break;
      case 'none':
         ReloadPlaylists();
         break;
   }
}

//event handlers for add playlist modal
function HandleAddPlaylistNameChange(event){
   document.getElementById('playlistName').textContent = event.target.value;
}

function HandleAddPlaylistCreatorChange(event){
   document.getElementById('playlistCreator').textContent = event.target.value;
}

document.querySelector(`h1`).classList.add('ubuntu-regular');


function HandleRemoveSong(event){
   let playlistId = document.getElementById('playlistModal').dataset.currid;
   let songId = event.srcElement.parentElement.parentElement.dataset.currid;
   RemoveSong(playlistId, songId);
   console.log(playlistId);
   console.log(songId);
   document.querySelector('.modal-playlist-cards').removeChild(event.srcElement.parentElement.parentElement);
}

function RemoveSong(playlistId, songId){
   let index = playlistData.findIndex(x => x.playlistID == playlistId);
   let songIndex = playlistData[index].songs.findIndex(x => x.song_id == songId);
   playlistData[index].songs.splice(songIndex, 1);
}
