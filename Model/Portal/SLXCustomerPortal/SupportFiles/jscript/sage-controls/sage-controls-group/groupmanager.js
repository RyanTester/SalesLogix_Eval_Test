/* external script file                               */
/* Copyright ©1997-2006                               */
/* Sage Software, Inc.                                */
/* All Rights Reserved                                */
/*  groupmanager.js                                   */
/*  This javascript object provides backward          */
/*  compatability for the GroupManager ActiveX        */
/*  control.  Pre existing calls to the GroupManager  */
/*  object will be handled by this object.            */
/*  Author: Newell Chappell                           */
/*  October 2004                                      */
/*  ================================================  */
/*  Object Methods-This is a singleton object 'class' */
/*  vGM.                                               */

/* Define a groupmanager object to be used for 'group' functionality         */
/* vGM_<name> are prototype functions. They will be called through the        */
/* groupmanager Class as vGM.<methodname - vGM_ prefix>, not as freestanding   */
/* functions.  Example: top.vGM.getCurrentGroup(0)  -- correct                */
/*                      groupmanager_getCurrentGroup(0)      -- WRONG!       */


function groupmanager() {
	/* Constructor for the groupmanager object class            */

	this.CurrentUserID = "";
	this.SortCol = -1;
	this.SortDir = "ASC";
	this.CurrentMode = "CONTACT"; //Contact
	this.GMUrl = "SLXGroupBuilder.aspx?method=";
	this.GroupXML = "";
	
	// ui messages - set externally to localize
	this.ConfirmDeleteMessage                = "Are you sure you want to delete the current group?";
	this.InvalidSortStringMessage            = "Error: Invalid sort string - ";
	this.InvalidConditionStringMessage       = "Error: Invalid condition string - ";
	this.InvalidLayoutConditionStringMessage = "Error: Invalid layout string - ";
}

// Cross browser xmlHttp class
function XBrowserXmlHttp() {

    this.XmlHttp = YAHOO.util.Connect.createXhrObject();
    //this.XmlHttp = new XMLHttpRequest();
}


/*-----------------------------------------Global (private) Variables --------------------------------------*/
var xmlHttpObject = new XBrowserXmlHttp();
var xmlhttp = xmlHttpObject.XmlHttp.conn;

/*-----------------------------------------private functions------------------------------------------------*/

function getFromServer(vURL) {
	xmlhttp.open("GET", vURL, false);
	xmlhttp.send("dummypostdata");
	var respText = xmlhttp.responseText;
	
	if (xmlhttp.responseText == "NOTAUTHENTICATED") {
        window.location.reload(true);
        return;
    }

	if ((respText.indexOf('Error') > -1) && (respText.indexOf('Error') < 3)) {
		alert(respText);
	}
	return respText;
  
}


function postToServer(vURL, aData) {
	xmlhttp.open("POST", vURL, false);
	xmlhttp.send(aData)
	var respText = xmlhttp.responseText;
	
	if (xmlhttp.responseText == "NOTAUTHENTICATED") {
        window.location.reload(true);
        return;
    }
    
	if ((respText.indexOf('Error') > -1) && (respText.indexOf('Error') < 3)) {
		alert(respText);
	}
	return respText;
}

/* ----------------------------------------General object functionality ------------------------------------*/


function groupmanager_CreateGroup(strMode) {
	if (strMode == '')
	    strMode = getCurrentGroupInfo().Family;
	var vURL = "QueryBuilderMain.aspx?mode=" + strMode;
	var width = Ext.getBody().getViewSize().width * .9;  
	window.open(vURL, "GroupViewer",
	    String.format("resizable=yes,centerscreen=yes,width={0},height=565,status=no,toolbar=no,scrollbars=yes", width));
}

function groupmanager_DeleteGroup(strGroupID) {
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
	var d = new Date();
    var time = d.getTime(); //prevent url caching
    
	if (confirm(this.ConfirmDeleteMessage)) {
	    getFromServer(this.GMUrl + 'DeleteGroup&gid=' + strGroupID + "&time=" + time);
        var url = document.location.href.replace("#", "");
        if (url.indexOf("?") > -1) {
            var halves = url.split("?");
            url = halves[0];
        }
        document.location = url;
	}
}

