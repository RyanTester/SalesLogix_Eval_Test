var currentCompleteCheckboxCtrl = null;
var luUserEventSubscribed = false;
var luOppContactEventSubscribed = false;
var currentProcessAction = null;

var OppSPMessages;

YAHOO.util.Event.addListener(window, 'load', initSalesProcessScript);
function initSalesProcessScript() {
    Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(salesProcessPageLoad);
}

function salesProcessPageLoad() {
    luOppContactEventSubscribed = false;
    luUserEventSubscribed = false;
}

function ProcessAction(stepId, actionType) {
    this.state = 0;
    this.stepId = stepId;
    this.xml = null;
    this.actionType = actionType;
    this.primaryContactId = null;
    this.selectedContactId = null;
    this.selectedUserId = null;
    this.selectWithOption = '';
    this.selectForOption = '';
    this.selectForValue = '';
    this.selectUserDesc = 'Schedule for user:';
    this.selectContactDesc = 'Schedule with contact:';
    this.IsInit = false;
}

function ProcessAction_Execute() {
    sp_ShowProcessView();

    if ((this.xml == null) && (this.state == 0)) {
        this.LoadXML();
    }

    if ((this.selectedContactId == null) && (this.state == 1)) {
        this.ResolveContact();
    }

    if ((this.selectedUserId == null) && (this.state == 2)) {
        this.ResolveUser();
    }

    if ((this.IsInit == true) && (this.state == 3)) {
        this.DoAction();
    }
}

function ProcessAction_Init() {
    //Default 
    this.selectWithOption = 'PRIMARYOPPCONTACT';
    this.selectForOption = 'CURRENTUSER';
    this.selectForValue = null;
    this.IsInit = true;
    this.Execute();
}

function ProcessAction_DoAction() {
    if (this.IsInit == true) {
        this.ShowMessage(OppSPMessages.ProcessingAction);
        //By Default we will post back for server side processing
        var cmdCtrl = document.getElementById(spCtrlIDs.cmdDoActionCtrlId);
        var actionContextCtrl = document.getElementById(spCtrlIDs.actionContextCtrlId);
        actionContextCtrl.value = this.stepId;
        sp_InvokeClickEvent(cmdCtrl);
    } 
}

function ProcessAction_LoadXML() {
    this.ShowStatus(OppSPMessages.InitAction);
    this.ShowMessage(OppSPMessages.PleaseWait);
    var result = null;
    result = sp_Service('GetActionXML', this.stepId);
    if (result == null) {
        this.WebServiceErrorHandler(result);
    }
    else {
        this.WebServiceHandler(result);
    }
}

function ProcessAction_WebServiceHandler(result) {
    if (this.state == 0) {
        this.state = 1;
        this.xml = result;
        this.Init();
    }
}

function ProcessAction_WebServiceErrorHandler(result) {
    if (this.state == 0) {
        this.ShowStatus('Error getting XML !' + result);
        this.Finish();
    } 
}

function ProcessAction_ResolveContact() {
    var contactId = null;
    this.ShowMessage(this.selectContactDesc);
    switch (this.selectWithOption.toUpperCase()) {
        case 'PRIMARYOPPCONTACT':
            contactId = sp_GetPrimaryOppContact();
            this.state = 2;
            break;
        case 'USERSELECTEDCONTACT':
            sp_SelectContact();
            break;
        case 'ALLOPPCONTACTS':
            contactId = 'ALLOPPCONTACTS';
            this.state = 2;
            break;
        default:
            contactId = 'Unknown';
            this.state = 2;
            break;
    }
    this.selectedContactId = contactId;
    var selectedContactIddElement = document.getElementById(spCtrlIDs.selectedContactIdCtrlId);
    selectedContactIddElement.value = contactId;
}

function ProcessAction_LuOppContactHandler(type, args) {
    var divLUCtrl = document.getElementById('divLUControls');
    divLUCtrl.style.display = 'none';
    var luOppContactTextCtrl = document.getElementById(spCtrlIDs.luOppContactCtrlId + '_LookupResult');
    var selectContactId = document.getElementById(spCtrlIDs.selectedContactIdCtrlId);
    selectContactId.value = luOppContactTextCtrl.value;
    if (currentProcessAction != null) {
        currentProcessAction.state = 2;
        currentProcessAction.selectedContactId = selectContactId.value;
        currentProcessAction.Execute();
    }
}

