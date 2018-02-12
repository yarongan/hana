$(window).load(function(){
	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
		};
	})();

	
	$('#search').keyup(function() {
		delay(function(){
		var $searchRows = $('.searchRow');
		var val = $.trim($('#search').val()).replace(/ +/g, ' ');
		if (val == "" ) {			
			$('.deleteSearch').hide();
			$('#shareSearch').hide();
			$('.hiddenRow').hide();
			$('.categoryRow').show();
		} else {			
			$('.deleteSearch').show();
			$('#shareSearch').show();
			$searchRows.show().filter(function() {
				var text = $(this).attr("searchText").replace(/\s+/g, ' ');

				return (!~text.indexOf(val));
				
			}).hide();
		}		
		}, 1000);
	});
	
	$('#deleteSearch').click(function() {
		$('#search').val('').keyup();
		$('#search').focusout();
		$('.hiddenRow').hide();
		$('.categoryRow').show();
		$('.deleteSearch').hide();
		if (location.search.length > 0){
			location.search = '';
		};
	});
	
	$('#shareSearch').click(function() {
		var searchTerm = $('#search').val();
		if (searchTerm.length > 0){
			searchTerm = "/?" + encodeURI(searchTerm);			
		} else {
			searchTerm = '';
		}
		
		location.href = 'https://api.whatsapp.com/send?text=http://www.hana.co.il' + searchTerm;

	});

	$('#search').val('').focus().keyup();
	
	createFooterTable();
	startTime();
	$("#table").delegate(".categoryRow", "click", function() {
		$(this).nextUntil(".categoryRow").toggle();
	});

	$( function() {
		carSymbolsDialog = $("#carSymbolsDiv").dialog();
		$("#carSymbolsDiv").parent()[0].style.zIndex="999";
		$(".ui-dialog-titlebar")[0].remove();
		$("#carSymbolsImg")[0].onclick = hideCarSymbolsDialog;
		carSymbolsDialog.hide();
		
		colorSymbolsDialog = $("#colorSymbolsDiv").dialog();
		$("#colorSymbolsDiv").parent()[0].style.zIndex="999";
		$(".ui-dialog-titlebar")[0].remove();
		$("#colorSymbolsImg")[0].onclick = hideColorSymbolsDialog;
		colorSymbolsDialog.hide();
	  } );

// Get the modal
//var adModal = document.getElementById('adModalId');

// Get the button that opens the modal
//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
//var span = document.getElementsByClassName("closeAd")[0];

// When the user clicks on the button, open the modal 
//btn.onclick = function() {
    //adModal.style.display = "block";
//}

// When the user clicks on <span> (x), close the modal
//span.onclick = function() {
//    adModal.style.display = "none";
//}

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//    if (event.target == adModal) {
 //       adModal.style.display = "none";
//    }
//}


	
});



function doOnOrientationChange(){
	var windowHeight = $(window).height();
	var searchHeight = windowHeight / 10;
	$('.searchDiv').height(searchHeight + 'px');
	document.getElementsByClassName("tableDiv")[0].style.top = searchHeight + 6 + "px";

};

function showCarSymbolsDialog(){
	$('#overlay')[0].style.display = "block";
	carSymbolsDialog.show();
};

function hideCarSymbolsDialog(){
	$('#overlay')[0].style.display = "none";
	carSymbolsDialog.hide();
};

function showColorSymbolsDialog(){
	$('#overlay')[0].style.display = "block";
	colorSymbolsDialog.show();
};

function hideColorSymbolsDialog(){
	$('#overlay')[0].style.display = "none";
	colorSymbolsDialog.hide();
};

function shareInWhatsapp(){
	location.href = 'https://api.whatsapp.com/send?text=http://www.hana.co.il';
};

function loadXMLDoc() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		prepareTables(xmlhttp);
		$('.hiddenRow').hide();
		$('.categoryRow').show();
		if (location.search.length > 0){
			$('#search').val(decodeURI(location.search.substring(1)));
		};		
    }
  };
  xmlhttp.open("GET", "xml/hana_v8.21.67s.xml", true);
  xmlhttp.send();

}