function groupmanager_EditGroup(strGroupID) {
	// show group editor dialog...
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
	var vURL = 'QueryBuilderMain.aspx?gid=' + strGroupID;
	vURL += '&mode=' + this.CurrentMode;
	var width = Ext.getBody().getViewSize().width * .9;  
	window.open(vURL, "EditGroup",
	    String.format("resizable=yes,centerscreen=yes,width={0},height=565,status=no,toolbar=no,scrollbars=yes", width));
}

function groupmanager_CopyGroup(strGroupID) {
	// show group editor dialog...
    if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
	var vURL = 'QueryBuilderMain.aspx?gid=' + strGroupID + '&action=copy';
	vURL += '&mode=' + this.CurrentMode;
	var width = Ext.getBody().getViewSize().width * .9;  
	window.open(vURL, "EditGroup",
	    String.format("resizable=yes,centerscreen=yes,width={0},height=565,status=no,toolbar=no,scrollbars=yes", width));
}

function groupmanager_ListGroupsAsSelect(strFamily) {
	if (strFamily == '')
	    strFamily = getCurrentGroupInfo().Family;
		
	var vURL = this.GMUrl + "GetGroupList&entity=" + strFamily;
	var response = getFromServer(vURL);	  
	
	var htmlOption;
    var xmlDoc = getXMLDoc(response);
	if (xmlDoc) {   
	    var groupInfos = xmlDoc.getElementsByTagName('GroupInfo');
	    for (var i = 0; i < groupInfos.length; i++) {
	        htmlOption += "<option value = '" + groupInfos[i].getElementsByTagName("GroupID")[0].firstChild.nodeValue + "'>"
	            + groupInfos[i].getElementsByTagName("DisplayName")[0].firstChild.nodeValue
	            + "</option>";
	    }
	    return htmlOption;
	 }
	 return "";
}

function groupmanager_HideGroup(strGroupID) {
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
	postToServer(this.GMUrl + 'HideGroup&gid=' + strGroupID, '');
}

function groupmanager_UnHideGroup(strGroupID) {
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
	getFromServer(this.GMUrl + 'UnHideGroup&gid=' + strGroupID);
}

function groupmanager_ShowGroups(strTableName) {
	if (strTableName == '')
	    strTableName = getCurrentGroupInfo().Family;
	var vURL = 'ShowGroups.aspx?tablename=' + strTableName;
	window.open(vURL, "ShowGroups","resizable=yes,centerscreen=yes,width=800,height=565,status=no,toolbar=no,scrollbars=yes");    
}

function groupmanager_ShowGroupInViewer(strGroupID) {
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
    var vURL = "GroupViewer.aspx?gid=" + strGroupID;
    window.open(vURL, "GroupViewer","resizable=yes,centerscreen=yes,width=800,height=600,status=no,toolbar=no,scrollbars=yes");
}

function groupmanager_Count(strGroupID) {
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
	return getFromServer(this.GMUrl + 'Count&gid=' + strGroupID);
}

function groupmanager_CreateAdHocGroup(strGroups, strName, strFamily, strLayoutId) {
	var vURL = this.GMUrl + 'CreateAdHocGroup';
	vURL += '&name=' + encodeURIComponent(strName);
	vURL += '&family=' + strFamily;
	vURL += '&layoutid=' + encodeURIComponent(strLayoutId);
	return postToServer(vURL, strGroups);
}

function groupmanager_GetGroupSQL(strGroupID, strUseAliases, strParts)
{
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
    var vURL = this.GMUrl + 'GetGroupSQL';
    vURL += '&gid=' + strGroupID;
    
    if (strUseAliases != null) {
         if  ((strUseAliases == 'true') || (strUseAliases == 'false')) {
            vURL += '&UseAliases=' + strUseAliases;  // must be true or false
         }
    } 
    
    if (strParts != null) {
         vURL += '&parts=' + strParts; 
    }
    
    return getFromServer(vURL);
}

