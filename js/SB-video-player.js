// JavaScript Document
$(function(){
	"use strict";
	//create the variables
	
	
	var videoContainers = {
		$videoContainer : $('.super-basic-player'),
		$videoControls : $('.super-basic-controls'),	
	};
	
	var video = {
		$video : $('#SB-video'),
		$videoObj: $('#SB-video')[0],
		$current : $('.current-time'),
		$playPause : $('.play-pause'),
		$duration : $('.duration'),
		$bufferBar : $('.load-progress'),
		$timeBar : $('.progress-slider'),
		$timeBarHandle : $('.progress-slider > .ui-slider-handle'),
		$timeSlide : false,
		$volumeSlide : 1,
		$audioSlider : $('.volume-bar'),
		$muteUnmute : $('.mute-unmute'),
		$auHandle : $('.mute-unmute > .ui-slider-handle'),
	};
	
	var full = {
			
	};
	
	//remove the controls
	
	video.$video.removeAttr('controls');
	
	video.$video.on('loadedmetadata', function(){
		setTimeout(updateLoadProgress, 500);
		hoverControls();
	});
	
	video.$video.on("timeupdate", function(){
		currentTime();
	});
	
	video.$video.on("durationchange", function(){
		DurationTime();
	});
	
	video.$video.on("canplaythrough", function(){
		updateLoadProgress();
	});
	
	
	seekBar();
	
	
	function updateLoadProgress(){
		var currentBuffer = video.$videoObj.buffered.end(0);
		var maxduration = video.$videoObj.duration;
		var perc = 100 * currentBuffer / maxduration;
		video.$bufferBar.css('width',perc+'%');
			
		if(currentBuffer < maxduration) {
			setTimeout(updateLoadProgress, 500);
		}
	}
	
	function hoverControls(){
		videoContainers.$videoControls.show().css({'bottom': 0});
		videoContainers.$videoContainer
		.hover(function(){
			videoContainers.$videoControls.stop().animate({'bottom': 60}, 500);
		}, function(){
			videoContainers.$videoControls.stop().animate({'bottom': -60}, 1000);	
			
		});
	}
	
	function playpause(){
		if (video.$videoObj.paused || video.$videoObj.ended) {
			video.$videoObj.play();
			video.$playPause.text("Pause");
		} else {
			video.$videoObj.pause();
			video.$playPause.text("Play");	
		}
	}
	
	function videoPlayPause(){
		if (video.$videoObj.paused || video.$videoObj.ended) {
			video.$videoObj.play();
		} else {
			video.$videoObj.pause();
		}	
	}
	
	video.$playPause.click(playpause);
	video.$video.click(videoPlayPause);
	
	function currentTime(){
		video.$current.html(formatTime(video.$videoObj.currentTime));
	}
	
	function DurationTime(){
		video.$duration.html(formatTime(video.$videoObj.duration));
	}
	
	function formatTime(seconds) {
    		seconds = Math.round(seconds);
    		var minutes = Math.floor(seconds / 60);
    		// Remaining seconds
    		seconds = Math.floor(seconds % 60);
   	 		// Add leading Zeros
    		minutes = (minutes >= 10) ? minutes : "0" + minutes;
    		seconds = (seconds >= 10) ? seconds : "0" + seconds;
    		return minutes + ":" + seconds;
  	}
	
	//progress bar
	function seekBar(){
		
	video.$video.on({
        canplaythrough: function() {
            var vid = this;
			var $vidTimeBar = video.$timeBar;
           $vidTimeBar.slider({
                range: "min",
                min: 0,
                max: parseInt(vid.duration, 10),
                value: 0,
                slide: function (event, ui) {
                    vid.currentTime = ui.value;
                }
            });
        },
        timeupdate: function() {
			var $vidTimeBar = video.$timeBar;
            $vidTimeBar.slider('value', this.currentTime);
        },
		ended : function(){
			var vid = this;
			vid.currentTime = 0;	
		}
    });
}

//volume control

function volumeBar(){
	video.$audioSlider.slider({
		value : 1,
		orientation : "horizontal",
		range : 'max',
		max : 1,
		step : 0.02,
		animate : true,
		slide: function(e,ui){
			video.$videoObj.muted = false;
			video.$volumeSlide = ui.value;
			video.$videoObj.volume = ui.value;
			volumeIcons();
		}	
	});
} volumeBar();	
	
	function volumeIcons(){
		var value = video.$audioSlider.slider('value');
		var volume = video.$muteUnmute;
		
		if(value <= 5) { 
            /* volume.css('background-position', '0 0');*/
			volume.text("Unmute");
          } 
        else if (value <= 25) {
              /*volume.css('background-position', '0 -25px');*/
			 volume.text("Mute"); 
         } 
         else if (value <= 75) {
             /* volume.css('background-position', '0 -50px');*/
			volume.text("Mute"); 
         } 
          else {
              /*volume.css('background-position', '0 -75px');*/
			  volume.text("Mute"); 
          }
	}
	
	//mute and unmute buttons
	
	function muteVideo() {
		var SBVolume = video.$volumeSlide;
	  if (video.$videoObj.volume > 0) {
		  video.$videoObj.volume = 0;
		 video.$muteUnmute.text("Unmute");
		 video.$audioSlider.slider('value' , '0');
	  } else {
		  video.$videoObj.volume = 1;	
		 video.$muteUnmute.text("Mute");
		 video.$audioSlider.slider('value' , SBVolume);
	  }
	  return false;	
	}
	
	video.$muteUnmute.click(muteVideo);
	
	
		
});

