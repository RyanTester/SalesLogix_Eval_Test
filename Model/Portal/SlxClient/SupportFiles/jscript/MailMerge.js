/* external script file                               */
/* Copyright ©1997-2007                               */
/* Sage Software, Inc.                                */
/* All Rights Reserved                                */
/*  MailMerge.js                                      */
/*  This javascript object provides backward          */
/*  compatability for the MailMergeJS ActiveX        */
/*  control.  Pre existing calls to the MailMergeJS  */
/*  object will be handled by this object.            */
/*  Author: Newell Chappell                           */
/*  October 2004                                      */
/*  ================================================  */
/*  Object Methods-This is a singleton object 'class' */
/*  gm.                                               */

/* Define a MailMergeJS object to be used for 'group' functionality         */
/* GM_<name> are prototype functions. They will be called through the        */
/* MailMergeJS Class as GM.<methodname - GM_ prefix>, not as freestanding   */
/* functions.  Example: top.GM.getCurrentGroup(0)  -- correct                */
/*                      MailMergeJS_getCurrentGroup(0)      -- WRONG!       */

/* 2/1/2007 - Modified this file to support only the functions */
/* needed for Gobi MailMerge and Email Notification; renamed it */
/* to MailMerge.js. */

var iLastSubMenuIndex = 0;

var IDX_ENTITYID = 0;
var IDX_ENTITYTYPE = 1;
var IDX_ENTITYDESCRIPTION = 2;
var IDX_ENTITYTABLENAME = 3;

var IDX_CACHE_ENTITYDESCRIPTION = 0;
var IDX_CACHE_ENTITYDISPLAYNAME = 1;
var IDX_CACHE_ENTITYID = 2;
var IDX_CACHE_ENTITYISACCOUNT = 3;
var IDX_CACHE_ENTITYISCONTACT = 4;
var IDX_CACHE_ENTITYISLEAD = 5;
var IDX_CACHE_ENTITYISOPPORTUNITY = 6;
var IDX_CACHE_ENTITYISTICKET = 7;
var IDX_CACHE_ENTITYKEYFIELD = 8;
var IDX_CACHE_ENTITYTABLENAME = 9;
var IDX_CACHE_ENTITYTYPE = 10;
var IDX_CACHE_ISVALID = 11;

function MailMergeJS() {
	/* Constructor for the MailMergeJS object class            */

	/*  Here are the 'properties' for this class.               */
	/*  There are no specific get/set functions for these.			*/
	this.CurrentUserID = "";
	this.UserName = "";
	this.ShortDateFormat = 'mm/dd/yyyy';
	this.svrdatefmt = 'mm/dd/yyyy';
	this.DateSeparator = '/';
	this.TimeSeparator = ':';
	this.SortCol = -1;
	this.SortDir = "ASC";
	this.DayStartTime = Date();
	this.AttachPath = "/BadPath";
	this.CurrentMode = 0;
	this.SSL = 0;
	this.CurrentCAOID = new Array();
	
    this.CachedContextInfo = new Array(11);    
    this.CurrentEntityDescription = "";
    this.CurrentEntityDisplayName = "";
    this.CurrentEntityID = "";
    this.CurrentEntityIsAccount = false;
    this.CurrentEntityIsContact = false;
    this.CurrentEntityIsLead = false;
    this.CurrentEntityIsOpportunity = false;
    this.CurrentEntityIsTicket = false;
    this.CurrentEntityKeyField = "";
    this.CurrentEntityTableName = "";
    this.CurrentEntityType = "";
    this.CurrentGroupCanBeMergedTo = false;
	this.CurrentGroupID = "";
	this.CurrentGroupTableName = "";
	this.CurrentGroupName = "";
	this.IsDetailView = false;
	
	this.GMUrl = '';
	this.IBUrl = '';
	this.baseUrl = '';
	this.htmlpath = '';
	this.swcpath = '';
	this.DefaultEmailTemplate = '';
	this.DefaultLetterTemplate = '';
	this.TimeZone = '';

	this.GroupSelectLists = new Array();
	this.CurrentLookupURL = new Array();
	this.CurrentLookupXML = new Array();
	this.ReportServer = "";
	this.DefaultGroupIDs = new Array();
}

/*-----------------------------------------private functions------------------------------------------------*/

function getFromServer(vURL) {
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("GET", vURL, false);
	xmlhttp.Send();
	var respText = xmlhttp.responseText;
	if ((respText.indexOf('Error') > -1) && (respText.indexOf('Error') < 3)) {
		alert(respText);
	}
	return respText;
}


function postToServer(vURL, aData) {
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", vURL, false);
	xmlhttp.Send(aData)
	var respText = xmlhttp.responseText;
	if ((respText.indexOf('Error') > -1) && (respText.indexOf('Error') < 3)) {
		alert(respText);
	}
	return respText;
}