function groupmanager_EditAdHocGroupAddMember(strGroupID, strItem) {
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
	// no return value expected;
	var x = getFromServer(this.GMUrl + 'EditAdHocGroupAddMember&groupid=' + strGroupID + '&entityid=' + strItem);
	//return x;
}
function groupmanager_EditAdHocGroupDeleteMember(strGroupID, strItem) {
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
	// no return value expected;
	var x = getFromServer(this.GMUrl + 'EditAdHocGroupDeleteMember&groupid=' + strGroupID + '&entityid=' + strItem);
	//return x;
}



function groupmanager_IsAdHoc(strGroupID) {
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Id;
    if (this.adHocGroupDictionary.hasOwnProperty(strGroupID)) {
		return this.adHocGroupDictionary[strGroupID];
	} else {
		var isAH = getFromServer(this.GMUrl + 'IsAdHoc&groupID=' + strGroupID);
		this.adHocGroupDictionary[strGroupID] = isAH;
		return isAH;
	}
}


function groupmanager_GetCurrentGroupID(strMode) {
	// Change implementation to use GroupContext
	alert ('not implemented yet');
}

function groupmanager_SetCurrentGroupID(strMode, strValue) {
	// Change implementation to use GroupContext
	alert ('not implemented yet');
}

function groupmanager_GetDefaultGroupID(strMode) {
	// Change implementation to use GroupContext
	alert ('not implemented yet');
}

function groupmanager_SetDefaultGroupID(strMode, strValue) {
	// Change implementation to use GroupContext
	alert ('not implemented yet');
}


function groupmanager_ExportGroup(strGroupID, strFileName) {
    InitObjects();
    if (GMvb)
    { 
	    GMvb.ExportGroup(strGroupID, strFileName);	
	} 
}


function stringsToQueryXML(strMode, strLayouts, strConditions, strSorts) {

    var lxml = layoutStrToXML(strLayouts);
    var cxml = conditionStrToXML(strConditions);
    var sxml = sortStrToXML(strSorts);

    var res = '<SLXGroup>';
    res += '<plugindata id="" name="" family="';
    res += strMode + '" type="8" system="F" userid="" />';
    res += '<groupid /><description />';
    res += lxml;
    res += cxml;
    res += sxml;
    res += '<hiddenfields count="0" />';
    res += '<parameters count="0" />';
    res += '<selectsql><![CDATA[]]></selectsql>';
    res += '<fromsql><![CDATA[]]></fromsql>';
    res += '<wheresql><![CDATA[]]></wheresql>';
    res += '<orderbysql><![CDATA[]]></orderbysql>';
    res += '<valuesql><![CDATA[]]></valuesql>';
    res += '<maintable>';
    res += strMode;
    res += '</maintable>';
    res += '<adhocgroup>false</adhocgroup>';
    res += '<adhocgroupid />';
    res += '<adddistinct>false</adddistinct>';
    res += '</SLXGroup>';
    return res;

}

