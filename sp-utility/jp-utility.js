
var SP_site = window.location.protocol+'//'+document.location.hostname; // gets only the current Site
//var SP_siteURL = _spPageContextInfo.webAbsoluteUrl; // the new one thats compatible with IE11
// if undefined then use old method again
if (SP_siteURL==undefined) {SP_siteURL = window.location.protocol+'//'+document.location.hostname+L_Menu_BaseUrl;}
var SP_UserID  = _spPageContextInfo.userId;//_spUserId;
// URL for creating a new Document Library
var SP_newDocLibURL = SP_siteURL+"/_layouts/new.aspx?FeatureId={00bfea71-e717-4e80-aa17-d0c71b360101}&ListTemplate=101";
var SP_createURL = SP_siteURL+"/_layouts/create.aspx";
var SP_templateGallery = SP_siteURL+"/_catalogs/lt/Forms/AllItems.aspx";
var SP_createSiteTemplateURL = SP_siteURL+"_layouts/savetmpl.aspx";

// force page to edit mode : ?ToolPaneView=2&pagemode=edit

// Browser Detection
var isBrowserOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isBrowserFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isBrowserSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
var isBrowserChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isBrowserIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

// Check SharePoint Version
var isSP2013 = (_spPageContextInfo.webUIVersion == 15);
var isSP2010 = (_spPageContextInfo.webUIVersion == 4);

// Configures DataTable...
var DT_searching = false;
var DT_paging = false;

// requires SPServices to be included
var SP_Usertitle = $().SPServices.SPGetCurrentUser({
	fieldName: "Title",
	debug: false
	});
// This is the Domain Login Name from Active Directory
// requires SPServices to be included
var SP_Username = $().SPServices.SPGetCurrentUser({
	fieldName: "Name",
	debug: false
	});
//---------------------------------------------------------------------------------------------//
// Will return the complete internal Sharepoint userid/name of the current logged in user
// requires SPServices to be included
function getSPCurrentUser() {
	return SP_UserID+";#"+SP_Usertitle;
}
//---------------------------------------------------------------------------------------------//
// Gets SharePoint data
// Parameter cquery is optional.
// NOTE : this version can be used on a List or Page, courtesy of Jose
//        Be advised for referencing files :
//         On List : '../../'
//         On Page : '../'
function getDataItems(list, listcolumns, ascending, cquery){
	var ascend = 'TRUE';
	var listName = list;
	var siteURL = window.location.protocol+'//'+document.location.hostname+L_Menu_BaseUrl;
	//var siteURL = 'http://'+document.location.hostname+L_Menu_BaseUrl;
	//var siteURL = '../';
	//if (onForm==true) {siteURL = '../../';} // set if only being called from a SharePoint Form
	var list = getList(siteURL, listName);
	if (ascending==false) {ascend='FALSE';}
	var qry = "<OrderBy><FieldRef Name='ID' Ascending='"+ascend+"' /></OrderBy>";
	if (arguments.length==4) {qry = cquery;}  // use custom query if last argument is used
	var columns = listcolumns;//["ID","Title"];
	var listItems = getListItems(list, qry, columns);

	return listItems;
}
//---------------------------------------------------------------------------------------------//
// Gets SharePoint data on separate Site
// Parameter cquery is optional.
function getDataItemsOnSeparateSite(list, siteURL, listcolumns, ascending, cquery){
	var ascend = 'TRUE';
	var listName = list;
	var list = getList(siteURL, listName);
	if (ascending==false) {ascend='FALSE';}
	var qry = "<OrderBy><FieldRef Name='ID' Ascending='"+ascend+"' /></OrderBy>";
	if (arguments.length==5) {qry = cquery;}  // use custom query if last argument is used
	var columns = listcolumns;//["ID","Title"];
	var listItems = getListItems(list, qry, columns);

	return listItems;
}