/* ----------------------------------------General object functionality ------------------------------------*/
function MailMergeJS_Init() {
	if (this.CurrentUserID == '') {
		alert(lclGroupManagerFaileToInitialize);
	} else {
		var vURL = this.GMUrl + "Init&uid=" + this.CurrentUserID;
		vURL += "&timezone=" + this.TimeZone;
		var retval = getFromServer(vURL);
		var props = retval.split("|");
		for (var i = 0; i < props.length; i++) {
			var property = props[i].split("=");
			if (property[0]) {
				switch (property[0]) {
					case("DefaultEmailTemplate") :
						if (property[1]) {
							this.DefaultEmailTemplate = property[1];
						}
						break;
					case("DefaultLetterTemplate") :
						if (property[1]) {
							this.DefaultLetterTemplate = property[1];
						}
						break;
					case("congroupid") :
						if (property[1]) {
							this.DefaultGroupIDs[0] = property[1];
						}
						break;
					case("accgroupid") :
						if (property[1]) {
							this.DefaultGroupIDs[1] = property[1];
						}
						break;
					case("oppgroupid") :
						if (property[1]) {
							this.DefaultGroupIDs[2] = property[1];
						}
						break;
					case("tickgroupid") :
						if (property[1]) {
							this.DefaultGroupIDs[8] = property[1];
						}
						break;
				}
			}
		}
	}
			
    /* Clear/Init the cache */    
    ClearCachedContextInfo();
    
	/* Group info */
	this.CurrentGroupCanBeMergedTo = GroupCanBeMergedTo(GROUPTABLENAME);
	this.CurrentGroupID = (GetCurrentGroupID() != "") ? GetCurrentGroupID() : GROUPID;
	this.CurrentGroupName = (GetCurrentGroupName() != "") ? GetCurrentGroupName() : GROUPNAME;
	this.CurrentGroupTableName = GROUPTABLENAME;
	
    this.CurrentEntityIsAccount = false;
    this.CurrentEntityIsContact = false;
    this.CurrentEntityIsLead = false;
    this.CurrentEntityIsOpportunity = false;
    this.CurrentEntityIsTicket = false;
		
	/* Entity info */
	var arrEntityInfo = new Array();
    if (GetCurrentEntityInfo(arrEntityInfo))
    {
        var strEntityId = arrEntityInfo[IDX_ENTITYID];
        if (strEntityId != "")
        {
            this.CurrentEntityID = strEntityId;
            this.IsDetailView = true;
        }
        
        var strEntityDescription = arrEntityInfo[IDX_ENTITYDESCRIPTION];
        var strEntityTableName = arrEntityInfo[IDX_ENTITYTABLENAME];
        var strEntityType = arrEntityInfo[IDX_ENTITYTYPE];
        
        var strEntityKeyField = GetKeyField(strEntityTableName);
        
        this.CurrentEntityDescription = strEntityDescription;
        this.CurrentEntityDisplayName = GetEntityDisplayName(strEntityType);
        this.CurrentEntityKeyField = strEntityKeyField;
        this.CurrentEntityTableName = strEntityTableName;
        this.CurrentEntityType = strEntityType;
	        	        
        switch (strEntityType)
        {
            case "Sage.Entity.Interfaces.IAccount":
                this.CurrentEntityIsAccount = true;                 
                break;
            case "Sage.Entity.Interfaces.IContact":
                this.CurrentEntityIsContact = true;
                break;
            case "Sage.Entity.Interfaces.ILead":
                this.CurrentEntityIsLead = true;
                break;
            case "Sage.Entity.Interfaces.IOpportunity":
                this.CurrentEntityIsOpportunity = true;
                break;
            case "Sage.Entity.Interfaces.ITicket":
                this.CurrentEntityIsTicket = true;
                break;
        }
    }
    else
    {
        this.CurrentEntityDescription = "";
        this.CurrentEntityDisplayName = "";
	    this.CurrentEntityID = "";
	    this.CurrentEntityKeyField = "";
	    this.CurrentEntityTableName = "";
	    this.CurrentEntityType = "";
	    this.CurrentEntityIsAccount = false;
	    this.CurrentEntityIsContact = false;
	    this.CurrentEntityIsLead = false;
        this.CurrentEntityIsOpportunity = false;
	    this.CurrentEntityIsTicket = false;
	    this.IsDetailView = false;
    }
}

function MailMergeJS_Logout() {
	getFromServer(this.GMUrl + "Logout");
}

function MailMergeJS_GetCurrentUserCode() {
	return getFromServer(this.GMUrl + "GetUserCode");
}

MailMergeJS.prototype.Init = MailMergeJS_Init;
MailMergeJS.prototype.Logout = MailMergeJS_Logout;
MailMergeJS.prototype.GetCurrentUserCode = MailMergeJS_GetCurrentUserCode;

/*-----------------------------------------Misc. stuff------------------------------------------------------*/
function MailMergeJS_GetFileSize(strPath) {
	var i = 1;
	if (top.MailMergeGUI) {
		try {
			i = top.MailMergeGUI.GetFileSize(strPath);
		} catch(e) {
			// if it failed, we will pretend we are not here...
			i = 1;
		}
	}
	return i
}
function MailMergeJS_GetPersonalDataPath() {
	if (top.MailMergeGUI)
		return top.MailMergeGUI.GetPersonalDataPath();
}
function MailMergeJS_ExcelInstalled() {
	if (!top.MailMergeGUI)
		return false; //If no activeX do not try to use excel
	if (xlinstalled == "unknown") {
		try {
			var xlapp = new ActiveXObject("Excel.Application");
		} catch(e) {
			xlinstalled = false;
			return false;
		}
		xlinstalled = true;
	}
	return xlinstalled;
}

function MailMergeJS_GetUserPreference(strName, strCategory) {
	return getFromServer(this.IBUrl + 'userpref&prefname=' + strName + '&prefcategory=' + strCategory);
}

MailMergeJS.prototype.GetFileSize = MailMergeJS_GetFileSize;
MailMergeJS.prototype.GetPersonalDataPath = MailMergeJS_GetPersonalDataPath;
MailMergeJS.prototype.ExcelInstalled = MailMergeJS_ExcelInstalled;
MailMergeJS.prototype.GetUserPreference = MailMergeJS_GetUserPreference;

/* Non-MailMergeJS object script */
// From 7.0 SalesTopNav