function ProcessAction_ResolveUser() {
    var userId = null;
    this.ShowMessage(this.selectUserDesc);
    switch (this.selectForOption.toUpperCase()) {
        case "CURRENTUSER":
            userId = sp_GetCurrentUser();
            this.state = 3;
            break;
        case "ACCTMGR":
            userId = sp_GetAcctManager();
            this.state = 3;
            break;
        case "SPECIFIC":
            userId = this.selectForValue;
            this.state = 3;
            break;
        case "SELECT":
            sp_SelectUser();
            break;
        default:
            userId = 'Unknown';
            this.state = 3;
            break;
    }
    this.selectedUserId = userId;
    var selectedUserIdElement = document.getElementById(spCtrlIDs.selectedUserIdCtrlId);
    selectedUserIdElement.value = userId;
}

function ProcessAction_LuUserHandler(type, args) {
    var divLUCtrl = document.getElementById('divLUControls');
    divLUCtrl.style.display = 'none';
    var luUserTextCtrl = document.getElementById(spCtrlIDs.luUserCtrlId + '_LookupResult');
    var selectedUserId = document.getElementById(spCtrlIDs.selectedUserIdCtrlId);
    selectedUserId.value = luUserTextCtrl.value;
    if (currentProcessAction != null) {
        currentProcessAction.state = 3;
        currentProcessAction.selectedUserId = selectedUserId.value;
        currentProcessAction.Execute();
    }
}

function ProcessAction_ShowMessage(message)
{
    sp_ShowMessage(message);
}

function ProcessAction_Finish() {
    sp_CloseProcessView()
    sp_CloseStatus();
}

function ProcessAction_ShowStatus(status) {
    sp_ShowStatus(status);
}
  
ProcessAction.prototype.Execute = ProcessAction_Execute;
ProcessAction.prototype.Init = ProcessAction_Init;
ProcessAction.prototype.LoadXML = ProcessAction_LoadXML;
ProcessAction.prototype.ResolveContact = ProcessAction_ResolveContact;
ProcessAction.prototype.LuOppContactHandler = ProcessAction_LuOppContactHandler;
ProcessAction.prototype.ResolveUser = ProcessAction_ResolveUser;
ProcessAction.prototype.LuUserHandler = ProcessAction_LuUserHandler;
ProcessAction.prototype.ShowMessage = ProcessAction_ShowMessage;
ProcessAction.prototype.ShowStatus = ProcessAction_ShowStatus;
ProcessAction.prototype.WebServiceHandler = ProcessAction_WebServiceHandler;
ProcessAction.prototype.WebServiceErrorHandler = ProcessAction_WebServiceErrorHandler;
ProcessAction.prototype.DoAction = ProcessAction_DoAction;
ProcessAction.prototype.Finish = ProcessAction_Finish;

function onSalesProcessChange() {
    var msg;
    var index;
    var newSalesProcessName;

    canInit = true;

    var currentSalesProcessName = document.getElementById(spCtrlIDs.currentSalesProcessCtrlId).value;
    var numStepsCompleted = document.getElementById(spCtrlIDs.numOfStepsCompletedCtrlId).value;
    index = document.getElementById(spCtrlIDs.ddlSalesProcessCtrlId).selectedIndex;
    newSalesProcessName = document.getElementById(spCtrlIDs.ddlSalesProcessCtrlId).options[index].text;
    if (numStepsCompleted != '0') {
        msg = String.format(OppSPMessages.ChangeSalesProcess, currentSalesProcessName, newSalesProcessName);
        canInit = confirm(msg);
    }
    if (canInit) {
        // Let the server postback handle the Re Initialization of the SalesProcess.
        Sys.WebForms.PageRequestManager.getInstance()._doPostBack(spCtrlIDs.ddlSalesProcessCtrlId, null);
    }
    else {
        SetSalesProcessDDL(currentSalesProcessName);
    }
}

function SetSalesProcessDDL(salesProcessName) {

    var ddl = document.getElementById(spCtrlIDs.ddlSalesProcessCtrlId);
    for (var i = 0; i < ddl.options.length; i++) {
        if (ddl.options[i].text == salesProcessName) {
            ddl.selectedIndex = i;
            break;
        }
    }
}

function SetStageDDL(stageId) {
    var ddl = document.getElementById(spCtrlIDs.ddlStagesCtrlId);
    for (var i = 0; i < ddl.options.length; i++) {
        if (ddl.options[i].value == stageId) {
            ddl.selectedIndex = i;
            break;
        }
    }
}