function conditionStrToXML(strConditions) {
	/* a condition string is a Pipe delimited string with condition information                    */
	/* |DataPath|Alias|Condition|value|AND/OR|Type|CaseSensitive|(|)|IsLiteral|Not|                */
	/* example: |CONTACT:LASTNAME|A1.LASTNAME| STARTING WITH |ab|END|1|F|||F|                      */

	var conds = strConditions.split(/\n/);
	//alert(strLayouts + "\n\n\n\n" + layouts.length);
	var ret = '<conditions>';
	for (var i = 0; i < conds.length; i++) {
		if (conds[i] != '') {
			var parts = conds[i].split('|');
			if (parts.length < 10) {
				alert(this.InvalidConditionStringMessage + conds[i]);
				return;
			}
			var cond = '<condition><datapath><![CDATA[';
			cond += parts[1];
			cond += ']]></datapath><alias><![CDATA[';
			cond += parts[2];
			cond += ']]></alias><displayname>';
			cond += getFieldName(parts[1]);
			cond += '</displayname><displaypath>';
			cond += getDisplayPath(parts[1]);
			cond += '</displaypath><fieldtype /><operator><![CDATA[';
			cond += parts[3];
			cond += ']]></operator><value><![CDATA[';
			cond += parts[4];
			cond += ']]></value><connector><![CDATA[';
			cond += parts[5];
			cond += ']]></connector><casesens>';
			cond += (parts[7] == 'T') ? 'true' : 'false';
			cond += '</casesens><leftparens><![CDATA[';
			cond += parts[8];
			cond += ']]></leftparens><rightparens><![CDATA[';
			cond += parts[9];
			cond += ']]></rightparens><isliteral>';
			cond += (parts[10] == 'T') ? 'true' : 'false';
			cond += '</isliteral><isnegated>';
			cond += (parts[11] == 'T') ? 'true' : 'false';
			cond += '</isnegated></condition>';
			ret += cond;
		}
	}
	ret += '</conditions>';

	return ret
}


function sortStrToXML(strSorts) {
	/* a sort string is a Pipe delimited string with the sort information                          */
	/* |DataPath|Alias|Direction|                                                                  */
	/* example: |CONTACT:FIRSTNAME||ASC|                                                           */

	var sorts = strSorts.split(/\n/);
	var ret = '<sorts>';
	for (var i = 0; i < sorts.length; i++) {
		var parts = sorts[i].split('|');
		if (parts.length < 4) {
			alert(this.InvalidSortStringMessage + sorts[i]);
			return;
		}
		var st = '<sort><datapath><![CDATA[';
		st += parts[1];
		st += ']]></datapath><alias><![CDATA[';
		st += parts[2];
		st += ']]></alias><displayname>';
		st += getFieldName(parts[1]);
		st += '</displayname><displaypath>';
		st += getDisplayPath(parts[1]);
		st += '</displaypath><sortorder>';
		st += parts[3];
		st += '</sortorder></sort>';
		ret += st;
	}
	ret += '</sorts>';
	return ret;
}

function layoutStrToXML(strLayouts) {
	/* a layout string is a Pipe delimited string with the layout information                       */
	/* |DataPath|Alias|Caption|width|Formatstring|FormatType|Alignment|CaptionAlignment|Tag         */
	/* example: |CONTACT:@NameLF|@NameLF|Name|100||0|0|0|                                           */

	var formatTypes = new Array();
  formatTypes.push('None');
  formatTypes.push('Fixed');
  formatTypes.push('Integer');
  formatTypes.push('DateTime');
  formatTypes.push('Percent');
  formatTypes.push('Currency');
  formatTypes.push('User');
  formatTypes.push('Phone');
  formatTypes.push('Owner');
  formatTypes.push('Boolean');
  formatTypes.push('Positive Integer');
  formatTypes.push('PickList Item');
  formatTypes.push('Time Zone');

  var aligns = new Array();
  aligns.push('Left');
  aligns.push('Right');
  aligns.push('Center');

	var layouts = strLayouts.split(/\n/);
	var ret = '<layouts>';
	for (var i = 0; i < layouts.length; i++) {
		var parts = layouts[i].split('|');
		if (parts.length < 9) {
			alert(this.InvalidLayoutConditionStringMessage + layouts[i]);
			return;
		}
		lXML = '<layout><datapath><![CDATA[';
		lXML += parts[1];
		lXML += ']]></datapath><alias><![CDATA[';
		lXML += parts[2];
		lXML += ']]></alias><displayname>';
		lXML += getFieldName(parts[1]);
		lXML += '</displayname><displaypath>';
		lXML += getDisplayPath(parts[1]);
		lXML += '</displaypath><fieldtype />';
		lXML += '<caption><![CDATA[';
		lXML += parts[3];
		lXML += ']]></caption><width>';
		lXML += parts[4];
		lXML += '</width><formatstring><![CDATA[';
		lXML += parts[5];
		lXML += ']]></formatstring><format>';
		var fmt = parts[6];
		fmt = (fmt == "") ? 0 : fmt;
		lXML += formatTypes[fmt];
		lXML += '</format><align>';
		var al = parts[7];
		al = (al == "") ? 0 : al;

		lXML += aligns[al];
		lXML += '</align><captalign>';
		al = parts[8];
		al = (al == "") ? 0 : al;
		lXML += aligns[al];
		lXML += '</captalign></layout>';

		ret += lXML
	}
	ret += '</layouts>';
	return ret;
}


