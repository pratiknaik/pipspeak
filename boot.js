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

// get video ID, initialize currentTime

var currentTime = 0, duration = 0;
url = window.location.href;
var videoID = url.substring(window.location.href.indexOf('watch?v=')+8);

var ext_id = 'akbppkonfpajpmnenablocifpbhckeoe';

// set up db

var db = openDatabase('pipdb', '1.0', 'PipSpeak database', 2 * 1024 * 1024);
var comments;

db.transaction(function (tx) {
	tx.executeSql('CREATE TABLE video (id, comment, time)')
});

db.transaction(function (tx) {
	tx.executeSql('SELECT * FROM video WHERE id LIKE ?', [videoID], function(tx, results) {
		var len = results.rows.length, i;
		// console.log('Found' + len + 'comments');
		comments = results;
	});
});

// flip an array

function transpose(a) {
	return Object.keys(a[0]).map(
    	function (c) { return a.map(function (r) { return r[c]; }); }
    );
}

// gets called when a user submits their comment

function addComment(message) {
	db.transaction(function (tx) {
		tx.executeSql('INSERT INTO video (id, comment, time) VALUES ("' + videoID + '","' + message + '",' + currentTime + ')');
	});
}

// formats comment

function returnTime(time) {
	var minutes = "0" + Math.floor(time / 60);
	var seconds = "0" + (time - minutes * 60);
	var writtenTime = minutes.substr(-2) + ":" + seconds.substr(-2);
	return writtenTime;
}

function parseComment(time, message) {	
	var postedMessage = message.replace('<<1>>', ' <img src="chrome-extension://' + ext_id + '/img/emote1.png" /> ');
	postedMessage = postedMessage.replace('<<2>>', ' <img src="chrome-extension://' + ext_id + '/img/emote2.png" /> ');
	postedMessage = postedMessage.replace('<<3>>', ' <img src="chrome-extension://' + ext_id + '/img/emote3.png" /> ');
	postedMessage = postedMessage.replace('<<4>>', ' <img src="chrome-extension://' + ext_id + '/img/emote4.png" /> ');
	postedMessage = postedMessage.replace('<<5>>', ' <img src="chrome-extension://' + ext_id + '/img/emote5.png" /> ');
	return "<code>" + returnTime(time) + "</code> " + postedMessage;
}

