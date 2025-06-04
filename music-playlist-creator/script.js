// JavaScript for Opening and Closing the Modal
const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

function openModal(festival) {
   /*document.getElementById('playlistName').innerText = festival.name;
   document.getElementById('playlistImage').src = festival.imageUrl;
   document.getElementById('playlistDates').innerText = `Dates: ${festival.dates}`;
   document.getElementById('playlistLocation').innerText = `Location: ${festival.location}`;
   document.getElementById('artistLineup').innerHTML = `<strong>Lineup:</strong> ${festival.lineup.join(', ')}`;
   */
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
