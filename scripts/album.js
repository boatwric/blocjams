var setSong = function(songNumber){
  if (currentSoundFile) {
         currentSoundFile.stop();//checks defined currentSoundFile and runs currentSoundFile.stop() if true
     }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];       currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, { //buzz.sound object, property is the audio from album object passed to currentSongFromAlbum which starts as null
    formats: [ 'mp3' ],
    preload: true//tells Buzz to load mp3s as soon as page loads
     });
    setVolume(currentVolume);
 };

var setVolume = function(volume) {
    if (currentSoundFile) {
       currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
     return $('.song-item-number[data-song-number="' + number + '"]')
};
     
var createSongRow = function(songNumber, songName, songLength) { //creates a table that generates song row content
     var template =
        '<tr class="album-view-song-item">' //notice how it manages the info with + 'strings' on each row
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' //data-song-number stores the song number, important if you set off the play button with the cursor and want to revert back to the number when the cursor leaves
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
var $row = $(template);   
  
var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

	  if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);	currentlyPlayingCell.html(currentlyPlayingSongNumber);
	  }
	  if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
		setSong(songNumber);
        updatePlayerBarSong();
	  } else if (currentlyPlayingSongNumber === songNumber) {
		if (currentSoundFile.isPaused()){
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();
        }else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.pause();
        }
	  }
    };
  
var onHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        } 
       console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };
     
var offHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = parseInt(songNumberCell.attr('data-song-number'));

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
    setSong(parseInt(currentSongIndex + 1));
    currentSoundFile.play();
  
    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);


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
    setSong(parseInt(currentSongIndex + 1)); 
    currentSoundFile.play();



    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>'; //This will cause a play button to appear each time song has cursor on it
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>'; 
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;



var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
   setCurrentAlbum(albumPicasso);
   $previousButton.click(previousSong);
   $nextButton.click(nextSong);
 });