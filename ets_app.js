var employeeRecord = new Array();

var locationRecord = new Array();
var locationHeader = new Array();

var skillRecord = new Array();
var skillHeader = new Array();

var certRecord = new Array();
var certHeader = new Array();
//---------------------------------------------------------------------------------------
function buildEmployeeRecordDataTable(){
	var list = "employeeRecord";
	var listcolumns = ["ID", "Title", "Contract", "FirstName", "BirthDate", "HireDate", "Address", "Address2", "City", "State", "ZipCode", "PhoneNumber", "CellPhone", "Email", "Position", "OfficeLocation", "Education", "Certification", "SkillSet", "Salary", "CurrentlyEmployed", "OnLeave", "DateLeave", "DateReturn"];
	var listItems = getDataItems(list, listcolumns, true);
	 employeeRecord = listItems;
	var cleanTable = new Array();


	if (listItems!=undefined) { // only do this if data is returned...or else crashes...
		for (var x=0;x<listItems.length;x++){
			cleanTable[x] = new Array();
			cleanTable[x]['ID'] = listItems[x]["ID"];
			cleanTable[x]['Title'] = buildViewModalLink(listItems[x]["Title"], listItems[x]["ID"]);
			cleanTable[x]['FirstName'] = listItems[x]["FirstName"];
			cleanTable[x]['Position'] = buildMultiTableData(listItems[x]["Position"]);
			cleanTable[x]['OfficeLocation'] = listItems[x]["OfficeLocation"];
			cleanTable[x]['Contract'] = buildMultiTableData(listItems[x]["Contract"]);
			cleanTable[x]['Edit'] = buildEditItemLink("employeeRecord", listItems[x]["ID"]);

			//$("#info").append(listItems[x]["ID"]+", "+listItems[x]["Title"]+", "+listItems[x]["FirstName"]+"<br>");

		}

		var cleanColumns = ["Edit","Title", "FirstName", "Position", "OfficeLocation", "Contract"];
		var tableHeader = ["Edit","LastName", "FirstName", "Position", "OfficeLocation", "Contract"];

		var sortIndex = 0;
		var sortDirection = "asc";
		var containerID = "Ets";  // Name of the DataTable Container

		printTable(cleanTable, cleanColumns, tableHeader, sortIndex, sortDirection, containerID);

	}
}
//---------------------------------------------------------------------------------------
function buildViewModalLink(label, listItemID){
	return '<a href="javascript:viewModalItem(\''+listItemID+'\');">'+label+'</a>';
}
//---------------------------------------------------------------------------------------
function viewModalItem(listItemID){
	employeeRecord;
 	$("#empId").val(listItemID);

		for(var x=0; x<employeeRecord.length; x++){
    		if (listItemID == employeeRecord[x]["ID"]) {
    			empFName = employeeRecord[x]["FirstName"];
     			empLName = employeeRecord[x]["Title"];
     			empBirth = buildDateData(employeeRecord[x]["BirthDate"]);
     			empHire = buildDateData(employeeRecord[x]["HireDate"]);
     			home = employeeRecord[x]["PhoneNumber"];
     			cell = employeeRecord[x]["CellPhone"];
     			email = checkBlankData(employeeRecord[x]["Email"]);
     			address = checkBlankData(employeeRecord[x]["Address"]);
					address2 = checkBlankData(employeeRecord[x]["Address2"]);
     			city = buildLocationData(employeeRecord[x]["City"]);
					state = buildMultiTableData(buildLocationData(employeeRecord[x]["State"]));
					zip = removeLastComma(buildLocationData(employeeRecord[x]["ZipCode"]));
     			position = buildContractData(employeeRecord[x]["Position"]);
     			contract = buildContractData(employeeRecord[x]["Contract"]);
     			office = SP_GetStr(employeeRecord[x]["OfficeLocation"]);
     			edu = SP_GetStr(employeeRecord[x]["Education"]);
					cert = buildMultiTableData(employeeRecord[x]["Certification"]);
     			skill = buildContractData(employeeRecord[x]["SkillSet"]);
     			salary = buildSalaryData(employeeRecord[x]["Salary"]);
					employed = buildEmployeeData(employeeRecord[x]["CurrentlyEmployed"]);
					leave = buildEmployeeData(employeeRecord[x]["OnLeave"]);
					dateLeave = buildDateData(employeeRecord[x]["DateLeave"]);
					dateReturn = buildDateData(employeeRecord[x]["DateReturn"]);

					$("#empName").val(empFName+" "+empLName);
					$("#empBirth").val(empBirth);
					$("#empHire").val(empHire);
					$("#home").val(home);
					$("#cell").val(cell);
					$("#email").val(email);
					$("#address").val(address);
					$("#address2").val(address2);
					$("#city").val(city+state+zip);
					$("#position").val(position);
					$("#contract").val(contract);
					$("#office").val(office);
					$("#edu").val(edu);
					$("#certi").val(cert);
					$("#skillset").val(skill);
					$("#salary").val(salary);
					$("#employed").val(employed);
					$("#leave").val(leave);
					$("#dateLeave").val(dateLeave);
					$("#dateReturn").val(dateReturn);
				}
				if(leave == "No"){
					$("label[for='dateLeave'],label[for='dateReturn'] ").hide();
					$("#dateLeave, #dateReturn").hide();
					$("#position").css({"margin-top":"-2.5em"});
					//$("#positionLabel").css({"top":"-3.25em"});
				}
				else{
					$("label[for='dateLeave'],label[for='dateReturn'] ").show();
					$("#dateLeave, #dateReturn").show();
					$("#position").css('margin-top', '');
					$("#positionLabel").css('top','');
				}
			}
 	$('#viewModal').modal('show');

	$('#editRecord').click(function(){
		viewModalEditItem(listItemID);
	})

	expandDiv();
	resetModal();
}
//---------------------------------------------------------------------------------------
function buildEditItemLink(listName, listItemID){
	return '<a href="javascript:editListItem(\''+listName+'\','+listItemID+');"><button type="button" class="btn btn-primary btn-xs">Edit</button></a>';
}
//---------------------------------------------------------------------------------------
function editListItem(listName, listItemID) {
	var exppath = "../Lists/"+listName+"/EditForm.aspx?ID="+listItemID;
	var returnsource = window.location; //returns the locations
	buildCustomDialog(exppath, returnsource, "Edit "+listName); //link the form to the table or add new button
}
//---------------------------------------------------------------------------------------
function buildEmployeeLeaveDataTable(){
	var list = "employeeRecord";
	var listcolumns = ["ID", "Title", "FirstName", "OnLeave", "DateLeave", "DateReturn"];
	var listItems = getDataItems(list, listcolumns, true);
	var cleanTable = new Array();


	if (listItems!=undefined) { // only do this if data is returned...or else crashes...
		for (var x=0;x<listItems.length;x++){
			if(listItems[x]["OnLeave"] == "1"){
				cleanTable[x] = new Array();
				cleanTable[x]['ID'] = listItems[x]["ID"];
				cleanTable[x]['Title'] = listItems[x]["Title"];
				cleanTable[x]['FirstName'] = listItems[x]["FirstName"];
				cleanTable[x]['OnLeave'] = listItems[x]["OnLeave"];
				cleanTable[x]['DateLeave'] = buildDateData(listItems[x]["DateLeave"]);
				cleanTable[x]['DateReturn'] = buildDateData(listItems[x]["DateReturn"]);
		  }
		}

		var cleanColumns = ["Title", "FirstName", "DateLeave", "DateReturn"];
		var tableHeader = ["LastName", "FirstName", "DateLeave", "DateReturn"];

		var sortIndex = 0;
		var sortDirection = "asc";
		var containerID = "onLeave";  // Name of the DataTable Container

		printTable(cleanTable, cleanColumns, tableHeader, sortIndex, sortDirection, containerID);
	}
}
//---------------------------------------------------------------------------------------
function buildEmployeeLocationTable(){
	var cleanTable = new Array();

	for (var y=0; y<employeeRecord.length; y++){
		var empLocID = SP_GetID(employeeRecord[y]["OfficeLocation"]);

		cleanTable[y] = new Array();
		cleanTable[y]['ID'] = employeeRecord[y]['ID'];
		cleanTable[y]['FirstName'] = employeeRecord[y]['FirstName'];
		cleanTable[y]['Title'] = employeeRecord[y]['Title'];

		for (var x=0;x<locationRecord.length;x++){
		  var locTitle = locationRecord[x]["Title"];
		  var locID = locationRecord[x]["ID"];

		  if (locID == empLocID) {
				cleanTable[y][locTitle] = "x";
		  } else {cleanTable[y][locTitle] = "";}
		}
	}
	var cc = ["Title", "FirstName"];
	var th = ["LastName", "FirstName"];

	var cleanColumns = cc.concat(locationHeader);
	var tableHeader = th.concat(locationHeader);

	var sortIndex = 0;
	var sortDirection = "asc";
	var containerID = "location";  // Name of the DataTable Container

	printTable(cleanTable, cleanColumns, tableHeader, sortIndex, sortDirection, containerID);

}
//---------------------------------------------------------------------------------------
function loadLocationRecord(){
	var list = "OfficeLocation";
	var listcolumns = ["ID", "Title"];
	var listItems = getDataItems(list, listcolumns, true);
	locationRecord = listItems;

	for (var x=0;x<locationRecord.length;x++) {
		locationHeader.push(locationRecord[x]["Title"]);
	}
}
//---------------------------------------------------------------------------------------
function buildEmployeeSkillTable(){
	var cleanTable = new Array();

	for (var y=0; y<employeeRecord.length; y++){
		if (employeeRecord[y]["SkillSet"] != ""){
			var empSkillID = employeeRecord[y]["SkillSet"];
			var _empSkills = empSkillID.split(";#");
			//var empName = employeeRecord[y]["FirstName"]+" "+employeeRecord[y]["Title"]

			cleanTable[y] = new Array();
			cleanTable[y]['ID'] = employeeRecord[y]['ID'];
			cleanTable[y]['FirstName'] = employeeRecord[y]['FirstName'];
			cleanTable[y]['Title'] = employeeRecord[y]['Title'];

			for (var x=0;x<skillRecord.length;x++){
		  	var skillTitle = skillRecord[x]["Title"];
		  	var skillID = skillRecord[x]["ID"];

				if (empSkillID.contains(skillTitle)){
					cleanTable[y][skillTitle] = "x";
				} else {cleanTable[y][skillTitle] = "";}
			}
		}
	}


	var cc = ["Title", "FirstName"];
	var th = ["LastName", "FirstName"];

	var cleanColumns = cc.concat(skillHeader);
	var tableHeader = th.concat(skillHeader);

	var sortIndex = 0;
	var sortDirection = "asc";
	var containerID = "skill";  // Name of the DataTable Container

	printTable(cleanTable, cleanColumns, tableHeader, sortIndex, sortDirection, containerID);

}
//---------------------------------------------------------------------------------------
function loadSkillRecord(){
	var list = "SkillSet";
	var listcolumns = ["ID", "Title"];
	var listItems = getDataItems(list, listcolumns, true);
	 skillRecord = listItems;

	 for (var x=0;x<skillRecord.length;x++) {
 		skillHeader.push(skillRecord[x]["Title"]);
 	}
}
 //---------------------------------------------------------------------------------------