function prepareTables(xml) {
	
  var i;
  var xmlDoc = xml.responseXML;
  var categories = xmlDoc.getElementsByTagName("category");
  var charges = xmlDoc.getElementsByTagName("charge");
  
	for (n = 0; n < categories.length; n++){
		var categoryRow = table.insertRow();
		categoryRow.setAttribute("searchText", categories[n].childNodes[0].nodeValue);
		categoryRow.className = "categoryRow searchRow";		
		var categoryCell = categoryRow.insertCell();
		categoryCell.textContent = categories[n].childNodes[0].nodeValue;
		categoryCell.colSpan = 4;
		
		var charges = categories[n].getElementsByTagName("charge");
  
		for (i = 0; i < charges.length; i++) { 
			var searchText = charges[i].textContent;
			var nameRow = table.insertRow();			
			nameRow.setAttribute("searchText", searchText);
			nameRow.className = "nameRow searchRow hiddenRow";
			var nameCell = nameRow.insertCell();
			nameCell.colSpan = 4;
			nameCell.textContent = charges[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
			
			var descriptionRow = table.insertRow();	
			descriptionRow.setAttribute("searchText", searchText);
			descriptionRow.className = "descriptionRow searchRow hiddenRow";
			var descriptionCell = descriptionRow.insertCell();
			descriptionCell.colSpan = 4;
			descriptionCell.textContent = charges[i].getElementsByTagName("desc")[0].childNodes[0].nodeValue;

			if (charges[i].getElementsByTagName("comment").length > 0){
				if (charges[i].getElementsByTagName("comment")[0].childNodes[0].nodeValue != ""){					
					var commentRow = table.insertRow();
					commentRow.setAttribute("searchText", searchText);
					commentRow.className = "commentAbove commentRow searchRow hiddenRow";					
					var commentCell = commentRow.insertCell();
					commentCell.colSpan = 4;					
					commentCell.textContent =  "*" + charges[i].getElementsByTagName("comment")[0].childNodes[0].nodeValue;

				}
			} 		

			var bottomRow = table.insertRow();
			bottomRow.setAttribute("searchText", searchText);
			bottomRow.colSpan = 4;
			bottomRow.className = "bottomRow searchRow hiddenRow";
			
//			var pageCell = bottomRow.insertCell();
//			pageCell.className = "pageCell";
//			pageCell.textContent = charges[i].getElementsByTagName("page")[0].childNodes[0].nodeValue;

			var pointsCell = bottomRow.insertCell();
			pointsCell.className = "pointsCell";
			pointsCell.textContent = "ניקוד: " + charges[i].getElementsByTagName("points")[0].childNodes[0].nodeValue;

			var fineCell = bottomRow.insertCell();
			fineCell.className = "fineCell";
			fineCell.textContent = "קנס: " + charges[i].getElementsByTagName("fine")[0].childNodes[0].nodeValue;

			var sectionCell = bottomRow.insertCell();
			sectionCell.className = "sectionCell";
			sectionCell.textContent = "סעיף: " + charges[i].getElementsByTagName("section")[0].childNodes[0].nodeValue;			
			
		}
		
		
	}
		var row = table.insertRow();
		row.className = "lastRow";
		var lastCell = row.insertCell();
		lastCell.colSpan = 4;
};

function createFooterTable() {
		var footerTable = document.getElementById("footer");
		var row = footerTable.insertRow();
		row.className = "footerRow";

		// create whatsapp cell
		var whatsappCell = row.insertCell();
		whatsappCell.className = "whatsappCell";
		var whatsappDiv = document.createElement("div");
		whatsappDiv.className = "whatsappDiv";
		whatsappCell.appendChild(whatsappDiv);
		
		var whatsappSpan = document.createElement("span");
		whatsappSpan.className = "whatsappSpan";
		var whatsappLink = document.createElement("a");
		whatsappLink.href = "https://api.whatsapp.com/send?text=http://www.hana.co.il";
		whatsappSpan.appendChild(whatsappLink);		
		whatsappDiv.appendChild(whatsappSpan);
		
		var whatsappInnerSpan = document.createElement("span");
		whatsappInnerSpan.className = "whatsappIcon";
		whatsappSpan.appendChild(whatsappInnerSpan);
		whatsappCell.onclick=shareInWhatsapp;


		// create version cell
		var versionCell = row.insertCell();
		versionCell.className = "versionCell";
		var versionTextSpan = document.createElement("span");
		versionTextSpan.className = "versionTextSpan";
		versionTextSpan.innerHTML = ":גרסה" + "<br>" + "8.21.67";
		versionCell.appendChild(versionTextSpan);	

		// create disclaimer cell
		var disclaimerCell = row.insertCell();
		disclaimerCell.className = "disclaimerCell";
		var disclaimerTextSpan = document.createElement("span");
		disclaimerTextSpan.className = "disclaimerTextSpan";
		disclaimerTextSpan.innerHTML = "אתר זה אינו רשמי<br>רק המידע המופיע בחנ\"א המודפסת קובע";
		disclaimerCell.appendChild(disclaimerTextSpan);	

		// create colors cell
		var colorsCell = row.insertCell();
		colorsCell.className = "colorsCell";
		var colorsTextSpan = document.createElement("span");
		colorsTextSpan.className = "colorsTextSpan";
		colorsTextSpan.innerHTML = "סמלי צבעים";
		colorsCell.appendChild(colorsTextSpan);		
		colorsCell.onclick=showColorSymbolsDialog;

		
		// create cars cell
		var carsCell = row.insertCell();
		carsCell.className = "carsCell";
		var carsTextSpan = document.createElement("span");
		carsTextSpan.className = "carsTextSpan";
		carsTextSpan.innerHTML = "סמלי רכבים";
		carsCell.appendChild(carsTextSpan);		
		carsCell.onclick=showCarSymbolsDialog;	
		
		
		// create last date cell
		var lastDateCell = row.insertCell();
		lastDateCell.className = "lastDateCell";
		var lastTextSpan = document.createElement("span");
		lastTextSpan.className = "lastTextSpan";
		lastTextSpan.innerHTML = "אחרון" + "<br>" + ":לתשלום";
		lastDateCell.appendChild(lastTextSpan);		
		lastDateCell.appendChild(document.createElement("br"));
		var lastDateSpan = document.createElement("span");
		lastDateSpan.className = "lastDateSpan";		
		lastDateCell.appendChild(lastDateSpan);		

		// create today cell
		var todayCell = row.insertCell();
		todayCell.className = "todayCell";
		var timeSpan = document.createElement("span");
		timeSpan.className = "timeSpan";
		todayCell.appendChild(timeSpan);		
		todayCell.appendChild(document.createElement("br"));
		var daySpan = document.createElement("span");
		daySpan.className = "daySpan";
		todayCell.appendChild(daySpan);		
		todayCell.appendChild(document.createElement("br"));
		var dateSpan = document.createElement("span");
		dateSpan.className = "dateSpan";
		todayCell.appendChild(dateSpan);
		
		generateDate();
		generateLastDate();
		
};

function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	document.getElementsByClassName('timeSpan')[0].innerHTML =	h + ":" + m;
	var t = setTimeout(startTime, 20000);
}

