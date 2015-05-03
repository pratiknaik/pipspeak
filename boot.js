(function ($) {
 
/**
* @function
* @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
* @param {function} handler A function to execute at the time when the element is inserted
* @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
* @example $(selector).waitUntilExists(function);
*/
 
var currentTime = 0;
url = window.location.href;
var videoID = url.substring(window.location.href.indexOf('watch?v=')+8);
console.log(videoID);

$.fn.waitUntilExists	= function (handler, shouldRunHandlerOnce, isChild) {
	var found	= 'found';
	var $this	= $(this.selector);
	var $elements	= $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);
	
	if (!isChild)
	{
		(window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
			window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce, true); }, 500)
		;
	}
	else if (shouldRunHandlerOnce && $elements.length)
	{
		window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
	}
	
	return $this;
}
 
}(jQuery));

$(document).ready(function()
{
var url = false; 
setInterval(function()
{    
	if(window.location.href != url) {
		url = window.location.href;
		if(window.location.href.indexOf('watch?v=') > -1) {
			$('#watch7-content').waitUntilExists(function(){ 
				$('#watch7-content').prepend("<div id='pipspeak' class='yt-card yt-card-has-padding action-panel-content'></div>");
				var content = "";
				//youtube red #e52d27
				content += "<span id='pipspeak_comment'>0:18 | This is a comment on the video.</span><br /><br />";
				content += "<table><tr><td style='width: 100%; padding-top: 9px;'><input id='pipspeak_comment_box' name='Comment box' type='text' placeholder='Type your comment here'/></td>\n";
				content += "<td style='min-width: 180px;'><img id='pipspeak_emote1' src='chrome-extension://akbppkonfpajpmnenablocifpbhckeoe/img/emote1.png' /> \
					<img id='pipspeak_emote2' src='chrome-extension://akbppkonfpajpmnenablocifpbhckeoe/img/emote2.png' /> \
					<img id='pipspeak_emote3' src='chrome-extension://akbppkonfpajpmnenablocifpbhckeoe/img/emote3.png' /> \
					<img id='pipspeak_emote4' src='chrome-extension://akbppkonfpajpmnenablocifpbhckeoe/img/emote4.png' /> \
					<img id='pipspeak_emote5' src='chrome-extension://akbppkonfpajpmnenablocifpbhckeoe/img/emote5.png' /></td></tr></table>\n";
				$('#pipspeak').html(content);
			}, true);
		}   
	}  
}, 500);	
})

setInterval(function() {

	// https://github.com/borismus/keysocket/issues/63
    var video = document.getElementsByTagName('video')[0];
    currentTime = Math.floor(video.currentTime);
    console.log(currentTime);
}, 1000);