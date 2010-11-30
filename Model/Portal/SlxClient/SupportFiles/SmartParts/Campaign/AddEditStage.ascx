<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddEditStage.ascx.cs" Inherits="SmartParts_Campaign_AddEditStage" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Form_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="Form_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Form_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="campaignaddeditcompstage.aspx"

            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
    <asp:HiddenField runat="server" ID="txtCodeTemp" />
    <asp:HiddenField runat="server" ID="Mode" />
    
</div>
<table id="Table2" border="0" cellpadding="1" cellspacing="2" class="formtable">
  <col width="50%" />
  <col width="50%" />
   <tr>
      <td colspan ="2">  
          <div class="twocollbl">
            <asp:Label ID="lblDescription" AssociatedControlID="txtDecription" runat="server" Text="Description:" meta:resourcekey="lblDescription"></asp:Label>
          </div>
           <div class="twocoltextcontrol" style="width:80%">
           <asp:TextBox runat="server" ID="txtDecription" MaxLength="64" />
         </div>    
     </td>
  </tr>
  <tr>     
      <td>  
          <div class="lbl">
            <asp:Label ID="lblStatus" AssociatedControlID="pklStatus" runat="server" Text="Status:" meta:resourcekey="lblStatus"></asp:Label>
          </div>
          <div class="textcontrol">
            <SalesLogix:PickListControl runat="server" ID="pklStatus" PickListId="" PickListName="Campaign Stage Status" AutoPostBack="false" NoneEditable="false" mustExistInlist="false" MaxLength="32"/>
          </div> 
     </td>
     <td>
       <div class="lbl alignleft">
          <asp:Label ID="lblStartDate" AssociatedControlID="dtStartDate" runat="server" Text="Start Date:" meta:resourcekey="lblStartDate" ></asp:Label>
       </div>   
       <div  class="textcontrol datepicker" > 
          <SalesLogix:DateTimePicker runat="server" ID="dtStartDate" DisplayDate="true" DisplayTime="false" Timeless="True" Enabled="true"/>
       </div>
     </td>
   </tr>
     <tr>     
      <td>  
       <div class="lbl">
          <asp:Label ID="lblLeadSource" AssociatedControlID="luLeadSource" runat="server" Text="Lead Source:" meta:resourcekey="lblLeadSource"></asp:Label>
       </div>
       <div  class="textcontrol lookup"  > 
            <SalesLogix:LookupControl runat="server" ID="luLeadSource" LookupEntityName="ILeadSource" LookupEntityTypeName="Sage.Entity.Interfaces.ILeadSource, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
              <LookupProperties>
               <SalesLogix:LookupProperty PropertyHeader="Type" meta:resourcekey="LeadSourceType" PropertyName="Type" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>
               <SalesLogix:LookupProperty PropertyHeader="Description" meta:resourcekey="LeadSourceDescription" PropertyName="Description" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>
               <SalesLogix:LookupProperty PropertyHeader="Abbrev" meta:resourcekey="LeadSourceAbbrev" PropertyName="AbbrevDescription" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>
              </LookupProperties>
              <LookupPreFilters>
               <SalesLogix:LookupPreFilter PropertyName="Status" FilterValue="Active"></SalesLogix:LookupPreFilter>
              </LookupPreFilters>
            </SalesLogix:LookupControl>
        </div> 
     </td>
     <td>
       <div class="lbl alignleft">
         <asp:Label ID="lblEndDate" AssociatedControlID="dtEndDate" runat="server" Text="End Date:" meta:resourcekey="lblEndDate"></asp:Label>
       </div>   
       <div  class="textcontrol datepicker"  > 
         <SalesLogix:DateTimePicker runat="server" ID="dtEndDate" DisplayDate="true" DisplayTime="false" Timeless="True" Enabled="true"/>
       </div>
     </td>
   </tr>
   <tr>
      <td >  
          <div class="lbl">
            <asp:Label ID="lblCode" AssociatedControlID="txtCode" runat="server" Text="Code:" meta:resourcekey="lblCode"></asp:Label>
          </div>
           <div class="textcontrol">
           <asp:TextBox runat="server" ID="txtCode" MaxLength="32" />
         </div>    
     </td>
     <td>
     </td>
  </tr>
  <tr>  
     <td colspan="2">  
         <div class="twocollbl">
           <asp:Label ID="lblComment" AssociatedControlID="txtComment" runat="server" Text="Comments:" meta:resourcekey="lblComment"></asp:Label>
         </div>
         <div class="twocoltextcontrol TEXTAREA" style="width:80%">
           <asp:TextBox runat="server" ID="txtComment" TextMode="MultiLine" Rows="4"  />
         </div>       
      </td>
   </tr>
