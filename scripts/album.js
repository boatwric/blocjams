var setSong = function(songNumber){
  if (currentSoundFile) {
         currentSoundFile.stop();
     }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
       currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
          formats: [ 'mp3' ],
          preload: true
     });
  setVolume(currentVolume)
 };

var seek = function(time) { //uses setTime function to change position to specified time
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var setCurrentTimeInPlayerBar = function(currentTime) { //function with currentTime as argument
    var $currentTimeElement = $('.seek-control .current-time'); //jQuery object that looks for all current-time class elements of seek-contol class
    $currentTimeElement.text(currentTime); //for $currentTimeElement, replace the text with currentTime
};

var setTotalTimeInPlayerBar = function(totalTime) { //function with currentTime as argument
    var $totalTimeElement = $('.seek-control .total-time'); //jQuery object that looks for all total-time class elements of seek-control class
    $totalTimeElement.text(totalTime); //for $totalTimeElement, replace text with totalTime
}

var filterTimeCode = function(timeInSeconds) { //function that takes timeInSeconds as argument
    var seconds = Number.parseFloat(timeInSeconds); //takes Number string, turned into floating point number, passed into timeInSeconds
    var wholeSeconds = Math.floor(seconds); //round floating point down to nearest integer (whole number)
    var minutes = Math.floor(wholeSeconds / 60); //take seconds integer, divide by 60 to get minutes

    var remainingSeconds = wholeSeconds % 60; //take seconds integer, modulus to get remainder from dividing by 60, gives seconds
    var output = minutes + ':' + remainingSeconds;

    return output;
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

      //Song already loaded, save song information
	  if (currentlyPlayingSongNumber !== null) { // Revert to song number for currently playing song because user started playing new song.
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);	
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
	  }
      //If no song yet playing, play brand new song
	  if (currentlyPlayingSongNumber !== songNumber) { // Switch from Play -> Pause button to indicate new song is playing.
        //$(this).html(pauseButtonTemplate);
		setSong(songNumber);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        
        var $volumeFill = $('.volume .fill');//Bloc implementation, sets CSS of volume bar to equal currentVolume; turns .volume and .fill classes into jQuery object
        var $volumeThumb = $('.volume .thumb'); //turns volume and thumb classes into jQuery object
        $volumeFill.width(currentVolume + '%'); //calls width method on volumeFill, set to currentVolume plus string %
        $volumeThumb.css({left: currentVolume + '%'}); //calls css method on volumeThumb, but left argument is unclear to me        
        
        $(this).html(pauseButtonTemplate);
        updatePlayerBarSong();
        
	  } else if (currentlyPlayingSongNumber === songNumber) {
		console.log('this is else if');
        //current song is paused
        if (currentSoundFile.isPaused()){
          console.log('in ELSE IF first if');
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();
        }
        //current song is not paused/is playing
        else {
          console.log('in ELSE IF else');
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

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) { //if something is playing
         currentSoundFile.bind('timeupdate', function(event) { //timeupdate is a Buzz feature, fire continuously while song plays
             var seekBarFillRatio = this.getTime() / this.getDuration(); //calculate seek bar fill by dividing these two Buzz functions, returns time in seconds
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent); //Percentage can't be less than 0
    offsetXPercent = Math.min(100, offsetXPercent); //Percentage can't be more than 100
    var percentageString = offsetXPercent + '%'; //converts percentage to string, adds % character
    $seekBar.find('.fill').width(percentageString); //sets width of fill class
    $seekBar.find('.thumb').css({left: percentageString}); //sets left value of thumb class
 };  


//Determines seekBarFillRatio

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');//find all elements with class of seek-bar that are contained within the class of player-bar, return jQuery wrapped array contain song seek and volume control
 
    $seekBars.click(function(event) {
         var offsetX = event.pageX - $(this).offset().left; //jQuery's pageX keeps track of horizontal position, subtracted from left edge of page
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth; //divides offsetX by barWidth to get seekBarFillRatio
         
         if ($(this).parent().attr('class') == 'seek-control') { //Bloc implementation, tells difference between setting seek bar and volume bar place
            seek(seekBarFillRatio * currentSoundFile.getDuration()); //if the bar's parent class is seek-control, use seekBarFillRation against song seek bar
         } else {
            setVolume(seekBarFillRatio * 100); //if not, seekBarFillRation to calculate where the volume is   
         }      
      
             updateSeekPercentage($(this), seekBarFillRatio); //$this is $seekBar argument, seekBarFillRatio argument to update the updateSeekBarPercentage() function
     });
     
    $seekBars.find('.thumb').mousedown(function(event) { //find elements with class of thumb inside $seekBars, adds mousedown listener which fire as soon as mouse is pressed down 
         
         var $seekBar = $(this).parent(); //$(this) equal to thumb node clicked, determines if it's the seek bar or volume bar by checking the node's parent

         $(document).bind('mousemove.thumb', function(event){ //.bind similar to addEventListener, takes string of event instead of wrapping event in a method like other jQuery events, event handler in bind call identical to click behavior, mousemove attached to whole document to allow bar movement if not directly moving over bar
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

             if ($seekBar.parent().attr('class') == 'seek-control') { //Bloc implementation, tells difference between setting seek bar and volume bar place
                seek(seekBarFillRatio * currentSoundFile.getDuration()); //if the bar's parent class is seek-control, adjust song seek bar  
             } else {
                setVolume(seekBarFillRatio); //if not, it's the volume
             }
                       
           
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
         
         $(document).bind('mouseup.thumb', function() { //if this weren't included, the mouse would never be unbound and the seek bars would move around forever
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });       
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
    updateSeekBarWhileSongPlays();

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
    updateSeekBarWhileSongPlays();



    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function () { //forgot parenths at function, broke cells
   if(currentSoundFile.isPaused()) { //got pretty close
     $(getSongNumberCell(currentlyPlayingSongNumber)).html(pauseButtonTemplate); //had no idea how to use getSongNumberCell and pass in currentlyPlayingSongNumber
     
     $(this).html(playerBarPauseButton); //didn't know to use $(this) because of above, but understand how it conforms to previous statement
     currentSoundFile.play(); //had right idea, but left off parenths and had $ in front
   }
   else if(currentSongFromAlbum && !currentSoundFile.isPaused()) { //extra close pareths broke cells, mine was an if statement. had currentSong.play as argument,understand second argument EXCEPT exclamation point. Does that
     $(getSongNumberCell(currentlyPlayingSongNumber)).html(playButtonTemplate);  // got right because opposite of statement above
     
     $(this).html(playerBarPlayButton);  // got right because opposite of statement above
     currentSoundFile.pause(); // got right because opposite of statement above
   }
 };

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>'; //This will cause a play button to appear each time song has cursor on it
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>'; 
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var currentAlbum = null;

var $playerBarPlayButton = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
   setCurrentAlbum(albumPicasso);
   setupSeekBars();
   $previousButton.click(previousSong);
   $nextButton.click(nextSong);
   $playerBarPlayButton.click(togglePlayFromPlayerBar);
 });