function buildEmployeeCertTable(){
	var cleanTable = new Array();

	for (var y=0; y<employeeRecord.length; y++){
		if (employeeRecord[y]["Certification"] != ""){

    	var empCertID = employeeRecord[y]["Certification"];
    	var _empCerts = empCertID.split(";#");

			cleanTable[y] = new Array();
			cleanTable[y]['ID'] = employeeRecord[y]['ID'];
			cleanTable[y]['FirstName'] = employeeRecord[y]['FirstName'];
			cleanTable[y]['Title'] = employeeRecord[y]['Title'];

    	for (var x=0;x<certRecord.length;x++){
		  	var certTitle = certRecord[x]["Title"];
		  	var certID = certRecord[x]["ID"];

				if (empCertID.contains(certTitle)){
					cleanTable[y][certTitle] = "x";
				} else {cleanTable[y][certTitle] = "";}
			}
		}
	}

	var cc = ["Title", "FirstName"];
	var th = ["LastName", "FirstName"];

	var cleanColumns = cc.concat(certHeader);
	var tableHeader = th.concat(certHeader);

	var sortIndex = 0;
	var sortDirection = "asc";
	var containerID = "cert";  // Name of the DataTable Container

	printTable(cleanTable, cleanColumns, tableHeader, sortIndex, sortDirection, containerID);
}
//---------------------------------------------------------------------------------------
function loadCertificationRecord(){
	var list = "Certification";
	var listcolumns = ["ID", "Title"];
	var listItems = getDataItems(list, listcolumns, true);
	 certRecord = listItems;

	 for (var x=0;x<certRecord.length;x++) {
 		certHeader.push(certRecord[x]["Title"]);
 	}
 }

