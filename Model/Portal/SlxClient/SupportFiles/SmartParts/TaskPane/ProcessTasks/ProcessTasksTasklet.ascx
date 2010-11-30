<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ProcessTasksTasklet.ascx.cs" Inherits="ProcessTasksTasklet" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="SalesLogix" %>


<style type="text/css">
.workflow-title 
{
    font-weight : bold;
    white-space : nowrap;
    overflow : hidden;
}
.workflow-list 
{
   list-style-image: none;
   list-style-position : outside;
   list-style-type: none; 
}
.workflow-node 
{
    color:black;
    font-family:arial,tahoma,helvetica,sans-serif;
    font-size:11px;
    font-size-adjust:none;
    font-stretch:normal;
    font-style:normal;
    font-variant:normal;
    font-weight:normal;
    line-height:normal;
    white-space:nowrap;
}
.workflow-node-el 
{
    line-height : 18px;
}
.workflow-node-indent 
{
    background-repeat:no-repeat;
    border:0pt none;
    height:18px;
    margin:0pt;
    padding:0pt;
    vertical-align:top;
    width:16px;
}
.workflow-node-indent IMG
{
    width:16px;
    border : 0px none;
}
.workflow-leaf-action
{
    cursor : pointer;
}
.workflow-leaf-text
{
    margin-left: 4px;
}

.workflow-list-expander 
{
    background-image: url(Libraries/Ext/resources/images/default/tree/elbow-end-plus.gif);
    cursor : pointer;
}

.workflow-list-expanded 
{
    background-image:  url(Libraries/Ext/resources/images/default/tree/elbow-end-minus.gif);
}

</style>


<div id="pendingTaskResult">

</div>
<SalesLogix:ScriptResourceProvider ID="ProcessTaskletStrings" runat="server">
    <Keys>
        <SalesLogix:ResourceKeyName Key="NoPendingTasks" />
        <SalesLogix:ResourceKeyName Key="Step" />
        <SalesLogix:ResourceKeyName Key="ClickToComplete" />
        <SalesLogix:ResourceKeyName Key="ClickToCancel" />
        <SalesLogix:ResourceKeyName Key="ClickToStartWorkflow" />
        <SalesLogix:ResourceKeyName Key="ProcessHostNotFound" />
        <SalesLogix:ResourceKeyName Key="NoProcessesFound" />
    </Keys>
</SalesLogix:ScriptResourceProvider>