function ShowTemplateEditor(from)
{        
    InitObjects();
	/* this is invoked by clicking Templates... on the Write menu (if there is one)      */
	var vTE = top.TemplateEditor
	vTE.CreateWindow();

	try {
		vTE.TransportType = 0;
		vTE.ConnectionString = CONNSTRING;
		vTE.AttachmentPath = ATTACHPATH;
		vTE.EmailSystem = 2; //emailOutlook;
		vTE.UserID = top.GM.CurrentUserID;
	
	    if (GM.CurrentEntityIsContact || GM.CurrentEntityIsLead)
	    {
	        vTE.CurrentEntityID = GM.CurrentEntityID;
	        vTE.CurrentEntityName = GM.CurrentEntityDescription;
		    vTE.CurrentEntityType = GM.CurrentEntityTableName;
	    }
	    else
	    {
		    vTE.CurrentEntityType = "CONTACT";
	    }
	    	    
		vTE.ShowAllTemplates = (from == "writeteditor");

		var tmp = vTE.bShowPreviewButton;
		vTE.bShowPreviewButton = true;

		vTE.LibraryPath  = LIBRARYPATH;

		vTE.BaseKeyCode = "";
		vTE.Remote = false;
		vTE.SiteCode = SITECODE;

		vTE.BaseLetterPluginID = 'BASELETTERTE';
		vTE.BaseFAXPluginID = 'BASEFAXTEMPL';
		vTE.BaseEMailPluginID = 'BASEEMAILTEM';

		if (from == 'writeteditor')
		{
			vTE.bShowSLXMergeButton = true;
			vTE.Manage = true;
        }

		var TEretVal = vTE.ShowModal();
		vTE.bShowSLXMergeButton = false;
		var retVal;
		if (TEretVal == 3) {
			tPluginID = vTE.SelectedTemplatePluginID;
			//instantiate MM Dialog...
			var vMM = top.MailMerge;

			vMM.CreateWindow();
			try {
				//vTE.bShowSLXMergeButton = false;
				vMM.TransportType = 0;
				vMM.ConnectionString = CONNSTRING;
				vMM.AttachmentPath   = ATTACHPATH;
				
				vMM.SiteCode = SITECODE;

				if (top.reportingEnabled == false) {
					vMM.AddressLabelsEnabled = false
				}
				
				/* Context info */
				
				if (GM.CurrentGroupCanBeMergedTo)
				{
				    vMM.CurrentGroupID   = GM.CurrentGroupID;
				    vMM.CurrentGroupName = GM.CurrentGroupName;
				    vMM.CurrentGroupType = GM.CurrentGroupTableName;
				}
				else
				{
				    vMM.CurrentGroupName = "No group";
				}
												
                if (GM.CurrentEntityIsContact || GM.CurrentEntityIsLead)
                {
                    vMM.CurrentEntityID = GM.CurrentEntityID;
                    vMM.CurrentEntityName = GM.CurrentEntityDescription;
                    vMM.CurrentEntityType = GM.CurrentEntityTableName;
                }
                
                /* The following will only occur if the user selected a Contact from a dialog based
                   on either an Account or an Opportunity. In this case the GM.CurrentEntity* values
                   are overwritten with the info associated with the selected Contact...and the
                   GM.CachedContextInfo will hold the original context information. */
                if (GM.CachedContextInfo[IDX_CACHE_ISVALID] == true)
                {   
                    if (GM.CachedContextInfo[IDX_CACHE_ENTITYID] != vMM.CurrentEntityID)
                    {
                        /* Is there an Account being displayed? */
                        if (GM.CachedContextInfo[IDX_CACHE_ENTITYISACCOUNT] == true)
                        {
                            vMM.CurrentAccountID = GM.CachedContextInfo[IDX_CACHE_ENTITYID];
                            vMM.CurrentAccountName = GM.CachedContextInfo[IDX_CACHE_ENTITYDESCRIPTION];
                        }
                        /* Is there an Opportunity being displayed? */
                        if (GM.CachedContextInfo[IDX_CACHE_ENTITYISOPPORTUNITY] == true)
                        {
                            vMM.CurrentOpportunityID = GM.CachedContextInfo[IDX_CACHE_ENTITYID];
                            vMM.CurrentOpportuntiyName = GM.CachedContextInfo[IDX_CACHE_ENTITYDESCRIPTION];
                        }
                    }
                }

				vMM.LibraryPath = LIBRARYPATH;
				vMM.EmailSystem = 2;

				vMM.UserID = top.GM.CurrentUserID;
				vMM.UserName = top.GM.UserName;
        		vMM.BaseLetterPluginID = 'BASELETTERTE';
		        vMM.BaseFAXPluginID = 'BASEFAXTEMPL';
		        vMM.BaseEMailPluginID = 'BASEEMAILTEM';
				vMM.UserNameLF = top.GM.UserName;

				var x = vMM.CreateDocument("","","",tPluginID,"",false);

			} finally {
				vMM.DestroyWindow();
			}
			retVal = 3;
		} else if (TEretVal == 1) {
			tName = vTE.SelectedTemplateName;
			tPluginID = vTE.SelectedTemplatePluginID;
			tFamily = vTE.SelectedTemplateFamily;

			vTE.bShowPreviewButton = tmp;

			retVal = 1;
		} else {
			vTE.bShowPreviewButton = tmp;
			retVal = 0;
		}
	} finally {
		vTE.DestroyWindow();
	}
	return retVal;
}

function WriteEmailUsing(APluginID) {
    InitObjects();
	MergeFromPlugin(0, APluginID);
}

/*
function WriteEmailUsingMoreTemplates(conId) {
    InitObjects();
	if (ShowTemplateEditor('moreemail') == 0) return;
	var vError = "";
	top.MailMergeGUI.ConnectionString = CONNSTRING;
	var x = top.MailMergeGUI.MRUItemExists(SITECODE, top.GM.CurrentUserID, tPluginID, 0, vError, '');
	if (x) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 0); //mmemail
	} else if (top.MailMergeGUI.ConfirmMessage("Add Template to Menu?", "Do you want to add the \"" + tName + "\" Template to your \"E-mail Using Template...\" Menu?") == 6) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 0); //mmemail
	}
	if (vError != "") {
		top.MailMergeGUI.ShowError("Error", vError);
	}
	MergeFromPlugin(0, tPluginID);
}
*/

function WriteLetterUsing(APluginID) {
    InitObjects();
	MergeFromPlugin(2, APluginID);
}

/*
function WriteLetterUsingMoreTemplates(conId) {
    InitObjects();
	if (ShowTemplateEditor('moreletter') == 0) return;

	var vError = "";
	top.MailMergeGUI.ConnectionString = CONNSTRING;
	var x = top.MailMergeGUI.MRUItemExists(SITECODE, top.GM.CurrentUserID, tPluginID, 2, vError, '');
	if (x) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 2);
	} else if (top.MailMergeGUI.ConfirmMessage("Add Template to Menu?", "Do you want to add the \"" + tName + "\" Template to your \"Letter Using Template...\" Menu?") == 6) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 2);
	}
	if (vError != "") {
		top.MailMergeGUI.ShowError("Error", vError);
	}
	MergeFromPlugin(2, tPluginID);
}
*/

function WriteFaxUsing(APluginID) {
    InitObjects();
	MergeFromPlugin(1, APluginID);
}

/*
function WriteFaxUsingMoreTemplates(conId) {
    InitObjects();
	if (ShowTemplateEditor('morefax') == 0) return;
	var vError = "";
	top.MailMergeGUI.ConnectionString = CONNSTRING;
	var x = top.MailMergeGUI.MRUItemExists(SITECODE, top.GM.CurrentUserID, tPluginID, 1, vError, '');
	if (x) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 1); //mmfax
	} else if (top.MailMergeGUI.ConfirmMessage("Add Template to Menu?", "Do you want to add the \"" + tName + "\" Template to your \"Fax Using Template...\" Menu?") == 6) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 1); //mmfax
	}
	if (vError != "") {
		top.MailMergeGUI.ShowError("Error", vError);
	}
	MergeFromPlugin(1, tPluginID);
}
*/

/*
function WriteTemplates(conId, grpId) {
    InitObjects();
    //CONGRPID = grpId;
	//gTemplateEditorMode=0;
	ShowTemplateEditor('writeteditor');
}
*/