//---------------------------------------------------------------------------------------------//
// Gets data from a SharePoint List from a Range (mainly used for auto-tagging purposes)
// NOTE : may have to mess with this because of :
//      Created By : "Author"
//      Modified By : "Editor"
// Also note that "Editor" seems to work with Documents instead of List.
function getDataItemsInRange(list, onForm, lastIdInList, listcolumns){
	var listName = list;
	var columns = ["ID","Editor"];
	var siteURL = '../';
	if (onForm==true) {siteURL = '../../';} // set if only being called from a SharePoint Form
	var list = getList(siteURL, listName);
	var qry = "<Where><Gt><FieldRef Name='ID' /><Value Type='Integer'>"+lastIdInList+"</Value></Gt></Where>";
	if (arguments.length==4) {columns = listcolumns;}  // use custom query if last argument is used
	var listItems = getListItems(list, qry, columns);

	return listItems;
}
//---------------------------------------------------------------------------------------------//
// Sets a List from an external site for editing.
// NOTE : User has to be logged into BOTH sites for this to work.
// Example : list = "JobPostings"
//           path = "https://ttcishare.com/sites/recruiting/"
function setExternalListforEdit(list, path) {
	var listName = list;
	var siteURL = path;
	var list = getList(siteURL, listName);

	return list;
}
//---------------------------------------------------------------------------------------------//
// Sets a List for Editing using jPoint
// Example : var list = setListforEdit("Master List", false )
//           list.updateItem([{ID:idofItemtoUpdate, Column1:column1Value, Column2:column2Value }]);
function setListforEdit(list, onForm ) {
	var listName = list
	var siteURL = '../'
	if (onForm==true) {siteURL = '../../';} // set if only being called from a SharePoint Form
	var list = getList(siteURL, listName);

	return list;
}
//---------------------------------------------------------------------------------------------//
// Gets the ID of the last record item on a SharePoint List (mainly used for auto-tagging purposes)
// Note : If the value returned is *NOT* the correct value, make sure the Document Library's view is set to "Show all items without folders".
//        This is due to jPoint not working well with folders, as there should *NOT* be any folders in the doc library.
function getLastIDinList(list, onForm, listColumns) {
	var listName = list;
	var siteURL = '../';
	if (onForm==true) {siteURL = '../../';} // set if only being called from a SharePoint Form
	var list = getList(siteURL, listName);
	var qry = "<OrderBy><FieldRef Name='ID' Ascending='FALSE' /></OrderBy>";
	var columns = ["ID","Editor"];
	if (arguments.length==3) {columns = listColumns;} // use custom columns if added to argument
	var listItems = getListItems(list, qry, columns);
	var lastIdInList = listItems[0]["ID"];

	return lastIdInList;
}
//---------------------------------------------------------------------------------------------//
// Gets the querystring value
function gup( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

//---------------------------------------------------------------------------------------------//
// internal jPoint code
function getList (siteURL, listName){
    return jP.Lists.setSPObject(siteURL, listName);
}
//---------------------------------------------------------------------------------------------//
// internal jPoint code
function getListItems(list, qry, fieldarray){
	var myResults = list.getSPItemsWithQuery(qry);
	var listItems = myResults.getItemsFieldData(fieldarray);

	return listItems;
}
//---------------------------------------------------------------------------------------------//
// internal jPoint code
// IBM's old way of doing it...doesn't work with chrome so it sucks
function getListItems_old(list, qry, fieldarray){
	switch (arguments.length){
		case 2:
			var myResults = list.getSPItemsWithQuery(qry)
			if(myResults.total == 0)
				return ""
			else
				return myResults.Items;
			break;
		case 3:
			var myResults = list.getSPItemsWithQuery(qry)
			if(myResults.total == null || myResults.total == 0)
				return ""
			else
				return myResults.getItemsFieldData(fieldarray);
				break;
		default:
			return list.getSPItemsWithQuery("<OrderBy><FieldRef Name='ID' Ascending='TRUE' /></OrderBy>").Items;
	}
}

//---------------------------------------------------------------------------------------------//
// internal jPoint code
function getListResults(list, listViewFields, qry, columns) {
    list.ViewFields = listViewFields;
    var listItems = getListItems(list,qry,columns)
    return listItems
}
//---------------------------------------------------------------------------------------------//
function isNull(what){return what==null}
//---------------------------------------------------------------------------------------------//
function isUndefined(what, returnStr) {
	if (what!==undefined && what!="") { return what; } else {return returnStr;}
}
//---------------------------------------------------------------------------------------------//
function include(filename)
{
	var head = document.getElementsByTagName('head')[0];
	script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';
	head.appendChild(script)
}
//---------------------------------------------------------------------------------------------//
// Returns the URL for the version history of the ItemID
// NOTE : requires versioning turned on for that particular List or Document Library
//        trimmed is optional and doesn't include the site url (good for building dialogues)
function getVersionHistoryURL(listName, itemID, trimmed){
	var thisURL = SP_siteURL+"/_layouts/versions.aspx?list="+GetListId(listName)+"&ID=" + itemID;
	if (trimmed) thisURL = "../_layouts/versions.aspx?list="+GetListId(listName)+"&ID=" + itemID;

	return thisURL;
}
//---------------------------------------------------------------------------------------------//
// Returns the name of the list on the *List View Page*
function getCurrentListName() {
	var listname = $(".s4-titletext h2 a:first").html(); //requires JQuery to get list name from ribbon breadcrumb
	//if (isSP2013) listname = $(".die a:first").html(); // for SP 2013
	if (isSP2013) listname = $("#pageTitle").html(); // for SP 2013

  // if all that above didn't work due to messed up sites like HHS...then get it from the URL..
  // kinda elaborate...just to get the List Name... such a pain.
	if (listname==undefined) {
		var siteURL = decodeURIComponent(window.location.href); // removes all that URL junk
		var listName = siteURL.split(SP_siteURL)[1].split('/'); // multi-splittin
		if (listName[1]=="Lists") {listname=listName[2]} else {listname=listName[1]} //checks for either List or Doc Library
	}
	return listname;
}
//---------------------------------------------------------------------------------------------//
// Removes a user based on ID to SharePoint UserGroup
// NOTE : Requires spjs-utility.js AND SPServices to be loaded
function removeUserFromGroup(userID, userGroup){
    var userInfo = getUserInfo_v2(userID); // gets User Active Directory Data since SPServices requires it for adding to groups.
										   // userInfo.Name is the SharePoint AD Login Name
    $().SPServices({
         operation: "RemoveUserFromGroup",
                    groupName: group,
                    userLoginName: userInfo,
                    async: false,
                    completefunc: null

    });
}
//---------------------------------------------------------------------------------------------//
// Adds a user based on ID to SharePoint UserGroup
// NOTE : **Requires spjs-utility.js** AND SPServices to be loaded
function addUserToGroup(userID, userGroup){
	var userInfo = getUserInfo_v2(userID); // gets User Active Directory Data since SPServices requires it for adding to groups.
										   // userInfo.Name is the SharePoint AD Login Name
	$().SPServices({
		operation: "AddUserToGroup",
		groupName: userGroup,
		userLoginName: userInfo.Name,
		completefunc: function(data,status){
		   //...
		}
	});
}
//---------------------------------------------------------------------------------------------//
// Checks to see what Sharepoint Group the current logged in user is in
// Require SPServices to be included
function inSPGroup(usergroup){
	var trueorfalse = false;
	// check if in SharePoint User Group
    $().SPServices({
        operation: "GetGroupCollectionFromUser",
        userLoginName: $().SPServices.SPGetCurrentUser(),
        async: false,
        completefunc: function (xData, Status) {
            if ($(xData.responseXML).find("Group[Name='"+usergroup+"']").length == 1) {
                //alert('in '+usergroup);
                trueorfalse = true;
            }
            else{
            	//alert('not in '+usergroup);
                trueorfalse = false;
            }
        }
    });

    return trueorfalse;
}
//---------------------------------------------------------------------------------------------//
// Gets a list of all Users in the Active Directory
// Call getAllUsers() first, then array value will be stored in the variable SPUser. Yes weird....
// example usage : SPUser[7].label = gets the username
//               : SPUser[7].value = gets the userid
// Require SPServices to be included
var SPUser;
function getAllUsers() {
	$().SPServices({
		operation: "GetUserCollectionFromSite",
		async: false,
		completefunc: function (xData) {
			var users = [];
			$(xData.responseXML).find('User').each(function () {
				var item = {},
					o = $(this);
				item.value = o.attr('ID');
				item.label = o.attr('Name');
				item.email = o.attr('Email');
				users.push(item);
			});
			SPUser = users;
		}
	});
}
//---------------------------------------------------------------------------------------------//
// Gets a list of all the Groups the current user is assigned to
// Require SPServices to be included
function getAllGroupsfromCurrentUser() {
	var mygroups;
	$().SPServices({
		operation: "GetGroupCollectionFromUser",
		userLoginName: $().SPServices.SPGetCurrentUser(),
		async: false,
		completefunc: function(xData, Status) {
			var groups = [];
			$(xData.responseXML).find("Group").each(function() {
					//alert($(this).attr('Name'));
					groups.push($(this).attr('Name'));
			});
			mygroups = groups;
		}
	});
	return mygroups;
}
//---------------------------------------------------------------------------------------------//
// Gets a Username by ID
// Require SPServices to be included
function getUserbyID(userid){
	getAllUsers();
	var username = "";
	for (var x=0;x<SPUser.length;x++) {
		if (String(userid)==String(SPUser[x].value)) {username=SPUser[x].label;}
	}
	return username;
}
//---------------------------------------------------------------------------------------------//
// Gets a User Email by ID
// Require SPServices to be included
function getUserEmailbyID(userid){
	getAllUsers(); // This has to be called again for some odd reason...its causes another call to the server but...
	var userEmail = "";
	for (x=1;x<SPUser.length;x++) {
		if (String(userid)==String(SPUser[x].value)) {userEmail=SPUser[x].email;}
	}
	return userEmail;
}
//---------------------------------------------------------------------------------------------//
// Returns the ID or GUID of a SharePoint List
// Can also be used to check if List exists or Not
// Note : requires SPServices to be loaded
function GetListId(listName) {
	var id = "";
	$().SPServices({
		operation: "GetList",
		listName: listName,
		async: false,
		completefunc: function (xData, Status) {
			id = $(xData.responseXML).find("List").attr("ID");
		}
	});
	return id;
}
//-----------------------------------------------------------------------------------------//
// Returns the ID or GUID of a SharePoint View
// Note : requires SPServices to be loaded
function GetViewId(listName, viewName){
    var guid;
    var filter = "View[DisplayName='"+ viewName +"']";
    $().SPServices({
        operation: "GetViewCollection",
        async: false,
        listName: listName,
        completefunc:function (xData, Status) {
            guid = $(xData.responseXML).find(filter).attr("Name");
        }
    });
    return guid;
}
//-----------------------------------------------------------------------------------------//
// Copies a file or document from Source Location to Destination Location
// NOTE : requires SPServices
function copyFile(fileName, srcLOC, destLOC){
	//var srcURL=SP_siteURL+'/'+removeDashes(docLibName)+'/ie_logo.png';
	//var destURL=SP_siteURL+'/'+removeDashes(docLibName)+'/ie_logo2.png';
	var srcURL = srcLOC+"/"+fileName;
	var destURL = destLOC+"/"+fileName;
	$().SPServices({
	  operation: "GetItem",
	  Url: srcURL,
	  completefunc: function (xData, Status) {
		var itemstream = $(xData.responseXML).find("Stream").text();
		var itemfields = [];
		$(xData.responseXML).find("FieldInformation").each(function(){
		  itemfields.push($(this).get(0).xml);
		});

		$().SPServices({
		  operation: "CopyIntoItems",
		  SourceUrl: srcURL,
		  DestinationUrls: [ destURL ],
		  Stream: itemstream,
		  Fields:itemfields,
		  completefunc: function (xData, Status) {

		  }
		})
	  }
	});
}
//-----------------------------------------------------------------------------------------//
// Deletes a folder inside the specified Document Library
// Note : Any files stored inside the folder WILL ALSO be deleted
function deleteFolder(docLib, folderName) {
    var clientContext;
    var oWebsite;
    var folderUrl;
    var results;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();

    clientContext.load(oWebsite);
    clientContext.executeQueryAsync(function () {
        folderUrl = oWebsite.get_serverRelativeUrl() + "/"+docLib+"/"+folderName;
        this.folderToDelete = oWebsite.getFolderByServerRelativeUrl(folderUrl);
        this.folderToDelete.deleteObject();

        clientContext.executeQueryAsync(
            Function.createDelegate(this, successHandler),
            Function.createDelegate(this, errorHandler)
        );
    }, errorHandler);

    function successHandler() { results = "success"; }
    function errorHandler() { results = "Request failed: " + arguments[1].get_message();}
	console.log(results);
}
//-----------------------------------------------------------------------------------------//
// Creates a folder inside the specified document library
function createFolder(docLibName, folderName) {
	$SP().createFolder({
	  path:folderName,
	  library:docLibName,
	  url:SP_siteURL+"/"
	});
}
//---------------------------------------------------------------------------------------------//
// Creates Upload Dialogue
// Note : docFolder is optional, only if documents needs to be uploaded directly to a folder
function buildCustomUpload(DocLibName, returnsource, multiple, docFolder ) {
//	var exppath = "/amcg/opscon/Contract Files";
//	var docListID = "377be1e9-1d3f-4ee8-a0a6-63a82fc166df";
	var exppath = L_Menu_BaseUrl+"/"+removeDashes(DocLibName);
	var docListID = GetListId(DocLibName);
	var subFolder = "";
	var mupload = "0";
	if (multiple==true) {mupload="1";} // set for multiple uploads
	if (arguments.length==4) {subFolder = "/"+docFolder;}
	SP.UI.ModalDialog.showModalDialog({
	//url: ctx.listUrlDir + "/Forms/Upload.aspx?MultipleUpload=1" + ((exppath != null && exppath.length > 2) ? '&RootFolder=' + exppath : ''),
	url: "../_layouts/Upload.aspx?MultipleUpload="+mupload+"&List=" + docListID + ((exppath != null && exppath.length > 2) ? '&RootFolder=' + exppath+subFolder : ''),
	title: "Upload a document",
	dialogReturnValueCallback: function() {
		//window.location = window.location.href;
		window.location = returnsource;
	}
});
}
//--------------------------------------------------------------------------------------------//
// Creates a SharePoint dialogue popup from a SharePoint form
// d_width is optional
function buildCustomDialog(exppath, returnsource, dialogTitle, d_width) {
//var exppath = "../Lists/DGR/NewForm.aspx";
var dwidth=620;  // default width of the dialogue
if (arguments.length==4) { dwidth = d_width;}
var tmpPath = exppath.toLowerCase();
if (tmpPath.indexOf("editform")>-1) {  // check for editform so that it can have a return added to the path
	if (isSP2013) { // check for SharePoint 2013
		SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', {
			url: exppath+"&source="+returnsource,
			width : dwidth,
			title: dialogTitle,
			dialogReturnValueCallback: function() {window.location = returnsource;}
		});
		} else {
			SP.UI.ModalDialog.showModalDialog({
				url: exppath+"&source="+returnsource, // added it here...
				width : dwidth,
				title: dialogTitle,
				dialogReturnValueCallback: function() {window.location = returnsource;}
			});
		}
}
else {  // newforms can NOT have a return source....................................................
		if (isSP2013) { // check for SharePoint 2013
		SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', {
			width : dwidth,
			url: exppath,
			title: dialogTitle,
			dialogReturnValueCallback: function() {window.location = returnsource;}
		});
		} else {
			SP.UI.ModalDialog.showModalDialog({
				//url: ctx.listUrlDir + "/Forms/Upload.aspx?MultipleUpload=1" + ((exppath != null && exppath.length > 2) ? '&RootFolder=' + exppath : ''),
				width : dwidth,
				url: exppath,
				title: dialogTitle,
				dialogReturnValueCallback: function() {
					//window.location = window.location.href;
					window.location = returnsource;
				}
			});
		}
	}
}

