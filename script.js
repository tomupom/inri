var _cufonRefresh = false;

$(function(){

	// ------------------------- global -------------------------

	if($("nav#global a img").length > 0){
		$("nav#global a img").each(function(index, item){
			var item_ = $(item);
			item_.addClass("not-active");

			var item_active = item_.clone();
			item_active.attr("src", item_active.attr("src").replace(".png", "_active.png"));
			item_active.addClass("active");
			item_.before(item_active);
			item_active.hide();
		});
		$("nav#global a").hover(function(){
			$(this).children(".not-active").fadeOut(100);
			$(this).children(".active").fadeIn(100);
		},function(){
			$(this).children(".not-active").fadeIn(100);
			$(this).children(".active").fadeOut(100);
		});
	}

	// bio
	if($("#biography").length > 0){
		initBiographyPage();
	}
	
	// links
	if($('#links').length > 0){
		Cufon.replace($('#links ul li'), {hover: true});
		Cufon.now();
	}
	// contact
	if($("#contact").length > 0){
		//Cufon.replace($('article h2, article p'), {hover: true});
		//Cufon.now();
	}
	// works
	if($("#works").length > 0){
		Cufon.replace($('nav#worklist'), {hover: true});
		Cufon.now();
		initSlideshow("#workimages img");
		
		if($.browser.msie){
			setDeselected($("#worklist a"));
			$("#worklist a").hover(function(){
				setSelected($(this));
			}, function(){
				setDeselected($(this));
			});
		}else{
			$("#worklist a").fadeTo(100, 0.4);
			$("#worklist a").hover(function(){
				$(this).fadeTo(100, 1.0);
			}, function(){
				$(this).fadeTo(100, 0.4);
			});
		}
	}
	// publication
	if($("#publications").length > 0){
		Cufon.replace($('nav#publist li'));
		if($('article').length > 0){
			Cufon.replace($('article'), {hover:true});
		}
		Cufon.now();
		initPublicationPage();
	}
	onWindowResize();
	$(window).resize(onWindowResize);
	
	$(".content").hide();
	$(".content").fadeIn();
	
	if($.browser.msie){
		setTimeout(cufonRefresh, 100);
	}

  
});

function cufonRefresh(){
	if(_cufonRefresh){
		Cufon.refresh();
		_cufonRefresh = false;
		//alert("refresh!");
	}
	
	setTimeout(cufonRefresh, 100);
}

// ------------------- publications navigation ------------------- //
var menuTimer;
var showCounter;
var showTimer;

function initPublicationPage(){
	initPublicationNav();
	if($("#pubphotolist").length > 0){
		$("#pubphotolist li a").hide();
		$("#pubphotolist li a").hover(function(){
			$(this).fadeTo(100, 1.0);
		}, function(){
			$(this).fadeTo(100, 0.7);
		});
		$("#pubphotolist ul").each(function(index, item){
			$(item).attr("id", "ul_"+index);
		});
		showCounter = 0;
		showTimer = setTimeout(showPhoto, 200);
	}
	if($("#photo img").length > 0){
		initSlideshow("#photo img");
	}
}
function showPhoto(){
	$("#pubphotolist ul").each(function(index, item){
		var selector = "#ul_"+index+" li a";
		if(showCounter >= index && $(selector).length > (showCounter-index)){
			$($(selector)[showCounter-index]).fadeTo(500, 0.7);
		}
	});
	if(showCounter < 10){
		showCounter++;
		showTimer = setTimeout(showPhoto, 200);
	}
}
function initPublicationNav(){
	$('#pub-menu a').click(function(){
		return false;
	});

	$(".submenu").hide();
	$(".submenu").css("position", "absolute");

	if($.browser.msie){
		// ----------------- IE8 ------------------------
		setDeselected($(".submenu li a"));

		$(".submenu li a").hover(function(){
			var self = this;
			$(".submenu li a").each(function(index, item){
				if(item == self){
					setSelected(item);
				}else{
					setDeselected(item);
				}
			});
		}, function(){
			$(".submenu li a").each(function(index, item){
				setDeselected(item);
			});
		});
	}else{
		// ----------------- others of IE8 ------------------------
		$(".submenu li a").fadeTo(100, 0.4);
		$(".submenu li a").hover(function(){
			var self = this;
			$(".submenu li a").each(function(index, item){
				if(item == self){
					$(item).fadeTo(100, 1.0);
				}else{
					$(item).fadeTo(100, 0.4);
				}
			});
		}, function(){
			$(".submenu li a").fadeTo(100, 0.4);
		});
	}
		
	
	$("nav#publist").mouseout(onNavMouseOut);
	$("nav#publist").mouseover(onNaviMouseOver);
	if($.browser.msie){
		setDeselected($("#pub-menu li a"));
	}else{
		$("#pub-menu li a").fadeTo(100, 0.4);
	}
	
	restoreNav();
	
	$("#pub-menu li a").mouseover(function(){
		changeSubmenu(this.hash);
	});
}

