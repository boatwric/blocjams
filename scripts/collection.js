/*
TAKEN OUT IN CHECKPOINT 17:
var collectionItemTemplate = //What follows is my first multiline JS string//
*/

var buildCollectionItemTemplate = function() { //action oriented functions start with verb by convention
     var template =    
     '<div class="collection-album-container column fourth">' // multi-line statement, +'s hold things together
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
   return $(template); //Above is JS, but this makes it work with a jQuery function
 };

$(window).load(function() { //does stuff when page loads
   var $collectionContainer = $('.album-covers'); //album covers class becomes jQuery variable
   $collectionContainer.empty(); //empties  any text or other elements from the element(s) it is called on
   for (var i = 0; i < 12; i++) { //goes through each album
     var $newThumbnail = buildCollectionItemTemplate(); //calls above function to fill in all the info
     $collectionContainer.append($newThumbnail);//appends template content to the collection container
  }
});

/*

RAW JS TAKEN OUT IN CHECKPOINT 17:

window.onload = function() {
       var collectionContainer = document.getElementsByClassName('album-covers')[0];
       collectionContainer.innerHTML = '';
       for (var i = 0; i < 12; i++) {
         collectionContainer.innerHTML += collectionItemTemplate;
     }
 }
*/