function doPostBack(control) {
    Sys.WebForms.PageRequestManager.getInstance()._doPostBack(control.id, null);
}

function onCompleteStep(cmdCompleteCtrlId, stepContextCtrlId, stepContext) {
    var cmdCtrl = document.getElementById(cmdCompleteCtrlId);
    var stepContextCtrl = document.getElementById(stepContextCtrlId);
    stepContextCtrl.value = stepContext;
    sp_InvokeClickEvent(cmdCtrl);
}

function onCompleteStepWithDate(sender, cmdCompleteCtrlId, contextCtrlId, contextValue) {
    var cmdCtrl = document.getElementById(cmdCompleteCtrlId);
    var contextCtrl = document.getElementById(contextCtrlId);
    contextCtrl.value = contextValue + ':' + sender.value;
    sp_InvokeClickEvent(cmdCtrl);
}

function onStartStepWithDate(sender, cmdStartCtrlId, contextCtrlId, contextValue) {
    var cmdCtrl = document.getElementById(cmdStartCtrlId);
    var contextCtrl = document.getElementById(contextCtrlId);
    contextCtrl.value = contextValue + ':' + sender.value;
    sp_InvokeClickEvent(cmdCtrl);
}

function sp_InvokeClickEvent(control) {
    if (document.createEvent) {
        // FireFox
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        control.dispatchEvent(e);
    }
    else {
        // IE
        control.click();
    }
}

// we can remove this since we do this as a post back
function onStageChange() {
    var ddlStagesCtrl = document.getElementById(spCtrlIDs.ddlStagesCtrlId);
    if (ddlStagesCtrl != null) {
        var index = document.getElementById(spCtrlIDs.ddlStagesCtrlId).selectedIndex;
        var spaId = document.getElementById(spCtrlIDs.ddlStagesCtrlId).options(index).value;
    }
}

// we can remove this since we do this as a post back
function onStageChangeCallBack(result) {
    var ddlStagesCtrl = document.getElementById(spCtrlIDs.ddlStagesCtrlId);
    var currentStageId = document.getElementById(spCtrlIDs.currentStageCtrlId).value;
    if (ddlStagesCtrl != null) {
        if (result == "") {
            alert(result);
            // There is no un compeleted required steps so go ahead and change the stage.
            // Let the server postback handle the changing of the stage.
            Sys.WebForms.PageRequestManager.getInstance()._doPostBack(ddlStagesCtrl.id, null);
        }
        else {
            // stop and do not continue. 
            // we need to display the message.
            alert(result);
            SetStageDDL(currentStageId);
        }
    }
}

// we can remove this since we do this as a post back
function onStageChangeCallBackError(result) {
    var ddlStagesCtrl = document.getElementById(spCtrlIDs.ddlSalesProcessCtrlId);
    var currentStageId = document.getElementById(spCtrlIDs.currentStageCtrlId).value;
    if (ddlStagesCtrl != null) {
        alert(result);
        SetStageDDL(currentStageId);
    }
}

function sp_SelectContactOld(returnHandler) {
    if (luOppContactObj == null) {
        luOppContactObj = eval(spCtrlIDs.luOppContactObj); // @LUOPPCONTACTOBJ;
    }
    var divLUCtrl = document.getElementById('divLUControls');
    divLUCtrl.style.display = 'block';
    var luOppContactBtnCtrl = document.getElementById(spCtrlIDs.luOppContactCtrlId + '_LookupBtn');
    if (luOppContactBtnCtrl != null) {
        //we must create the panel first!
        luOppContactBtnCtrl.onclick();
    }
    if (luOppContactEventSubscribed == false) {
        luOppContactObj.panel.hideEvent.subscribe(returnHandler);
        luOppContactEventSubscribed = true;
    }
}

function sp_SelectContact() {
    var divSelectContact = document.getElementById('spSelectContactDiv');
    var divSelectUser = document.getElementById('spSelectUserDiv');
    var divMain = document.getElementById('spMain');
    divSelectContact.style.display = 'block';
    divSelectUser.style.display = 'none';
    var luOppContactTextCtrl = document.getElementById(spCtrlIDs.luOppContactCtrlId + '_LookupResult');
    luOppContactTextCtrl.value = '';
    var luOppContactBtnCtrl = document.getElementById(spCtrlIDs.luOppContactCtrlId + '_LookupBtn');
    if (luOppContactBtnCtrl != null) {
        //Open up the look up!
        luOppContactBtnCtrl.onclick();
    }
}