function onNavMouseOut(){
	if(menuTimer == null){
		menuTimer = setTimeout(restoreNav, 1000);
	}
}
function onNaviMouseOver(){
	if(menuTimer != null){
		clearTimeout(menuTimer);
		menuTimer = null;
	}
}
function changeSubmenu(hash){
	if(hash.indexOf("#") >= 0){
		hash = hash.substring(hash.indexOf("#")+1);
	}

	if($.browser.msie){
		$("#pub-menu li a").each(function(index, item){
			if(item.hash == "#"+hash){
				setSelected(item);
			}else {
				setDeselected(item);
			}
		});
		$('.submenu[id!="'+hash+'"]').hide();
		$(".submenu#"+hash).show();
	}else{
		$("#pub-menu li a").each(function(index, item){
			if(item.hash == "#"+hash){
				$(item).fadeTo(100, 1.0);
			}else{
				$(item).fadeTo(100, 0.4);
			}
		});
		$('.submenu[id!="'+hash+'"]').fadeOut("fast");
		$(".submenu#"+hash).fadeIn("fast");
	}
}
function restoreNav(){
	if($('#pub-menu li a.selected').length == 0){
		return;
	}
	var hash = $('#pub-menu li a.selected').attr("hash");
	changeSubmenu(hash);
}


// ------------------- slide show for works, publications ------------------- //

var currentIndex = 0;

var images = new Array();
var slideTimer;

function initSlideshow(target){
	images = $(target);
	images.css("position","absolute");
	images.hide();
	if(images.length > 1){
		changeSlide();
		images.each(function(index, item){
			$(item).click(changeSlide);
		});
	}else{
		images.fadeIn(2000);
	}
}
function changeSlide(){
	var target = $(images[currentIndex]);
	target.css("zIndex", 10);
	target.fadeIn(2000, slideshowAfterFadeIn);
}
function slideshowAfterFadeIn(){
	clearTimeout(slideTimer);
	var target = $(images[currentIndex]);
	images.each(function(index, item){
		if(index != currentIndex){
			$(images[index]).hide()
		}
	});
	target.css("zIndex", 0);
	slideTimer = setTimeout(changeSlide, 5000);
	currentIndex++;
	if(currentIndex > images.length-1){
		currentIndex = 0;
	}
}



// ------------------- common ------------------- //

function onWindowResize(){

/*	var windowWidth = window.innerWidth;
	if($.browser.msie){
		windowWidth = document.documentElement.clientWidth;
	}
	var documentWidth = document.body.scrollWidth;

	if(documentWidth < windowWidth){
		$("#wrap").css("marginLeft", (-490+(windowWidth-documentWidth)/2)+"px");
	}else{
		$("#wrap").css("marginLeft", "-490px");
	}
	
	var documentHeight = $(".content").outerHeight()+$("header").outerHeight();
	var windowHeight = window.innerHeight;
	if($.browser.msie){
		windowHeight = document.documentElement.clientHeight;
	}

	if(documentHeight > windowHeight){
		$("footer").css("top", (documentHeight-45)+"px");
	}else{
		$("footer").css("top", (windowHeight-45)+"px");
	}*/

	var windowWidth = $(document).width();
	var windowHeight = $(document).height();
	
	if(document.all){
	  windowWidth =  document.body.clientWidth;
	  windowHeight =  document.body.clientHeight;
	}else if(document.layers || document.getElementById){
	  windowWidth = innerWidth;
	  windowHeight = innerHeight;
	}

	var documentHeight = $(".content").outerHeight()+$("header").outerHeight();

	if(documentHeight > windowHeight-90){
		$("footer").css("top", (documentHeight+40)+"px");
	}else{
		$("footer").css("top", (windowHeight-45)+"px");
	}


	var documentWidth = document.body.scrollWidth;

	if(documentWidth < windowWidth){
		$("#wrap").css("marginLeft", (-490+(windowWidth-documentWidth)/2)+"px");
	}else{
		$("#wrap").css("marginLeft", "-490px");
	}	
}

