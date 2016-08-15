
var _userID = Cookies.get("_userId"),_token = Cookies.get("_password");
var _markers = [];
var map;

function doAjax(webService,_data,_function){

    var WebServiceURL = "http://proj.ruppin.ac.il/cegroup3/prod/IceWS.asmx";
    $.support.cors = true;
    $.ajax({
        url: WebServiceURL+'/'+webService,
        dataType: "json",
        type: "POST",
        data: _data,
        contentType: "application/json; charset=utf-8",
        error: function (err) {
            alert("error: " + err);
        },
        success: _function
    });

}

$(document).on("pagecreate","#branches",function(){
  //ValidateUser({_token: _token, _userID: _userID});
    doAjax("GetYepBranches", "", function(data) {
        var list = JSON.parse(data.d);
        //init map
        var long = list.Table[0].Longitude;
        var lat = list.Table[0].Latitude;
        var loc = new google.maps.LatLng(lat, long);
        var $branchesSelect = $('#select-branches');
        var myOptions = {
            zoom: 15,
            center: loc
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
        //add branches to select
        for (var i = 0 ; i < list.Table.length; i++) {
            $('<option>').val(list.Table[i].BranchName).text(list.Table[i].BranchName).attr({ Telephone:list.Table[i].Telephone,Manager:list.Table[i].Manager,Weekend: list.Table[i].Weekend, WeekendOpenHours: list.Table[i].WeekendOpenHours, MidWeekOpenHours: list.Table[i].MidWeekOpenHours, MidWeek: list.Table[i].MidWeek, Kosher: list.Table[i].Kosher, Address: list.Table[i].Address, BranchName: list.Table[i].BranchName, Latitude: list.Table[i].Latitude, Longitude: list.Table[i].Longitude }).appendTo($branchesSelect);
            //add markers to map
            _markers.push(new google.maps.Marker({
                position: new google.maps.LatLng( list.Table[i].Latitude,list.Table[i].Longitude),
                map: map,
                title: list.Table[i].Address
            }));
        }
        
        $branchesSelect.on('change', function () {
            var $selectedItem = $(this).find(":selected");
            map.setCenter(new google.maps.LatLng($selectedItem.attr('Latitude'), $selectedItem.attr('Longitude')));
            $('#txtSelectedBranche').text($selectedItem.attr("branchname") + ": ");
            $('#txtSelectedBranchName').text($selectedItem.attr("branchname"));
            $('#txtSelectedAddress').text($selectedItem.attr("address"));
            $("#iconSelectedKosher").text("");
            if ($selectedItem.attr("kosher").toLowerCase() == "true") {
                $('<span style="margin:0px;margin-left:5px;background-color:#66FF8F;" class="ui-btn ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext"></span>').appendTo($("#iconSelectedKosher"))
            }
            else {
                $('<span style="margin:0px;margin-left:5px;background-color:pink;" class="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext"></span>').appendTo($("#iconSelectedKosher"))
            }
            $("#txtMidWeek").text($selectedItem.attr('midweek')).addClass('color-text-gray');
            $('#txtMidWeekOpenHours').text($selectedItem.attr('midweekopenhours')).addClass('color-text-gray');
            $("#txtWeekend").text($selectedItem.attr('weekend')).addClass('color-text-gray');
            $('#txtWeekendOpenHours').text($selectedItem.attr('weekendopenhours')).addClass('color-text-gray');
            $('#txtManager').text($selectedItem.attr('manager')).addClass('color-text-gray');
            $('#txtTelephone').text($selectedItem.attr('telephone')).addClass('color-text-gray');
        });
        $branchesSelect.val($branchesSelect.children().first().attr('value')).change();
    }
 );
});

function initBranches(data){

	//var _data = JSON,parse(data);
}

$(document).one('pagebeforecreate', function () {
	var panel = buildMenu();
    $.mobile.pageContainer.prepend(panel);
    $("#menu").panel().enhanceWithin();

}); //this function is dynamiclly define the panel menu 

$(document).on("pageshow", "#index", function(event){
	sliderStart('#index'); // init slider
	$('#index' + ' .menuLink').attr('href','#menu'); // bind menu button
	setMenu("index"); // init menu
}); //init index page

$(document).on("pageshow", "#branches", function(event){
	sliderStart('#branches');// init slider
	$('#Branches' + ' .menuLink').attr('href','#menu');// bind menu button
	setMenu('branches'); // init menu


}); // init branches page


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
} // this function recive a pageId and init the menu by this page id.

function buildMenu(){		
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
}//this function return a menu as string


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
} // func recive page id and init its slider.


	