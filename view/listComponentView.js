/*
 * AsTeRICS - Assistive Technology Rapid Integration and Construction Set (http://www.asterics.org)
 * 
 * 
 * Y88b                     d88P      888               d8888  .d8888b.   .d8888b. 
 *  Y88b                   d88P       888              d88888 d88P  Y88b d88P  Y88b
 *   Y88b                 d88P        888             d88P888 888    888 Y88b.
 *    Y88b     d888b     d88P .d88b.  8888888b.      d88P 888 888         "Y888b.  
 *     Y88b   d88888b   d88P d8P  Y8b 888   Y88b    d88P  888 888            "Y88b.
 *      Y88b d88P Y88b d88P  88888888 888    888   d88P   888 888    888       "888
 *       Y88888P   Y88888P   Y8b.     888   d88P  d8888888888 Y88b  d88P Y88b  d88P
 *        Y888P     Y888P     "Y8888  8888888P"  d88P     888  "Y8888P"   "Y8888P"
 * 
 * Copyright 2015 Kompetenznetzwerk KI-I (http://ki-i.at)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
 ACS.listComponentView = function(	containerId, // String
									mainList, // DOM Element
									component, // ACS.component
									model) { // ACS.model
								
// ***********************************************************************************************************************
// ************************************************** private variables **************************************************
// ***********************************************************************************************************************
	var $listElem = $(document.createElement('li'));
	var $subList = $(document.createElement('ul'));

// ***********************************************************************************************************************
// ************************************************** private methods ****************************************************
// ***********************************************************************************************************************
	var getIncomingDataChannel = function(inPort) {
		for (var i = 0; i < model.dataChannelList.length; i++) {
			if (model.dataChannelList[i].getInputPort() === inPort) return model.dataChannelList[i];
		}
		return null;
	}	
	
	var getDataChannels = function(outPort) {
		var channelList = [];
		for (var i = 0; i < model.dataChannelList.length; i++) {
			if (model.dataChannelList[i].getOutputPort() === outPort) channelList.push(model.dataChannelList[i]);
		}
		return channelList;
	}
	
	var channelExists = function(inPort) {
		for (var i = 0; i < model.dataChannelList.length; i++) {
			if (model.dataChannelList[i].getInputPort() === inPort) return true;
		}
		return false;
	}

	var eventChannelAlreadyExists = function(startComp, endComp) {
		for (var i = 0; i < model.eventChannelList.length; i++) {
			if ((model.eventChannelList[i].startComponent === startComp) && (model.eventChannelList[i].endComponent === endComp)) return true;
		}
		return false;
	}
	
	var listEntryOutgoingDataConnection = function(dataCh) {
		var $le = $(document.createElement('li'));
		$le.attr('id', containerId + '_' + dataCh.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
		$le.attr('tabindex', '0');
		$le.append('port ');
		var $btn = $(document.createElement('button'));
		$btn.attr('type', 'button');
		$btn.text(dataCh.getInputPort().getId());
		$btn.click(function(iPort) {
			return function(evt) {$('#' + containerId + '_' + iPort.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + iPort.getParentComponent().getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
		}(dataCh.getInputPort()));
		$le.append($btn);
		$le.append(' at ');
		$btn = $(document.createElement('button'));
		$btn.attr('type', 'button');
		$btn.text(dataCh.getInputPort().getParentComponent().getId());
		$btn.click(function(iPort) {
			return function(evt) {$('#' + containerId + '_' + iPort.getParentComponent().getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
		}(dataCh.getInputPort()));
		$le.append($btn);
		$le.focus(function() {
			model.deSelectAll();
			model.addItemToSelection(dataCh);			
		});
		return $le;
	}		

	var addIncomingDataConnection = function($div, inChannel) {
		$div.text(' connected to port ');
		var $btn = $(document.createElement('button'));
		$btn.attr('type', 'button');
		$btn.text(inChannel.getOutputPort().getId());
		$btn.click(function(oPort) {
			return function(evt) {$('#' + containerId + '_' + oPort.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + oPort.getParentComponent().getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
		}(inChannel.getOutputPort()));
		$div.append($btn);
		$div.append(' at ');
		$btn = $(document.createElement('button'));
		$btn.attr('type', 'button');
		$btn.text(inChannel.getOutputPort().getParentComponent().getId());
		$btn.click(function(oPort) {
			return function() {$('#' + containerId + '_' + oPort.getParentComponent().getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
		}(inChannel.getOutputPort()));
		// make channel focusable and select channel on focus
		$div.attr('tabindex', '0');
		$div.addClass('additionalFocusableElement');
		$div.focus(function() {
			model.deSelectAll();
			model.addItemToSelection(inChannel);			
		});
		$div.append($btn);
	}

	var generatePortList = function(id, portList) {
		var $list = $(document.createElement('ul'));
		$list.attr('id', id + 'List');
		for (var i = 0; i < portList.length; i++) {
			var $li = $(document.createElement('li'));
			$li.attr('id', containerId + '_' + portList[i].getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
			$li.attr('tabindex', '0');
			$li.focus(function() {
				model.deSelectAll();
				model.addItemToSelection(component);
			});
			$list.append($li);
			$li.text(portList[i].getId());
			var $div = $(document.createElement('div'));
			$div.attr('id', containerId + '_' + portList[i].getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
			var $btn = $(document.createElement('button'));
			$btn.attr('type', 'button');
			$li.append($div);
			$li.append($btn);
			// add already existing connections (i.e. channels)
			if (portList[i].getType() === ACS.portType.INPUT) {
				var inChannel = getIncomingDataChannel(portList[i]);
				if (inChannel) addIncomingDataConnection($div, inChannel);
				$btn.text('Connect datachannel here');
				$btn.addClass(containerId + '_dataInPortBtn');
				$btn.click(function(port) {
					return function() {
						if (!channelExists(port)) {
							model.dataChannelList[model.dataChannelList.length - 1].setInputPort(port);
						} else {
							$('#' + containerId + '_actionInfo').text('Cannot connect to this port, since it already has a connection. Please complete the channel by using the "connect here"-button at a matching input port.');
							$('#' + containerId + '_actionInfo').append(ACS.listView.makeCancelButton(model));
							$('#' + containerId + '_actionInfo').focus();
						}
					}
				}(portList[i]));
				$btn.attr('disabled', '');
			} else {
				var dataChannels = getDataChannels(portList[i]);
				if (dataChannels.length > 0) {
					$div.text(' connected to');
					var $ul = $(document.createElement('ul'));
					$div.append($ul);
					for (var j = 0; j < dataChannels.length; j++) {
						$ul.append(listEntryOutgoingDataConnection(dataChannels[j]));
					}
				}
				$btn.text('Start new datachannel');
				$btn.addClass(containerId + '_dataOutPortBtn');
				$btn.click(function(port) {
					return function() {
						var ch = ACS.dataChannel(port.getId() + 'AT' + port.getParentComponent().getId(), port, null);
						var addAct = ACS.addDataChannelAction(model, ch);
						addAct.execute();
					}
				}(portList[i]));
			}
			
		}
		$('#' + id).append($list);
		$('#' + id).focus(function() {
			model.deSelectAll();
			model.addItemToSelection(component);
		});	
	}
	
	var listEntryEventConnection = function(channel, incomingEventConnection) {
		var $li = $(document.createElement('li'));
		$li.attr('id', containerId + '_' + channel.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
		$li.attr('tabindex', '0');
		$li.focus(function(evtChannel) {
			return function() {
				model.deSelectAll();
				model.addItemToSelection(evtChannel);
			};
		}(channel));
		// create button that links to other end of eventChannel
		var linkToCompId;
		if (incomingEventConnection) {
			linkToCompId = channel.startComponent.getId();
		} else {
			linkToCompId = channel.endComponent.getId();
		}
		var $btn = $(document.createElement('button'));
		$btn.attr('type', 'button');
		$btn.text(linkToCompId);
		$btn.click(function(compId) {
			return function() {$('#' + containerId + '_' + compId.replace(/\s+/g, '').replace(/\.+/g, '')).focus();};
		}(linkToCompId));
		$li.append($btn);
		$li.focus(function() {
			model.deSelectAll();
			model.addItemToSelection(channel);
		});		
		return $li;
	}
	
	var addEventConnections = function($div, incomingEventConnection) {
		var $list = null;
		for (var i = 0; i < model.eventChannelList.length; i++) {
			var tmpComp;
			if (incomingEventConnection) {
				tmpComp = model.eventChannelList[i].endComponent;
			} else {
				tmpComp = model.eventChannelList[i].startComponent;
			}
			if (tmpComp === component) {
				if (!$list) {
					$div.text(' connected to');
					$list = $(document.createElement('ul'));
					$div.append($list);
				}
				$list.append(listEntryEventConnection(model.eventChannelList[i], incomingEventConnection));
			}
		}
	}
	
// ***********************************************************************************************************************
// ************************************************** public stuff *******************************************************
// ***********************************************************************************************************************
	var returnObj = {};

	returnObj.getComponent = function() {
		return component;
	}	
	
	returnObj.destroy = function() {
		$listElem.remove();
	}
	
	returnObj.focusComponent = function() {
		$('#' + containerId + '_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();
	}
	
	returnObj.focusOutgoingEventConnection = function(evtCh) {
		$('#' + containerId + '_' + evtCh.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();
	}
	
	returnObj.focusOutgoingDataChannel = function(dataCh) {	
		$('#' + containerId + '_' + dataCh.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '')).focus();
	}
	
	returnObj.addOutgoingDataChannel = function(dataCh) {
		var $outPortDiv = $('#' + containerId + '_' + dataCh.getOutputPort().getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		var $list = $outPortDiv.find('ul');
		if ($list.length === 0) {
			$outPortDiv.text(' connected to');
			$list = $(document.createElement('ul'));
			$outPortDiv.append($list);
		}
		$list.append(listEntryOutgoingDataConnection(dataCh));
	}
	
	returnObj.removeOutgoingDataChannel = function(dataCh) {
		// remove the list entry 
		$le = $('#' + containerId + '_' + dataCh.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
		if ($le.length > 0) $le.remove();
		// check if there are any connections left from this port - if no, remove sublist
		var $outPortDiv = $('#' + containerId + '_' + dataCh.getOutputPort().getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		var $list = $outPortDiv.find('ul');
		if (($list.length > 0) && ($list.children().length === 0)) { // remove list in case it is emtpy; also remove words "connected to", since there is no connection anymore
			$list.remove();
			$outPortDiv.text('');
		}
	}

	returnObj.addIncomingDataChannel = function(dataCh) {
		var $inPortDiv = $('#' + containerId + '_' + dataCh.getInputPort().getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		addIncomingDataConnection($inPortDiv, dataCh);
	}
	
	returnObj.removeIncomingDataChannel = function(dataCh) {
		var $inPortDiv = $('#' + containerId + '_' + dataCh.getInputPort().getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		$inPortDiv.text('');
		$inPortDiv.unbind();
		$inPortDiv.removeAttr('tabindex');
		$inPortDiv.removeClass('additionalFocusableElement');
	}

	returnObj.addOutgoingEventChannel = function(eventCh) {
		var $outPortDiv = $('#' + containerId + '_eventOutput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		var $list = $outPortDiv.find('ul');
		if ($list.length === 0) {
			$outPortDiv.text(' connected to');
			$list = $(document.createElement('ul'));
			$outPortDiv.append($list);
		}
		$list.append(listEntryEventConnection(eventCh, false));
	}

	returnObj.addIncomingEventChannel = function(eventCh) {
		var $inPortDiv = $('#' + containerId + '_eventInput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		var $list = $inPortDiv.find('ul');
		if ($list.length === 0) {
			$inPortDiv.text(' connected to');
			$list = $(document.createElement('ul'));
			$inPortDiv.append($list);
		}
		$list.append(listEntryEventConnection(eventCh, true));
	}
	
	returnObj.removeOutgoingEventChannel = function(eventCh) {
		// remove the list entry 
		$le = $('#' + containerId + '_' + eventCh.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
		if ($le.length > 0) $le.remove();
		// check if there are any connections left from this port - if no, remove sublist
		var $outPortDiv = $('#' + containerId + '_eventOutput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		var $list = $outPortDiv.find('ul');
		if (($list.length > 0) && ($list.children().length === 0)) { // remove list in case it is emtpy; also remove words "connected to", since there is no connection anymore
			$list.remove();
			$outPortDiv.text('');
		}
	}

	returnObj.removeIncomingEventChannel = function(eventCh) {
		// remove the list entry 
		$le = $('#' + containerId + '_' + eventCh.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
		if ($le.length > 0) $le.remove();
		// check if there are any connections left to this port - if no, remove sublist
		var $inPortDiv = $('#' + containerId + '_eventInput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		var $list = $inPortDiv.find('ul');
		if (($list.length > 0) && ($list.children().length === 0)) { // remove list in case it is emtpy; also remove words "connected to", since there is no connection anymore
			$list.remove();
			$inPortDiv.text('');
		}
	}

// ***********************************************************************************************************************
// ************************************************** constructor code ***************************************************
// ***********************************************************************************************************************
	$listElem.attr('tabindex', '0');
	$listElem.attr('id', containerId + '_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''));
	$listElem.text(component.getId());
	$subList.addClass('componentSublist');
	$listElem.append($subList);
	$listElem.focus(function() {
		model.deSelectAll();
		model.addItemToSelection(component);
	});	
	$(mainList).append($listElem);
	
	if (component.inputPortList.length > 0) {
		$subList.append('<li id="' + containerId + '_inputPorts_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '" tabindex="0">Input Ports:</li>');
		generatePortList(containerId + '_inputPorts_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''), component.inputPortList);
	}
	if (component.outputPortList.length > 0) {
		$subList.append('<li id="' + containerId + '_outputPorts_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '" tabindex="0">Output Ports:</li>');
		generatePortList(containerId + '_outputPorts_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, ''), component.outputPortList);
	}
	if (component.listenEventList.length > 0) {
		$subList.append('<li id="' + containerId + '_eventInput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '" tabindex="0">Event input port</li>');
		var $div = $(document.createElement('div'));
		$div.attr('id', containerId + '_eventInput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		var $btn = $(document.createElement('button'));
		$btn.attr('type', 'button');
		$btn.text('Connect eventchannel here');
		$btn.addClass(containerId + '_eventInPortBtn');
		$btn.click(function() {
			if (!eventChannelAlreadyExists(model.eventChannelList[model.eventChannelList.length - 1].startComponent, component)) {
				model.eventChannelList[model.eventChannelList.length - 1].setId(model.eventChannelList[model.eventChannelList.length - 1].getId() + component.getId()); // this ID involves start- and end-component - therefore it must be finalised here, on completion of channel
				model.eventChannelList[model.eventChannelList.length - 1].endComponent = component;
				model.eventChannelList[model.eventChannelList.length - 1].events.fireEvent('eventChannelCompletedEvent');
			} else {
				$('#' + containerId + '_actionInfo').text('The eventchannel you intend to create already exists. Please complete the channel by using the "connect here"-button at a matching input port or cancel the action.');
				$('#' + containerId + '_actionInfo').append(ACS.listView.makeCancelButton(model));
				$('#' + containerId + '_actionInfo').focus();
			}
		});
		$btn.attr('disabled', '');	
		$('#' + containerId + '_eventInput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '')).append($div);
		$('#' + containerId + '_eventInput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '')).append($btn);
		addEventConnections($div, true);
	}
	if (component.triggerEventList.length > 0) {
		$subList.append('<li id="' + containerId + '_eventOutput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '" tabindex="0">Event output port</li>');
		var $div = $(document.createElement('div'));
		$div.attr('id', containerId + '_eventOutput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '') + '_connections');
		var $btn = $(document.createElement('button'));
		$btn.attr('type', 'button');
		$btn.text('Start new eventchannel');
		$btn.addClass(containerId + '_eventOutPortBtn');
		$btn.click(function() {
			var ch = ACS.eventChannel(component.getId() + '_TO_'); // second half of ID is added, when channel is completed
			ch.startComponent = component;
			var addAct = ACS.addEventChannelAction(model, ch);
			addAct.execute();			
		});
		$('#' + containerId + '_eventOutput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '')).append($div);
		$('#' + containerId + '_eventOutput_AT_' + component.getId().replace(/\s+/g, '').replace(/\.+/g, '')).append($btn);
		addEventConnections($div, false);
	}

	return returnObj;
}