</table>
<table id="tblTasks" border="0" cellpadding="1" cellspacing="2" class="formtable">
  <col width="100%" />  
   <tr>
     <td >
        <div class="mainContentHeader">
         <span id="Span1"  >
           <asp:Label ID="lblTasks" runat="server" Text="Tasks" meta:resourcekey="lblTasks" ></asp:Label>
         </span>
        </div>
      </td>
    </tr>
    <tr>
        <td>
           <div style="overflow:auto; height:100px">            
             <SalesLogix:SlxGridView runat="server" 
              ID="grdTasks" 
              GridLines="None"
              AutoGenerateColumns="False" 
              CellPadding="4" 
              CssClass="datagrid"
              AlternatingRowStyle-CssClass="rowdk" 
              RowStyle-CssClass="rowlt" 
              ShowEmptyTable="true"
              EmptyTableRowText="No records match the selection criteria." 
              meta:resourcekey="grdTasks_NoRecordFound"
              OnRowCommand="grdTasks_RowCommand" 
              OnRowDeleting="grdTasks_RowDeleting"
              DataKeyNames="Id" 
              EnableViewState="false"
              ExpandableRows="true"
              ResizableColumns="true"
             >
              <Columns>
                <asp:BoundField DataField="Description"  HeaderText="Description"  meta:resourcekey="grdTasks_Description"  />
                <asp:BoundField DataField="Status"   HeaderText="Status"  meta:resourcekey="grdTasks_Status" />
                <asp:BoundField DataField="Priority" HeaderText="Priority"  meta:resourcekey="grdTasks_Priority"/>
                <asp:TemplateField HeaderText="Percent Complete" meta:resourceKey="grdTasks_PercentComplete" itemstyle-horizontalalign="Right">
                  <ItemTemplate>
                    <asp:Label runat="server" Text='<%# (String.Format("{0}",((Double)Eval("PercentComplete"))*100))%>'></asp:Label>                    
                  </ItemTemplate>
                 </asp:TemplateField>
              </Columns>
             </SalesLogix:SlxGridView>
                         
        </div>
        </td>
    </tr>    
</table>
<table id="tblBudget" border="0" cellpadding="1" cellspacing="2" class="formtable">
  <col width="50%" />
  <col width="50%" />
  <tr>
     <td colspan="3">
        <div class="mainContentHeader">
         <span>
           <asp:Label ID="lblBudget" runat="server" Text="Budget" meta:resourcekey="lblBudget" ></asp:Label>
         </span>
        </div>
      </td>
    </tr>
    <tr>
      <td>
      <div class="lbl">
            <asp:Label ID="lblEstimatedCost" runat="server" AssociatedControlID="slxCurEstimatedCost" Text="Estimated Cost:" meta:resourcekey="lblEstimatedCost"></asp:Label>
      </div>
      <div  class="textcontrol currency"  > 
          <SalesLogix:Currency runat="server" ID="slxCurEstimatedCost" ExchangeRateType="BaseRate" Enabled="false" DisplayCurrencyCode="false"  />
       </div>   
     </td>
      <td>  
         <div class="lbl">
            <asp:Label ID="lblActualCost" runat="server" AssociatedControlID="slxCurActualCost" Text="Actual Cost:" meta:resourcekey="lblActualCost"></asp:Label>
         </div>
         <div  class="textcontrol currency"  > 
            <SalesLogix:Currency runat="server" ID="slxCurActualCost" ExchangeRateType="BaseRate" Enabled="false" DisplayCurrencyCode="false"  />
         </div> 
     </td>   
   </tr>
   <tr>
      <td>  
        <div class="lbl">
            <asp:Label ID="lblEstimatedHours" runat="server" AssociatedControlID="txtEstimatedHours" Text="Estimated Hours:" meta:resourcekey="lblEstimatedHours"></asp:Label>
         </div>
         <div class="textcontrol">
              <asp:TextBox runat="server" ID="txtEstimatedHours" ReadOnly="true" Enabled="false"/>
          </div>   
     </td>
      <td>  
         <div class="lbl">
            <asp:Label ID="lblActualHours" runat="server" AssociatedControlID="txtActualHours" Text="Actual Hours:" meta:resourcekey="lblActualHours"></asp:Label>
         </div>
          <div class="textcontrol">
              <asp:TextBox runat="server" ID="txtActualHours" ReadOnly="true" Enabled="false" />
          </div> 
     </td>
   </tr>
     
</table>
<table id="tblButtons" border="0" cellpadding="1" cellspacing="2" class="formtable">
  <col width="99%" />
  <col width="1" />
  <col width="1" />
  <tr>
   <td  colspan="3" >
    <hr />
   </td>
  </tr>
  <tr>
    <td>
    </td>
    <td align="right">
       <div class="slxButton" style="margin-right:10px">
         <asp:Button ID="cmdSave" Text="OK" width="100px" runat="server" OnClick="cmdSave_OnClick" meta:resourcekey="cmdSave" CssClass="slxbutton" />
       </div>
    </td>
    <td align="right"> 
        <div class="slxButton" style="margin-right:40px">
           <asp:Button ID="cmdCancel" Text="Cancel" runat="server" width="100px" OnClick="cmdCancel_OnClick" meta:resourcekey="cmdCancel" CssClass="slxbutton" />
        </div>
    </td>
  </tr>
</table>
