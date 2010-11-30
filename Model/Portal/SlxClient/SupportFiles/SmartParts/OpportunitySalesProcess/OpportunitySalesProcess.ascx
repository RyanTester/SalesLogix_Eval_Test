<%@ Control Language="C#" AutoEventWireup="true" CodeFile="OpportunitySalesProcess.ascx.cs" Inherits="SmartParts_OpportunitySalesProcess_SalesProcess" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" Namespace="System.Web.UI" TagPrefix="asp" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="Saleslogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="SalesProcess_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="SalesProcess_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="SalesProcess_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkSalesProcessHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="oppsalesprocesstab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<div style="display:none">
    <asp:HiddenField ID="txtCurrentSalesProcessId" runat="server" value="" ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtCurrentSalesProcessName" runat="server" value="" ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtOpportunityId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtNumOfStepsCompleted" runat="server" value="1"  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtCurrentStage" runat="server" value="1"  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtAccountId" runat="server" value=""></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtAccountName" runat="server" value=""></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtContactId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtContactName" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtForId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtForName" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtWithId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtWithName" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtSelectedOppContactId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="txtOppContactCount" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="currentUserId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="primaryOppContactId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="accountManagerId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="selectedContactId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="selectedUserId" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="stepContext" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="actionContext" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="startDateContext" runat="server" value=""  ></asp:HiddenField>&nbsp;
    <asp:HiddenField ID="completeDateContext" runat="server" value=""  ></asp:HiddenField>&nbsp;

    <SalesLogix:ScriptResourceProvider ID="OppSPMessages" runat="server">
        <Keys>
            <SalesLogix:ResourceKeyName Key="RequiresActiveMail" />
            <SalesLogix:ResourceKeyName Key="ChangeSalesProcess" />
            <SalesLogix:ResourceKeyName Key="ProcessingAction" />
            <SalesLogix:ResourceKeyName Key="InitAction" />
            <SalesLogix:ResourceKeyName Key="PleaseWait" />
            <SalesLogix:ResourceKeyName Key="ScheduleWithContact" />
            <SalesLogix:ResourceKeyName Key="MustSelectContact" />
            <SalesLogix:ResourceKeyName Key="MustSelectUser" />
            <SalesLogix:ResourceKeyName Key="GettingCurrentUser" />
            <SalesLogix:ResourceKeyName Key="GettingOppContact" />
            <SalesLogix:ResourceKeyName Key="GettingAcctMgr" />
            <SalesLogix:ResourceKeyName Key="InitMailMerge" />
            <SalesLogix:ResourceKeyName Key="SelectAuthor" />
            <SalesLogix:ResourceKeyName Key="MergeWith" />
            <SalesLogix:ResourceKeyName Key="PerformingMailMerge" />
            <SalesLogix:ResourceKeyName Key="ProcessingMailMerge" />
            <SalesLogix:ResourceKeyName Key="InitActivity" />
            <SalesLogix:ResourceKeyName Key="PerformingActivity" />
            <SalesLogix:ResourceKeyName Key="ToDo" />
            <SalesLogix:ResourceKeyName Key="Meeting" />
            <SalesLogix:ResourceKeyName Key="PhoneCall" />
            <SalesLogix:ResourceKeyName Key="SelectActLeader" />
            <SalesLogix:ResourceKeyName Key="InitLitRequest" />
            <SalesLogix:ResourceKeyName Key="RequestFor" />
            <SalesLogix:ResourceKeyName Key="PerformingLitReq" />
            <SalesLogix:ResourceKeyName Key="InitContactProc" />
            <SalesLogix:ResourceKeyName Key="PerformingContactProc" />
            <SalesLogix:ResourceKeyName Key="SelectEMailAddr" />
            <SalesLogix:ResourceKeyName Key="InvalidPath" />
            <SalesLogix:ResourceKeyName Key="MailMergeCompleted" />
            <SalesLogix:ResourceKeyName Key="MailMergeFailed" />
            <SalesLogix:ResourceKeyName Key="MailMergeSuccess" />
            <SalesLogix:ResourceKeyName Key="WordTemplateNotFound" />
            <SalesLogix:ResourceKeyName Key="CanceledOrContactNotFound" />
            <SalesLogix:ResourceKeyName Key="LabelTemplateNotFound" />
            <SalesLogix:ResourceKeyName Key="SelectFolder" />
            <SalesLogix:ResourceKeyName Key="MustBeAtLeastOne" />
            <SalesLogix:ResourceKeyName Key="NoContactAssociated" />
            <SalesLogix:ResourceKeyName Key="SelectFolderCaption" />
            <SalesLogix:ResourceKeyName Key="SelectFolderTitle" />
        </Keys>
    </SalesLogix:ScriptResourceProvider>

    <asp:Button ID="cmdDoAction" runat="server" OnClick="cmdDoAction_OnClick"  text="DoAction" />
    <asp:Button ID="cmdStartDate" runat="server" OnClick="cmdStartDate_OnClick" text="StartStepWithDate" />
    <asp:Button ID="cmdCompleteDate" runat="server" OnClick="cmdCompleteDate_OnClick" text="CompleteStepWithDate" />
    <asp:Button ID="cmdCompleteStep" runat="server" OnClick="cmdCompleteStep_OnClick"  text="CompeleteStep"/>

    <asp:ScriptManagerProxy ID="scriptManagerProxy" runat="server" ></asp:ScriptManagerProxy>&nbsp;
