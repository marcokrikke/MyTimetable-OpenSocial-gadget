var oauthModule = (function($) {
	function authorizeClient(approvalUrl) {
		$('#approval').show();
		$('#loading').hide();
		
		var onPopupOpen = function() {
			$('#waiting').show();
			$('#approval').hide();
		};
		
		var onPopupClose = function() {
			// reload, now authenticated
			$('#waiting').hide();
			
			$.publish("/oauth/authorized");
		};
		
		var popup = new gadgets.oauth.Popup(approvalUrl, "height=420,width=680", onPopupOpen, onPopupClose);
		$('#personalize').click(popup.createOpenerOnClick());
		$('#approvaldone').click(popup.createApprovedOnClick());
	}
	
	return {
		authorize: function(approvalUrl) {
			authorizeClient(approvalUrl);
		}
	}
}(jQuery));