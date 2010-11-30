<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddEditAddress.ascx.cs" Inherits="SmartParts_Address_AddEditAddress" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="AddressForm_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="AddressForm_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="AddressForm_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkAddressHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="accountaddresschange.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
    <asp:HiddenField runat="server" ID="txtEntityId" />
    <asp:HiddenField runat="server" ID="Mode" />
</div>

<table id="tblTest" border="0" cellpadding="1" cellspacing="2" class="formtable">
  <col width="50%" />
  <col width="50%" />
  <tr>
      <td>  
          <span class="lbl">
            <asp:Label ID="lblDescription" AssociatedControlID="pklDecription" runat="server" Text="Description:" meta:resourcekey="lblDecription"></asp:Label>
          </span>
          <span class="textcontrol">
            <SalesLogix:PickListControl runat="server" ID="pklDecription" PickListId="kSYST0000014" PickListName="Address Description (Account)" AutoPostBack="false" NoneEditable="false" mustExistInlist="false" />
          </span> 
     </td>
  </tr>
  <tr>   
     <td>  
        <span class="lblright">
           <asp:Label ID="lblIsPrimary" AssociatedControlID="cbxIsPrimary" runat="server" Text="Is Primary" meta:resourcekey="lblPrimary"></asp:Label>
        </span>
        <span >
           <asp:CheckBox runat="server" ID="cbxIsPrimary" Text=""  />
        </span>         
        <span class="lblright">
        <asp:Label ID="lblIsShipping" AssociatedControlID="cbxIsShipping" runat="server" Text="Is Shipping" meta:resourcekey="lblShipping"></asp:Label>
        </span>
         <span >
           <asp:CheckBox runat="server" ID="cbxIsShipping" Text=""  />
        </span> 
     </td>
   </tr>
   <tr>  
     <td>  
         <span class="lbl">
           <asp:Label ID="lblAddress1" AssociatedControlID="txtAddress1" runat="server" Text="Address1:" meta:resourcekey="lblAddress1"></asp:Label>
         </span>
         <span class="textcontrol">
           <asp:TextBox runat="server" ID="txtAddress1" MaxLength="64"  />
         </span>       
      </td>
   </tr>
   <tr>   
      <td>  
         <span class="lbl">
           <asp:Label ID="lblAddress2"  AssociatedControlID="txtAddress2" runat="server" Text="Address2:" meta:resourcekey="lblAddress2"></asp:Label>
         </span>
         <span class="textcontrol">
           <asp:TextBox runat="server" ID="txtAddress2" MaxLength="64"  />
         </span>       
      </td>
   </tr>
   <tr>  
      <td>  
         <span class="lbl">
           <asp:Label ID="lblAddress3"  AssociatedControlID="txtAddress3" runat="server" Text="Address3:" meta:resourcekey="lblAddress3"></asp:Label>
         </span>
         <span class="textcontrol">
           <asp:TextBox runat="server" ID="txtAddress3" MaxLength="64"  />
         </span>       
      </td>
   </tr>
   <tr>     
      <td>  
          <span class="lbl">
            <asp:Label ID="lblCity" AssociatedControlID="pklCity" runat="server" Text="City:" meta:resourcekey="lblCity"></asp:Label>
          </span>
          <span class="textcontrol">
            <SalesLogix:PickListControl runat="server" ID="pklCity" PickListId="kSYST0000384" PickListName="City" AutoPostBack="false" NoneEditable="false" mustExistInlist="false"/>
          </span> 
     </td>
   </tr>
   <tr>     
     <td>  
          <span class="lbl">
            <asp:Label ID="lblState" AssociatedControlID="pklState" runat="server" Text="State:" meta:resourcekey="lblState"></asp:Label>
          </span>
          <span class="textcontrol">
            <SalesLogix:PickListControl runat="server" ID="pklState" PickListId="kSYST0000390" PickListName="State" AutoPostBack="false" NoneEditable="false" mustExistInlist="false"/>
          </span> 
     </td>
   </tr>
   <tr>     
     <td>  
         <span class="lbl">
           <asp:Label ID="lblPostalCode"  AssociatedControlID="txtPostalCode" runat="server" Text="PostalCode:" meta:resourcekey="lblPostalCode"></asp:Label>
         </span>
         <span class="textcontrol">
           <asp:TextBox runat="server" ID="txtPostalCode" MaxLength="64"  />
         </span>       
      </td>
    </tr>
    <tr>    
      <td>  
          <span class="lbl">
            <asp:Label ID="lblCountry" AssociatedControlID="pklCountry" runat="server" Text="Country:" meta:resourcekey="lblCountry"></asp:Label>
          </span>
          <span class="textcontrol">
            <SalesLogix:PickListControl runat="server" ID="pklCountry" PickListId="kSYST0000386" PickListName="Country" AutoPostBack="false" NoneEditable="false" mustExistInlist="false" />
          </span> 
      </td>
    </tr>
    <tr>
      <td>  
         <span class="lbl">
            <asp:Label ID="lblSalutation" AssociatedControlID="txtSalutation" runat="server" Text="Attention:" meta:resourcekey="lblSalutation"></asp:Label>
         </span>
         <span class="textcontrol">
            <asp:TextBox runat="server" ID="txtSalutation" MaxLength="64" />
         </span>       
      </td>
    </tr>      
    <tr>
        <td align="right">
            <div style="padding: 10px 10px 0px 10px;">
                <asp:Button runat="server" ID="btnSave" CssClass="slxbutton" ToolTip="Save" meta:resourcekey="btnSave" />  
                <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" ToolTip="Cancel" meta:resourcekey="btnCancel" />  
            </div>
        </td>
    </tr>
</table>