function onSelectContactNext() {
    var luOppContactTextCtrl = document.getElementById(spCtrlIDs.luOppContactCtrlId + '_LookupResult');
    var selectContactId = document.getElementById(spCtrlIDs.selectedContactIdCtrlId);
    selectContactId.value = luOppContactTextCtrl.value;
    if (currentProcessAction != null) {
        if (selectContactId.value == '') {
            alert(OppSPMessages.MustSelectContact);
        }
        else {
            var divSelectContact = document.getElementById('spSelectContactDiv');
            divSelectContact.style.display = 'none';
            var result = sp_Service("RESOLVEOPPCONTACT", selectContactId.value);
            selectContactId.value = result;
            currentProcessAction.selectedContactId = selectContactId.value;
            currentProcessAction.state = 2;
            currentProcessAction.Execute();
        }
    }
    return false;
}

function sp_SelectUserOld(returnHandler) {
    if (luUserObj == null) {
        luUserObj = eval(spCtrlIDs.luUserObj); // @LUUSEROBJ;
    }
    var divLUCtrl = document.getElementById('divLUControls');
    divLUCtrl.style.display = 'block';
    luUserObj.Show();
    if (luUserEventSubscribed == false) {
        luUserObj.panel.hideEvent.subscribe(returnHandler);
        luUserEventSubscribed = true;
    }
}

function onSelectUserNext() {
    var luUserTextCtrl = document.getElementById(spCtrlIDs.luUserCtrlId + '_LookupResult');
    var selectedUserId = document.getElementById(spCtrlIDs.selectedUserIdCtrlId);
    selectedUserId.value = luUserTextCtrl.value;
    if (currentProcessAction != null) {
        if (selectedUserId.value == '') {
            alert(OppSPMessages.MustSelectUser);
        }
        else {
            var divSelectContact = document.getElementById('spSelectContactDiv');
            divSelectContact.style.display = 'none';

            currentProcessAction.state = 3;
            currentProcessAction.selectedUserId = selectedUserId.value;
            currentProcessAction.Execute();
        }
    }
    return false;
}

function sp_SelectUser()
{
    var divSelectContact = document.getElementById('spSelectContactDiv');
    var divSelectUser = document.getElementById('spSelectUserDiv');
    var divMain = document.getElementById('spMain');
    divSelectContact.style.display = 'none';
    divSelectUser.style.display = 'block';
    return false;
}

function sp_GetCurrentUser()
{
    sp_ShowMessage(OppSPMessages.GettingCurrentUser); 
    var ctrl = document.getElementById(spCtrlIDs.currentUserIdCtrlId);
    var result = ctrl.value;
    return result;
}

function sp_GetPrimaryOppContact()
{
    sp_ShowMessage(OppSPMessages.GettingOppContact);
    var ctrl = document.getElementById(spCtrlIDs.primaryOppContactIdCtrlId);
    var result = ctrl.value;
    return result;
}

function sp_GetOppContactCount() {
    var ctrl = document.getElementById(spCtrlIDs.oppContactCountCtrlId);
    var result = ctrl.value;
    return result;
}

function sp_GetAcctManager() {
    sp_ShowMessage(OppSPMessages.GettingOppContact);
    var ctrl = document.getElementById(spCtrlIDs.accountManagerIdCtrlId);
    var result = ctrl.value;
    return result;
}

function sp_GetOpportunity() {
    var ctrl = document.getElementById(spCtrlIDs.opportunityIdCtrlId);
    var result = ctrl.value;
    return result;
}