/*
function WriteMailMerge(curType, curGroup, curEntity, curGrpName) {
    InitObjects();
	var vMM = top.MailMerge;

	vMM.CreateWindow();
	try {
		vMM.TransportType = 0;
		vMM.ConnectionString = CONNSTRING;
		vMM.AttachmentPath   = ATTACHPATH;
		vMM.SiteCode = SITECODE;

		if (top.reportingEnabled == false) {
			vMM.AddressLabelsEnabled = false
		}

        var entid = curEntity;
        var contextEntityId = getEntity();
        if (contextEntityId.charAt(0) == curEntity.charAt(0))
            entid = contextEntityId;
		var curgrpname = 'No group';
		var curgrptype = curType;
		var cid = '';
		var aid = '';
		var oid = '';
		if (curEntity.charAt(0) == 'C') { cid = entid; }
		if (curEntity.charAt(0) == 'A') { aid = entid; }
		if (curEntity.charAt(0) == 'O') { oid = entid; }
		    

		curgrpname = curGrpName;

		vMM.CurrentGroupID = curGroup;
		vMM.CurrentGroupType = curgrptype;
		vMM.CurrentGroupName = curgrpname;
		if (entid.charAt(0) == 'C') {
			vMM.CurrentEntityID = entid;
			vMM.CurrentEntityType = 'Contact';
		}
		vMM.CurrentAccountID = aid;
		vMM.CurrentOpportunityID = oid;

		vMM.LibraryPath = LIBRARYPATH;
		vMM.EmailSystem = 2;

		vMM.UserID = USERID;
		vMM.UserName = USERNAME;
		vMM.BaseLetterPluginID = 'BASELETTERTE';
		vMM.BaseFAXPluginID = 'BASEFAXTEMPL';
		vMM.BaseEMailPluginID = 'BASEEMAILTEM';
		vMM.UserNameLF = USERNAME;

		var x = vMM.ShowModal();

	} finally {
		vMM.DestroyWindow();
	}
}
*/

/*
function WriteAddressLabels(conId, grpId, grpType, grpName) {
    InitObjects();
	var vAL = top.AddressLabels;
	vAL.CreateWindow();

	try	{
		vAL.TransportType = 0;
		vAL.ConnectionString = CONNSTRING;

		var	vConID = conId;
		if (vConID != "") {
			vAL.CurrentEntityType = "Contact";
			vAL.CurrentEntityID = vConID;
			vAL.CurrentEntityName = CONNAME;
		}

		vAL.CurrentGroupID     = grpId;
		if (vAL.CurrentGroupID != "") {
  		    vAL.CurrentGroupName = grpName;
  		    var modename = "";
  		    vAL.CurrentGroupType = grpType;
		} else {
  		    vAL.CurrentGroupName = "No group";
		}


		vAL.UserID = top.GM.CurrentUserID;

		vAL.UserName = top.GM.UserName;
		if (vAL.ShowModal() == 1) {
			// Use OnPrint() event.
		}
	}	finally	{
		vAL.DestroyWindow();
	}
}
*/
	function decodeHTML(vStr) {
		vStr = vStr.replace(/&quot;/g, '"');
		vStr = vStr.replace(/&lt;/g, '<');
		vStr = vStr.replace(/&gt;/g, '>');
		vStr = vStr.replace(/&amp;/g, '&');
		return vStr;
	}

/*
function WriteEmail() {
    InitObjects();
    CONID = getMergeContactID();
  	var conEmail = getFromServer(GM.IBUrl + 'GetSingleValue&item=email&entity=CONTACT&idfield=CONTACTID&id='+CONID);
    document.location.href = "mailto:" + conEmail;
}
*/

function GetMergeEntityID()
{        
    var strContactID;
    var strEntityID;
    var strOpportunityContactID;
    var strURL;
    
    if ((GM.CurrentEntityIsLead || GM.CurrentEntityIsContact) & GM.IsDetailView)
    {
        return GM.CurrentEntityID;
    }

    /* If the current entity is an Account, Opportunity, or Ticket then grab a Contact. */
    if ((GM.CurrentEntityIsAccount || GM.CurrentEntityIsOpportunity || GM.CurrentEntityIsTicket) & GM.IsDetailView)
    {
        strUrl = ASPCOMPLETEPATH + "/SLXInfoBroker.aspx?info=getconid&id=" + UrlEncode(GM.CurrentEntityID) + "&singleonly=true";
        strContactID = getFromServer(strUrl);
        if (strContactID != "")
        {
            /* Update the GM.CurrentEntity* properties. */
            UpdateCurrentEntityInfoForEntity(strContactID, true);
            return strContactID;
        }
    }
    
    /* Let the user select a Contact. */
    strUrl = "SelectContactId.aspx";
    if (GM.CurrentEntityIsAccount & GM.IsDetailView)
    {
        strUrl += '?AccountId=' + GM.CurrentEntityID;
        strContactID = showModalDialog(strUrl, window, 'status:no;resizable:yes;dialogheight:520px;dialogwidth:740px;edge:sunken;help:no');
        if (strContactID != "")
        {
            /* Update the GM.CurrentEntity* properties. */
            UpdateCurrentEntityInfoForEntity(strContactID, true);
            return strContactID;
        }
        else
        {
            return "";
        }
    }
    if (GM.CurrentEntityIsOpportunity & GM.IsDetailView)
    {
        strUrl += '?OpportunityId=' + GM.CurrentEntityID;
        strOpportunityContactID = showModalDialog(strUrl, window, 'status:no;resizable:yes;dialogheight:480px;dialogwidth:740px;edge:sunken;help:no');
        if (strOpportunityContactID != "")
        {
            strContactID = getFromServer(ASPCOMPLETEPATH + "/SLXInfoBroker.aspx?info=getconid&id=" + UrlEncode(strOpportunityContactID));
            if (strContactID != "")
            {
                /* Update the GM.CurrentEntity* properties. */
                UpdateCurrentEntityInfoForEntity(strContactID, true);
                return strContactID;
            }
            else
            {
                return "";
            }
        }
        else
        {
            return "";
        }
    }   
    /* If we've gotten this far...we're probably in a list view or on a non-TACO/Lead view. */
    strUrl = GM.CurrentEntityIsLead ? "SelectLeadId.aspx" : "SelectContactId.aspx";
    strEntityID = showModalDialog(strUrl, window, 'status:no;resizable:yes;dialogheight:520px;dialogwidth:740px;edge:sunken;help:no');
    if (strEntityID != "")
    {
        /* Update the GM.CurrentEntity* properties. */
        UpdateCurrentEntityInfoForEntity(strEntityID, !GM.CurrentEntityIsLead);
        return strEntityID;
    }   
    
    return "";
}

