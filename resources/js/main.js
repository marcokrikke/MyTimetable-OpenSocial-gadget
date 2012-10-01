function initgadget() {
	var prefs = new gadgets.Prefs();
	
	// default values
	var numItems = 5;
	
	// override from settings
	if (prefs.getInt("number-of-events") != undefined) {
		numItems = prefs.getInt("number-of-events");
	}
	
	$.subscribe("/oauth/authorize", function(e, approvalUrl) {
		// authorize the client
		oauthModule.authorize(approvalUrl);
	});
	
	$.subscribe("/oauth/authorized", function() {
		// we're now authorized, try to load data again
		timetableModule.loadTimetable(numItems);
	});
	
	$.subscribe("/error/message", function(e, message) {
		var msg = new gadgets.MiniMessage();
		msg.createDismissibleMessage(message);
	});
	
	$.subscribe("/timetable/loaded", function() {
		var events = timetableModule.getEvents();
		
		document.getElementById("loading").innerHTML = "";
		
		if (timetableModule.numberOfItems() == 0) {
			$('#noactivities').show();
		}
		else {
			for (var i = 0; i < timetableModule.numberOfItems(); i++) {
				var description = events[i].activityDescription;
				var startDate = new Date(events[i].startDate);
				var endDate = new Date(events[i].endDate);
				var locations = events[i].locations;
	
				var item = "<tr><td class='activity'><ul><li></li></ul><span>"
						+ description
						+ "</span></td><td class='date'>"
						+ startDate.getDate() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getFullYear()
						+ "</td><td class='time'>"
						+ startDate.getHours() + ":" + startDate.getMinutes()
						+ " - "
						+ endDate.getHours() + ":" + endDate.getMinutes()
						+ "</td><td class='location'>";
				
				if (locations.length == 1) {
					item += locations[0].name;
				}
				else if (locations.length > 1) {
					item += "<span class='multiple-locations'>Multiple locations</span><div class='all-items'><ul>";
					
					for (var j = 0; j < locations.length; j++) {
						item += "<li>" + locations[j].name + "</li>";
					}
					
					item += "</ul></div>";
				}
				
				item += "</td></tr>";
	
				document.getElementById("activities").innerHTML += item;
				$('#activities').show();
				
				// add tooltip to activities with multiple locations
				$(".multiple-locations").each(function() {
					$(this).qtip({
						content: $(this).parent().find('div.all-items').html(),
						show: 'mouseover',
						hide: 'mouseout',
						style: {
							border: {
								color: '#000',
								width: 1
							},
							name: 'light'
						},
						position: {
						      corner: {
						         target: 'leftBottom',
						         tooltip: 'bottomRight'
						      }
						   }
					});
				});
			}
		}

		gadgets.window.adjustHeight();
	});
	
	timetableModule.loadTimetable(numItems);
}