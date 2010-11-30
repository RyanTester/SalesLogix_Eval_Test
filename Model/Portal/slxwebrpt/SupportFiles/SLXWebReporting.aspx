<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SLXWebReporting.aspx.cs" Inherits="WebReporting._Default" Trace="false" %>

<%@ Register Assembly="CrystalDecisions.Web, Version=11.5.3700.0, Culture=neutral, PublicKeyToken=692fbea5521e1304"
    Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Sage SalesLogix Crystal Reports Viewer</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <CR:CrystalReportViewer ID="CrystalReportViewer1" runat="server" AutoDataBind="true" EnableDatabaseLogonPrompt="False" 
        CssFilename="/crystalreportviewers115/css/default.css" 
        GroupTreeImagesFolderUrl="/crystalreportviewers115/images/tree/" 
        ToolbarImagesFolderUrl="/crystalreportviewers115/images/toolbar/" />
    </div> 
    </form>
</body>
</html>
