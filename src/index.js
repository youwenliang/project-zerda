import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import $ from 'jquery';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();


var url = $('input[name="url"]');
url.click(function() {
	url.select();
	$('.nav-button').addClass('move');
	$('#search').css('display', 'none');
	$('input').css('padding-left', '15px');
});

$('.nav-button:nth-child(4)').click(function() {
	$('.nav-button').removeClass('move');
	$('#search').css('display', 'flex');
	$('input').css('padding-left', '0px');
})

url.keyup(function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
    	console.log(url.val());
    	url.blur();
    }
});

var lastScrollTop = 0;
var scrollCount = 0;
var app = $('.App');
var nav = $('.nav');
app.scroll(function(){
	var st = $(window).pageYOffset || app.scrollTop();
	if(st > lastScrollTop) {
		scrollCount += (st-lastScrollTop);
		if(scrollCount > 80) nav.addClass('hidden');
	}
	else {
		nav.removeClass('hidden');
		scrollCount = 0;
	}
	lastScrollTop = st;
	
});

// document.getElementById('iframe').onload = function(){
// 	this.style.height = this.contentWindow.document.body.scrollHeight + 'px';
// }

// var getImageURL = function(url){
// 	$.ajax({
// 	    type: "GET",
// 	    url: 'http://api.page2images.com/restfullink?p2i_url='+url+'&p2i_key=68cae95553779311&p2i_device=2',
// 	    dataType: 'json',
// 	    error: function(){
// 	        alert('Unable to load feed, Incorrect path or invalid feed');
// 	    },
// 	    success: function(xml){
// 	    	console.log(xml);
// 	        var image_url = xml.image_url;
// 	        $('#website').attr('src', image_url);
// 	    }
// 	});
// };