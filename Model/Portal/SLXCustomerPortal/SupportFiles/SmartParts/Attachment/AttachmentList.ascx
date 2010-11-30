<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AttachmentList.ascx.cs" Inherits="AttachmentList" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>
<%@ Register TagPrefix="radU" Namespace="Telerik.WebControls" Assembly="RadUpload.NET2" %>
                        
<div style="display:none">
   <SalesLogix:SmartPartToolsContainer runat="server" ID="AttachDetails_RTools" ToolbarLocation="right">
        <asp:Panel ID="Panel1" runat="server">
            <asp:ImageButton ID="cmdInsertFile" runat="server" OnClick="showAddAttachment" OnClientClick="Attachments_AllowSubmit();" ToolTip="<%$ resources: InsertFile_Button_lz.ToolTip %>"
                ImageUrl="ImageResource.axd?scope=global&type=Global_Images&key=plus_16x16" />
            <asp:ImageButton id="cmdInsertUrl" runat="server" OnClientClick="OnInsertURL_Click(); return false;" ToolTip="<%$ resources: InsertUrl_Button_lz.alt %>"
                ImageUrl="~/images/icons/Internet_Service_Add_16x16.gif" />
            <asp:ImageButton runat="server" ID="cmdEditAttachment" ImageUrl="~/images/icons/Edit_Item_16x16.gif" OnClick="EditFile_Click" OnClientClick="Attachments_AllowSubmit();"
                ToolTip="<%$ resources: Edit_Button_lz.ToolTip %>" />
            <asp:ImageButton runat="server" ID="cmdDeleteAttachment" OnClientClick="OnDeleteAttachment()"
                ToolTip="<%$ resources: Delete_Button_lz.ToolTip %>" ImageUrl="~/images/icons/Delete_16x16.gif" />
            <SalesLogix:PageLink ID="lnkAttachmentsHelp" runat="server" LinkType="HelpFileName"
                ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="attachmentstab.aspx"
                ImageUrl="ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
            </SalesLogix:PageLink>
        </asp:Panel>
    </SalesLogix:SmartPartToolsContainer>
    <asp:Button runat="server" ID="btnDelete" OnClick="DeleteFile_Click" />
</div>

<radU:RadProgressManager ID="radUProgressMgr" OnClientSubmitting="Attachments_onSubmitting" runat="server" />
<div id="insertDiv" runat="server" style="display:none">
    <table border="0" cellpadding="1" cellspacing="0" class="formtable">
        <col width="15%" />
        <col width="85%" />
        <tr id="insertRow1">
            <td>
                <div id="fileDiv" runat="server" class="twocollbl alignleft">
                    <asp:Label AssociatedControlID="uplInsertUpload" ID="lblInsertFile" runat="server"
                        Text="<%$ resources: uplInsertUpload.Caption %>" >
                    </asp:Label>
                </div>
                <div id="urlDiv" runat="server" class="twocollbl alignleft">
                    <asp:Label ID="lblURL" runat="server" Text="<%$ resources: txtInsertURL.Caption %>" AssociatedControlID="txtEditFile"></asp:Label>
                </div>
            </td>
            <td>               
                <div id="fileUploadDiv" runat="server">
                    <radU:RadUpload ReadOnlyFileInputs="true" ID="uplInsertUpload" runat="server" InitialFileInputsCount="1" EnableViewState="true"
                        EnableFileInputSkinning="True" ToolTip="<%$ resources: uplInsertUpload.ToolTip %>" ControlObjectsVisibility="None"
                        Skin="Slx" SkinsPath="~/Libraries/RadControls/upload/skins" OnClientAdded="IncreaseFileInputWidth" Width="500px" />
                </div>
                <div class="textcontrol" id="urlUploadDiv" runat="server" style="width:395px; padding-left:10px;">
                    <asp:TextBox ID="txtInsertURL" runat="server"></asp:TextBox>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr id="descriptionRow">
            <td>
                <div class="twocollbl alignleft">
                    <asp:Label AssociatedControlID="txtInsertDesc" runat="server" ID="lblInsertDesc"
                        Text="<%$ resources: txtInsertDesc.Caption %>">
                    </asp:Label>
                </div>
            </td>
            <td>
                <div style="padding-left:10px;">
                    <asp:TextBox Width="284px" ID="txtInsertDesc" runat="server" ToolTip="<%$ resources: txtInsertDesc.ToolTip %>"></asp:TextBox>                    
                    <asp:Button ID="cmdInsertUpload" OnClientClick="OnInsertUpload()" OnClick="cmdUpload_Click" runat="server"
                        Text="<%$ resources: cmdEditUpload.Caption %>" CssClass="slxbutton" />
                </div>
            </td>
        </tr>
    </table>
</div>