// ------------------- Biography ------------------- //

var biographyPage = {};
biographyPage.sectionTopPositions = [];

biographyPage.cursorUp = null;
biographyPage.cursorDown = null;

function initBiographyPage(){
	biographyPage.cursorUp = $("a#counter_cursor_up");
	biographyPage.cursorDown = $("a#counter_cursor_down");
	
	$("header").css("position", "fixed");
	
	$("nav#chrono ul li a, a#counter_cursor_up, a#counter_cursor_down").click(function(){
		var hash = this.hash;
		if(hash.length > 2 && $(hash).length > 0){
			var targetOffset = $(hash).offset().top - 210;
			$("html,body").animate({scrollTop: targetOffset}, 500, 'swing', function(){
				//document.location.hash = hash;
				//alert(hash);
				//alert($(hash).offset().top);
			});
		}
		return false;
	});

	$("section").each(function(index, item){
		var offset = $(item).offset().top;
		biographyPage.sectionTopPositions[index] = offset;
	});

	biographyPage.cursorUp.css("cursor", "pointer");
	biographyPage.cursorDown.css("cursor", "pointer");
	deactivateCursor(biographyPage.cursorUp);
	deactivateCursor(biographyPage.cursorDown);
	onBioScrolled();
	//$(document).scroll(onBioScrolled);
	setTimeout(onBioScrolled, 30);
}

function onBioScrolled(){
	var scrollTop = $(document).scrollTop();
	var index = -1;
	
	for(var i=0; i<biographyPage.sectionTopPositions.length; i++){
		if(scrollTop+290 < biographyPage.sectionTopPositions[i]){
			index = i;
			break;
		}
	}

	if(index < 0){
		index = biographyPage.sectionTopPositions.length;
	}

	if(index > 1){
		activateCursor(biographyPage.cursorUp);
		biographyPage.cursorUp.attr("href", $("nav#chrono a")[index-2].hash);
	}else{
		deactivateCursor(biographyPage.cursorUp);
	}
	
   var documentHeight = $(".content").outerHeight()+$("header").outerHeight();
	var windowHeight = window.innerHeight;
	if($.browser.msie){
		windowHeight = document.documentElement.clientHeight;
	}
	
   if(index < biographyPage.sectionTopPositions.length && documentHeight > scrollTop+windowHeight+100 ){
		activateCursor(biographyPage.cursorDown);
		biographyPage.cursorDown.attr("href", $("nav#chrono a")[index].hash);
	}else{
		deactivateCursor(biographyPage.cursorDown);
	}

	var offset = index*-100+120;
	if(offset > 20){
		offset = 20;
	}
	$("aside").css("backgroundPosition","0px "+offset+"px");
	setTimeout(onBioScrolled, 30);
}

function activateCursor(cursor){
	if(cursor.css("cursor") == "default"){
		cursor.fadeTo(100, 0.4);
		cursor.mouseover(function(){
			$(this).fadeTo(100, 1);
		});
		cursor.mouseout(function(){
			$(this).fadeTo(100, 0.4);
		});
		cursor.css("cursor", "pointer");
	}
}
function deactivateCursor(cursor){
	if(cursor.css("cursor") == "pointer"){
		cursor.attr("href", "#");
		cursor.fadeTo(100, 0.1);
		cursor.unbind("mouseover");
		cursor.unbind("mouseout");
		cursor.css("cursor", "default");
	}
}


function setSelected(item){
	if(! $(item).hasClass("selected_")){
		$(item).addClass("selected_");
		$(item).css("color", "#000000");
		_cufonRefresh = true;
	}
	if($(item).hasClass("deselected_")){
		$(item).removeClass("deselected_");
		_cufonRefresh = true;
	}
}
function setDeselected(item){
	if(! $(item).hasClass("deselected_")){
		$(item).addClass("deselected_");
		$(item).css("color", "#646464");
		_cufonRefresh = true;
	}
	if($(item).hasClass("selected_")){
		$(item).removeClass("selected_");
		_cufonRefresh = true;
	}
}