/*-----------------------------------------Global (private) Variables --------------------------------------*/
    var xlinstalled = "unknown";
    var methodnotfound = "The method, '<methodname>' is not found in this object.  Please try the GMvb object.";
	var GM;
	var GMvb;
    //var isAdHocDictionary;
    var CONGRPID;
    var reportingEnabled = ((REPORTURL != "") || UseActiveReporting());
    function InitObjects() {
        //var entid = getEntity();
        //CONID = ((entid.charAt(0) == 'C') ? entid : '');
        //isAdHocDictionary = new ActiveXObject("Scripting.Dictionary");
        
        GM = new MailMergeJS();
	    GM.GMUrl = ASPCOMPLETEPATH + "/SLXGroupManager.aspx?action=";
	    GM.IBUrl = ASPCOMPLETEPATH + "/SLXInfoBroker.aspx?info=";
	    GM.baseUrl = ASPCOMPLETEPATH;
    	GM.CurrentUserID = USERID;
	    GM.TimeZone = TIMEZONE;
	    GM.UserName = USERNAME;
	    
	    GM.Init();
        GMvb = makeGobiMailMergeVb();
        reportingEnabled = ((REPORTURL != "") || UseActiveReporting());
        
        /* Clear the cache of context info */
        ClearCachedContextInfo();
        
        /* Close any open menus */
        CloseAllMenus();
    }

function setContext(key, value) {
  if (Sage.Services) { 
    var contextservice = Sage.Services.getService("ClientContextService");
    if ((contextservice) && (contextservice.containsKey(key))) {
       contextservice.setValue(key, value);
    } else {
       contextservice.add(key, value);
    }
  }
}

/*
function getEntity() {
    var res = ''
    res = getContext("ClientEntityId");
    if (res == '') {
        res = getQueryVariable("entityId");
    }
    return res;
}
*/

function getContext(key) {
  var res = '';
  if (Sage.Services) { 
    var contextservice = Sage.Services.getService("ClientContextService");
    if ((contextservice) && (contextservice.containsKey(key))) {
       res = contextservice.getValue(key);
    } 
  }
  return res;
}

function getContextVariables() {
    MENUXML = getContext("MENUXML");
    if (MENUXML == '') {
        MENUXML = top.MailMergeGUI.GetWebWriteMenu(SITECODE, USERID, 5);
        setContext("MENUXML", MENUXML);
    }
}

function initEmailNotification() {
	try
	{
		var table = GetCurrentEntityTableName().toUpperCase() == "LEAD" ? "LEAD" : "CONTACT";
		SEN.Init('ADMIN', ASPCOMPLETEPATH, CONNSTRING, table); 
	}
	catch(err)
	{
	}
}
$(document).ready(initEmailNotification);
    
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0].toLowerCase() == variable.toLowerCase()) {
            return pair[1];
        }
    } 
    return "";
}

function addRecent(doc, id, functionName, enable) {
    var specItems = doc.firstChild.firstChild.selectSingleNode("MenuItem[@MenuID=\"" + id + "\"]");
    for (var i=0; i<specItems.childNodes.length-2;i++) {
        var itemID = specItems.childNodes.item(i).attributes.item(1).nodeValue;
        var text = specItems.childNodes.item(i).attributes.item(1).nodeValue;
        var navURL = "javascript:" + functionName + "('" + specItems.childNodes.item(i).attributes.item(2).nodeValue + "')";
        var imageURL = '';
        var clientid = SubMenuId(id);
        var menu = Ext.ComponentMgr.get(id).menu;
        menu.add({ text: text,
            href: navURL,
            cls: "x-btn-text-icon",
            icon: '',
            enabled: enable
        });
    }
}

function AddNewSubMenuItem(mode, pluginId, text) {      
    var navURL = "";
    var imageURL = "";
    var id = "";
    switch (mode)
    {
        case 0:
            id = "500";  //SubMenuId("500");
            navURL = "javascript:WriteEmailUsing('" + pluginId + "')";
            break;
        case 1:
            id = "501";  //SubMenuId("501");
            navURL = "javascript:WriteLetterUsing('" + pluginId + "')";
            break;
        case 2:
            id = "502";  //SubMenuId("502");
            navURL = "javascript:WriteFaxUsing('" + pluginId + "')";
            break;
        default:
            return;
    }
    
    var menu = Ext.ComponentMgr.get(id).menu;
    menu.add({ text: text,
        href: navURL,
        cls: "x-btn-text-icon",
        icon: imageURL
    });
}

function SubMenuId(submenu)
{
    var prefix = MAILMERGEMENUCLIENTID.substring(0, MAILMERGEMENUCLIENTID.lastIndexOf('_')+1);
    return prefix + submenu + "_sub";
}

function AddNewEmailSubMenuItem(pluginId, text)
{
    AddNewSubMenuItem(0, pluginId, text);
}

function AddNewLetterSubMenuItem(pluginId, text)
{
    AddNewSubMenuItem(1, pluginId, text);
}

function AddNewFaxSubMenuItem(pluginId, text)
{
    AddNewSubMenuItem(2, pluginId, text);
}

function CloseAllMenus()
{
}

function AddMailMerge() {
    top.MailMergeGUI.ConnectionString = CONNSTRING;
    var doc = getXMLDoc(top.MailMergeGUI.GetWebWriteMenu(SITECODE, USERID, 5, CurrentEntityIsLead() ? "LEAD" : "CONTACT"));
            
    var mrulist = new Array();
    mrulist["500"] = "WriteEmailUsing";
    mrulist["501"] = "WriteLetterUsing";
    mrulist["502"] = "WriteFaxUsing";
    
    var bEnable = IsMailMergeRelatedEntity();
    
    for (var i=0; i<3; i++)
    {
        var key = String.format("50{0}", i);
        addRecent(doc, key, mrulist[key], bEnable);
        iLastSubMenuIndex = 500+i;
    }
}

function GetCurrentGroupID()
{
    var strResult = "";
    if (Sage.Services.hasService("ClientGroupContext"))
    {
        var contextSvc = Sage.Services.getService("ClientGroupContext");
        var context = contextSvc.getContext();
        strResult = context.CurrentGroupID;
    }
    return strResult;
}

function GetCurrentGroupName()
{
    var strResult = "";
    if (Sage.Services.hasService("ClientGroupContext"))
    {
        var contextSvc = Sage.Services.getService("ClientGroupContext");
        var context = contextSvc.getContext();
        strResult = context.CurrentName;
    }
    return strResult;
}