//------------------------------------------------------------------------------------------------------------------

function getFieldName(aDataPath) {
	var res = "";
	if (aDataPath.indexOf('!') > -1) {
		res = aDataPath.substr(aDataPath.lastIndexOf('!') + 1);
	} else {
		res = aDataPath.substr(aDataPath.lastIndexOf(':') + 1);
	}
	return res;
}

function getDisplayPath(aDataPath) {
	var disp = "";
	var isTable = true;
	var temp = "";
	for (var i = 0; i < aDataPath.length; i++) {
		var chr = aDataPath.charAt(i);
		if (isTable) {
			if ((chr == ":") || (chr == '!')) {
				//we just finished getting a table name...
				if (disp == "") {
					disp = temp;
				} else {
					disp = disp + "." + temp;
				}
				temp = "";
				isTable = false;
			} else {
				temp += chr;
			}
		} else if (chr == ".") {
			// we have come to another table...
			isTable = true;
		}
	}
	return disp;
}


//------------------------------------------------------------------------------------------------------------------


function groupmanager_ShareGroup(strGroupID) {
// show group editor dialog...
	if (strGroupID == '')
	    strGroupID = getCurrentGroupInfo().Family;
	var vURL = 'ShareGroup.aspx?gid=' + strGroupID;
	
	window.open(vURL, "ShareGroup","resizable=yes,centerscreen=yes,width=530,height=500,status=no,toolbar=no,scrollbars=yes");
	
}

function groupmanager_GetGroupId(strGroupName) {
    return getFromServer(this.GMUrl + 'GetGroupId&name=' + strGroupName);
}

groupmanager.prototype.CreateGroup = groupmanager_CreateGroup;
groupmanager.prototype.DeleteGroup = groupmanager_DeleteGroup;
groupmanager.prototype.EditGroup = groupmanager_EditGroup;
groupmanager.prototype.CopyGroup = groupmanager_CopyGroup;
groupmanager.prototype.HideGroup = groupmanager_HideGroup;
groupmanager.prototype.UnHideGroup = groupmanager_UnHideGroup;
groupmanager.prototype.ShowGroups = groupmanager_ShowGroups;
groupmanager.prototype.Count = groupmanager_Count;
groupmanager.prototype.CreateAdHocGroup = groupmanager_CreateAdHocGroup;
groupmanager.prototype.IsAdHoc = groupmanager_IsAdHoc;
groupmanager.prototype.GetCurrentGroupID = groupmanager_GetCurrentGroupID;
groupmanager.prototype.getCurrentGroupID = groupmanager_GetCurrentGroupID;
groupmanager.prototype.SetCurrentGroupID = groupmanager_SetCurrentGroupID;
groupmanager.prototype.GetDefaultGroupID = groupmanager_GetDefaultGroupID;
groupmanager.prototype.SetDefaultGroupID = groupmanager_SetDefaultGroupID;
groupmanager.prototype.ExportGroup = groupmanager_ExportGroup;
groupmanager.prototype.ShareGroup = groupmanager_ShareGroup;
groupmanager.prototype.ShowGroupInViewer = groupmanager_ShowGroupInViewer;
groupmanager.prototype.ListGroupsAsSelect = groupmanager_ListGroupsAsSelect;
groupmanager.prototype.GetGroupSQL = groupmanager_GetGroupSQL;
groupmanager.prototype.GetGroupId = groupmanager_GetGroupId;

var groupManager = new groupmanager();