function _buildCustomDialog(exppath, returnsource, dialogTitle ) {
//var exppath = "../Lists/DGR/NewForm.aspx";
var tmpPath = exppath.toLowerCase();
if (tmpPath.indexOf("editform")>-1) {  // check for editform so that it can have a return added to the path
		SP.UI.ModalDialog.showModalDialog({
			url: exppath+"&source="+returnsource, // added it here...
			title: dialogTitle,
			dialogReturnValueCallback: function() {
				window.location = returnsource;
			}
		});
	} else {  // newforms can NOT have a return source
		SP.UI.ModalDialog.showModalDialog({
			//url: ctx.listUrlDir + "/Forms/Upload.aspx?MultipleUpload=1" + ((exppath != null && exppath.length > 2) ? '&RootFolder=' + exppath : ''),
			url: exppath,
			title: dialogTitle,
			dialogReturnValueCallback: function() {
				//window.location = window.location.href;
				window.location = returnsource;
			}
		});
	}
}

function buildCustomDialog_old(exppath, returnsource, dialogTitle ) {
//var exppath = "../Lists/DGR/NewForm.aspx";
SP.UI.ModalDialog.showModalDialog({
	//url: ctx.listUrlDir + "/Forms/Upload.aspx?MultipleUpload=1" + ((exppath != null && exppath.length > 2) ? '&RootFolder=' + exppath : ''),
	url: exppath,
	title: dialogTitle,
	dialogReturnValueCallback: function() {
		//window.location = window.location.href;
		window.location = returnsource;
	}
});
}