//---------------------------------------------------------------------------------------
function loadLookUpData(){
	loadLocationRecord();
	loadSkillRecord();
	loadCertificationRecord();
}
//---------------------------------------------------------------------------------------
function viewModalEditItem(listItemID){
	var exppath = "../Lists/employeeRecord/EditForm.aspx?ID="+listItemID;
	var returnsource = window.location; //returns the locations
	buildCustomDialog(exppath, returnsource, "Edit Employee Record");
}
//---------------------------------------------------------------------------------------
function dashModalItem(){
	var returnsource = window.location;
	employeeRecord;

	$("a.dashModal").click(function(){
		var modalShow = $('#dashModal').modal('show');

		switch (this.id){
			case "leaveLink" :{
				modalShow;
				$("#onLeaveContainer").show();
				$("#skillContainer").hide();
				$("#certContainer").hide();
				$("#locationContainer").hide();

			}break;

			case "locationLink" :{
				modalShow;
				$("#locationContainer").show();
				$("#onLeaveContainer").hide();
				$("#skillContainer").hide();
				$("#certContainer").hide();
			}break;

			case "skillsLink" :{
				modalShow;
				$("#skillContainer").show();
				$("#locationContainer").hide();
				$("#onLeaveContainer").hide();
				$("#certContainer").hide();
			}break;

			case "certLink" :{
				modalShow;
				$("#certContainer").show();
				$("#locationContainer").hide();
				$("#onLeaveContainer").hide();
				$("#skillContainer").hide();
			}break;
		};
	});
	resetModal();
}
//---------------------------------------------------------------------------------------
function adminModalItem(){
  $('#adminModal').modal('show');

  //$("#addLocAdmin").click(function(){
    //var exppath = "../Lists/OfficeLocation/NewForm.aspx";
    //var returnsource = window.location;
    //  buildCustomDialog(exppath, returnsource, "Add Location");
  //})

	$("#editLocAdmin").click(function(){
    var exppath = "../Lists/OfficeLocation/AllItems.aspx";
    var returnsource = window.location;
      buildCustomDialog(exppath, returnsource, "Edit Location");
  })

	$("#addSkillAdmin").click(function(){
    var exppath = "../Lists/SkillSet/NewForm.aspx";
    var returnsource = window.location;
      buildCustomDialog(exppath, returnsource, "Add Skill");
  })
	$("#editSkillAdmin").click(function(){
    var exppath = "../Lists/SkillSet/AllItems.aspx";
    var returnsource = window.location;
      buildCustomDialog(exppath, returnsource, "Edit Skill");
  })
	$("#addCertAdmin").click(function(){
    var exppath = "../Lists/Certification/NewForm.aspx";
    var returnsource = window.location;
      buildCustomDialog(exppath, returnsource, "Add Certification");
  })
	$("#editCertAdmin").click(function(){
    var exppath = "../Lists/Certification/AllItems.aspx";
    var returnsource = window.location;
      buildCustomDialog(exppath, returnsource, "Edit Certification");
  })

}
//---------------------------------------------------------------------------------------
function addNewListItem(listName, params) { //function with a name of addNewListItem with a parameter that grabs the listname and opens the form of the list
	if (arguments.length==1) {params="";}
	var exppath = "../Lists/"+listName+"/NewForm.aspx"+params; //grabs the form
	var returnsource = window.location; //returns the locations
	buildCustomDialog(exppath, returnsource, "Add New "+listName); //link the form to the table or add new button
}
//---------------------------------------------------------------------------------------
function buildCountInfo(){ // Build Leave Counter
	var employeeLeaveCount = 0;
	var locationCount = 0;
	var skillCount = 0;
	var certCount = 0;

	for (var x=0;x<employeeRecord.length;x++) {
  	if (employeeRecord[x]["OnLeave"]=="1") {employeeLeaveCount++;} // checks leave counter
		if (employeeRecord[x]["OfficeLocation"]==='true'){locationCount++;}
		if (employeeRecord[x]["SkillSet"]==='true'){skillCount++;}
		if (employeeRecord[x]["Certification"]==='true'){certCount++;}
  }

  $("#leaveCount").text(employeeLeaveCount);
  $("#locCount").text(locationRecord.length);
  $("#skillCount").text(skillRecord.length);
  $("#certCount").text(certRecord.length);

}
//---------------------------------------------------------------------------------------
function buildMultiTableData(multiVal){
	var newVal = multiVal.split(";#");
	var newContract = "";

  	for(var x=0;x<newVal.length;x++){
    	if (isNumber(newVal[x])) {newContract+=", ";} else {newContract+=(newVal[x]);}
 	}
 	return newContract.substr(2);
}
//---------------------------------------------------------------------------------------
function buildContractData(contractVal){
	var newVal = contractVal.split(";#");
	var newContract = "";

  	for(var x=0;x<newVal.length;x++){
    	if (isNumber(newVal[x])) {newContract+="\n";}
      else {newContract+=(newVal[x]);}
 	}
		//if (newVal.length>6) {$("#bottom-container").height("15em");}
													//$("#modal-body").height("17em");}
		//else {$("#bottom-container").height("13em");}
					//$("#modal-body").height("7em");}
 	return newContract.replace(/^\s*|\s*$/g,'');
}
//---------------------------------------------------------------------------------------
function buildDateData(dateVal){
  var dateField = dateVal;
  var newVal = "";

  if(dateField === undefined){newVal == "";} else {newVal+=dateField.substr(0,10);}
  return newVal.replace(/\-/g,'/');
}
//---------------------------------------------------------------------------------------
function buildSalaryData(salaryVal){
	var newSalary = salaryVal;
	var blankSalary = "";

	if (newSalary!== '' && !isNaN(newSalary)) {blankSalary+=parseFloat(newSalary).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");}
  	return blankSalary;
}
//---------------------------------------------------------------------------------------
function buildEmployeeData(empVal){
  var newVal = empVal;
  var newData = "";

	if(newVal=="0"){newData+="No";} else {newData+="Yes";}
  	return newData;
}
//---------------------------------------------------------------------------------------
function checkBlankData(emptyVal){
  var blankVal = emptyVal;
  var newVal = "";
  if(blankVal==undefined){newVal=="";} else {newVal+=blankVal;}
		return newVal;
}
//---------------------------------------------------------------------------------------
function buildLocationData(locVal){
	var location = locVal;
	var newLoc = "";

	if(location==undefined){newLoc=="";} else {newLoc+=location+", ";}

	return newLoc;
}
//---------------------------------------------------------------------------------------
function removeLastComma(val) {
	var oldVal = val
	var lastChar = oldVal.slice(0,-2);
		return lastChar;
}
//---------------------------------------------------------------------------------------
function expandDiv(){
	$(".expand").click(function(){
    $(this).toggleClass('fa-minus-circle');
	});
	$(".expand2").click(function(){
    $(this).toggleClass('fa-minus-circle');
	});
	$(".expand3").click(function(){
    $(this).toggleClass('fa-minus-circle');
	});
	$(".expand4").click(function(){
    $(this).toggleClass('fa-minus-circle');
	});

	$('#viewModal').on('show.bs.modal', function () {
			 $(this).find('.modal-body').css({
							width:'auto', //probably not needed
							height:'auto', //probably not needed
							'max-height':'100%'

			 });
		});
}
//---------------------------------------------------------------------------------------
function resetModal(){

	$('#viewModal').on('hide.bs.modal', function () {
		$('#expandContainer, #expandContainer2, #expandContainer3, #expandContainer4').removeClass('in');
		$('.expand, .expand2, .expand3, .expand4').removeClass('fa-minus-circle').addClass('fa-plus-circle');
	});

	$('#dashModal').on('hide.bs.modal', function () {
			$('#skill').scrollLeft(0);
	});
}
