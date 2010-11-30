<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddEditAccountAssociation.ascx.cs" Inherits="SmartParts_Association_AddEditAccountAssociation" %>
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
        <%--
        <asp:ImageButton runat="server" ID="btnSave" ToolTip="Update" ImageUrl="~/images/icons/Save_16x16.gif" 
            meta:resourcekey="btnSave" />
        --%>
        <SalesLogix:PageLink ID="lnkAddEditAssociationHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="associnfoa.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>        
    </asp:Panel>
    <asp:HiddenField runat="server" ID="Mode" />
    <asp:HiddenField runat="server" ID="hdtAccountId" />
    <asp:ImageButton runat="server" ID="cmdClose" OnClick="cmdClose_OnClick" ImageUrl="~/images/clear.gif"/>
</div>

<table id="tblAssoc" border="0" cellpadding="1" cellspacing="2" class="formtable">
  <col width="50%" />
  <col width="50%" />
  
  
  <tr>
      <td>  
           <div runat="server" id="divFromIDDialog">
           <span class="textcontrol2">
           <SalesLogix:LookupControl runat="server" ID="luFromIDDialog" LookupDisplayMode="Dialog" LookupEntityName="Account" LookupBindingMode="String" ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
              <LookupProperties>
                 <SalesLogix:LookupProperty PropertyHeader="AccountName" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_AccountName"></SalesLogix:LookupProperty>
                 <SalesLogix:LookupProperty PropertyHeader="City" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_City"></SalesLogix:LookupProperty>                 
                 <SalesLogix:LookupProperty PropertyHeader="State" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_State"></SalesLogix:LookupProperty>                                  
                 <SalesLogix:LookupProperty PropertyHeader="MainPhone" PropertyName="MainPhone" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_MainPhone"></SalesLogix:LookupProperty>                 
                 <SalesLogix:LookupProperty PropertyHeader="Type" PropertyName="Type" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_Type"></SalesLogix:LookupProperty>
                 <SalesLogix:LookupProperty PropertyHeader="SubType" PropertyName="SubType" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_SubType"></SalesLogix:LookupProperty>
                 <SalesLogix:LookupProperty PropertyHeader="Status" PropertyName="Status" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_Status"></SalesLogix:LookupProperty>        
                 <SalesLogix:LookupProperty PropertyHeader="AccountManager" PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_AccountManager"></SalesLogix:LookupProperty>    
                 <SalesLogix:LookupProperty PropertyHeader="Owner" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_Owner"></SalesLogix:LookupProperty>  
              </LookupProperties>
              <LookupPreFilters></LookupPreFilters>
           </SalesLogix:LookupControl>
           </span>
           </div>
           <div runat="server" id="divFromIDText">
            <b>
            
           <SalesLogix:LookupControl runat="server" ID="luFromIDText" LookupDisplayMode="Text" LookupEntityName="Account" LookupBindingMode="String" ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
              <LookupProperties>
                 <SalesLogix:LookupProperty PropertyHeader="AccountName" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
             </LookupProperties>
              <LookupPreFilters></LookupPreFilters>
           </SalesLogix:LookupControl>
            </b>
           
           </div>
                  
           <asp:Label ID="lblFromIsa" AssociatedControlID="luFromIDText" runat="server" Text="is a" meta:resourcekey="lblIsA"></asp:Label>
        
     </td>
     <td>  
           <div runat="server" id="divToIDDialog">
           <span class="textcontrol2">
           <SalesLogix:LookupControl runat="server" ID="luToIDDialog" LookupEntityName="Account" LookupDisplayMode="Dialog" LookupBindingMode="String" ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
             <LookupProperties>
               <SalesLogix:LookupProperty PropertyHeader="AccountName" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_AccountName"></SalesLogix:LookupProperty>
                 <SalesLogix:LookupProperty PropertyHeader="City" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_City"></SalesLogix:LookupProperty>                 
                 <SalesLogix:LookupProperty PropertyHeader="State" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_State"></SalesLogix:LookupProperty>                                  
                 <SalesLogix:LookupProperty PropertyHeader="MainPhone" PropertyName="MainPhone" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_MainPhone"></SalesLogix:LookupProperty>                 
                 <SalesLogix:LookupProperty PropertyHeader="Type" PropertyName="Type" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_Type"></SalesLogix:LookupProperty>
                 <SalesLogix:LookupProperty PropertyHeader="SubType" PropertyName="SubType" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_SubType"></SalesLogix:LookupProperty>
                 <SalesLogix:LookupProperty PropertyHeader="Status" PropertyName="Status" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_Status"></SalesLogix:LookupProperty>        
                 <SalesLogix:LookupProperty PropertyHeader="AccountManager" PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_AccountManager"></SalesLogix:LookupProperty>    
                 <SalesLogix:LookupProperty PropertyHeader="Owner" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True" meta:resourcekey="Lookup_Owner"></SalesLogix:LookupProperty>
             </LookupProperties>
             <LookupPreFilters></LookupPreFilters>
           </SalesLogix:LookupControl>
           </span>
           </div>
           
           <div runat="server" id="divToIDText">
            <b>
           <SalesLogix:LookupControl runat="server" ID="luToIDText" LookupEntityName="Account" LookupDisplayMode="Text" LookupBindingMode="String" ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
             <LookupProperties>
               <SalesLogix:LookupProperty PropertyHeader="AccountName" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
             </LookupProperties>
             <LookupPreFilters></LookupPreFilters>
           </SalesLogix:LookupControl>
           </b>
           </div>
          
           <asp:Label ID="lblToIsa" AssociatedControlID="luToIDText" runat="server" Text="is a" meta:resourcekey="lblIsA"></asp:Label>
       
      </td>
  </tr>
  <tr>
    <td>  
      <span class="textcontrol2">
        <SalesLogix:PickListControl runat="server" ID="pklForwardRelation" PickListId="kSYST0000011" PickListName="Association Types - Account" MustExistInList="false" ValueStoredAsText="true" AlphaSort="true" Width="250px"/>
      </span> 
    </td>  
    <td>  
      <span class="textcontrol2">
        <SalesLogix:PickListControl runat="server" ID="pklBackRelation" PickListId="kSYST0000011" PickListName="Association Types - Account" MustExistInList="false" ValueStoredAsText="true" AlphaSort="true" Width="250px" />
      </span> 
    </td>
  </tr>
  <tr>
    <td> 
      <div runat="server" id="divBackRelationToEdit">
      <span class="textcontrol2">
        <asp:Label ID="lblBackRelatedTo_OfTo1" AssociatedControlID="luBackRelatedTo" runat="server" Text="of/to" meta:resourcekey="lblOfTo" ></asp:Label>
        <b>
         <SalesLogix:LookupControl runat="server" ID="luBackRelatedTo" Enabled="true" LookupEntityName="Account" LookupDisplayMode="Text" LookupBindingMode="String" ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
          <LookupProperties>
            <SalesLogix:LookupProperty PropertyHeader="AccountName" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Type" PropertyName="Type" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Status" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
          </LookupProperties>
          <LookupPreFilters></LookupPreFilters>
        </SalesLogix:LookupControl>
        </b>
         </span>
      </div> 
      <div runat="server" id="divBackRelationToAdd">
      <span class="textcontrol2">
        <asp:Label ID="lblBackRelatedTo_OfTo2" AssociatedControlID="lblBackRelationTo_Account" runat="server" Text="of/to" meta:resourcekey="lblOfTo" ></asp:Label>
        <b>
           <asp:Label ID="lblBackRelationTo_Account" runat="server"></asp:Label> 
        </b>
         </span>
      </div> 
    </td>
    <td>  
      <span class="textcontrol2">
         <asp:Label ID="lblFowardRelatedTo_OfTo" AssociatedControlID="luFowardRelatedTo" runat="server" Text="of/to" meta:resourcekey="lblOfTo"></asp:Label>
         <b>
         <SalesLogix:LookupControl runat="server" ID="luFowardRelatedTo" Enabled="true" LookupEntityName="Account" LookupDisplayMode="Text" LookupBindingMode="String" ReturnPrimaryKey="true" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
          <LookupProperties>
            <SalesLogix:LookupProperty PropertyHeader="AccountName" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Status" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
          </LookupProperties>
          <LookupPreFilters></LookupPreFilters>
        </SalesLogix:LookupControl>
        </b>
      </span> 
    </td>
  </tr>
  <tr>
    <td>  
      <span class="lbltop">
        <asp:Label ID="lblForwardNotes" meta:resourcekey="lblDescription" AssociatedControlID="txtForwardNotes" runat="server" Text="Description:"></asp:Label>
      </span>
      <span class="textcontrol2">
        <asp:TextBox runat="server" ID="txtForwardNotes" TextMode="MultiLine" Columns="40" Rows="4" maxLength="4"  />
      </span> 
    </td>
    <td>  
      <span class="lbltop">
        <asp:Label ID="lblBackNotes" meta:resourcekey="lblDescription" AssociatedControlID="txtBackNotes" runat="server" Text="Description:"></asp:Label>
      </span>
      <span class="textcontrol2">
        <asp:TextBox runat="server" ID="txtBackNotes" TextMode="MultiLine" Columns="40" Rows="4" MaxLength="128" />
      </span> 
    </td>
  </tr>  
  <tr>
    <td colspan="2">
        <div style="padding: 10px 10px 0px 10px; text-align: right;">
            <asp:Button runat="server" ID="btnSave" CssClass="slxbutton" ToolTip="Save" meta:resourcekey="btnSave" style="width:70px; margin: 0 5px 0 0;" />  
            <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" ToolTip="Cancel" meta:resourcekey="btnCancel" style="width:70px;" />  
        </div>
    </td>
  </tr>
</table>