//-------------------------------------------------------------------------------------------//
// Gets the string or ID from SharePoint Lookup Value
function SP_GetStr(str) {
	if (str!==undefined) {
		str = str.split(';#');
		return str[1];
	} else return "";
}

function SP_GetID(str) {
	if (str!==undefined) {
		str = str.split(';#');
		return str[0];
	} else return "";
}
//------------------------------------------------------------------------------------------//
// Gets the Yes/No value in those SharePoint Yes/No columns
function SP_GetYesNo(vals){
	var yesno = "No";
	if (vals=="1") yesno = "Yes";
	return yesno;
}
//------------------------------------------------------------------------------------------//
// Prevents that annoying 'undefined' issues
function checkUndefined(str) {
	var newstr = "";
	if (str!==undefined) {newstr=str;}
	return newstr;
}
//------------------------------------------------------------------------------------------//
// Returns the ID value of the current SharePoint user logged in (just an internal way of doing it)
function getUserID() {
	return _spUserId;
}
//------------------------------------------------------------------------------------------//
// Returns the domain and current SharePoint site
function getCurrentDomainSite() {
	return document.domain+L_Menu_BaseUrl;
}
//------------------------------------------------------------------------------------------//
// Fixes SharePoint's crappy date string and returns a more cleaner one
// Return Format : MM/DD/YYYY
function SPdateCorrect(oldString) {
	if (oldString!=undefined) {
		var result = oldString.split(" ")[0];
		result = result.split("-");
		return Math.floor(result[1]) + "/" + result[2] + "/" + result[0] ;
	}
	else
	return "n/a";
}
//-----------------------------------------------------------------------------------------//
// Gets today's date returned in this format : YYYY-MM-DD
// note : may want to pass this through the SPdateCorrect() function
function getTodayDate(){
    var d = new Date();
    var mzero = "";
    var dzero = "";
    if ((d.getMonth()+1)<10) {mzero = "0";}  // Adds zero if single digit since SharePoint uses the YYYY-MM-DD format
    if ((d.getDate()+1)<10) {dzero = "0";}
    var todayDate = d.getFullYear()+"-"+mzero+(d.getMonth()+1)+"-"+dzero+d.getDate();

    return todayDate;
}
//-----------------------------------------------------------------------------------------//
// Gets the Julian Date
// example : var today = new Date();
//           today = getJulianDate(today);
function getJulianDate(todayDate) {
   return Math.floor((todayDate / 86400000) - (todayDate.getTimezoneOffset()/1440) + 2440587.5);
}
//-----------------------------------------------------------------------------------------//
// Gets the Julian Day (returns value from 1 - 365 based on day of the year)
// example : var today = new Date();
//           today = getJulianDay(today);
// can even use : getJulianDay("12/31/2015") to get value of 365
function getJulianDay(thisDate, padded) {
	var now = new Date(thisDate);
	var start = new Date(now.getFullYear(), 0, 0);
	var diff = now - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);

	// Adds the "0" padding to single digit numbers
	if (padded) {
		if (day<10) day="0"+day;
	}
  return day;
}
//-----------------------------------------------------------------------------------------//
// Returns the last 2 digit of the year. Not really sure if this is even "Julian" but whatever..
function getJulianYear(thisDate) {
	var now = new Date(thisDate);
	// get last two digits of year.
	var year = now.getFullYear().toString().substr(2,2);

  return year;
}
//-----------------------------------------------------------------------------------------//
// Adds days to Date. Returns value back in SP format : mm/dd/yyyy
function addDaysToDate(dateVal, numDays ) {
    var date = new Date(dateVal);
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() + numDays);
    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var y = newdate.getFullYear();

    var someFormattedDate = mm + '/' + dd + '/' + y;
    return someFormattedDate;
}
//-----------------------------------------------------------------------------------------//
// Get the difference in Days between 2 SP Dates (date1-date2)
function daysDifference(date1, date2){
	var _date1 = new Date(date1);
	var _date2 = new Date(date2);
	var timeDiff = (_date2.getTime() - _date1.getTime());
	var daysDiff = (timeDiff / (1000 * 3600 * 24));
	return daysDiff;
}
//-----------------------------------------------------------------------------------------//
// Allows for auto filter selection in a listbox
// Example : $('#select').filterByText($('#textbox'), true);
// Should also disable multiple select from the listbox also before calling this function :
//      $('select').removeAttr('multiple');
//		$("select").attr("size", 5);    //sets a size to it
// Note : requires jQuery to included
jQuery.fn.filterByText = function(textbox, selectSingleMatch) {
  return this.each(function() {
    var select = this;
    var options = [];
    $(select).find('option').each(function() {
      options.push({value: $(this).val(), text: $(this).text()});
    });
    $(select).data('options', options);
    $(textbox).bind('change keyup', function() {
      var options = $(select).empty().scrollTop(0).data('options');
      var search = $.trim($(this).val());
      var regex = new RegExp(search,'gi');

      $.each(options, function(i) {
        var option = options[i];
        if(option.text.match(regex) !== null) {
          $(select).append(
             $('<option>').text(option.text).val(option.value)
          );
        }
      });
      if (selectSingleMatch === true &&
          $(select).children().length === 1) {
        $(select).children().get(0).selected = true;
      }
    });
  });
};
//-----------------------------------------------------------------------------------------//
// Check if value is in an array or not
function inArray(arr, obj) {
    for(var i=0; i<arr.length; i++) {
		if (arr[i] == obj) return true;
	}
}
//-----------------------------------------------------------------------------------------//
// Another way of doing it.
// Usage : if (!(stateCode in in_Array(['NH','VT','RI','MA','NJ','CT','DE','MD']))) { /* do something */}
function in_Array(a){
	var o = {};
		for(var i=0;i<a.length;i++){
		o[a[i]]='';
		}
	return o;
}
//-----------------------------------------------------------------------------------------//
// Combines two arrays together
// Usage : var stateClickList = new Array();
//         var stateList = ["Delaware", "District of Columbia", "Kansas"];
//	       stateClickList = addToArray(stateClickList, stateList);
function addToArray(masterArray, arrayToAdd) {
	for(var i=0; i<arrayToAdd.length; i++){
		masterArray.push(arrayToAdd[i])
	}
	return masterArray;
}
//-----------------------------------------------------------------------------------------//
// Returns the ID of a webpart on a SharePoint page.
// webPartTitle : Actual text name of the webpart
function getWebPartId(webPartTitle) {
    var spanWithTitle = $("h3.ms-WPTitle:contains(" + webPartTitle + ")");
    if (spanWithTitle != null) {
        return "#" + $(spanWithTitle).parent().parent().parent().parent().parent().parent().parent().parent().parent().attr('id');
    }
    return null;
}
//-----------------------------------------------------------------------------------------//
// Returns the ID the SharePoint form element (such as drop down, textbox..etc).
// Values for elementType : input - for textboxess
//	 						select - for drop down list or list boxes
// Note : can also check for events too
// 	$("select[title$='MenuGroup']").change(function() { // fires event onChange selection from drop down list
//		//code...
//	});
// Also change attributes like save button :
//  $("input[value$='Save']").attr('value', "Submit");
//
// Another cool trick to replace text from a Class element :
// $(".ms-cui-ctl-largelabel").text(function () {
//    return $(this).text().replace("Save", "Submit");
// });
//
// And finally....here we can auto populate fields on a Form!!!!! Yippy skippy!!!!!
// NOTE : For SharePoint 2013, you may have to put this in a jQuery Document.Ready wrapper (yeah this was a bitch...)
// $( document ).ready(function() {
//    console.log( "ready!" );
// });
//
// 	$("select[title$='JobID']").val(sessionStorage.JobID); // auto populate drop download list
//	$("input[Title='SiteSource']").val(sessionStorage.siteSource);  // auto populate text box
//
// Check for field change in form (using jquery)
// var taskorderID = "#ctl00_m_g_3a8c2052_7dc7_4a5c_a098_8dce6d195823_ctl00_ctl05_ctl01_ctl00_ctl00_ctl04_ctl00_ctl00_BooleanField"; // form element ID
// $(taskorderID).change(function() { // check for change in the form
// 		blah blah blah
// }
//
// Hide an entire row from a form
// var parentField = "#ctl00_m_g_3a8c2052_7dc7_4a5c_a098_8dce6d195823_ctl00_ctl05_ctl02_ctl00_ctl00_ctl04_ctl00_Lookup"; // ID of the parent field
// $(parentField).parents('tr:first').hide();   // hide it...or can even show it
//
// Check if a CheckBox field is checked
// if($(taskorderID).is(':checked')) {}
//
// Gets Value of a Radio Button (note: genderS is the name of the radio button as it requires name and ID)
// $('input[name="genderS"]:checked').val();
//
// Gets Value of a Radio Button on a SharePoint for (since its all jacked up in there...)
// var $input = $("input:radio[name$='ctl00$RadioButtons']:checked")
// var radioVal = $('label[for='+$input.attr('id')+']').text();
// radioVal
//
// Gets the Value of a Select Box (LookUp List) in SharePoint. For multi-select box, you will have to split it by "|t" since SharePoint is like that
// var lookUpVal = $("[id$='MultiLookupPicker']").val(); // for 2010 or 2007
// var lookUpVal = "[id$='MultiLookup']"; //for 2013
//
// Check if Checkbox is Checked
// $("input[title='Packet Complete?']").is(':checked')
//
// Check a Checkbox (or uncheck it)
// $("input[title='Administratively Withdrawn?']").prop('checked', false);
//
// Gets Value of Text Box Field
// $("input[title='FirstName']").val()
//
// Gets Value of Text Area
// $("textarea[title='Phenotype Info']").val()
//
// Gets ID Value of Select Box
// $("select[title='Petitioner State']").val()
//
// Gets the Text Value from Select Box
// primaryInstitutionVal = $("#ctl00_m_g_53a9153d_b513_41c1_b30f_2fefd13c230d_ctl00_ctl05_ctl21_ctl00_ctl00_ctl04_ctl00_Lookup option:selected").text();
//
// Loops through all Items in a Select Box (or multi-select)
// var addInst = $("#ctl00_m_g_53a9153d_b513_41c1_b30f_2fefd13c230d_ctl00_ctl05_ctl23_ctl00_ctl00_ctl04_ctl00_ctl00_SelectResult option");
// addInst.each(function(){
//		  console.log($(this).val())
//	  });
//
// ****NOTE******
// The webpart containing these codes should be below the entire form


