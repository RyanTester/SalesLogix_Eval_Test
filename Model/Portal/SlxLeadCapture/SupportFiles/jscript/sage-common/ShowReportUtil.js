/* ShowReportUtil.js contains functions to display a report for the current entity only. It does not handle groups. */

/* The following global variables define the default reports for the primary main views. */
var REPORT_ACCOUNT = "Account:Account Detail";
var REPORT_CONTACT = "Contact:Contact Detail";
var REPORT_OPPORTUNITY = "Opportunity:Opportunity Detail";
var REPORT_DEFECT = "Defect:Support Defect";
var REPORT_TICKET = "Ticket:Support Ticket";

/* Set this to the report value for a view other than Account, Contact, Opportunity, Defect, or Ticket. */
/* NOTE: This value should be set to a value that is supported for the current view. */
/* The helper function SetDefaultReport(Report) can be used to set this value (e.g. SetDefaultReport("Lead:Lead Detail"). */
var REPORT_DEFAULT = "";

/* Helper functions for working with the reports associated with specific entities. */

function GetAccountReport() {
    return REPORT_ACCOUNT;
}

function SetAccountReport(Report) {
    REPORT_ACCOUNT = Report;
}

function GetContactReport() {
    return REPORT_CONTACT;
}

function SetContactReport(Report) {
    REPORT_CONTACT = Report;
}

function GetOpportunityReport() {
    return REPORT_OPPORTUNITY;
}

function SetOpportunityReport(Report) {
    REPORT_OPPORTUNITY = Report;
}

function GetDefectReport() {
    return REPORT_DEFECT;
}

function SetDefectReport(Report) {
    REPORT_DEFECT = Report;
}

function GetTicketReport() {
    return REPORT_TICKET;
}

function SetTicketReport(Report) {
    REPORT_TICKET = Report;
}

function GetDefaultReport() {
    return REPORT_DEFAULT;
}

function SetDefaultReport(Report) {
    REPORT_DEFAULT = Report;
}

/* Returns the report associated with the current view, if any. */
function GetCurrentReport() {
    var result = null;
    if (Sage.Services.hasService("ClientEntityContext")) {
        var contextSvc = Sage.Services.getService("ClientEntityContext");
        var context = contextSvc.getContext();
        var strTableName = context.EntityTableName.toUpperCase();
        switch (strTableName) {
            case "ACCOUNT":
                return GetAccountReport();
                break;
            case "CONTACT":
                return GetContactReport();
                break;
            case "OPPORTUNITY":
                return GetOpportunityReport();
                break;
            case "DEFECT":
                return GetDefectReport();
                break;
            case "TICKET":
                return GetTicketReport();
                break;
            default:
                return GetDefaultReport();
                break;
        }      
    }
    return result;
}

/* Returns the PLUGIN.PLUGINID associated with the report defined by the S parameter. */
function GetReportId(S) {
    if (S != null && S != "") {
        /* Do we have a FAMILY:NAME value? */
        if (S.toString().indexOf(":") != -1) {
            var xmlhttp = YAHOO.util.Connect.createXhrObject().conn;
            var strUrl = "SLXReportsHelper.ashx?method=GetReportId&report=" +  escape(S);
            xmlhttp.open("GET", strUrl, false);
            xmlhttp.send(null);
            if (xmlhttp.status == 200) {
                return xmlhttp.responseText;
            }
        }
        else {
            /* Does it look like we already have a plugin ID? */
            if (S.toString().length == 12) {
                return S;
            }
        }
    }
    return null;
}

/* Populates the global report variables used in ShowReport.ascx (in Sage.SalesLogix.Client.Reports.Helper.dll). */
function PopulateGlobals(ReportId, EntityTableName, EntityId) {
    var strKeyField = EntityTableName + "." + EntityTableName + "ID";
    var strWSql = "(" + strKeyField + " = '" + EntityId + "')";
    var strSqlQry = "SELECT " + strKeyField + " FROM " + EntityTableName;

    GLOBAL_REPORTING_PLUGINID = ReportId;
    GLOBAL_REPORTING_KEYFIELD = strKeyField;
    GLOBAL_REPORTING_RSF = "";
    GLOBAL_REPORTING_WSQL = strWSql;
    GLOBAL_REPORTING_SQLQRY = strSqlQry;
    GLOBAL_REPORTING_SORTFIELDS = "";
    GLOBAL_REPORTING_SORTDIRECTIONS = "";
    GLOBAL_REPORTING_SS = (GLOBAL_REPORTING_URL.toUpperCase().indexOf("HTTPS") == -1 ? "0" : "1");
}

