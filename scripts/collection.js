var collectionItemTemplate = //What follows is my first multiline JS string//
     '<div class="collection-album-container column fourth">' // +'s from line to line hold the whole thing together//
   + '  <img src="assets/images/album_covers/01.png"/>'
   + '  <div class="collection-album-info caption">'
   + '    <p>'
   + '      <a class="album-name" href="album.html"> The Colors </a>'
   + '      <br/>'
   + '      <a href="album.html"> Pablo Picasso </a>'
   + '      <br/>'
   + '      X songs'
   + '      <br/>'
   + '    </p>'
   + '  </div>'
   + '</div>'
   ;

window.onload = function() {
       var collectionContainer = document.getElementsByClassName('album-covers')[0];
       collectionContainer.innerHTML = '';
       for (var i = 0; i < 12; i++) {
         collectionContainer.innerHTML += collectionItemTemplate;
     }
 }