function getFormID(elementType, elementName) {
	return $(elementType+"[title$='"+elementName+"']").attr("ID");
}
//-----------------------------------------------------------------------------------------//
function handleKeyPresses(e) {
	// ($("#txtUser").is(":focus")) // check for Focus
	//if (e.keyCode==13) {document.getElementById("btnSelectUser").click();} // calls the button's ID
}
//-----------------------------------------------------------------------------------------//
// Thanks to IE being such a pain in the ass, i had to resort to this ugly ass mess here...
var horribleIEVal = "function(e){\"use strict\";if(null==this)throw new TypeError;var t=Object(this),r=t.length>>>0;if(0===r)return-1;var s=0;if(arguments.length>1&&(s=Number(arguments[1]),s!=s?s=0:0!=s&&1/0!=s&&s!=-1/0&&(s=(s>0||-1)*Math.floor(Math.abs(s)))),s>=r)return-1;for(var i=s>=0?s:Math.max(r-Math.abs(s),0);r>i;i++)if(i in t&&t[i]===e)return i;return-1}";
//-----------------------------------------------------------------------------------------//
// Builds a DataTable
// note : requires jquery.dataTables.min.js
//                 jquery.dataTables.css
//        - tableTools is optional, only if you need exporting
function printTable(outputArray, columnsToDisplay, headerNames, sortIndex, sortDirection, containerID, tableOnly){
	var swfPath = SP_site+"/_layouts/export/copy_csv_xls_pdf.swf";  // for 2010
	if (isSP2013) swfPath = SP_site+"/_layouts/15/export/copy_csv_xls_pdf.swf"; // for 2013
	var table = "<table id='"+containerID+"' class='display'><thead><tr>";

	for (var x = 0; x<headerNames.length;x++){
		table+="<th>"+headerNames[x]+"</th>";
	}

	table+="</tr></thead>";
	table+="</table>";
	var rows = new Array();

	for (i in outputArray){
			var row = new Array();
			for (var b = 0; b < columnsToDisplay.length; b++){
				var myValue = outputArray[i][columnsToDisplay[b]];
				row.push(_format(myValue));
				//row.push(myValue);
			}
			//Very very horrible hack....but it works...
			if (row[i]!=horribleIEVal) rows.push(row);
	}

	$("#"+containerID+"Container").append(table);

	if (tableOnly) { // just showing only the table
		var oTable = $("#"+containerID).DataTable({
			aaData: rows,
			/*
			"lengthChange": false,
			"searching": DT_searching,
			"bProcessing": true,
			"bPaginate": DT_paging,
			"iDisplayLength": 100,
			*/
			"scrollX": true,
			"scrollY": (screen.height-500)+"px", // adjusted so whole report will fit on screen without need for scrolling down
			"scrollCollapse": true,
			"paging": false,
			"aaSorting": [[sortIndex, sortDirection]],
			//"columns":[null,null,null,{"type": "num-fmt"}],

			"dom": 'T<"clear">lfrtip',
			"tableTools": {"sSwfPath": swfPath, // .SWF file is installed in the /images folder on server
							"aButtons": [
										//"copy",
										//"print",
										{
											"sExtends":    "collection",
											"sButtonText": "Export",
											"aButtons":    [ "xls", "pdf" ]
										}
									]
						}
		});
	} else { // display everything
		var oTable = $("#"+containerID).DataTable({
			aaData: rows,
			"bProcessing": true,
			"iDisplayLength": 10,
			"aaSorting": [[sortIndex, sortDirection]],
			//"columnDefs": [ { "type": "formatted-num", "targets": [ 2, 3 ] } ],

			/*
			"language": {
					//"decimal": ",",
					"thousands": " "
			},
			"columnDefs": [
                { "type": "numeric-comma", targets: 0 }
            ],
			"columns":[null,null,null,{"type": "numeric-comma", targets : 3}],

			/*
			dom: 'Bfrtip',
			buttons: ['copy', 'excel', 'pdf',
						{
							extend: 'print',
							exportOptions: {
								columns: ':visible'
							}
						},
						'colvis'
			],
			columnDefs: [ {
				targets: -1,
				visible: false
			} ]
			*/

			// the older way...works though
			"dom": 'T<"clear">lfrtip',
			//"dom": '<"top">CT',
			"tableTools": {"sSwfPath": swfPath, // .SWF file is installed in the /images folder on server
							"aButtons": [
										//"copy",
										//"print",
										{
											"sExtends":    "collection",
											"sButtonText": "Export",
											"aButtons":    [ "xls", "pdf" ]
										}
									]
						}

		});

		/*
		// This works...but dammit, the fricken columns will still show when exporting to file. So...useless for me...damn...

		$("input:checkbox").change(function(e) {
			//e.preventDefault();
			// Get the column API object
			var column = oTable.column( $(this).attr('data-column') );
			// Toggle the visibility
			column.visible( ! column.visible() );
		});
		*/
	}
}