<div id="editDiv" style="display:none" runat="server">
    <table border="0" cellpadding="1" cellspacing="0" class="formtable">
        <col width="60%" />
        <col width="30%" />
        <col width="10%" />
        <tr>
            <td>
                <div class="twocollbl alignleft">
                    <asp:Label ID="lblEditFile" runat="server" Text="<%$ resources: txtEditFile.Caption %>"
                        AssociatedControlID="txtEditFile">
                    </asp:Label>
                </div>
                <span class="textcontrol" style="padding-left:10px;">
                    <asp:TextBox ID="txtEditFile" runat="server" ReadOnly="True" ></asp:TextBox>
                </span>
            </td>
            <td>
                <div class="lbl alignleft">
                    <asp:Label ID="lblEditSize" runat="server" Text="<%$ resources: txtEditSize.Caption %>"
                        AssociatedControlID="txtEditSize">
                    </asp:Label>
                </div>
                <div class="textcontrol">
                    <asp:TextBox ID="txtEditSize" Enabled="false" runat="server" ReadOnly="True"></asp:TextBox>
                </div>
            </td>
            <td>
                <div>
                    <asp:Button runat="server" id="cmdEditUpload" OnClientClick="OnEditUpload()" OnClick="cmdEditSave_Click" 
                        Text="<%$ resources: cmdEditUpload.Caption %>" CssClass="slxbutton" />
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="twocollbl alignleft">
                    <asp:Label ID="lblEditDesc" runat="server" Text="<%$ resources: txtEditDesc.Caption %>"
                        AssociatedControlID="txtEditDesc">
                    </asp:Label>
                </div>
                <span class="textcontrol" style="padding-left:10px;">
                    <asp:TextBox ID="txtEditDesc" runat="server"></asp:TextBox>
                </span>
            </td>
            <td>
                <div class="lbl alignleft">
                    <asp:Label AssociatedControlID="dtpAttachedDate" ID="lblAttachedDate" runat="server" 
                        Text="<%$ resources: dtpAttachedDate.Caption %>">
                    </asp:Label>
                </div>
                <div class="textcontrol">
                    <SalesLogix:DateTimePicker DisplayTime="true" runat="server" ID="dtpAttachedDate" Enabled="false" />
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="twocollbl alignleft">
                    <asp:Label ID="lblEditUpload" runat="server" Text="<%$ resources: lblEditUpload.Caption %>"
                        AssociatedControlID="uplEditUpload">
                    </asp:Label>                
                </div>
                <div id="editFileDiv" style="display:inline" runat="server" >
                    <radU:RadUpload ReadOnlyFileInputs="true" ID="uplEditUpload" runat="server" InitialFileInputsCount="1" EnableViewState="true"
                        EnableFileInputSkinning="True" ToolTip="<%$ resources: uplInsertUpload.ToolTip %>" ControlObjectsVisibility="None"
                        Skin="Slx" SkinsPath="~/Libraries/RadControls/upload/skins" Width="500px" />
                </div>
                <div class="textcontrol" id="editUrlDiv" style="display:none; padding-left:10px;" runat="server" >
                    <asp:TextBox ID="txtEditURL" runat="server" ToolTip="<%$ resources: txtEditURL.ToolTip %>"></asp:TextBox>
                </div>
            </td>
            <td>
                <div class="lbl alignleft">
                    <asp:Label ID="lblEditAttachedBy" runat="server" Text="<%$ resources: txtEditAttachedBy.Caption %>"
                        AssociatedControlID="txtEditAttachedBy">
                    </asp:Label>
                </div>
                <div class="textcontrol">
                    <asp:TextBox ID="txtEditAttachedBy" Enabled="false" runat="server" ReadOnly="true"></asp:TextBox>
                </div>
            </td>
        </tr>
    </table>
</div>

<div style="clear:both"></div>
<radU:RadProgressArea ID="radUProgressArea" runat="server" DisplayCancelButton="true" Skin="Slx" 
    SkinsPath="~/Libraries/RadControls/upload/skins">
</radU:RadProgressArea>
<input id="txtAttachId1" type="hidden" runat="server" />
<input id="txtSelRowIndx" type="hidden" runat="server" />
<input id="txtDeleteConfirmed" type="hidden" value="F" runat="server" />
<input id="txtIsURLMode" type="hidden" value="F" runat="server" />
<SalesLogix:SlxGridView ID="grdAttachments" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
    GridLines="none" runat="server" AutoGenerateColumns="False" ForeColor="#333333" DataKeyNames="Id" CellPadding="4"
    EmptyTableRowText="<%$ resources: grdAttachments_EmptyTableRowText %>" ExpandableRows="True" AllowPaging="true" PageSize="10"
    ShowEmptyTable="True" EnableViewState="false" ResizableColumns="True" OnRowCreated="grdAttachments_RowCreated"
    OnSorting="grdAttachments_Sorting" ShowSortIcon="True" CurrentSortExpression="Description" AllowSorting="True"
    SortDescImageUrl="" SortAscImageUrl="" >
    <Columns>                
        <asp:TemplateField SortExpression="Description" HeaderText="<%$ resources: grdAttachments_Description_Header %>" > 
            <ItemTemplate> 
                <asp:HyperLink runat="server" Target="_blank"
                    Text='<%# Eval("Description") %>'
                    NavigateUrl='<%# FormatUrl(Eval("Id"), Eval("Filename"), Eval("DataType"), Eval("Description")) %>' >
                </asp:HyperLink> 
            </ItemTemplate> 
        </asp:TemplateField>                                
        <asp:TemplateField SortExpression="ModifyUser" HeaderText="<%$ resources: grdAttachments_ModifyUser_Header %>" >
            <ItemTemplate>
                <SalesLogix:SlxUserControl runat="server" ID="ModifyUser" Enabled="False" DisplayMode="AsText" 
                    LookupResultValue='<%# Eval("ModifyUser") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="ModifyDate" HeaderText="<%$ resources: grdAttachments_ModifyDateTime_Header %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" ID="ModifyDate" DateOnly="False" DisplayMode="AsText" 
                    DateTimeValue='<%# Eval("ModifyDate") %>' />
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="FileSize" HeaderText="<%$ resources: grdAttachments_Size_Header %>" >
            <ItemTemplate>
                <asp:Label ID="lblSize" Text='<%# FormatSize(Eval("FileSize")) %>' Runat="Server"/>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Filename" HeaderText="Filename" ReadOnly="True" Visible="False"/>
        <asp:BoundField DataField="DataType" HeaderText="DataType" ReadOnly="True" Visible="False"/>
    </Columns>
    <RowStyle CssClass="rowlt" />
    <AlternatingRowStyle CssClass="rowdk" />
</SalesLogix:SlxGridView>