function GetCurrentEntityInfo(arrEntityInfo)
{
    var bResult = false;
    if (Sage.Services.hasService("ClientEntityContext"))
    {
        var contextSvc = Sage.Services.getService("ClientEntityContext");
        var context = contextSvc.getContext();
        /* EntityId (e.g. "CGHEA0002670") */
        var strEntityId = context.EntityId;
        arrEntityInfo.push(strEntityId);
        /* EntityType (e.g. "Sage.Entity.Interfaces.IContact") */
        var strEntityType = context.EntityType; 
        arrEntityInfo.push(strEntityType);     
        /* EntityDescription (e.g. "Abbott, John") */
        var strEntityDescription = context.Description;
        arrEntityInfo.push(strEntityDescription);  
        /* EntityTableName (e.g. "CONTACT") */
        var strEntityTableName = context.EntityTableName;
        arrEntityInfo.push(strEntityTableName);
        bResult = true;
    }
    return bResult;
}

function GetCurrentEntityDescription()
{
    var strResult = "";
    if (Sage.Services.hasService("ClientEntityContext"))
    {
        var contextSvc = Sage.Services.getService("ClientEntityContext");
        var context = contextSvc.getContext();
        strResult = context.Description;
    }
    return strResult;
}

function GetCurrentEntityId()
{
    var strResult = "";
    if (Sage.Services.hasService("ClientEntityContext"))
    {
        var contextSvc = Sage.Services.getService("ClientEntityContext");
        var context = contextSvc.getContext();
        strResult = context.EntityId;
    }
    return strResult;
}

function GetCurrentEntityTableName()
{
    var strResult = "";
    if (Sage.Services.hasService("ClientEntityContext"))
    {
        var contextSvc = Sage.Services.getService("ClientEntityContext");
        var context = contextSvc.getContext();
        strResult = context.EntityTableName;
    }
    return strResult;
}

function GetCurrentEntityType()
{
    var strResult = "";
    if (Sage.Services.hasService("ClientEntityContext"))
    {
        var contextSvc = Sage.Services.getService("ClientEntityContext");
        var context = contextSvc.getContext();
        strResult = context.EntityType;
    }
    return strResult;
}

function GetEntityDisplayName(entityType)
{
    var strResult = "";
    if (entityType != "")
    {
        switch (entityType)
        {
            case "Sage.Entity.Interfaces.IAccount":
                strResult = "Account";                 
                break;
            case "Sage.Entity.Interfaces.IContact":
                strResult = "Contact"; 
                break;
            case "Sage.Entity.Interfaces.IContract":
                strResult = "Contract"; 
                break;
            case "Sage.Entity.Interfaces.ILead":
                strResult = "Lead"; 
                break;
            case "Sage.Entity.Interfaces.IOpportunity":
                strResult = "Opportunity";
                break;
            case "Sage.Entity.Interfaces.IReturn":
                strResult = "RMA";
                break;
            case "Sage.Entity.Interfaces.ITicket":
                strResult = "Ticket";
                break;
        }
    }    
    return strResult;
}

function GroupCanBeMergedTo(groupTableName)
{
    var bResult = false;
    if (groupTableName != "")
    {
        switch (groupTableName.toUpperCase())
        {   
            case "ACCOUNT":
                bResult = true;
                break;              
            case "CONTACT":
                bResult = true;
                break;    
            case "LEAD":
                bResult = true;
                break;             
            case "OPPORTUNITY":
                bResult = true;
                break;                                        
        }
    }
    return bResult;
}

function IsMailMergeRelatedEntity()
{
    var bResult = false;
    var strEntityType = GetCurrentEntityType();
    if (strEntityType != "")
    {
        switch (strEntityType)
        {
            case "Sage.Entity.Interfaces.IAccount":
                bResult = true;                     
                break;
            case "Sage.Entity.Interfaces.IContact":
                bResult = true;
                break;
            case "Sage.Entity.Interfaces.IContract":
                bResult = true;
                break;
            case "Sage.Entity.Interfaces.ILead":
                bResult = true;
                break;
            case "Sage.Entity.Interfaces.IOpportunity":
                bResult = true;
                break;
            case "Sage.Entity.Interfaces.IReturn":
                bResult = true;
                break;
            case "Sage.Entity.Interfaces.ITicket":
                bResult = true;
                break;
            default:
                bResult = false;
                break;
        }
    }    
    return bResult;
}

function GetKeyField(tableName)
{
    var strResult = "";
    if (tableName != "")
    {
        switch (tableName.toUpperCase())
        {
            case "ACCOUNT":
                strResult = "ACCOUNTID";                       
                break;
            case "CONTACT":
                strResult = "CONTACTID";
                break;
            case "CONTRACT":
                strResult = "CONTRACTID";
                break;
            case "LEAD":
                strResult = "LEADID";
                break;
            case "OPPORTUNITY":
                strResult = "OPPORTUNITYID";
                break;
            case "RMA":
                strResult = "RMAID";
                break;
            case "TICKET":
                strResult = "TICKETID";
                break;
        }
    }
    return strResult;
}

function CurrentEntityIsContact()
{
    return (GetCurrentEntityType() == "Sage.Entity.Interfaces.IContact") ? true : false;
}

function CurrentEntityIsLead()
{
    return (GetCurrentEntityType() == "Sage.Entity.Interfaces.ILead") ? true : false;
}

function CurrentEntityIsOpportunity()
{
    return (GetCurrentEntityType() == "Sage.Entity.Interfaces.IOpportunity") ? true : false;
}

function CurrentEntityIsTicket()
{
    return (GetCurrentEntityType() == "Sage.Entity.Interfaces.ITicket") ? true : false;
}

function ShowMessage(msg)
{
    alert(msg);
}

function ClearCachedContextInfo()
{
    GM.CachedContextInfo[IDX_CACHE_ENTITYDESCRIPTION] = "";
    GM.CachedContextInfo[IDX_CACHE_ENTITYDISPLAYNAME] = "";
    GM.CachedContextInfo[IDX_CACHE_ENTITYID] = "";
    GM.CachedContextInfo[IDX_CACHE_ENTITYISACCOUNT] = false;
    GM.CachedContextInfo[IDX_CACHE_ENTITYISCONTACT] = false;
    GM.CachedContextInfo[IDX_CACHE_ENTITYISLEAD] = false;
    GM.CachedContextInfo[IDX_CACHE_ENTITYISOPPORTUNITY] = false;
    GM.CachedContextInfo[IDX_CACHE_ENTITYISTICKET] = false;
    GM.CachedContextInfo[IDX_CACHE_ENTITYKEYFIELD] = "";
    GM.CachedContextInfo[IDX_CACHE_ENTITYTABLENAME] = "";
    GM.CachedContextInfo[IDX_CACHE_ENTITYTYPE] = "";
    GM.CachedContextInfo[IDX_CACHE_ISVALID] = false;
}