$(document).ready(function() {

	// get video duration

	var video = document.getElementsByTagName('video')[0];
	duration = video.duration;

	// checks for Enter... also emote stuff

	$("#watch7-content").on("keyup", '#pipspeak_comment_box', function (e) {
		// console.log('herp');
	    if (e.keyCode == 13) {
	    	// console.log('derp');
	        var data = $('#pipspeak_comment_box').val();
	        $('#pipspeak_comment_box').val('');
	        $("#pipspeak_comment").slideUp(function() {
	        	$("#pipspeak_comment").html(parseComment(currentTime, data));
        		$("#pipspeak_comment").slideDown();
	        });
	        addComment(data);
	    }
	});

	$("#watch7-content").on("click", "#pipspeak_emote1", function() {
		$("#pipspeak_comment").html(parseComment(currentTime, "<<1>>"));
	    addComment("<<1>>");
	});

	$("#watch7-content").on("click", "#pipspeak_emote2", function() {
		$("#pipspeak_comment").html(parseComment(currentTime, "<<2>>"));
	    addComment("<<2>>");
	});

	$("#watch7-content").on("click", "#pipspeak_emote3", function() {
		$("#pipspeak_comment").html(parseComment(currentTime, "<<3>>"));
	    addComment("<<3>>");
	});

	$("#watch7-content").on("click", "#pipspeak_emote4", function() {
		$("#pipspeak_comment").html(parseComment(currentTime, "<<4>>"));
	    addComment("<<4>>");
	});

	$("#watch7-content").on("click", "#pipspeak_emote5", function() {
		$("#pipspeak_comment").html(parseComment(currentTime, "<<5>>"));
	    addComment("<<5>>");
	});

	var url = false; 

	// inject our crap

	setInterval(function() {    
		if(window.location.href != url) {
			url = window.location.href;
			if(window.location.href.indexOf('watch?v=') > -1) {
				$('#watch7-content').waitUntilExists(function(){ 
					$('#watch7-content').prepend("<div id='pipspeak' class='yt-card yt-card-has-padding action-panel-content'></div>");
					var content = "";
					//youtube red #e52d27
					content += "<div id='pipspeak_comment'></div><br />";
					content += "<table><tr><td style='width: 100%; padding-top: 9px;'><input \
						id='pipspeak_comment_box' name='Comment box' type='text' placeholder='Type your comment here... press Enter to submit.'/></td>\n";
					content += "<td style='min-width: 190px;'><img id='pipspeak_emote1' src='chrome-extension://" + ext_id + "/img/emote1.png' /> \
						<img id='pipspeak_emote2' src='chrome-extension://" + ext_id + "/img/emote2.png' /> \
						<img id='pipspeak_emote3' src='chrome-extension://" + ext_id + "/img/emote3.png' /> \
						<img id='pipspeak_emote4' src='chrome-extension://" + ext_id + "/img/emote4.png' /> \
						<img id='pipspeak_emote5' src='chrome-extension://" + ext_id + "/img/emote5.png' /></td></tr></table>\n";
					content += "<br /><div id='pipspeak_graph' style='height: 150px; width: 100%;'></div>\n";
					$('#pipspeak').html(content);

					var numPoints = 100.0;
					var labels = [];
					var numLabels = [];
					var frequency = [];
					for(var l = 0; l < numPoints; l++) frequency[l] = 0; // prepopulate
					for(var i = 0; i < numPoints; i++) {
						numLabels[i] = Math.floor(i * duration / numPoints);
						labels[i] = returnTime(Math.floor(i * duration / numPoints));
						for (var j = 0; j < comments.rows.length; j++) {
							//console.log(comments.rows.item(j).time + " | " + numLabels[i]);
							if(i != 0) {
					    		if(comments.rows.item(j).time < numLabels[i] && comments.rows.item(j).time > numLabels[i - 1]) {
					    			frequency[i - 1]++;
					    		}
					    	}
					    	if(i == 19) {
					    		if(comments.rows.item(j).time > numLabels[i]) frequency[i]++;
					    	}
					    }
					}

					$('#pipspeak_graph').highcharts({
						credits: {
						    position: {
						        align: 'left',
						        verticalAlign: 'bottom',
						        x: 1000,
						        y: -1000
						    }
						},
				        chart: {
				            type: 'area',
				            marginTop: 5
				        },
				        legend: {
				        	enabled: false
				        },
				        title: {
				        	text: null
				        },
				        xAxis: {
				            labels: {
				                formatter: function () {
				                    return returnTime(this.value); // clean, unformatted number for year
				                }
				            }
				        },
				        yAxis: {
				            labels: {
				                formatter: function () {
				                    return this.value;
				                }
				            },
				            title: {
				            	enabled: false
				            }
				        },
				        colors: ['#e52d27'],
				        plotOptions: {
				            area: {
				                marker: {
				                    enabled: false,
				                    symbol: 'circle',
				                    radius: 1,
				                    states: {
				                        hover: {
				                            enabled: true
				                        }
				                    }
				                }
				            }
				        },
				        tooltip: {
				        	enabled: false
				        },
				        series: [{
				            data: transpose([numLabels, frequency])
				        }]
				    });
					// $("#pipspeak_graph").height('100px');
					// $("#pipspeak_graph").width('95%');
				}, true);
			}   
		}  
	}, 500);
});

// updates every second

setInterval(function() {

	// $("#pipspeak_graph").height('150px');
	// $("#pipspeak_graph").width('95%');

	//var ctx = document.getElementById("pipspeak_graph").getContext("2d");
	//ctx.canvas.width = '95%';
	//ctx.canvas.height = '200px';
	// https://github.com/borismus/keysocket/issues/63
    var video = document.getElementsByTagName('video')[0];
    currentTime = Math.floor(video.currentTime);
    for (var i = 0; i < comments.rows.length; i++) {
    	if(comments.rows.item(i).time == currentTime) {
			$('#pipspeak_comment').html(parseComment(currentTime, comments.rows.item(i).comment));
    	}
    }
}, 1000);