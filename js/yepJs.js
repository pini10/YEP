
var panel = buildMenu();
// var panel = '<div data-role="panel" id="mypanel" data-position="right" data-display="push" data-theme="a"><div data-role="header"><h1>Panel</h1></div>
// <ul data-role="listview" data-inset="true"><li><a>Listview</a></li></ul></div>';


$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#menu").panel().enhanceWithin();

});

$(document).on("pageshow", "#index", function(event){
	sliderStart('#index');
	$('#index' + ' .menuLink').attr('href','#menu');
	setMenu("index");
});

$(document).on("pageshow", "#branches", function(event){
	sliderStart('#branches');
	$('#Branches' + ' .menuLink').attr('href','#menu');
	setMenu('branches');
});



		

function setMenu(pageId){

		$("#menu li").each(function(){
		var link = $(this).find("a");
		var liId = $(this).attr('id');
		if(liId.toLowerCase() == pageId){
			$(this).attr('data-role','list-divider');
			link.attr('class','ui-btn');
		}
		else{
			 link.attr('href','#'+liId.toLowerCase());
			 $(this).removeAttr("data-role").removeAttr('class','');
			 link.attr('class','ui-btn ui-btn-icon-right ui-icon-carat-r');
		}

		$("#menuList").listview("refresh");
	});
}

function buildMenu(){		//this function returb the menu string
	//cheching vars
	var string = '';
	//prepering code
	string += '<div data-role="panel" id="menu" data-position="right" data-display="push" data-theme="a">'+
	'<ul data-role="listview" id="menuList" >'+
	'<li id="Index"><a>Home</a></li>'+
	'<li id="Branches"><a>Branches</a></li>'+
	'</ul>'+
	'</div>';

	return string;

}


function sliderStart(pageIdWithHash){
	var $thisPage = pageIdWithHash;
	$($thisPage + ' .mySlide > div:gt(0)').hide();

	setInterval(function(){
		var $firstDiv = $($thisPage+' .mySlide > div:first');
		$firstDiv.fadeOut(1000);
		$firstDiv.next().fadeIn(1000,function(){
			$firstDiv.appendTo( $thisPage +' .mySlide');	
		});
	},3000);
}


	