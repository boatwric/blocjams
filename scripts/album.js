// Example Album
 var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

var createSongRow = function(songNumber, songName, songLength) { //creates a table that generates song row content
     var template =
        '<tr class="album-view-song-item">' //notice how it manages the info with + 'strings' on each row
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' //data-song-number stores the song number, important if you set off the play button with the cursor and want to revert back to the number when the cursor leaves
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 };

var setCurrentAlbum = function(album) {
     // Sets all album elements that need to be displayed, corresponds to HTML elements
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     // firstChild finds first child node of element, nodeValue returns or sets up value; value set to album title
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // song list set to empty string before loop, clears out any previous information
     albumSongList.innerHTML = '';
 
     // goes through all the songs from specified album, inserts into html using innerHTML, createSong function called at each loop to populate song number, title, and duration
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };

//The following function finds the parent by class name 

var findParentByClassName = function(element, targetClass) { //function that looks at the album and the target class
    if (element) {  //if said element
        var currentParent = element.parentElement; //looks for parent element of element in question, stores in currentParent
        while (currentParent.className !== targetClass && currentParent.className !== null) //while current parent's class name is not the target class and the current parent's class name isn't null (that is, if the current parent actually has a class assigned to it)
            currentParent = currentParent.parentElement; //currentParent is assigned the parent element
        }
        return currentParent; //and finally returns the parent element
    }
};

//So if the element you're looking at has a parent with the same class, the parent will be found and returned whenever you invoke this function

/*

The findParentByClassName function enables us to write a larger function that will always return the song item. This method, which we'll call getSongItem, should take an element and, based on that element's class name(s), use a switch statement that returns the element with the .song-item-number class.

*/

var getSongItem = function(element) { //creates funtion that takes in an element
    switch (element.className) { //sets up a switch that looks at the class name of the element
        case 'album-song-button': //if it has album song button attribute
        case 'ion-play': //and play button attribute
        case 'ion-pause': //and the pause attribute
            return findParentByClassName(element, 'song-item-number'); //return the parent class function, using the song number as the target class??? What does this actually do?
        case 'album-view-song-item': //if it has the album-view-song-item attribute
            return element.querySelector('.song-item-number'); //return the first element in song-item-number???
        case 'song-item-title':// if element has song item title
        case 'song-item-duration':// and the duration
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number'); //then... what???
        case 'song-item-number': //if the element has a song item number attribute
            return element; //return what the element is (I presume just the number?)
        default: //any other time
            return; //do nothing???
    }  
};

//I don't even understand what this function does or why it is trying to find these values...

/*var songListContainer = document.getElementsByClassName('album-view-song-list')[0]; //target parent element, causes EVENT BUBBLING*/

var clickHandler = function(targetElement) {
       var songItem = getSongItem(targetElement);  
  
       if (currentlyPlayingSong === null) {//if no song is currently playing? I don't think I'm understanding this condition 
         songItem.innerHTML = pauseButtonTemplate; //insert a pause button
         currentlyPlayingSong = songItem.getAttribute('data-song-number'); //this is the currently playing song
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) { //If the test returns the track number
         songItem.innerHTML = playButtonTemplate; //insert a place button
         currentlyPlayingSong = null; //and set the currently playing song to null (not playing)
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) { //If the clicked song is not the one being played
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');//looks at the page, returns array consisting of first element of class plus the value of currently playing song and saves them to currently playing song element
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number'); //sets currentlyPlayingSongElement's content to the song number
         songItem.innerHTML = pauseButtonTemplate; //sets sonItem content to pause button
         currentlyPlayingSong = songItem.getAttribute('data-song-number'); //currentlyPlayingSong looks at songItem and pulls out data-song-number attribute, gets assigned to currentlyPlayingSong
     }
 };

var songListContainer = document.getElementsByClassName('album-view-song-list')[0]; 

var songRows = document.getElementsByClassName('album-view-song-item');


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>'; //This will cause a play button to appear each time song has cursor on it

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';//This one for the pause

var currentlyPlayingSong = null; //Will be able to test if song is playing or not when event listener is added, will be added to the same for loop created for mouseleave event


 window.onload = function() {
     setCurrentAlbum(albumPicasso);
   
   songListContainer.addEventListener('mouseover', function(event) {
         //event.target stores DOM element where event occurs, in this case tells you what song your mouse pointer is  over- until revison, and now it gives a play button
         //console.log(event.target); --> old instructions
         if (event.target.parentElement.className === 'album-view-song-item') {
             // Changes the content from the number to the play button's HTML, this is just the parent element
             //REMOVE??? Ah, yes, remove. This used to say just assign play button on mouse over, but no way to remove it; event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
             //This is the child element, only works if you're hovering over the song number now
             var songItem = getSongItem(event.target); //creates function that takes in an event and a target (element?)
+
+            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) { //if the song number doesn't match the currently playing song...
+                songItem.innerHTML = playButtonTemplate; //assign play button onMouseover
+            }
         }
     });
   for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             // Function reverts the content back to the number when the cursor leaves the row
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number'); //Cached the song item that we're leaving in a variable. Referencing  getSongItem() repeatedly causes multiple queries that can hinder performance. We've done the same with the song number
             if (songItemNumber !== currentlyPlayingSong) { //Added the conditional that checks that the item the mouse is leaving is not the current song, and we only change the content if it isn't.
                 songItem.innerHTML = songItemNumber;
             }
         });
         
         songRows[i].addEventListener('click', function(event) { //This is what currentlyPlayingSong was made for
             clickHandler(event.target); //dictates if a song has a number, pause button, or pause button representing it
         });  
   }
 };