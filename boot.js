(function ($) {
 
/**
* @function
* @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
* @param {function} handler A function to execute at the time when the element is inserted
* @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
* @example $(selector).waitUntilExists(function);
*/
 
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
			$('#watch7-main-container').waitUntilExists(function(){ 
				$('#watch7-main-container').prepend("<input id='comment_box' name='Comment box' type='text' placeholder='Type your comment here'/>");
				$('#watch7-main-container').prepend("<h1>PipSpeak Extension<h1>");
			}, true);
		}   
	}  
}, 500);	
})