</div>

<div id="spProcessView" style="display:none;">
    <table border="0" cellpadding="2" cellspacing="2" width="50%" style="margin:10px;padding:25px;background-color:AliceBlue;border:solid 1px #a8a9be;">
        <tr>
            <td>
                <div id="spStatus" style="display:none;"></div>
                <div id="spMsg" style="display:none;"></div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="spSelectContactDiv" style="display:none">
                    <table border="0" cellpadding="2" cellspacing="2" width="100%" style="background-color:AliceBlue;">
                        <tr>
                            <td>
                                <span class="lbl">
                                    <asp:Label ID="lblSelectContact" runat="server" width = "100%" Text="<%$ resources: lblSelectContact.Text %>"
                                        AssociatedControlID="luOppContact" >
                                    </asp:Label>&nbsp;
                                </span>
                                <span class="textcontrol">
                                    <SalesLogix:LookupControl runat="server" ID="luOppContact" LookupEntityName="OpportunityContact"
                                        SeedProperty="Opportunity.Id" LookupBindingMode="String"
                                        LookupEntityTypeName="Sage.Entity.Interfaces.IOpportunityContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                                        <LookupProperties>
                                            <SalesLogix:LookupProperty PropertyHeader="lueOppContact_LastName.Header" PropertyName="Contact.LastName"
                                                PropertyFormat="None" UseAsResult="False" >
                                            </SalesLogix:LookupProperty>
                                            <SalesLogix:LookupProperty PropertyHeader="lueOppContact_FirstName.Header" PropertyName="Contact.FirstName"
                                                PropertyFormat="None" UseAsResult="False" >
                                            </SalesLogix:LookupProperty>
                                            <SalesLogix:LookupProperty PropertyHeader="lueOppContact_Account.Header"
                                                PropertyName="Contact.AccountName" PropertyFormat="None" UseAsResult="True" >
                                            </SalesLogix:LookupProperty>
                                            <SalesLogix:LookupProperty PropertyHeader="lueOppContact_Primary.Header"
                                                PropertyName="IsPrimary" PropertyType="System.Boolean" PropertyFormat="None" UseAsResult="True" >
                                            </SalesLogix:LookupProperty>
                                            <SalesLogix:LookupProperty PropertyHeader="lueOppContact_Influence.Header"
                                                PropertyName="Influence" PropertyType="System.String" PropertyFormat="None" UseAsResult="True" >
                                            </SalesLogix:LookupProperty>
                                            <SalesLogix:LookupProperty PropertyHeader="lueOppContact_Role.Header"
                                                PropertyName="SalesRole" PropertyType="System.String" PropertyFormat="None" UseAsResult="True" >
                                            </SalesLogix:LookupProperty>
                                        </LookupProperties>
                                        <LookupPreFilters>
                                        </LookupPreFilters>
                                    </SalesLogix:LookupControl>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <asp:Button ID="cmdSelectContactNext" runat="server" Text="<%$ resources: cmdSelectContactNext.Text %>" />
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="spSelectUserDiv" style="display:none">
                    <table border="0" cellpadding="2" cellspacing="2" width="100%" style="background-color:AliceBlue;">
                        <col width="50%" /> 
                        <tr>
                            <td>
                                <span class="lbl">
                                    <asp:Label ID="lblSelectUser" runat="server" width="100%" Text="<%$ resources: lblSelectUser.Text %>"
                                        AssociatedControlID="luUser" >
                                    </asp:Label>&nbsp;
                                </span>
                                <span class="textcontrol">
                                    <SalesLogix:SlxUserControl runat="server" ID="luUser" />
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                <asp:Button ID="cmdSelectUserNext" runat="server" Text="<%$ resources: cmdSelectUserNext.Text %>" />
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>  
    </table>
