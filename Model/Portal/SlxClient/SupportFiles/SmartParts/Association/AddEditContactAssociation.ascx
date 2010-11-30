<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddEditContactAssociation.ascx.cs" Inherits="SmartParts_Association_AddEditContactAssociation" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<style type="text/css">
  SPAN.textcontrol2 INPUT, SPAN.textcontrol2 TEXTAREA, SPAN.textcontrol2.SELECT {	
	font-family: "Arial Unicode MS", Arial, Helvetica, sans-serif;
	color: #000000;
	font-size: 90%;
	width : 90%;
	background-color: #FFFFFF;
	border: 1px solid #E8E9EE;
	font-style: normal;
	margin : .1em 0em;
	vertical-align : middle;
}
</style>

<div style="display:none">
    <asp:Panel ID="AssociationForm_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="AssociationForm_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="AssociationForm_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkAssociationHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="associnfoc.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
    <asp:HiddenField runat="server" ID="Mode" />
    <asp:HiddenField runat="server" ID="hdtContactId" />
    <asp:ImageButton runat="server" ID="cmdClose" OnClick="cmdClose_OnClick" ImageUrl="~/images/clear.gif" />
</div>

<table border="0" cellpadding="0" cellspacing="2" class="formtable">
    <col width="50%" /><col width="50%" />
    <tr>
        <td>  
            <div runat="server" id="divFromIDDialog">
                <SalesLogix:LookupControl runat="server" ID="luFromIDDialog" LookupDisplayMode="Dialog" LookupEntityName="Contact" LookupBindingMode="String" ReturnPrimaryKey="true"
                    LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Name.PropertyHeader %>" PropertyName="NameLF" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_AccountName.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_WorkPhone.PropertyHeader %>" PropertyName="WorkPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Email.PropertyHeader %>" PropertyName="Email" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters></LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>
            <div runat="server" id="divFromIDText">
                <b>
                <SalesLogix:LookupControl runat="server" ID="luFromIDText" LookupDisplayMode="Text" LookupEntityName="Contact" LookupBindingMode="String" ReturnPrimaryKey="true"
                    LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_LastName.PropertyHeader %>" PropertyName="LastName" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_FirstName.PropertyHeader %>" PropertyName="FirstName" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                    </LookupProperties>
                <LookupPreFilters></LookupPreFilters>
                </SalesLogix:LookupControl>
                </b>
            </div>
            <asp:Label ID="lblFromIsA" AssociatedControlID="luFromIDDialog" runat="server" Text="<%$ resources: lblIsA.Text %>"></asp:Label>
        </td>
        <td> 
            <div runat="server" id="divToIDDialog">
                <span class="textcontrol2">
                    <SalesLogix:LookupControl runat="server" ID="luToIDDialog" LookupDisplayMode="Dialog" LookupEntityName="Contact" LookupBindingMode="String" ReturnPrimaryKey="true"
                        LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                        <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Name.PropertyHeader %>" PropertyName="NameLF" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_AccountName.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>                 
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>                 
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>                                  
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_WorkPhone.PropertyHeader %>" PropertyName="WorkPhone" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Email.PropertyHeader %>" PropertyName="Email" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>  
                        </LookupProperties>
                        <LookupPreFilters></LookupPreFilters>
                    </SalesLogix:LookupControl>
                </span>
            </div>
            <div runat="server" id="divToIDText">
                <b>
                <SalesLogix:LookupControl runat="server" ID="luToIDText" LookupDisplayMode="Text" LookupEntityName="Contact" LookupBindingMode="String" ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_LastName.PropertyHeader %>" PropertyName="LastName" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_FirstName.PropertyHeader %>" PropertyName="FirstName" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters></LookupPreFilters>
                </SalesLogix:LookupControl>
                </b>
            </div>
            <asp:Label ID="lblToIsA" AssociatedControlID="luToIDDialog" runat="server" Text="<%$ resources: lblIsA.Text %>"></asp:Label>
        </td>
    </tr>
    <tr>
        <td>  
            <span class="textcontrol2">
                <SalesLogix:PickListControl runat="server" ID="pklForwardRelation" PickListId="kSYST0000012" PickListName="Association Types - Contact"
                    MustExistInList="false" ValueStoredAsText="true" AlphaSort="true" />
            </span> 
        </td>
        <td>
            <span class="textcontrol2">
                <SalesLogix:PickListControl runat="server" ID="pklBackRelation" PickListId="kSYST0000012" PickListName="Association Types - Contact"
                    MustExistInList="false" ValueStoredAsText="true" AlphaSort="true" />
            </span>
        </td>
    </tr>
    <tr>
        <td>
            <div runat="server" id="divBackRelationToEdit">
                <span class="textcontrol2">
                    <asp:Label ID="lblBackRelatedTO_OfTo1" AssociatedControlID="luBackRelatedTo" runat="server" Text="<%$ resources: lblOfTo.Text %>"></asp:Label>
                    <b>
                    <SalesLogix:LookupControl runat="server" ID="luBackRelatedTo" LookupDisplayMode="Text"  Enabled="true" LookupEntityName="Contact" LookupBindingMode="String"
                        ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
                        <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Name.PropertyHeader %>" PropertyName="NameLF" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_AccountName.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_WorkPhone.PropertyHeader %>" PropertyName="WorkPhone" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Email.PropertyHeader %>" PropertyName="Email" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters></LookupPreFilters>
                    </SalesLogix:LookupControl>
                    </b>
                </span>
            </div>
            <div runat="server" id="divBackRelationToAdd">
                <span class="textcontrol2">
                    <asp:Label ID="lblBackRelatedTO_OfTo2" AssociatedControlID="lblBackRelationTo_Contact" runat="server" Text="<%$ resources: lblOfTo.Text %>" ></asp:Label>
                    <b>
                    <asp:Label ID="lblBackRelationTo_Contact" runat="server"></asp:Label>
                    </b>
                </span>
            </div>
        </td>
        <td>  
            <span class="textcontrol2">
                <asp:Label ID="FowardRelatedTo_OfTo" AssociatedControlID="luFowardRelatedTo" runat="server" Text="of/to" meta:resourcekey="lblOfTo"></asp:Label>
                <b>
                <SalesLogix:LookupControl runat="server" ID="luFowardRelatedTo" LookupDisplayMode="Text"  Enabled="true" LookupEntityName="Contact" LookupBindingMode="String" ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
                    <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Name.PropertyHeader %>" PropertyName="NameLF" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_AccountName.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_WorkPhone.PropertyHeader %>" PropertyName="WorkPhone" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Email.PropertyHeader %>" PropertyName="Email" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters></LookupPreFilters>
                </SalesLogix:LookupControl>
                </b>
            </span>
        </td>
    </tr>
    <tr>
        <td rowspan="4">
            <span class="lbltop">
                <asp:Label ID="lblForwardNotes" AssociatedControlID="txtForwardNotes" runat="server" Text="<%$ resources: lblDescription.Text %>"></asp:Label>
            </span>
            <span class="textcontrol2">
                <asp:TextBox runat="server" ID="txtForwardNotes" TextMode="MultiLine" Columns="40" Rows="4" />
            </span>
        </td>
        <td rowspan="4">  
            <span class="lbltop">
                <asp:Label ID="lblBackNotes" AssociatedControlID="txtBackNotes" runat="server" Text="<%$ resources: lblDescription.Text %>"></asp:Label>
            </span>
            <span class="textcontrol2">
                <asp:TextBox runat="server" ID="txtBackNotes" TextMode="MultiLine" Columns="40" Rows="4" />
            </span>
        </td>
    </tr> 
</table>
<div style="padding: 10px 10px 0px 10px; text-align: right;">
     <asp:Button runat="server" ID="btnSave" CssClass="slxbutton" ToolTip="<%$ resources: cmdSave.Caption %>" Text="<%$ resources: cmdSave.Caption %>" style="width:70px; margin: 0 5px 0 0;" />
     <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" ToolTip="<%$ resources: cmdCancel.Caption %>" Text="<%$ resources: cmdCancel.Caption %>" style="width:70px;" />
</div>