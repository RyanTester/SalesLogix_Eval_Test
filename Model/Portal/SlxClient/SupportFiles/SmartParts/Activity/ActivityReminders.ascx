<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ActivityReminders.ascx.cs" Inherits="SmartParts_Activity_ActivityReminders" %>
<%@ Import Namespace="Sage.Common.Syndication.Json"%>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<script type="text/javascript">

var _curSelRow = null;
var _clientId = null;

function selectAll() {
    var checkAllCheckBox = $("input[id$=_chkSelectAll]")[0];
    var gridViewCtl = $("table[id$=_grdActivityReminders]");
    
    $("input[id$=_chkRowSelect]", gridViewCtl)
        .attr("checked", checkAllCheckBox.checked);
        
    Reminders.saveSelectedIds();
    Reminders.enableListActions();
}

function onActivitySelectClick(e) {
    Reminders.saveSelectedIds();
    Reminders.enableListActions();
    
    // cancel click event bubbling to prevent the row click event from firing
    var event = e || window.event;      
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

function onGridViewRowSelected(rowIdx, clientId, activityId) {
    _clientId = clientId;
    var selRow = getSelectedRow(rowIdx);
    if (_curSelRow != null) {
        $(_curSelRow).removeClass("x-grid3-row-selected");
    }
    else {
        _curSelRow = getSelectedRow(1);
        if (_curSelRow != null) {
            $(_curSelRow).removeClass("x-grid3-row-selected");
        }
    }

    if (null != selRow) {
        _curSelRow = selRow;
        selRowIndxCtl.value = rowIdx;
        $(_curSelRow).addClass("x-grid3-row-selected");

        var postBackBtn = document.getElementById(clientId + "_btnSelectedRow");
        var currentIdx = document.getElementById(clientId + "_currentIndex");
        currentIdx.value = activityId;
        postBackBtn.click();
        currentIdx.value = "";
    }
}

function getSelectedRow(rowIdx) {
    var gridViewCtl = document.getElementById(_clientId + "_grdActivityReminders");
    selRowIndxCtl = document.getElementById(_clientId + "_txtSelRowIndx");
    return gridViewCtl.rows[rowIdx];
}

function btnShowHideDetails(clientId, hideCaption, showCaption) {
    var btnShowHideDetails = document.getElementById(clientId + "_btnShowHideDetail");
    var divActivityDetails = document.getElementById(clientId + "_divActivityDetails");
    var divActivityList = document.getElementById(clientId + "_divActivityList");
    var hideDetailsPane = document.getElementById(clientId + "_hideDetailsPane");
    
    if (btnShowHideDetails != null && divActivityDetails != null && divActivityList != null) {
        if (btnShowHideDetails.value == hideCaption) {
            divActivityDetails.style.display = "none";
            btnShowHideDetails.value = showCaption;
            divActivityList.style.height = "600px";
            hideDetailsPane.value = "T";
        } 
        else {
            divActivityDetails.style.display = "inline";
            btnShowHideDetails.value = hideCaption;
            divActivityList.style.height = "350px";
            hideDetailsPane.value = "F";
        }
    }
}

function OnActionClick(action) {
    $('input[id$=_ActionType]').val(action);
    $('input[id$=_ActivityIds]').val(Reminders.getSelectedActivities());
    $('input[id$=_SelectedIds]').val(Reminders.getSelectedIds());
    $('input[id$=_btnPerformAction]').click();
}

var SR = <%= JavaScriptConvert.SerializeObject(SR) %>;

var Reminders = {

    quickComplete: new Ext.Window({
	    id: 'quickComplete',
        layout: 'fit',
        title: SR.QuickComplete,
        closeAction: 'hide',
        width: 400,
        height: 215,
        border: false,
        cls: 'address-dialog',
        items: [{
            xtype: 'form',
            border: true,
            bodyStyle: 'padding: 10px',
            labelAlign: 'left',
            items: [{
                xtype: 'picklistcombo',
                id: 'quickComplete-result',
                fieldLabel: SR.Result,
                pickListName: 'To Do Result Codes'
            }, {
                xtype: 'fieldset',
                labelAlign: 'top',
                style: 'border: none; margin: 0; padding: 0;',
                anchor: '100% -25',
                items: [{
                    xtype: 'textarea',
                    id: 'quickComplete-note',
                    fieldLabel: SR.ApplyToSelected,
                    anchor: '100% -20'
                }]
            }]
        }],
        buttons: [{
            id: 'quickComplete-individually',
		    text: SR.Individually,
		    handler: function() {
                Reminders.quickComplete.hide();
		        OnActionClick('CompleteSelectedIndividually');
		    }
	    }, new Ext.Toolbar.Fill(), {
            id: 'quickComplete-asScheduled',
		    text: SR.AsScheduled,
		    handler: function() {
                Reminders.quickComplete.hide();
                $('input[id$=_resultText]').val(Ext.getCmp('quickComplete-result').getValue().text);
                $('input[id$=_completeNotes]').val(Ext.getCmp('quickComplete-note').getValue());
                $('input[id$=_asScheduled]').val('True');
		        OnActionClick('CompleteSelected');
		    }
	    }, {
            id: 'quickComplete-now',
            text: SR.Now,
		    handler: function() {
                Reminders.quickComplete.hide();
                $('input[id$=_resultText]').val(Ext.getCmp('quickComplete-result').getValue().text);
                $('input[id$=_completeNotes]').val(Ext.getCmp('quickComplete-note').getValue());
                $('input[id$=_asScheduled]').val('False');
		        OnActionClick('CompleteSelected');
		    }
        }],
	    listeners: {
		    beforeshow: function() {
		        if (!document.getElementById('complete-text')) {
                    Ext.DomHelper.insertFirst(Reminders.quickComplete.footer.child('.x-panel-btns'), {
                        tag: 'div',
                        id: 'complete-text',
                        'class': 'x-form-item',
                        style: 'margin-bottom:0;padding-bottom:0;',
                        html: '<label class="x-form-item-label" style="white-space: nowrap;">' + 
                            SR.CompleteAllSelected + '</label>'
                    });
                }
                Ext.getCmp('quickComplete-result').setValue('');
                Ext.getCmp('quickComplete-note').setValue('');
		    },
		    show: function() {
			    Ext.getCmp('quickComplete-result').focus(true, 100);
		    }
	    } 
    }),

    getSelectedIds: function() {
        sel = [];
        $("input[id$=_chkRowSelect]:checked").each(
            function() {
                sel.push($(this).attr("data-activityId"));
            }
        );
        return sel.join();
    },
    
    getSelectedActivities: function() {
        sel = [];
        $("input[id$=_chkRowSelect][data-reminderType!=" 
            + SR.ReminderType_Confirm + "]:checked").each(
            function() {
                sel.push($(this).attr("data-activityId"));
            }
        );
        return sel.join();
    },

    getCount: function() {
        return $("input[id$=_chkRowSelect]").size();
    },

    getSelectedCount: function() {
        return $("input[id$=_chkRowSelect]:checked").size();
    },

    getConfirmationCount: function() {
        return $("input[id$=_chkRowSelect][data-reminderType=" 
            + SR.ReminderType_Confirm + "]").size();
    },

    getPastDueCount: function() {
        return $("input[id$=_chkRowSelect][data-reminderType=" 
            + SR.ReminderType_PastDue + "]").size();
    },

    getSelectedAlarmCount: function() {
        return $("input[id$=_chkRowSelect][data-reminderType=" 
            + SR.ReminderType_Alarm + "]:checked").size();
    },

    getSelectedPastDueCount: function() {
        return $("input[id$=_chkRowSelect][data-reminderType=" 
            + SR.ReminderType_PastDue + "]:checked").size();
    },

    getSelectedConfirmationCount: function() {
        return $("input[id$=_chkRowSelect][data-reminderType=" 
            + SR.ReminderType_Confirm + "]:checked").size();
    },

    isAllSelected: function() {
        return $("input[id$=_chkRowSelect]:not(:checked)").size() === 0;
    },
    
    reminderPreferencesPrompt: function(message, cookieParm, fn){
        var form = new Ext.FormPanel({
           bodyStyle: 'background-color: #C6D7EF',   
           labelAlign:'left',         
           border: false, 
           defaults: {       
            hideLabel: true
           },       
           items: [  
                    {
                      border: false,                  
                      html: '<p style=padding:5px;>' + message + '</p><br/><br/>'
                    },
                    {
                    border: false
                    },
                    {  
                      html: '<p align=right style=padding:5px;>',
                      xtype: 'checkbox',  
                      name: 'dontShow',  
                      inputValue: true,  
                      boxLabel: SR.OptOutMessage
                    }
                  ]
        });
        
        var contain = new Ext.Panel({
            items: form,
            border: false        
        });
        
        
        var dialog = new Ext.Window({                  
                bodyStyle: 'background-color: #C6D7EF',
                border: false,
                width:380,
                height: 180,
                layout: 'fit',
                title: SR.Warning,                
                items: contain,
                modal: true,
                buttonAlign: 'right',
                buttons: [{
                    text: SR.OK,
                    minWidth: 60,
                    handler: function()
                    {                             
                        //Get the user preference
                        var optOutPref = form.getForm().getValues().dontShow;
                        
                        //Save the user preference
                        if (optOutPref != undefined)
                        {
                            document.cookie = "SLXReminderPreferences=; expires=1/01/2020";    
                            cookie.setCookieParm(optOutPref, cookieParm, "SLXReminderPreferences");
                        }             
                        fn(true);  
                        dialog.hide();                                            
                    }},
                    {
                    text: SR.Cancel, 
                    minWidth: 60,
                    handler: function()
                    {
                        dialog.hide();                        
                    }
                }]
    });
    dialog.show();   
    },
    
    checkConfirmations: function(fn) {    
        if (   (fn !== this.snoozeAll && this.getSelectedConfirmationCount() === 0)
            || (fn === this.snoozeAll && this.getConfirmationCount() === 0)
           ) {
            fn(true);
            return;
        }       
        
        //Check cookie whether to display prompt
        var dontShow = cookie.getCookieParm("ConfirmedActivitiesOnlyPrompt", "SLXReminderPreferences");        if (dontShow == "true")  
            {fn(true);
            return;}   

       this.reminderPreferencesPrompt(SR.ConfirmedActivitiesOnly, "ConfirmedActivitiesOnlyPrompt", fn);
        
    },
    
    checkAlarmOnlyAction: function(fn) {
        if (   this.getSelectedPastDueCount() === 0 
            && this.getSelectedConfirmationCount() === 0 
           ) {
            fn(true);
            return;
        }
        
        //Check cookie whether to display prompt
        var dontShow = cookie.getCookieParm("AlarmsOnlyPrompt", "SLXReminderPreferences");        if (dontShow == "true")  
            {fn(true);
            return;}   

       this.reminderPreferencesPrompt(SR.AlarmOnlyAction, "AlarmsOnlyPrompt", fn);              

    },
    
    doDeleteSelected: function(ignoreConfirmations) {
        if (!ignoreConfirmations) {
            this.checkConfirmations(this.doDeleteSelected);
            return;
        }
        OnActionClick('DeleteSelected');
    },
    
    deleteSelected: function() {
        Ext.Msg.show({
            title: SR.Warning, 
            msg: SR.DeleteActivity_ConfirmationMessage, 
            icon: Ext.Msg.WARNING,
            buttons: Ext.Msg.OKCANCEL,
            fn: function(btn, text) {
                if (btn === 'ok') {
                    Reminders.doDeleteSelected();
                }
            }
        });
    },
    
    rescheduleSelected: function(ignoreConfirmations) {
        if (!ignoreConfirmations) {
            this.checkConfirmations(this.rescheduleSelected);
            return;
        }
        OnActionClick('RescheduleSelected');
    },
    
    completeSelected: function(ignoreConfirmations) {
        if (!ignoreConfirmations) {
            this.checkConfirmations(this.completeSelected);
            return;
        }
        if (Reminders.getSelectedActivities() === "")
            return;
        Reminders.quickComplete.show();
    },
    
    dismissSelected: function(checkDone) {
        if (!checkDone) {
            this.checkAlarmOnlyAction(this.dismissSelected);
            return;
        }
        OnActionClick('DismissSelected');
    },
        
    snoozeSelected: function(checkDone) {
        if (!checkDone) {
            this.checkAlarmOnlyAction(this.snoozeSelected);
            return;
        }
        OnActionClick('SnoozeSelected');
    },
        
    snoozeAll: function(checkDone) {
        if (!checkDone) {
            $("input[id$=_chkSelectAll]")[0].checked = true;
            selectAll();
            this.checkAlarmOnlyAction(this.snoozeAll);
            return;
        }
        OnActionClick('SnoozeSelected');
    },
    
    // NOTE: used in code behind
    showError: function(message) {
        Ext.Msg.show({
            title: SR.Warning, 
            msg: message, 
            icon: Ext.Msg.WARNING,
            buttons: Ext.Msg.OK
        });
    },
    
    saveSelectedIds: function() {
        $('input[id$=_SelectedIds]').val(this.getSelectedIds());
    },
    
    restoreSelectedIds: function() {
        var selectedIds = $("input[id$=_SelectedIds]").val().split(",");
        $("input[id$=_chkRowSelect]").each(
            function() {
                var id = $(this).attr("data-activityId");
                var checked = selectedIds.indexOf(id) >= 0;
                $(this).attr("checked", checked);
            }
        );  
    },
            
    enableListActions: function() {
        var actions = [
            $("input[id$=_cmdDeleteActivity]")[0],
            $("input[id$=_cmdRescheduleActivity]")[0],
            $("input[id$=_cmdCompleteActivity]")[0],
            $("input[id$=_btnSnooze]")[0],
            $("input[id$=_btnDismiss]")[0]
        ];
        
        var disabled = this.getSelectedCount() === 0;
        jQuery.each(actions, function() {
            this.disabled = disabled;
        });
        $("input[id$=_btnSnoozeAll]")[0].disabled = this.getCount() === 0;
        $("input[id$=_chkSelectAll]").attr("checked", this.isAllSelected());
    },
    
    init: function () {
        this.restoreSelectedIds();
        this.enableListActions();    
    }
};

function onPageLoad() {
    $(document).ready(function() {
        Reminders.init();
        
     //Check to see if the Reminder Timer is on the page.  If so, let it get the updated cached count.
     if (ReminderTimerObj)
        {
            $.get("SLXReminderHandler.aspx", function(data, status) {           
            ReminderTimerObj.HandleHttpResponse(data);
            });
        }   
    });
}

Sys.Application.add_load(onPageLoad); 

</script>

<div style="display:none">
    <asp:Panel ID="ActivityReminders_LTools" runat="server">
    </asp:Panel>
    <asp:Panel ID="ActivityReminders_CTools" runat="server">
        <asp:Button runat="server" ID="btnShowHideDetail" CssClass="slxbutton" />
    </asp:Panel>
    <asp:Panel ID="ActivityReminders_RTools" runat="server">
        <asp:ImageButton runat="server" ID="cmdDeleteActivity" 
            OnClientClick="Reminders.deleteSelected(); return false;"
            ToolTip="<%$ resources: cmdDelete_Button.ToolTip %>" 
            ImageUrl="~/images/icons/Delete_16x16.gif" 
            disabled="disabled"
        />
        <asp:ImageButton runat="server" ID="cmdRescheduleActivity" 
            OnClientClick="Reminders.rescheduleSelected(); return false;"
            ToolTip="<%$ resources: cmdRescheduleActivity.ToolTip %>" 
            ImageUrl="~/images/icons/Reschedule_Activity_16x16.gif" 
            disabled="disabled"
        />
        <asp:ImageButton runat="server" ID="cmdCompleteActivity" 
            OnClientClick="Reminders.completeSelected(); return false;"
            ToolTip="<%$ resources: cmdCompleteActivity.ToolTip %>" 
            ImageUrl="~/images/icons/complete_activity_16x16.gif" 
            disabled="disabled"
        />
        <SalesLogix:PageLink ID="ActivityRemindersHelpLink" runat="server" 
            LinkType="HelpFileName" NavigateUrl="alarmlist.aspx"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" 
            ImageUrl="~/images/icons/Help_16x16.gif">
        </SalesLogix:PageLink>
    </asp:Panel>

    <asp:Button runat="server" ID="btnSelectedRow" style="display:none" />
    <asp:Button ID="btnPerformAction" runat="server" style="display:none;"/>

    <input id="txtSelRowIndx" type="hidden" runat="server" />
    <input id="txtDeleteConfirmed" type="hidden" value="F" runat="server" />

    <asp:HiddenField ID="ActionType" runat="server" />
    <asp:HiddenField ID="ActivityIds" runat="server" />
    <asp:HiddenField ID="SelectedIds" runat="server" />
    <asp:HiddenField ID="currentIndex" runat="server" />

    <!-- Complete related -->
    <asp:HiddenField ID="asScheduled" runat="server" Value="" />
    <asp:HiddenField ID="completeNotes" runat="server" Value="" />
    <asp:HiddenField ID="resultText" runat="server" Value="" />

    <asp:HiddenField ID="hideDetailsPane" runat="server" Value="F" />
</div>

<div id="divActivityList" runat="server" class="formrow" style="height:350px;overflow:scroll">
    <SalesLogix:SlxGridView runat="server" ID="grdActivityReminders" Width="98%" 
        MinRowHeight="18px" GridLines="None" AutoGenerateColumns="False"
        CellPadding="4" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" 
        RowStyle-CssClass="rowlt" ShowEmptyTable="True" ResizableColumns="True"
        EmptyTableRowText="<%$ Resources:grdActivityReminders.EmptyTableRowText %>" 
        DataKeyNames="Id" EnableViewState="false" AllowSorting="true"
        OnSorting="grdActivityReminders_Sorting" 
        OnRowDataBound="grdActivityReminders_RowDataBound" 
        >
        <Columns>
            <asp:TemplateField HeaderText="">
                <itemtemplate>
                    <span id="ActivityId<%# DataBinder.Eval(Container, "RowIndex") %>" style="display:none"><%# DataBinder.Eval(Container.DataItem, "ActivityId") %></span>
                    <span id="ReminderTypeId<%# DataBinder.Eval(Container, "RowIndex") %>" style="display:none"><%# DataBinder.Eval(Container.DataItem, "ReminderType") %></span>
                </itemtemplate>
            </asp:TemplateField>
            <asp:TemplateField>
                <HeaderTemplate>
                    <asp:CheckBox ID="chkSelectAll" runat="server" 
                        Text="<%$ Resources:chkbxSelectAll.Text %>" 
                        onclick="selectAll();"
                    />
                </HeaderTemplate>
                <itemtemplate>
                    <asp:CheckBox ID="chkRowSelect" runat="server" 
                        onclick="onActivitySelectClick(event);"
                    />
                </itemtemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="ReminderType" HeaderText="<%$ Resources:Reminders_Grid_Header_ActivityReminder.HeaderText %>" SortExpression="ReminderType" />
            <asp:TemplateField SortExpression="ActivityType" HeaderText="<%$ Resources:Reminders_Grid_Header_ActivityType.HeaderText %>">
                <itemtemplate>
                    <asp:HyperLink ID="lnkActivity" runat="server" Target="_top" Font-Bold="false" NavigateUrl='<%# BuildActivityNavigateUrl(Eval("ActivityId"), Eval("ReminderType")) %>'>
			            <img alt="Activity Type" style="vertical-align:middle;" src='<%# DataBinder.Eval(Container.DataItem, "TypeImage") %>' />&nbsp;<%# DataBinder.Eval(Container.DataItem, "ActivityType") %>
			        </asp:HyperLink>
                </itemtemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="StartDate" HeaderText="<%$ Resources:Reminders_Grid_Header_Start.HeaderText %>" SortExpression="StartDate" />
            <asp:TemplateField SortExpression="ContactName" HeaderText="<%$ Resources:Reminders_Grid_Header_Name.HeaderText %>">
                <ItemTemplate>
                    <asp:HyperLink ID="lnkContact" runat="server" Target="_top" Enabled='<%# DataBinder.Eval(Container.DataItem, "ContactLinkEnabled") %>'
                        NavigateUrl='<%# DataBinder.Eval(Container.DataItem, "ContactLink") %>'>
								        <%# DataBinder.Eval(Container.DataItem, "Name") %>
			        </asp:HyperLink>
                </ItemTemplate>
            </asp:TemplateField>
            <asp:TemplateField SortExpression="AccountName" HeaderText="<%$ Resources:Reminders_Grid_Header_Account.HeaderText %>">
                <ItemTemplate>
                    <asp:HyperLink ID="lnkAccount" runat="server" Target="_top" Enabled='<%# DataBinder.Eval(Container.DataItem, "AccountLinkEnabled") %>'
                        NavigateUrl='<%# DataBinder.Eval(Container.DataItem, "AccountLink") %>'>
			            <%# DataBinder.Eval(Container.DataItem, "AccountName") %>
			        </asp:HyperLink>
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="Regarding" HeaderText="<%$ Resources:Reminders_Grid_Header_Regarding.HeaderText %>" SortExpression="Regarding" />
        </Columns>
        <RowStyle CssClass="rowlt" />
        <AlternatingRowStyle CssClass="rowdk" />
    </SalesLogix:SlxGridView>
</div>

<div style="height:30px;">
    <table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin:5px 0;">
        <tr>
            <td>
                <asp:Button runat="server" ID="btnDismiss" 
                    Text="<%$ Resources: Reminders_Button_Dismiss.Text %>" 
                    disabled="disabled"
                    CssClass="slxbutton" 
                    OnClientClick="Reminders.dismissSelected(); return false;"
                />
            </td>
            <td>
                <asp:CheckBox ID="chkPastDue" runat="server" Checked="true" Text="<%$ Resources:Reminders_Ckbox_PastDue.Text %>" AutoPostBack="true"/>
            </td>
            <td align="right">
                <asp:Label ID="lblSnoozeBy" runat="server" Text="<%$ Resources:Reminders_Label_SnoozeBy.Text %>" style="margin-right:5px;"></asp:Label>
                <asp:DropDownList ID="SnoozeDuration" runat="server" style="margin-right:5px;">
                    <asp:ListItem Selected="true" Text="<%$ Resources:Reminders_ListItem_5.Text %>" Value="5"></asp:ListItem>
                    <asp:ListItem Text="<%$ Resources:Reminders_ListItem_15.Text %>" Value="15"></asp:ListItem>
                    <asp:ListItem Text="<%$ Resources:Reminders_ListItem_30.Text %>" Value="30"></asp:ListItem>
                    <asp:ListItem Text="<%$ Resources:Reminders_ListItem_60.Text %>" Value="60"></asp:ListItem>
                    <asp:ListItem Text="<%$ Resources:Reminders_ListItem_120.Text %>" Value="120"></asp:ListItem>
                    <asp:ListItem Text="<%$ Resources:Reminders_ListItem_1440.Text %>" Value="1440"></asp:ListItem>
                    <asp:ListItem Text="<%$ Resources:Reminders_ListItem_2880.Text %>" Value="2880"></asp:ListItem>
                </asp:DropDownList>
                <asp:Button ID="btnSnooze" runat="server" 
                    Text="<%$ Resources: btnSnooze.Text %>" 
                    ToolTip="<%$ Resources: btnSnooze.ToolTip %>" 
                    disabled="disabled"
                    CssClass="slxbutton"
                    style="margin-right:5px" 
                    OnClientClick="Reminders.snoozeSelected(); return false;"
                />
                <asp:Button ID="btnSnoozeAll" runat="server" 
                    Text="<%$ Resources: btnSnoozeAll.Text %>" 
                    ToolTip="<%$ Resources: btnSnoozeAll.ToolTip %>"
                    disabled="disabled"
                    CssClass="slxbutton"
                    style="margin-right:5px" 
                    OnClientClick="Reminders.snoozeAll(); return false;" 
                />
            </td>
        </tr>
    </table>
</div>
<hr />

<div id="divActivityDetails" runat="server">
<table id="tblActivity" border="0" cellpadding="1" cellspacing="2" class="formtable">
    <col width="50%" />
    <col width="45%" />
    <col width="5%" />
<tr>
    <td style="padding-left:40px">
        <asp:Image ID="imgActivity" ImageUrl="../../help/Common/images/alarmicons/To-Do.gif" runat="server" />
        <asp:HyperLink ID="lnkRegarding" runat="server" NavigateUrl="" Font-Size="Small" Font-Bold="true">
            <asp:Localize ID="lclRegarding" runat="server" Text="<%$ Resources:Reminders_HLink_Regarding.Text %>"></asp:Localize>
        </asp:HyperLink>
    </td>
    <td align="right">
        <div runat="server" id="divActivityOptions" style="display:none">
            <asp:Image ID="imgComlete" ImageUrl="~/images/icons/Clear_Activity_16x16.gif" runat="server" />
            <asp:HyperLink ID="lnkComplete" runat="server" Font-Size="Small" Font-Bold="true" NavigateUrl="javascript:OnActionClick('Complete')"
                Text="<%$ Resources:Reminders_Button_Complete.Text %>" ToolTip="<%$ Resources:Reminders_Button_Complete.ToolTip %>">
            </asp:HyperLink>
            &nbsp;
            &nbsp;
            <asp:Image ID="imgReschedule" ImageUrl="~/images/icons/Reschedule_Activity_16x16.gif" runat="server" />
            <asp:HyperLink ID="lnkReschedule" runat="server" Font-Size="Small" Font-Bold="true" NavigateUrl="javascript:OnActionClick('Reschedule')"
                Text="<%$ Resources:Reminders_Button_Reschedule.Text %>" ToolTip="<%$ Resources:Reminders_Button_Reschedule.ToolTip %>">
            </asp:HyperLink>
        </div>
        <div runat="server" id="divConfirmActivity" style="display:none">
            <asp:Image ID="imgDecline" ImageUrl="~/images/icons/Delete_16x16.gif" runat="server" />
            <asp:HyperLink ID="lnkDecline" runat="server" Font-Size="Small" Font-Bold="true" NavigateUrl="javascript:OnActionClick('Decline')"
                Text="<%$ Resources:lnkDecline.Text %>" ToolTip="<%$ Resources:lnkDecline.ToolTip %>">
            </asp:HyperLink>
            &nbsp;
            &nbsp;
            <asp:Image ID="imgAccept" ImageUrl="~/images/icons/Reschedule_Activity_16x16.gif" runat="server" />
            <asp:HyperLink ID="lnkAccept" runat="server" Font-Size="Small" Font-Bold="true" NavigateUrl="javascript:OnActionClick('Confirm')"
                Text="<%$ Resources:lnkAccept.Text %>" ToolTip="<%$ Resources:lnkAccept.ToolTip %>">
            </asp:HyperLink>
        </div>
        <div runat="server" id="divDeleteConfirmation" style="display:none">
            <asp:Image ID="imgDeleteConfirmation" ImageUrl="~/images/icons/Delete_16x16.gif" runat="server" />
            <asp:HyperLink ID="lnkDeleteConfirmation" runat="server" Font-Size="Small" Font-Bold="true" NavigateUrl="javascript:OnActionClick('UnConfirm')"
                Text="<%$ Resources:lnkDeleteConfirmation.Text %>" ToolTip="<%$ Resources:lnkDeleteConfirmation.ToolTip %>">
            </asp:HyperLink>
        </div>
    </td>
    <td></td>
</tr>
<tr>
    <td style="padding-left:40px">
        &nbsp 
    </td>
</tr>
<tr>
    <td style="padding-left:40px">
        <div class="lbl alignleft">
            <asp:Label ID="lblMeeting" runat="server" Text="<%$ Resources:lblMeeting.Text %>"
                AssociatedControlID="lblStartDate">
            </asp:Label>
        </div>
        <div>
            <asp:Label ID="lblStartDate" runat="server" Text="<%$ Resources:Reminders_Label_StartDate.Text %>"></asp:Label>
        </div>
    </td>
    <td rowspan="11">
        <asp:TextBox ID="txtNotes" runat="server" CssClass="slxtext" TextMode="MultiLine" Width="100%" Wrap="true"
            ReadOnly="true" Rows="11">
        </asp:TextBox>
    </td>
    <td></td>
</tr>
<tr>
    <td style="padding-left:40px">
        <div class="lbl alignleft">
            <asp:Label ID="lblDuration" runat="server" Text="<%$ Resources:lblDuration.Text %>"
                AssociatedControlID="lblDurationText">
            </asp:Label>
        </div>
        <div>
            <asp:Label ID="lblDurationText" runat="server"></asp:Label>
        </div>
    </td>                
</tr>
<tr>
</tr>
<tr>
    <td style="padding-left:40px">
         <div class="lbl alignleft">
            <asp:Label ID="lblContact" runat="server" Text="<%$ Resources:lblContact.Text %>"
                AssociatedControlID="lnkContactName">
            </asp:Label>
        </div>
        <div class="slxlabel">
            <asp:HyperLink runat="server" ID="lnkContactName"></asp:HyperLink>
        </div>
    </td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td style="padding-left:40px">
        <div class="lbl alignleft">
        </div>
        <div class="textcontrol phone">
            <SalesLogix:Phone ID="phnPhone" runat="server" DisplayAsLabel="true"></SalesLogix:Phone>
        </div>
    </td>
    <td></td>
    <td></td>
</tr>
<tr>
</tr>
<tr>
    <td style="padding-left:40px">
        <div class="lbl alignleft">
            <asp:Label ID="lblAccount" runat="server" Text="<%$ Resources:lblAccount.Text %>"
                AssociatedControlID="lnkAccount">
            </asp:Label>
        </div>
        <div class="slxlabel">
            <asp:HyperLink runat="server" ID="lnkAccount"></asp:HyperLink>
        </div>
    </td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td style="padding-left:40px">
        <div class="lbl alignleft">
            <asp:Label ID="lblLeader" runat="server" Text="<%$ Resources:lblLeader.Text %>"
                AssociatedControlID="lblLeaderDisplay">
            </asp:Label>
        </div>
        <div>
            <asp:Label ID="lblLeaderDisplay" runat="server"></asp:Label>
        </div>
    </td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td style="padding-left:40px">
        <div class="lbl alignleft">
            <asp:Label ID="lblPriority" runat="server" Text="<%$ Resources:lblPriority.Text %>"
                AssociatedControlID="lblPriorityDisplay">
            </asp:Label>
        </div>
        <div>
            <asp:Label ID="lblPriorityDisplay" runat="server"></asp:Label>
        </div>
    </td>
</tr>
<tr>
    <td style="padding-left:40px">
        <div class="lbl alignleft">
            <asp:Label ID="lblOpportunity" runat="server" Text="<%$ Resources:lblOpportunity.Text %>"
                AssociatedControlID="lnkOpportunity">
            </asp:Label>
        </div>
        <div class="slxlabel">
            <asp:HyperLink runat="server" ID="lnkOpportunity"></asp:HyperLink>
        </div>
    </td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td style="padding-left:40px">
        <div class="lbl alignleft">
            <asp:Label ID="lblTicket" runat="server" Text="<%$ Resources:lblTicket.Text %>"
                AssociatedControlID="lnkTicket">
            </asp:Label>
        </div>
        <div class="slxlabel">
            <asp:HyperLink runat="server" ID="lnkTicket"></asp:HyperLink>
        </div>
    </td>
</tr>
<tr>
    <td style="padding-left:40px">
        &nbsp 
    </td>
</tr>
<tr>
    <td align="right">
        <asp:HyperLink ID="ShowCalendar" runat="server" NavigateUrl="../../Calendar.aspx" Text="<%$ Resources:Reminders_Href_ShowCal.Text %>"
            style="padding-right:10px">
        </asp:HyperLink>
    </td>
    <td>
        <asp:HyperLink ID="ShowConfirmations" runat="server" NavigateUrl="../../ActivityManager.aspx?activetab=actTabConfirm"
            Text="<%$ Resources:Reminders_Href_ShowConf.Text %>">
        </asp:HyperLink>
    </td>
</tr>
</table>
</div>