function UpdateCurrentEntityInfoForEntity(entityID, bContact)
{    
    if ((GM.CurrentEntityID != entityID) & (entityID != ""))
    {
        var strAction = bContact ? "getconname" : "getleadname";
        var strUrl = ASPCOMPLETEPATH + "/SLXInfoBroker.aspx?info=" + strAction + "&id=" + UrlEncode(entityID);               
        var strEntityDescription = getFromServer(strUrl);
                
        /* Cache info */       
        ClearCachedContextInfo(); 
        GM.CachedContextInfo[IDX_CACHE_ENTITYDESCRIPTION] = GM.CurrentEntityDescription;
        GM.CachedContextInfo[IDX_CACHE_ENTITYDISPLAYNAME] = GM.CurrentEntityDisplayName;
        GM.CachedContextInfo[IDX_CACHE_ENTITYID] = GM.CurrentEntityID;
        GM.CachedContextInfo[IDX_CACHE_ENTITYISACCOUNT] = GM.CurrentEntityIsAccount;
        GM.CachedContextInfo[IDX_CACHE_ENTITYISCONTACT] = GM.CurrentEntityIsContact;
        GM.CachedContextInfo[IDX_CACHE_ENTITYISLEAD] = GM.CurrentEntityIsLead;
        GM.CachedContextInfo[IDX_CACHE_ENTITYISOPPORTUNITY] = GM.CurrentEntityIsOpportunity;
        GM.CachedContextInfo[IDX_CACHE_ENTITYISTICKET] = GM.CurrentEntityIsTicket;
        GM.CachedContextInfo[IDX_CACHE_ENTITYKEYFIELD] = GM.CurrentEntityKeyField;
        GM.CachedContextInfo[IDX_CACHE_ENTITYTABLENAME] = GM.CurrentEntityTableName;
        GM.CachedContextInfo[IDX_CACHE_ENTITYTYPE] = GM.CurrentEntityType;
        GM.CachedContextInfo[IDX_CACHE_ISVALID] = true;
        
        /* Update GM.CurrentEntity* with new values */
        GM.CurrentEntityDescription = strEntityDescription;
        GM.CurrentEntityDisplayName = bContact ? "Contact" : "Lead";
        GM.CurrentEntityID = entityID;
        GM.CurrentEntityKeyField = bContact ? "CONTACTID" : "LEADID";
        GM.CurrentEntityTableName = bContact ? "CONTACT" : "LEAD";
        GM.CurrentEntityType = bContact ? "Sage.Entity.Interfaces.IContact" : "Sage.Entity.Interfaces.ILead";

        GM.CurrentEntityIsAccount = false;
        GM.CurrentEntityIsContact = bContact ? true : false;
        GM.CurrentEntityIsLead = bContact ? false : true;
        GM.CurrentEntityIsOpportunity = false;
        GM.CurrentEntityIsTicket = false;
        
        GM.IsDetailView = true;
    }
}

function WriteEmailEx()
{   
    InitObjects();
    if (GetMergeEntityID() != "")
    {
        var strUrl = GM.IBUrl + "GetSingleValue&item={0}&entity=" + GM.CurrentEntityTableName + "&idfield=" + GM.CurrentEntityKeyField + "&id=" + GM.CurrentEntityID;
        if (postToServer(String.format(strUrl, "donotsolicit")) == 'T') {
            alert(lclDoNotSolicit);
            return;
        }
        if (postToServer(String.format(strUrl, "donotemail")) == 'T') {
            alert(lclDoNotEmail);
            return;
        }
	top.MailMergeGUI.ConnectionString = CONNSTRING;
	top.MailMergeGUI.WriteEmail(GM.CurrentEntityTableName, GM.CurrentEntityID);
    }
}

function WriteEmailUsingMoreTemplatesEx() {
    InitObjects();
	if (ShowTemplateEditor('moreemail') == 0) return;
	var vError = "";
	top.MailMergeGUI.ConnectionString = CONNSTRING;
	var x = top.MailMergeGUI.MRUItemExists(SITECODE, top.GM.CurrentUserID, tPluginID, 0, vError, '');
	if (x) {
	    vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 0); //mmemail
    } else {
        if (top.MailMergeGUI.ConfirmMessage(lclAddTemplateToMenu, FormatStr(lclEmail_AddTemplateToMenuPrompt, tName)) == 6) {
            vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 0); //mmemail
            if (vError == "") {
                AddNewEmailSubMenuItem(tPluginID, tName);
            }
        }
	}
	if (vError != "") {
		top.MailMergeGUI.ShowError("Error", vError);
	}
	MergeFromPlugin(0, tPluginID);
}

function WriteFaxUsingMoreTemplatesEx()
{
    InitObjects();
	if (ShowTemplateEditor('morefax') == 0) return;
	var vError = "";
	top.MailMergeGUI.ConnectionString = CONNSTRING;
	var x = top.MailMergeGUI.MRUItemExists(SITECODE, top.GM.CurrentUserID, tPluginID, 1, vError, '');
	if (x) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 1); //mmfax
} else if (top.MailMergeGUI.ConfirmMessage(lclAddTemplateToMenu, FormatStr(lclFax_AddTemplateToMenuPrompt, tName)) == 6) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 1); //mmfax
		if (vError == "")
		{
		    AddNewFaxSubMenuItem(tPluginID, tName);
		}		
	}
	if (vError != "") {
		top.MailMergeGUI.ShowError("Error", vError);
	}
	MergeFromPlugin(1, tPluginID);
}

function WriteLetterUsingMoreTemplatesEx()
{
    InitObjects();
	if (ShowTemplateEditor('moreletter') == 0) return;

	var vError = "";
	top.MailMergeGUI.ConnectionString = CONNSTRING;
	var x = top.MailMergeGUI.MRUItemExists(SITECODE, top.GM.CurrentUserID, tPluginID, 2, vError, '');
	if (x) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 2);
} else if (top.MailMergeGUI.ConfirmMessage(lclAddTemplateToMenu, FormatStr(lclLetter_AddTemplateToMenuPrompt, tName)) == 6) {
		vError = top.WriteMenu(top.GM.CurrentUserID, tName, tPluginID, 2);
		if (vError == "")
		{
		    AddNewLetterSubMenuItem(tPluginID, tName);
		}			
	}
	if (vError != "") {
		top.MailMergeGUI.ShowError("Error", vError);
	}
	MergeFromPlugin(2, tPluginID);
}