function generateDate() {
	var today = new Date();
	var dayString;

	switch (today.getDay()){
		case 0:
		  dayString = "יום ראשון";
		  break;
		case 1:
		  dayString = "יום שני";
		  break;
		case 2:
		  dayString = "יום שלישי";
		  break;
		case 3:
		  dayString = "יום רביעי";
		  break;
		case 4:
		  dayString = "יום חמישי";
		  break;
		case 5:
		  dayString = "יום שישי";
		  break;
		case 6:
		  dayString = "יום שבת";
		  break;	
	}
	
	document.getElementsByClassName('daySpan')[0].innerHTML = dayString;
	
	var todayNumberString = today.getDate();
	var todayMonthString = parseInt(today.getMonth() + 1);
	var todayYearString = today.getFullYear();
	todayNumberString = checkTime(todayNumberString);
	todayMonthString = checkTime(todayMonthString);
	
	document.getElementsByClassName('dateSpan')[0].innerHTML = todayNumberString + "/" + todayMonthString + "/" + todayYearString;

}

function generateLastDate(){
	var lastDate = new Date();
	lastDate.setDate(lastDate.getDate() + 90);

	var lastDateNumberString = lastDate.getDate();
	var lastDateMonthString = parseInt(lastDate.getMonth() + 1);
	var lastDateYearString = lastDate.getFullYear();
	
	document.getElementsByClassName('lastDateSpan')[0].innerHTML = lastDateNumberString + "/" + lastDateMonthString + "/" + lastDateYearString;
}

function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}
