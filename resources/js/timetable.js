var timetableModule = (function($) {
	// contains all events
	var events = [];

	function loadTimetableData(entries) {	
		var now = new Date();
		var todayString = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();

		var	url = "http://demo.eveoh.nl/api/v0/timetable?startDate=" + todayString + "&limit=" + entries;
		var params = {};
		params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
		params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.OAUTH2;
		params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
		params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = "mytimetable_demo";
		params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = "0";
	
		gadgets.io.makeRequest(url, function(response) {
			if (response.oauthApprovalUrl) {
				// authorize client first
				$.publish("/oauth/authorize", response.oauthApprovalUrl);
			} else if (response.data) {
				events = response.data;
				
				$.publish("/timetable/loaded");
			} else {
				// something went wrong
				$.publish("/error/message", 'Error! Message: ' + response.oauthErrorExplanation);			
				
				console.log("ERROR");
				console.log("Error code: " + response.oauthError);
				console.log("Error URI: " + response.oauthErrorUri);
				console.log("Error description: " + response.oauthErrorText);
				console.log("Error explanation: " + response.oauthErrorExplanation);
				console.log("Error trace: " + response.oauthErrorTrace);
				
				$('#loading').hide();
				$('#waiting').hide();
				$('#approval').show();
			}
		}, params);
	}

	return {
		loadTimetable : function(entries) {
			loadTimetableData(entries);
		},
		
		numberOfItems : function() {
			return events.length;
		},

		getEvents : function() {
			return events;
		}
	}
}(jQuery));