</div>
<div id="spMain" style="display:block">
    <table border="0" cellpadding="2" cellspacing="2" class="formtable">
        <col width="50%" />
        <col width="50%" />
        <tr>
            <td>
                <span class="lbl">
                    <asp:Label ID="lblSalesProces" runat="server" width="100%" Text="<%$ resources: lblSalesProcess.Text %>" AssociatedControlID="ddlSalesProcess" ></asp:Label>&nbsp;
                </span>
                <span class="textcontrol">
                    <asp:DropDownList runat="server" ID="ddLSalesProcess" OnSelectedIndexChanged="ddLSalesProcess_SelectedIndexChanged" AutoPostBack="false"></asp:DropDownList>
                </span>
            </td>
            <td rowspan="2" valign="top">
                 <table id="SSSnapShot" style="border:solid 1px #a8a9be; background-color:White; width:99%" border="0" cellpadding="0" cellspacing="0">
                     <tr>
                        <th style="background-color:AliceBlue;border-bottom:solid 1px #a8a9be; padding-left: 5px;">
                           <b><asp:Label ID="lblSalesProcessSnapShot" Text="<%$ resources: lblSalesProcessSnapShot.Text %>" runat="server" ></asp:Label></b>
                        </th>
                    </tr>
                     <tr>
                        <td style="float: left; vertical-align: middle; overflow: hidden; text-align: left">
                           <b><asp:Label ID="lblCurrentStage" runat="server" Text="<%$ resources: lblCurrentStage.Text %>"></asp:Label></b> =
                           <asp:Label ID="valueCurrnetStage" runat="server" Text=""></asp:Label>&nbsp; 
                           <b><asp:Label ID="lblDaysInStage" runat="server" Text="<%$ resources: lblDaysInStage.Text %>"></asp:Label></b> =
                           <asp:Label ID="valueDaysInStage" runat="server" Text="0"></asp:Label> 
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: middle; text-align: left">
                           <span class="fixer">
                           <b><asp:Label ID="lblProbablity" runat="server" Text="<%$ resources: lblProbability.Text %>"></asp:Label></b> = 
                           <asp:Label ID="valueProbabilty" runat="server" Text="0%"></asp:Label>&nbsp;
                           <b><asp:Label ID="lblEstDays" runat="server" Text="<%$ resources: lblEstDays.Text %>"></asp:Label></b> =
                           <asp:Label ID="valueEstDays" runat="server" Text="0"></asp:Label>&nbsp;
                           <b><asp:Label ID="lblEstClose" runat="server" Text="<%$ resources: lblEstClose.Text %>"></asp:Label></b> = 
                           <SalesLogix:DateTimePicker runat="server" ID="dtpEstClose" Enabled="true" DisplayDate="true" DisplayTime="false" Timeless="True" DisplayMode="AsText" AutoPostBack="false"></SalesLogix:DateTimePicker>
                           </span>                       
                        </td>
                    </tr> 
                </table>
             </td>
        </tr>
        <tr>
            <td>
                          <span class="lbl" style="font-style:normal" >
                 <asp:LinkButton OnClientClick="javascript:btnDisable(this.id);" id="btnStages" runat="server" CommandName="Stages" OnClick="cmdStages_Click" ToolTip="<%$ resources: linkManageStages.ToolTip %>" Text="<%$ resources: linkManageStages.Text %>" /> 
                 <asp:Label runat="server" id="btnStagesHide" style="color:#0000CC;display:none;" Text="<%$ resources: linkManageStages.Text %>"></asp:Label>
               </span>
               <span class="textcontrol">
                 <asp:DropDownList runat="server" ID="ddlStages" OnSelectedIndexChanged="ddlStages_SelectedIndexChanged" AutoPostBack="True"></asp:DropDownList>
                </span> 
                
            </td>
        </tr>
    </table>
    <SalesLogix:SlxGridView runat="server" ID="SalesProcessGrid" GridLines="None" AutoGenerateColumns="False" CellPadding="4"
        CssClass="datagrid" OnRowDataBound="SalesProcessGrid_RowDataBound" OnRowCommand="SalesProcessGrid_RowCommand" width="100%"
        EnableViewState="false" ExpandableRows="false" ResizableColumns="false" >
        <Columns >
            <asp:TemplateField HeaderText="<%$ resources: SalesProcessGrid_Completed.HeaderText %>" ItemStyle-HorizontalAlign="Center">
                <ItemTemplate>
                    <asp:Label ID="lblReq" runat="server"></asp:Label>
                    <asp:CheckBox id="chkComplete" runat="server" checked='<%# DataBinder.Eval(Container.DataItem, "Completed") %>' ></asp:CheckBox>
                </ItemTemplate>   
            </asp:TemplateField>
            <asp:TemplateField HeaderText="<%$ resources: SalesProcessGrid_Step.HeaderText %>" ItemStyle-HorizontalAlign="Left">
                <ItemTemplate>
                    <asp:LinkButton ID="linkAction" runat="server" ></asp:LinkButton>
                </ItemTemplate>   
            </asp:TemplateField>         
            <asp:BoundField DataField="Description" HeaderText="<%$ resources: SalesProcessGrid_Description.HeaderText %>" />
            <asp:TemplateField HeaderText="<%$ resources: SalesProcessGrid_StartedOn.HeaderText %>" >
                <ItemTemplate>
                    <SalesLogix:DateTimePicker runat="server" ID="dtpStartDate" Enabled="true" DisplayTime="false" Timeless="True"
                        DisplayMode="AsHyperlink" AutoPostBack="false" >
                    </SalesLogix:DateTimePicker>
                </ItemTemplate>   
            </asp:TemplateField>
                <asp:TemplateField HeaderText="<%$ resources: SalesProcessGrid_CompletedOn.HeaderText %>">
                    <ItemTemplate>
                        <SalesLogix:DateTimePicker runat="server" ID="dtpCompleteDate" Enabled="true" DisplayDate="true" DisplayTime="false"
                            Timeless="True" DisplayMode="AsHyperlink" AutoPostBack="false">
                        </SalesLogix:DateTimePicker>
                    </ItemTemplate>   
                </asp:TemplateField>
        </Columns>
        <HeaderStyle BackColor="#F3F3F3" BorderColor="Transparent" Font-Bold="True" Font-Size="Small" />
        <RowStyle CssClass="rowlt" />
        <AlternatingRowStyle CssClass="rowdk" />
    </SalesLogix:SlxGridView>
</div>