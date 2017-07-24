import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import $ from 'jquery';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

/** Menu **/
var menu = $('#menu');
menu.click(function(e){
	$('#mask').addClass('active');
	$('#menu-panel').toggleClass('active');
})

$('#mask').click(function(){
	if($(this).hasClass('none'));
	else {
		$('#menu-panel').removeClass('active');
		$('#mask').removeClass('active');
		if($('.modal').hasClass('active')) $('.modal').removeClass('active');
	}
})

/** Settings **/
var settings = $('#menu-settings');
settings.click(function(e){
	e.stopPropagation();
	$('#mask').removeClass('active');
	$('#menu-panel').toggleClass('active');
	$('#settings-panel').addClass('active');
})

$('#settings-close').click(function(){
	$('#settings-panel').removeClass('active');		
})

/** Subscribe **/
var subscribe = $('#menu-subscribe');
subscribe.click(function(e){
	// e.stopPropagation();
	if($(this).hasClass('fade') || $(this).hasClass('subscribed')) ;
	else {
		$('#menu-panel').toggleClass('active');
		$('#mask').removeClass('active');
		// $('#subscribe-modal').addClass('active');
		$('#toast').addClass('active');
		setTimeout(function(){
			$('#toast').removeClass('active');
		},3300);
	}
})

$('.modal .button').click(function(){
	$('#subscribe-modal').removeClass('active');
	$('#mask').removeClass('active');
});

$('#subscribe-ok').click(function(){
	$('#toast').addClass('active');
	setTimeout(function(){
		$('#toast').removeClass('active');
	},3300);
})

$(window).click(function(){
	$('.dropdown').removeClass('active');
})

$('#action-refresh').click(function(){
	// window.location.href = window.location.href;
})