function executeAction(stepId, actionType) {
    currentProcessAction = null;
    //Reset the default functions..
    ProcessAction.prototype.Init = ProcessAction_Init;
    ProcessAction.prototype.DoAction = ProcessAction_DoAction;
    var boolExecute = false;
    switch (actionType) {
        case 'None':
            break;
        case 'MailMerge':
            if (!top.MailMergeGUI) {
                sp_Alert(OppSPMessages.RequiresActiveMail);
                return;
                boolExecute = false;
            }
            else {
                ProcessAction.prototype.Init = Init_MailMerge;
                ProcessAction.prototype.DoAction = doMailMerge;
                boolExecute = true;
            }
            break;
        case 'Script':
            break;
        case 'Form':
            break;
        case 'PhoneCall':
            ProcessAction.prototype.Init = Init_Activity;
            boolExecute = true;
            break;
        case 'ToDo':
            ProcessAction.prototype.Init = Init_Activity;
            boolExecute = true;
            break;
        case 'Meeting':
            ProcessAction.prototype.Init = Init_Activity;
            boolExecute = true;
            break;
        case 'LitRequest':
            ProcessAction.prototype.Init = Init_LitRequest;
            boolExecute = true;
            break;
        case 'ContactProcess':
            ProcessAction.prototype.Init = Init_ContactProcess;
            boolExecute = true;
            break;
        case 'ActivityNotePad':
            break;
        default:
            break;
    }
    if (boolExecute == true) {
        var result = sp_Service("CANCOMPLETESTEP", stepId);
        if (result != '') {
            sp_Alert(result);
            currentProcessAction = null;
        }
        else {
            currentProcessAction = new ProcessAction(stepId, actionType);
            currentProcessAction.Execute();
        }
    }
    else {
        currentProcessAction = null;
    }
}

function Init_MailMerge() {
    this.ShowMessage(OppSPMessages.InitMailMerge);

    var xmlDoc = sp_GetXmlDoc(this.xml);
    var objAct = xmlDoc.getElementsByTagName('MergeOptions');
    var strAuthorType = objAct[0].getElementsByTagName('Author')[0].getElementsByTagName('Type')[0].firstChild.nodeValue;
    var strAuthorValue = objAct[0].getElementsByTagName('Author')[0].getElementsByTagName('Value')[0].firstChild.nodeValue;
    var strMergeWith = objAct[0].getElementsByTagName('MergeWith')[0].firstChild.nodeValue;

    this.selectWithOption = strMergeWith;
    this.selectForOption = strAuthorType;
    this.selectForValue = strAuthorValue;
    this.selectUserDesc = OppSPMessages.SelectAuthor;
    this.selectContactDesc = OppSPMessages.MergeWith;
    this.ShowStatus(OppSPMessages.PerformingMailMerge);
    this.ShowMessage(OppSPMessages.PleaseWait);
    this.IsInit = true;
    this.Execute();
}

function doMailMerge() {
    this.ShowMessage(OppSPMessages.ProcessingMailMerge);

    var xmlDoc = sp_GetXmlDoc(this.xml);
    var objAct = xmlDoc.getElementsByTagName('FollowUpActivity');
    var scheduleForType = objAct[0].getElementsByTagName('Leader')[0].getElementsByTagName('Type')[0].firstChild.nodeValue;
    var scheduleForValue = objAct[0].getElementsByTagName('Leader')[0].getElementsByTagName('Value')[0].firstChild.nodeValue;
    var leaderId = '';

    switch (scheduleForType.toUpperCase()) {
        case 'CURRENTUSER':
            leaderId = sp_GetCurrentUser();
            break;
        case 'ACCTMGR':
            leaderId = sp_GetAcctManager();
            break;
        case 'SPECIFIC':
            leaderId = scheduleForValue;
            break;
        default:
            leaderId = sp_GetCurrentUser();
            break;
    }
    this.ShowMessage(OppSPMessages.ProcessingMailMerge);

    sp_DoMailMergeVB(this.xml, this.selectedContactId, this.selectedUserId, leaderId);

    this.Finish();
    return false;
}

function Init_Activity() {
    this.ShowMessage(OppSPMessages.InitActivity);

    var xmlDoc = sp_GetXmlDoc(this.xml);
    var objAct = xmlDoc.getElementsByTagName('ActivityAction');
    var strScheduleForType = objAct[0].getElementsByTagName('ScheduleFor')[0].getElementsByTagName('Type')[0].firstChild.nodeValue;
    var strScheduleForValue = objAct[0].getElementsByTagName('ScheduleFor')[0].getElementsByTagName('Value')[0].firstChild.nodeValue;
    var strScheduleWith = objAct[0].getElementsByTagName('ScheduleWith')[0].firstChild.nodeValue;
    var desc = '';
    switch (this.actionType.toUpperCase()) {
        case 'TODO':
            desc = OppSPMessages.ToDo;
            break;
        case 'PHONECALL':
            desc = OppSPMessages.PhoneCall;
            break;
        case 'MEETING':
            desc = OppSPMessages.Meeting;
            break;
        default:
            desc = 'Activty';
            break;
    }

    this.selectWithOption = strScheduleWith;
    this.selectForOption = strScheduleForType;
    this.selectForValue = strScheduleForValue;
    this.selectUserDesc = OppSPMessages.SelectActLeader;
    this.selectContactDesc = OppSPMessages.ScheduleWithContact;
    this.ShowStatus(String.format(OppSPMessages.PerformingActivity, desc));
    this.IsInit = true;
    this.Execute();
}

