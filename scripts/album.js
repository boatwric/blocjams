//Used to be sample albums here, moved to fixtures.js in Checkpoint 19

var createSongRow = function(songNumber, songName, songLength) { //creates a table that generates song row content
     var template =
        '<tr class="album-view-song-item">' //notice how it manages the info with + 'strings' on each row
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' //data-song-number stores the song number, important if you set off the play button with the cursor and want to revert back to the number when the cursor leaves
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
      // return $(template); this used to be return template; until Checkpoint 18
     var $row = $(template);   
  
    var clickHandler = function() {
      var songNumber = $(this).attr('data-song-number');

	  if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	  }
	  if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();
	  } else if (currentlyPlayingSongNumber === songNumber) {
		// Switch from Pause -> Play button to pause currently playing song.
		$(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
		currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
	  }
    };
  
     var onHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        } 
       console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };
     
     var offHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
     };
     
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var setCurrentAlbum = function(album) {

/*
We replace each instance of getElementsByClassName with a jQuery selector and use CSS-style syntax to select the elements. Additionally, we add a $ to the start of each variable name because they now reference jQuery objects.
*/
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');  
  
/* 

Raw JS removed in Checkpoint 17:  
     
     // Sets all album elements that need to be displayed, corresponds to HTML elements
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
 */
 
/* 

Raw JS removed in Checkpoint 17:  
       
     // firstChild finds first child node of element, nodeValue returns or sets up value; value set to album title
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);

*/
     $albumTitle.text(album.title); //jQuery .text replaces JS firstChild.nodeValue
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl); //jQuery .attr replaces JS setAttribute()
     
     $albumSongList.empty();
     for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
     }
 };

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);

};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    } //this is how it loops back to the start after last track

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

/* 

Raw JS removed in Checkpoint 17: 
  
  // song list set to empty string before loop, clears out any previous information
     albumSongList.innerHTML = '';
 
     // goes through all the songs from specified album, inserts into html using innerHTML, createSong function called at each loop to populate song number, title, and duration
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };

*/

/*

REMOVED IN CHECKPOINT 18
var findParentByClassName = function(element, targetClass) {
    if (element) {
        var currentParent = element.parentElement;
        while (currentParent.className !== targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
};

var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

 var clickHandler = function(targetElement) {
        var songItem = getSongItem(targetElement); 
        if (currentlyPlayingSong === null) {
            songItem.innerHTML = pauseButtonTemplate;
            currentlyPlayingSong = songItem.getAttribute('data-song-number');
      } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
            songItem.innerHTML = playButtonTemplate;
            currentlyPlayingSong = null;  
      } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
            var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
            songItem.innerHTML = pauseButtonTemplate;
            currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } 
 };
*/


/*var songListContainer = document.getElementsByClassName('album-view-song-list')[0]; //target parent element, causes EVENT BUBBLING*/

/*

REMOVED IN CHECKPOINT 18

var songListContainer = document.getElementsByClassName('album-view-song-list')[0]; 

var songRows = document.getElementsByClassName('album-view-song-item');

*/

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>'; //This will cause a play button to appear each time song has cursor on it
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>'; 
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

// window.onload = function() TAKEN OUT IN CHECKPOINT 18
 $(document).ready(function() {
   setCurrentAlbum(albumPicasso);
   $previousButton.click(previousSong);
   $nextButton.click(nextSong);
   
/*   
TAKEN OUT IN CHECKPOINT 18
   songListContainer.addEventListener('mouseover', function(event) {
         //event.target stores DOM element where event occurs, in this case tells you what song your mouse pointer is  over- until revison, and now it gives a play button
         //console.log(event.target); --> old instructions
         if (event.target.parentElement.className === 'album-view-song-item') {
             // Changes the content from the number to the play button's HTML, this is just the parent element
             event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
             var songItem = getSongItem(event.target);
           
           if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
             //This is the child element, only works if you're hovering over the song number now
         }
     });
  */   
   //for (var i = 0; i < songRows.length; i++) {
/*   
TAKEN OUT IN CHECKPOINT 18
         songRows[i].addEventListener('mouseleave', function(event) {
             // Fucntion reverts the content back to the number when the cursor leaves the row
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');
 
             // #2
                 if (songItemNumber !== currentlyPlayingSong) {
                     songItem.innerHTML = songItemNumber;
             }
         });  
*/         
        // songRows[i].addEventListener('click', function(event) {
             //clickHandler(event.target);
         //});
    // }
 });