function WriteMailMergeEx()
{       
    InitObjects();
	var vMM = top.MailMerge;

	vMM.CreateWindow();
	try
	{
		vMM.TransportType = 0;
		vMM.ConnectionString = CONNSTRING;
		vMM.AttachmentPath   = ATTACHPATH;
		vMM.SiteCode = SITECODE;

		if (top.reportingEnabled == false)
		{
			vMM.AddressLabelsEnabled = false
		}
		    
		if (GM.CurrentGroupCanBeMergedTo)
		{
		    vMM.CurrentGroupID = GM.CurrentGroupID;
		    vMM.CurrentGroupType = GM.CurrentGroupTableName;
		    vMM.CurrentGroupName = (GM.CurrentGroupName != "") ? GM.CurrentGroupName : "No group";
		}
		
		if (GM.CurrentEntityIsContact || GM.CurrentEntityIsLead)
		{
		    vMM.CurrentEntityID = GM.IsDetailView ? GM.CurrentEntityID : "";
            vMM.CurrentEntityName = GM.IsDetailView ? GM.CurrentEntityDescription : GM.CurrentEntityIsLead ? "No lead" : "No contact";
	        vMM.CurrentEntityType = GM.CurrentEntityDisplayName;
	    }
	    vMM.CurrentAccountID = GM.CurrentEntityIsAccount ? GM.CurrentEntityID : "";
	    vMM.CurrentAccountName = GM.CurrentEntityIsAccount ? GM.CurrentEntityDescription : "";
	    vMM.CurrentOpportunityID = GM.CurrentEntityIsOpportunity ? GM.CurrentEntityID : "";
	    vMM.CurrentOpportunityName = GM.CurrentEntityIsOpportunity ? GM.CurrentEntityDescription : "";

		vMM.LibraryPath = LIBRARYPATH;
		vMM.EmailSystem = 2;

		vMM.UserID = USERID;
		vMM.UserName = USERNAME;
		vMM.BaseLetterPluginID = 'BASELETTERTE';
		vMM.BaseFAXPluginID = 'BASEFAXTEMPL';
		vMM.BaseEMailPluginID = 'BASEEMAILTEM';
		vMM.UserNameLF = USERNAME;

		var x = vMM.ShowModal();

	}
	finally
	{
		vMM.DestroyWindow();
	}
}

function WriteAddressLabelsEx()
{
    InitObjects();
	var vAL = top.AddressLabels;
	vAL.CreateWindow();

	try
	{
		vAL.TransportType = 0;
		vAL.ConnectionString = CONNSTRING;

        if (GM.CurrentGroupCanBeMergedTo)
        {
		    vAL.CurrentGroupID = GM.CurrentGroupID;
		    vAL.CurrentGroupType = GM.CurrentGroupTableName;
		    vAL.CurrentGroupName = (GM.CurrentGroupName != "") ? GM.CurrentGroupName : "No group";
		}
		
		if (GM.CurrentEntityIsContact || GM.CurrentEntityIsLead)
		{
	        vAL.CurrentEntityID = GM.IsDetailView ? GM.CurrentEntityID : "";
	        vAL.CurrentEntityName = GM.IsDetailView ? GM.CurrentEntityDescription : GM.CurrentEntityIsLead ? "No lead" : "No contact";
		    vAL.CurrentEntityType = GM.CurrentEntityDisplayName;
		}

		vAL.UserID = top.GM.CurrentUserID;

		vAL.UserName = top.GM.UserName;
		if (vAL.ShowModal() == 1)
		{
			// Use OnPrint() event.
		}
	}
	finally
	{
		vAL.DestroyWindow();
	}
}

function WriteTemplatesEx()
{
    InitObjects();
	//gTemplateEditorMode = 0;
	ShowTemplateEditor('writeteditor');
}

function FormatStr(str, value)
{
    return str.replace('%s', value);
}

function UseActiveReporting() {
    return (REMOTE_USEACTIVEREPORTING == "T");
}

function ShowReportUsingActiveReporting(sql, reportId) {
    if (typeof (SLXCRV) === "undefined") {
        alert("The SalesLogix Crystal Report Viewer is not installed.");
        return;
    }
    if (SLXCRV.IsCrystalViewerInstalled() == false) {
        alert("The Crystal ActiveX Report Viewer is not installed.");
        return;
    }
    if (SLXCRV.IsCrystalReportsRunTimeInstalled() == false) {
        alert("The Crystal Reports ActiveX Designer Run Time Library is not installed.");
        return;
    }
    var ConnectionString = REMOTE_CONNECTIONSTRING;
    var DataSource = REMOTE_DATASOURCE;
    var DatabaseServer = parseInt(REMOTE_DBTYPE);
    var SSL = (window.parent.document.location.protocol.toUpperCase().indexOf("HTTPS") == -1 ? "0" : "1");
    var KeyField = "CONTACT.CONTACTID";
    var Password = PWD;
    var PluginId = reportId;
    var RecordSelection = "";
    var SortDirections = "";
    var SortFields = "";
    var UserCode = USERNAME;
    
    var SQLSelect = "";
    var SQLWhere = ""; 
    var ForceSQL = false;      
    if (sql.toUpperCase().indexOf("SELECT ") == 0)
    {
        SQLSelect = sql;
        SQLWhere = "";
        ForceSQL = true;
    }
    else
    {
        SQLSelect = "";
        SQLWhere = sql;
        ForceSQL = false;    
    }       

    SLXCRV.ShowReport(ConnectionString, DataSource, DatabaseServer, ForceSQL, SSL, KeyField, Password, PluginId, RecordSelection, SortDirections, SortFields, SQLSelect, SQLWhere, UserCode);
}


function GetMailMergeServerUrl() {
    var strLocation = window.location;
    var iIndex = String(strLocation).lastIndexOf("/");
    if (iIndex != -1) {
        var strUrl = String(strLocation).substring(0, iIndex);
        strUrl += "/SLXMailMergeServer.ashx";
        return strUrl;
    }
    return null;
}

var mmServerUrl = GetMailMergeServerUrl();
if ((mmServerUrl != null) && (mmServerUrl != "")) {
    CONNSTRING = mmServerUrl;
}

/////////////////////////////////////////////////////////////////////////////
// http://ajax.asp.net/docs/ClientReference/Sys/ApplicationClass/SysApplicationNotifyScriptLoadedMethod.aspx
/////////////////////////////////////////////////////////////////////////////
if (typeof(Sys) !== 'undefined') { Sys.Application.notifyScriptLoaded(); }
/*
    --------------------------------------------------------
    DO NOT PUT SCRIPT BELOW THE CALL TO notifyScriptLoaded()
    --------------------------------------------------------
*/