function _format(myValue){
	if(myValue==null || myValue==""){
		return "";
	}
	else if(isFinite(myValue)){
		if(myValue % 1 != 0){
			return addCommas(roundNumber(myValue,2));
		}
		else if(myValue % 1 == 0 && myValue.substring(1,0) == 0){
			return myValue;
		}
		else{
			return addCommas(parseInt(myValue));
		}
	}
	else if(myValue.search('%') != -1){
		return myValue;
	}
	else if(myValue.indexOf("https")==0){
		return parseSPURL(myValue);
	}
	else if(isValidDate(myValue)) {
		//return myValue
		return parseSPDate(myValue);
	}
	else if(myValue.indexOf("#")){
		return parseLookup(myValue);
	}
	else{
		alert("Error formatting "+myValue);
	}
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function isValidDate(value) {

	var objRegExp = /^\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{2}:\d{2}$/
    return objRegExp.test(value);
}

function parseSPDate(dateValue) {

	dateValue= dateValue.substring(0, dateValue.indexOf(" "));
	var split = dateValue.split("-");
	var formattedDate = split[0]+"-"+split[1]+"-"+split[2];
	return formattedDate;
}

function parseSPURL(urlValue) {
	var urlParts = urlValue.split(",")
	var urlLink = urlParts[0]
	var urlValue = urlParts[1]

	return "<a href='" + urlLink + "'>" + urlValue + "</a>";
}

function parseLookup(lookupString){
		return lookupString.slice(lookupString.indexOf("#")+1);
}
//-----------------------------------------------------------------------------------------//
function getListLevel() {
	var listLevel = "";
	var currLocation = window.location.href;
	if (currLocation.indexOf("/Lists/")>0 || currLocation.indexOf("/Forms/")>0) {listLevel="../";} // check if on a list or not
	return listLevel;
}
//-----------------------------------------------------------------------------------------//
// Builds a Button Icon
// Note : assuming inside a table row already, and all images stored in SharePoint's PublishingImages folder
//        also assumes that there is corresponding mouse over image along with the image in the format : <img>_over.png
//        Set nolabel to false if label is not needed below the image
function buildIconButton(img, id, jsEvent, label, nolabel) {
	var labelColor = "#0072bc"; // sharePoint link color
	var listLevel = getListLevel();

	document.write("<td align='center'>");
	document.write("<img data-toggle='tooltip' data-placement='bottom' title='"+label+"' id='"+id+"' onclick='"+jsEvent+"' src='"+listLevel+"../PublishingImages/"+img+"' alt='"+label+"'><br>");
	if (arguments.length==4) { document.write("<font color='"+labelColor+"'><a id='"+id+"Link' onclick='"+jsEvent+"'>"+label+"</a></font>"); }
	document.write("</td>");

	var imgs = img.split("."); // splits it
	var img_over = imgs[0]+"_over."+imgs[1]; //builds the mouse over image link

	// Handles the mouse over effect
	if (imageExists(""+listLevel+"../PublishingImages/"+img_over)) { // only do this if the over image exists, kinda sloppy though
		$("#"+id).hover(function() {
			$(this).attr("src",""+listLevel+"../PublishingImages/"+img_over);
			$(this).css( 'cursor', 'pointer' );
				}, function() {
			$(this).attr("src",""+listLevel+"../PublishingImages/"+img);
			$(this).css( 'cursor', 'default' );
		});
	}

	// Handles text label if exists. This makes look like an actual html link.
	if (arguments.length==4) {
		$("#"+id+"Link").hover(function() {
			$(this).css( 'cursor', 'pointer' );
				}, function() {
			$(this).css( 'cursor', 'default' );
		});
	}
}
//-----------------------------------------------------------------------------------------//
// Encode or Decode HTML Entities (for multiple line boxes that contain rich text)
function htmlEncode(value){
    if (value) {
        return jQuery('<div />').text(value).html();
    } else {
        return '';
    }
}

function htmlDecode(value) {
    if (value) {
        return $('<div />').html(value).text();
    } else {
        return '';
    }
}
//-----------------------------------------------------------------------------------------//
// Check if an image exists or not.
// Returns true or false
// Note : If image doesn't exist then will throw a 404 error in the console, no big deal unless you are a control freak
function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}
//-----------------------------------------------------------------------------------------//
// Removes spaces from a string
// In case your IDs have spaces in them for any reason..
function removeSpaces(str){
	str = str.replace(/\s/g, '');
	return str;
}
//-----------------------------------------------------------------------------------------//
// Removes dashes
// NOTE : This is actually required for Document Libraries that have dashes
function removeDashes(str){
	str = str.replace(/[-]/g,'');
	str = str.replace(/'/g, ''); // removes apostrophe while we're at it
	str = str.replace(/[|]/g,''); // and that pipe thing or whatever the hell its called
	str = str.replace(/[:]/g,''); // and that colon thing
	str = str.replace(/[,]/g,''); // and that comma too
	str = str.replace(/[/]/g,''); // and that slash
	return str;
}
//-----------------------------------------------------------------------------------------//
// Forces a page reload or refresh
function reloadPage() {
	var thispage = window.location;
	window.location = thispage;
}
//-----------------------------------------------------------------------------------------//
// Opens a Document Library in Windows Explorer
// NOTE : Will **only work** in Internet Explorer Browser
function openDocLibFolder(foldername){
	if (navigator.appName!="Microsoft Internet Explorer") { alert("This feature is only available in the Internet Explorer Web Browser.");} else {
		CoreInvoke('NavigateHttpFolder', foldername);
	}
}
//-----------------------------------------------------------------------------------------//
// Opens up the All Site Contents
function viewSiteContent() {
	var expath = SP_siteURL+"/_layouts/viewlsts.aspx";
	if (isSP2013) {expath = SP_siteURL+"/_layouts/15/viewlsts.aspx";}
	window.open(expath); // always open Site Content in new window
}
//------------------------------------------------------------------------------------------------------------//
// Check if value is a number
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
//-----------------------------------------------------------------------------------------//
// Takes a string and make it into an HTML email link
function createEmailLink(oldstring){
	var emailLink = "";
	if (oldstring!=undefined && oldstring!="") emailLink = "<a href='mailto:"+oldstring+"'>"+oldstring+"</a>";
	return emailLink;
}
//-----------------------------------------------------------------------------------------//
// Removes commas from string
function removeCommas(str) {
	return str = str.replace( /,/g, "" );
}
//-----------------------------------------------------------------------------------------//
// formats number in currency format
function currencyFormat(currVal) {
	var newVal = "";
	if (currVal==undefined || currVal=="")
		{newVal= "$0";} else {newVal = "$"+_format(currVal);}
	return newVal;
}
//-----------------------------------------------------------------------------------------//
// Note : Doesn't work...remove this later
function CopyToClipboard(text) {
   Copied = text.createTextRange();
   Copied.execCommand("Copy");
}
//-----------------------------------------------------------------------------------------//
// Check if string is alphanumeric or not
function isAlphaNumeric(str) {
  var code, i, len;

  if (str.length<1) {return false;}  // must not be blank
  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};
//----------------------------------------------------------------------------------------//
// Check if numerical value is in range
// returns true if in range else false
function inRange(x, min, max) {
	return x >= min && x <= max;
}
//----------------------------------------------------------------------------------------//
// Checks if the following phone number is in this format :
// XXX-XXX-XXXX
// XXX.XXX.XXXX
// XXX XXX XXXX
function ValidPhoneNumber(inputtxt){
	var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		if (inputtxt.match(phoneno)) {
			return true;
		} else {
			return false;
		}
}
//----------------------------------------------------------------------------------------//
// Check if a valid email
function validEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
//----------------------------------------------------------------------------------------//
// Function to hide a column row in the form
function hideColumn(c) {
  $(".ms-formlabel h3 nobr").filter(function() {
    var thisText = $.trim($(this).clone().children().remove().end().text());
    return thisText.indexOf(c) === 0 && thisText.length === c.length;
  }).closest("tr").hide();
}
//----------------------------------------------------------------------------------------//
// Function to show a column row in the form
function showColumn(c) {
  $(".ms-formlabel h3 nobr").filter(function() {
    var thisText = $.trim($(this).clone().children().remove().end().text());
    return thisText.indexOf(c) === 0 && thisText.length === c.length;
  }).closest("tr").show();
}
//----------------------------------------------------------------------------------------//
// Make SP Field Required
function requiredColumn(ColName, requiredCol)
{
    if(requiredCol=="True")
    {
          var spanTag ="<span class=\"ms-formvalidation\"> *</span>";
            var newHtml = ColName;
            if (requiredCol)
            {
                newHtml += spanTag;
                $("nobr").filter(function() {
                return $(this).text() === ColName;
                }).html(newHtml);
            }
      }
}
//----------------------------------------------------------------------------------------//
// Make SP Field Read Only
function DisableColumn(Column, IsDisable) {
	if (IsDisable == "True") {
		$("input[title='" + Column + "']").attr("readonly","true").css('background-color','#F6F6F6');

	}
}
//----------------------------------------------------------------------------------------//
// Disable SP People Picker on Form
// NOTE : this apparently disables *ALL* people pickers on a form, the parameter doesn't matter
function disablePeoplePicker(column){
	$("nobr:contains('"+column+"')").closest("td").next("td").attr("disabled", "disabled");
	$("div[id$='_UserField_upLevelDiv']").attr("contentEditable",false);
	$("span[id$='_UserField']").find("img").hide();
}
//----------------------------------------------------------------------------------------//
// CAML Query Samples
/*
// Lookup IDs
<Where><Eq><FieldRef Name='Author' LookupId='TRUE' /><Value Type='Lookup'>"+SP_UserID+"</Value></Eq></Where>
<Where><Eq><FieldRef Name='State' LookupId='TRUE' /><Value Type='Lookup'>"+binderID+"</Value></Eq></Where>

// Yes/No
<Where><Eq><FieldRef Name='Active' /><Value Type='Boolean'>1</Value></Eq></Where>

// Order By
// NOTE : "Order By" can be added at the end of the CAML Query
<OrderBy><FieldRef Name='Created' Ascending='False' /></OrderBy>
// Order by 2 fields
<OrderBy><FieldRef Name='Tab' Ascending='TRUE' /><FieldRef Name='SortOrder' Ascending='TRUE' /></OrderBy>
//------------------------------------------------------------------------------------------
//
/ To disable Input controls, ie.. Single Line text, Choice with single select (Radio button, Checkbox), Button, Multiline Text with Plain text
// $(":input[Title='Priority']").attr("disabled", "disabled");
//
// To disable Drop Down
// $("Select[Title='Priority']").attr("disabled", "disabled");
//
// To disable Multichoice check box
// $('nobr:contains("SUBJECT AREA")').closest("td").next("td").attr("disabled", "disabled");
//
//------------------------------------------------------------------------------------------
// Misc SharePoint Form Functionality
/*

// Detects changes based on SharePoint's Actual Date Picker (on the Form itself)
$("input[title='Petition Receipt Date']").get(0).onvaluesetfrompicker = DatePickerChanged;
function DatePickerChanged() {
    alert("change");
}

// OnChange event from SharePoint Field (on the Form itself)
$("input[title='Petition Receipt Date']").change(function() {
  alert("change");
  });



//------------------------------------------------------------------------------------------
SP Layouts Paths
-----------------
Accessed through : SP_site+"/_layouts/..."

Servers
--------
SP 2007 : C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\12\TEMPLATE\LAYOUTS\
SP 2010 : C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\
SP 2013 : C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\TEMPLATE\LAYOUTS\

*/
