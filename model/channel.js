ACS.channel = function(id) { // String
	// private variables
	var isSelected = false;

	// private methods
	
	// public stuff
	var returnObj = {};
	
	returnObj.description = '';
	returnObj.events = ACS.eventManager();
	
	returnObj.getId = function() {
		return id;
	}
	
	returnObj.getIsSelected = function() {
		return isSelected;
	}
	
	returnObj.setIsSelected = function(newIsSelected) {
		isSelected = newIsSelected;
		if (isSelected) {
			returnObj.events.fireEvent('selectedEvent');
		} else {
			returnObj.events.fireEvent('deSelectedEvent');
		}		
	}	

	// constructor code
	
	
	return returnObj;
}