function Init_LitRequest() {
    this.ShowMessage(OppSPMessages.InitLitRequest);

    var xmlDoc = sp_GetXmlDoc(this.xml);
    var objAct = xmlDoc.getElementsByTagName('LitRequestAction');
    var strScheduleForType = objAct[0].getElementsByTagName('Author')[0].getElementsByTagName('Type')[0].firstChild.nodeValue;
    var strScheduleForValue = objAct[0].getElementsByTagName('Author')[0].getElementsByTagName('Value')[0].firstChild.nodeValue;
    var strScheduleWith = objAct[0].getElementsByTagName('RequestFor')[0].firstChild.nodeValue;

    this.selectWithOption = strScheduleWith;
    this.selectForOption = strScheduleForType;
    this.selectForValue = strScheduleForValue;
    this.selectUserDesc = OppSPMessages.SelectAuthor;
    this.selectContactDesc = OppSPMessages.RequestFor;
    this.ShowStatus(OppSPMessages.PerformingLitReq);
    this.IsInit = true;
    this.Execute();
}

function Init_ContactProcess() {
    this.ShowMessage(OppSPMessages.InitContactProc);

    var xmlDoc = sp_GetXmlDoc(this.xml);
    var objAct = xmlDoc.getElementsByTagName('ContactProcessAction');
    var strScheduleWith = objAct[0].getElementsByTagName('ScheduleWith')[0].firstChild.nodeValue;

    this.selectWithOption = strScheduleWith;
    this.selectForOption = '';
    this.selectForValue = '';
    this.selectContactDesc = OppSPMessages.ScheduleWithContact;
    this.ShowStatus(OppSPMessages.PerformingContactProc);
    this.IsInit = true;
    this.Execute();
}

function sp_Service(serviceType, serviceContext) {
    var vURL = "./SmartParts/OpportunitySalesProcess/SalesProcessService.aspx?serviceType=" + serviceType + "&serviceContext=" + serviceContext + "&datetime=" + Date();
    if (typeof (xmlhttp) == "undefined") {
        xmlhttp = YAHOO.util.Connect.createXhrObject().conn;
    }
    xmlhttp.open("GET", vURL, false);
    xmlhttp.send(null);

    var results = xmlhttp.responseText;
    return results;
}

function sp_ShowStatus(status) {
    var divStatus = document.getElementById('spStatus');
    var divMain = document.getElementById('spMain');
    divStatus.innerHTML = status;
    divStatus.style.display = 'block';
    divMain.style.display = 'none';
}

function sp_CloseStatus() {
    var divStatus = document.getElementById('spStatus');
    var divMain = document.getElementById('spMain');
    divStatus.style.display = 'none';
    divMain.style.display = 'block';
    sp_CloseMessage();
}

function sp_ShowMessage(msg) {
    var divCtrl = document.getElementById('spMsg');
    divCtrl.innerHTML = '<b>' + msg + '</b>';
    divCtrl.style.display = 'block';
}

function sp_CloseMessage() {
    var divCtrl = document.getElementById('spMsg');
    divCtrl.style.display = 'none';
}

function sp_ShowProcessView() {
    var divCtrl = document.getElementById('spProcessView');
    divCtrl.style.display = 'block';
}

function sp_CloseProcessView() {
    var divCtrl = document.getElementById('spProcessView');
    divCtrl.style.display = 'none';
}

function sp_GetXmlDoc(xmlData) {
    var xmlDoc = null;
    // If IE
    if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlData);
    }
    // Else Firefox
    else {
        var domParser = new DOMParser();
        xmlDoc = domParser.parseFromString(xmlData, "text/xml");
    }
    return xmlDoc;
}

function sp_Format(formatString, value1, value2) {
    return String.format(formatString, value1, value2);
}

function sp_Alert(message) {
    var msgService = Sage.Services.getService("WebClientMessageService");
    if (msgService) {
        msgService.showClientMessage(message);
    }
}

function btnDisable(btnStages) {
    document.getElementById(btnStages).style.display = 'none';
    document.getElementById(btnStages + 'Hide').style.display = 'inline';
}
if (typeof (Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();