/* Displays a report by PLUGIN.PLUGINID. The report should be based on the main table associated with the current view. */
function ShowReportById(ReportId) {
    if (GLOBAL_REPORTING_URL == "") {
        alert(MSGID_THE_REPORTING_SERVER_HAS_NOT_BEEN);
        return;
    }
    if (ReportId == null || ReportId == "") {
        alert(MSGID_THE_REPORTID_HAS_NOT_BEEN_DEFINED);
        return;    
    }
    if (Sage.Services.hasService("ClientEntityContext")) {
        var contextSvc = Sage.Services.getService("ClientEntityContext");
        var context = contextSvc.getContext();
        var strTableName = context.EntityTableName.toUpperCase();
        var strEntityId = context.EntityId;
        if (strEntityId != "") {
            PopulateGlobals(ReportId, strTableName, strEntityId);
            var url = "ShowReport.aspx";
            window.open(url, "ShowReportViewer", "location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=800,height=630");
        }
        else {
            alert(MSGID_THE_CURRENT_ENTITY_IS_UNDEFINED);
        }
    }
    else {
        alert(MSGID_UNABLE_TO_SHOW_THE_DETAIL_REPORT);
    }
}

/* Displays a report by FAMILY:NAME. The report should be based on the main table associated with the current view. */
function ShowReportByName(ReportName) {
    if (GLOBAL_REPORTING_URL == "") {
        alert(MSGID_THE_REPORTING_SERVER_HAS_NOT_BEEN);
        return;
    }
    if (ReportName == null || ReportName == "") {
        alert(MSGID_THE_REPORTNAME_HAS_NOT_BEEN_DEFINED);
        return;
    }
    if (Sage.Services.hasService("ClientEntityContext")) {
        var contextSvc = Sage.Services.getService("ClientEntityContext");
        var context = contextSvc.getContext();
        var strTableName = context.EntityTableName.toUpperCase();
        var strEntityId = context.EntityId;
        if (strEntityId != "") {
            var strReportId = GetReportId(ReportName);
            if (strReportId != null && strReportId != "") {
                PopulateGlobals(strReportId, strTableName, strEntityId);
                var url = "ShowReport.aspx";
                window.open(url, "ShowReportViewer", "location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=800,height=630");
            }
            else {
                alert(MSGID_THE_REPORT_COULD_NOT_BE_LOCATED_FOR)
            }
        }
        else {
            alert(MSGID_THE_CURRENT_ENTITY_IS_UNDEFINED);
        }
    }
    else {
        alert(MSGID_UNABLE_TO_SHOW_THE_DETAIL_REPORT);
    }
}

/* Shows the report defined by ReportNameOrId using the EntityTableName and EntityId values. */
/* The ReportNameOrId can be a FAMILY:NAME value or a PLUGIN.PLUGINID value. */
/* The EntityTableName should be the main table associated with the report. */
function ShowReport(ReportNameOrId, EntityTableName, EntityId) {
    if (GLOBAL_REPORTING_URL == "") {
        alert(MSGID_THE_REPORTING_SERVER_HAS_NOT_BEEN);
        return;
    }
    if (ReportNameOrId == null || ReportNameOrId == "") {
        alert(MSGID_THE_REPORTNAMEORID_IS_UNDEFINED_IN);
        return;
    }
    if (EntityTableName == null || EntityTableName == "") {
        alert(MSGID_THE_ENTITYTABLENAME_IS_UNDEFINED_IN);
        return;
    }
    if (EntityId == null || EntityId == "") {
        alert(MSGID_THE_ENTITYID_IS_UNDEFINED_IN);
        return;
    }    
    var strReportId = GetReportId(ReportNameOrId);
    if (strReportId != null && strReportId != "") {
        var strTableName = EntityTableName.toUpperCase();
        var strEntityId = EntityId;
        if (strEntityId != "") {
            PopulateGlobals(strReportId, strTableName, strEntityId);
            var url = "ShowReport.aspx";
            window.open(url, "ShowReportViewer", "location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=800,height=630");
        }
        else {
            alert(MSGID_THE_CURRENT_ENTITY_IS_UNDEFINED);
        }
    }
    else {
        alert(MSGID_THE_REPORT_COULD_NOT_BE_LOCATED_FOR)
    }
}

/* Displays the default report for the current view and entity, if a report has been associated with the view. */
function ShowDefaultReport() {
    if (GLOBAL_REPORTING_URL == "") {
        alert(MSGID_THE_REPORTING_SERVER_HAS_NOT_BEEN);
        return;
    }
    if (Sage.Services.hasService("ClientEntityContext")) {
        var strDetailReport = GetCurrentReport();
        if (strDetailReport != null && strDetailReport != "") {      
            var strReportId = GetReportId(strDetailReport);
            if (strReportId != null && strReportId != "") {
                var contextSvc = Sage.Services.getService("ClientEntityContext");
                var context = contextSvc.getContext();
                var strTableName = context.EntityTableName.toUpperCase();
                var strEntityId = context.EntityId;
                if (strEntityId != "") {
                    PopulateGlobals(strReportId, strTableName, strEntityId);
                    var url = "ShowReport.aspx";
                    window.open(url, "ShowReportViewer", "location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=800,height=630");
                }
                else {
                    alert(MSGID_THE_CURRENT_ENTITY_IS_UNDEFINED);
                }
            }
            else {
                alert(MSGID_THE_REPORT_COULD_NOT_BE_LOCATED_FOR)
            }         
        }
        else {
            alert(MSGID_THE_CURRENT_ENTITY_DOES_NOT_HAVE);
        }
    }
    else {
        alert(MSGID_UNABLE_TO_SHOW_THE_DETAIL_REPORT);
    }
}
