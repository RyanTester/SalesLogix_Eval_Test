<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ManageStages.ascx.cs" Inherits="SmartParts_OpportunitySalesProcess_ManageStages" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
 <asp:Panel ID="ManageStages_LTools" runat="server"></asp:Panel>
 <asp:Panel ID="ManageStages_CTools" runat="server"></asp:Panel>
 <asp:Panel ID="ManageStages_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkSalesProcessHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="salesprocessmanagestages.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
 </asp:Panel>
 <asp:HiddenField ID="stageContext" runat="server" value=""  ></asp:HiddenField>&nbsp;
 <asp:HiddenField ID="currentContext" runat="server" value=""  ></asp:HiddenField>&nbsp;
 <asp:HiddenField ID="startDateContext" runat="server" value=""  ></asp:HiddenField>&nbsp;
 <asp:HiddenField ID="completeDateContext" runat="server" value=""  ></asp:HiddenField>&nbsp;
 <asp:Button ID="cmdSetCurrent" runat="server" OnClick="cmdSetCurrent_OnClick"  text="SetCurrent" />
 <asp:Button ID="cmdCompleteStage" runat="server" OnClick="cmdCompleteStage_OnClick"  text="CompeleteStage" />
 <asp:Button ID="cmdStartDate" runat="server" OnClick="cmdStartDate_OnClick" text="StartStagetWithDate" />
 <asp:Button ID="cmdCompleteDate" runat="server" OnClick="cmdCompleteDate_OnClick" text="CompleteStageWithDate" />
 
</div>
<table border="0" cellpadding="0" cellspacing="0" class="formtable">
<col width="40%" />
<col width="60%" />
    <tr>
        <td >
          <span class="lbl">       
            <asp:Label ID="lblOpportunity" AssociatedControlID="txtOpportunity" runat="server" Text="Opportunity:"  meta:resourcekey="lblOpportunity"></asp:Label>
          </span>
          <span class="textcontrol"> 
            <asp:TextBox runat="server" Enabled="false" ID="txtOpportunity"></asp:TextBox>
          </span>
        </td>
        <td rowspan="2" valign="top">
             
             <table id="SSSnapShot" style="border:solid 1px navy; background-color:White; width:80%" border="0" cellpadding="0" cellspacing="0">
                 <tr>
                    <th style="background-color:AliceBlue;border-bottom:solid 1px Navy">
                       <b><asp:Label ID="lblSalesProcessSnapShot"   runat="server" Text="Sales Process Snapshot" meta:resourcekey="lblSalesProcessSnapShot" ></asp:Label></b>
                    </th>
                </tr>
                 <tr>
                    <td style="float: left; vertical-align: middle; overflow: hidden; text-align: left">
                       <b><asp:Label ID="lblCurrentStage"  runat="server" Text="Current Stage" meta:resourcekey="lblCurrentStage"></asp:Label></b> =
                       <asp:Label ID="valueCurrnetStage" runat="server" Text=""></asp:Label>&nbsp; 
                       <b><asp:Label ID="lblDaysInStage" runat="server" Text="Days In Stage:" meta:resourcekey="lblDaysInStage"></asp:Label></b> =
                       <asp:Label ID="valueDaysInStage" runat="server" Text="0"></asp:Label> 
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: middle; text-align: left">
                       <span class="fixer">
                       <b><asp:Label ID="lblProbablity" runat="server" Text="Probability" meta:resourcekey="lblProbability"></asp:Label></b> = 
                       <asp:Label ID="valueProbabilty" runat="server" Text="0%"></asp:Label>&nbsp;
                       <b><asp:Label ID="lblEstDays"  runat="server" Text="Est. Days" meta:resourcekey="lblEstDays"></asp:Label></b> =
                       <asp:Label ID="valueEstDays" runat="server" Text="0"></asp:Label>&nbsp;
                       <b><asp:Label ID="lblEstClose" runat="server" Text="Est. Close" meta:resourcekey="lblEstClose"></asp:Label></b> = 
                       <SalesLogix:DateTimePicker runat="server" ID="dtpEstClose" Enabled="true" DisplayDate="true" DisplayTime="false" Timeless="True" DisplayMode="AsText" AutoPostBack="false"></SalesLogix:DateTimePicker>
                       </span>                       
                    </td>
                </tr>
                          
            </table>
          
         </td>
    </tr>
    <tr>
        <td >
           <span class="lbl">
           <asp:Label ID="lblSalesProcess" AssociatedControlID="txtSalesProcess" runat="server" Text="Sales Process:"  meta:resourcekey="lblSalesProcess"></asp:Label>
           </span>
           <span class ="textcontrol">
           <asp:TextBox runat="server" Enabled="false" ID="txtSalesProcess" ></asp:TextBox>
           </span>
         </td>
    </tr>
    
</table>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
  <tr>
      <td> 
          <span >
             
             <SalesLogix:SlxGridView runat="server" 
              ID="grdStages" 
              GridLines="None"
              AutoGenerateColumns="False" 
              CellPadding="4" 
              CssClass="datagrid" OnRowDataBound="grdStages_RowDataBound"
              EnableViewState="false"
              ExpandableRows="false"
              ResizableColumns="false"
              width="100%"
              >
                <Columns >
                    <asp:BoundField DataField="StageOrder"    HeaderText="Order" meta:resourcekey="StageGrid_Order"/>
                    <asp:BoundField DataField="StageName"    HeaderText="Stage" meta:resourcekey="StageGrid_Stage" />
                    <asp:TemplateField HeaderText="Current"  meta:resourcekey="StageGrid_Current">
                       <ItemTemplate>
                        <asp:CheckBox id="chkStageCurrent" runat="server" checked='false' ></asp:CheckBox>
                       </ItemTemplate>   
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Completed"  meta:resourcekey="StageGrid_Completed">
                       <ItemTemplate>
                        <asp:CheckBox id="chkStageComplete" runat="server" checked='false' AutoPostBack="false"></asp:CheckBox>
                       </ItemTemplate>   
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Started On" meta:resourcekey="StageGrid_StartedOn">
                       <ItemTemplate>
                           <SalesLogix:DateTimePicker runat="server" ID="dtpStartDate" Enabled="true" DisplayTime="false" Timeless="True" DisplayMode="AsHyperlink" autopostback="false" ></SalesLogix:DateTimePicker>
                       </ItemTemplate>   
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Completed On"  meta:resourcekey="StageGrid_CompletedOn">
                       <ItemTemplate>
                           <SalesLogix:DateTimePicker runat="server" ID="dtpCompleteDate" Enabled="true" DisplayTime="false" Timeless="True" DisplayMode="AsHyperlink"  autopostback="false" ></SalesLogix:DateTimePicker>
                       </ItemTemplate>   
                    </asp:TemplateField>
                    <asp:BoundField DataField="Probability"    HeaderText="Probability" meta:resourcekey="StageGrid_Probability" />
                    <asp:BoundField DataField="EstimatedDays"    HeaderText="Est. Days" meta:resourcekey="StageGrid_EstDays" />
                  </Columns>
                 <HeaderStyle BackColor="#F3F3F3" BorderColor="Transparent" Font-Bold="True" Font-Size="Small" />
                 <RowStyle CssClass="rowlt" />
                 <AlternatingRowStyle CssClass="rowdk" />
                 
             </SalesLogix:SlxGridView>
                         
        </span>
         
         
     </td>
  </tr>
</table>
        
