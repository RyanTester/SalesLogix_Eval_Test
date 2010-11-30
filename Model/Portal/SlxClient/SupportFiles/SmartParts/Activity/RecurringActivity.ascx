<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RecurringActivity.ascx.cs" Inherits="SmartParts_Activity_RecurringActivity" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LeftTools" runat="server" />
<asp:Panel ID="CenterTools" runat="server" />
<asp:Panel ID="RightTools" runat="server">
    <SalesLogix:PageLink ID="lnkRecurActHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="recurringactivity.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</asp:Panel>
</div>

<table>
    <tr valign="top">
        <td>
            <asp:Panel ID="pnlActivity" runat="server" BorderStyle="Solid" BorderColor="AliceBlue">
                <asp:Label ID="labelRecurring" runat="server" Text="<%$ resources: labelRecurring.Text %>" Width="170px"></asp:Label>
                <asp:RadioButtonList ID="rbRecurringType" runat="server" AutoPostBack="true" Width="160px" OnSelectedIndexChanged="rbRecurringType_SelectedIndexChanged">
                    <asp:ListItem Value="0"  OccurrenceID="0" Text="<%$ resources: labelRecurring.Items.Once %>" />
                    <asp:ListItem Value="1"  OccurrenceID="1" Text="<%$ resources: labelRecurring.Items.Daily %>" />
                    <asp:ListItem Value="2"  OccurrenceID="2" Text="<%$ resources: labelRecurring.Items.Weekly %>" />
                    <asp:ListItem Value="3"  OccurrenceID="3" Text="<%$ resources: labelRecurring.Items.Monthly %>" />
                    <asp:ListItem Value="4"  OccurrenceID="4" Text="<%$ resources: labelRecurring.Items.Yearly %>" />
                </asp:RadioButtonList>
            </asp:Panel>
        </td>
        <td>
            <table cellspacing="2">
                <tr>
                    <td>
                        <asp:Panel ID="pnlMain" runat="server" >
                            <asp:Panel ID="pnlOnce" runat="server" Style="display:none">
                                <table>
                                    <tr>
                                        <td >
                                            <asp:Localize ID="localizeRecurringOnce" runat="server" Text="<%$ resources: localizeRecurringOnce.Text %>" />
                                        </td>
                                    </tr>
                                    <tr><td ><hr /></td></tr>
                                    <tr>
                                        <td>
                                            <asp:Localize ID="localizeActivityOccursOnce" runat="server" Text="<%$ resources: localizeActivityOccursOnce.Text %>" />
                                        </td>
                                    </tr>
                                    <tr><td><br /><br /></td></tr>
                                 </table>
                             </asp:Panel>

                            <asp:Panel ID="pnlDaily" runat="server" Style="display:none">
                                <table >
                                    <tr>
                                        <td colspan="2">
                                             <asp:Localize ID="localizeRecurringActivity" runat="server" Text="<%$ resources: localizeRecurringActivity.Text %>" />
                                        </td>
                                    </tr>
                                     <tr><td colspan="2"><hr /></td></tr>
                                    <tr>
                                        <td>
                                            <asp:RadioButton ID="rbEveryDay" runat="server" Checked="true" Text="<%$ resources: rbEveryDay.Text %>"  GroupName="EveryDays" AutoPostBack="true"/>&nbsp;
                                         </td>
                                         <td>
                                            <asp:TextBox ID="txtEveryDay" runat="server" Width="35px" AutoPostBack="true" MaxLength="3" Text="1" onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                            <asp:Localize ID="localizeEveryDays" runat="server" Text="<%$ resources: localizeEveryDays.Text %>" />
                                        </td>
                                     </tr>
                                     <tr>
                                        <td>
                                            <asp:RadioButton ID="rbEveryDayAfterCompletion" runat="server"  Text="<%$ resources: rbEveryDayAfterCompletion.Text %>" GroupName="EveryDays" AutoPostBack="true"/>&nbsp;
                                         </td>
                                         <td>
                                            <asp:TextBox ID="txtEveryDayAfterCompletion" runat="server" Width="35px" AutoPostBack="true" MaxLength="3" Text="1" onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                            <asp:Localize ID="localizeDaysAfterCompletion" runat="server" Text="<%$ resources: localizeDaysAfterCompletion.Text %>" />
                                        </td>
                                     </tr>
                                 </table>
                                 <input type="hidden" id="DailyLoaded" runat="server" value="false" />
                            </asp:Panel>

                            <asp:Panel ID="pnlWeekly" runat="server" Style="display:none">
                                <table cellspacing="2">
                                     <tr>
                                        <td colspan="4">
                                            <asp:Localize ID="localizeRecurringActivityWeekly" runat="server" Text="<%$ resources: localizeRecurringActivityWeekly.Text %>" />
                                        </td>
                                    </tr>
                                     <tr><td colspan="4"><hr /></td></tr>
                                    <tr>
                                         <td colspan="4">
                                            <asp:RadioButton ID="rbEveryWeekly" runat="server" Checked="true" Text="<%$ resources: rbEveryWeekly.Text %>" GroupName="EveryWeekly" AutoPostBack="true" />&nbsp;
                                            <asp:TextBox ID="txtWeekly" runat="server" Width="35px" AutoPostBack="true" MaxLength="3" Text="1" onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                            <asp:Localize ID="localizeWeeksOn" runat="server" Text="<%$ resources: localizeWeeksOn.Text %>" />
                                        </td>   
                                    </tr>
                                    <tr>
                                        <td><asp:CheckBox ID="chkMonday" runat="server" Text="<%$ resources: ddlYearlyWeekDay.Items.Monday %>" AutoPostBack="true"  /></td>
                                        <td><asp:CheckBox ID="chkTuesday" runat="server" Text="<%$ resources: ddlYearlyWeekDay.Items.Tuesday %>" AutoPostBack="true" /></td>
                                        <td><asp:CheckBox ID="chkWednesday" runat="server" Text="<%$ resources: ddlYearlyWeekDay.Items.Wednesday %>" AutoPostBack="true"/></td>
                                        <td><asp:CheckBox ID="chkThursday" runat="server" Text="<%$ resources: ddlYearlyWeekDay.Items.Thursday %>" AutoPostBack="true" /></td>
                                    </tr>
                                    <tr>
                                        <td><asp:CheckBox ID="chkFriday" runat="server" Text="<%$ resources: ddlYearlyWeekDay.Items.Friday %>" AutoPostBack="true"/></td>
                                        <td><asp:CheckBox ID="chkSaturday" runat="server" Text="<%$ resources: ddlYearlyWeekDay.Items.Saturday %>" AutoPostBack="true"/></td>
                                        <td colspan="2"><asp:CheckBox ID="chkSunday" runat="server" Text="<%$ resources: ddlYearlyWeekDay.Items.Sunday %>" AutoPostBack="true"/></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <asp:RadioButton ID="rbEveryWeeklyAfterCompletion" runat="server" Checked="true" Text="<%$ resources: rbEveryWeeklyAfterCompletion.Text %>" AutoPostBack="true" GroupName="EveryWeekly"/>&nbsp;
                                            <asp:TextBox ID="txtWeeklyAfterCompletion" runat="server" Width="35px" AutoPostBack="true" MaxLength="3" Text="1"  onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                            <asp:Localize ID="localizeWeeksAfterCompletion" runat="server" Text="<%$ resources: localizeWeeksAfterCompletion.Text %>" />
                                        </td>   
                                    </tr>
                                </table>
                            </asp:Panel>

                            <asp:Panel ID="pnlMonthly" runat="server" Style="display:none">
                                 <table cellspacing="2">
                                     <tr>
                                        <td >
                                            <asp:Localize ID="localizeRecurringMonthly" runat="server" Text="<%$ resources: localizeRecurringMonthly.Text %>" />
                                        </td>
                                    </tr>
                                    <tr><td><hr /></td></tr>
                                    <tr>
                                        <td>
                                            <asp:RadioButton ID="rbEveryMonthOnDay" runat="server" Text="<%$ resources: rbEveryMonthOnDay.Text %>"  Checked="true" GroupName="monthly" AutoPostBack="true"  />&nbsp;&nbsp;
                                            <asp:TextBox ID="txtEveryMonthOnDay" runat="server" Width="35px" AutoPostBack="true" MaxLength="3" Text="1"  onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                            <asp:Localize ID="localizeMonthsOnDay" runat="server" Text="<%$ resources: localizeMonthsOnDay.Text %>" />&nbsp;
                                            <asp:DropDownList ID="ddlEveryMonthOnDay" runat="server" AutoPostBack="true">
                                                <asp:ListItem Text="1" Value="1"></asp:ListItem>
                                                <asp:ListItem Text="2" Value="2"></asp:ListItem>
                                                <asp:ListItem Text="3" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="4" Value="4"></asp:ListItem>
                                                <asp:ListItem Text="5" Value="5"></asp:ListItem>
                                                <asp:ListItem Text="6" Value="6"></asp:ListItem>
                                                <asp:ListItem Text="7" Value="7"></asp:ListItem>
                                                <asp:ListItem Text="8" Value="8"></asp:ListItem>
                                                <asp:ListItem Text="9" Value="9"></asp:ListItem>
                                                <asp:ListItem Text="10" Value="10"></asp:ListItem>
                                                <asp:ListItem Text="11" Value="11"></asp:ListItem>
                                                <asp:ListItem Text="12" Value="12"></asp:ListItem>
                                                <asp:ListItem Text="13" Value="13"></asp:ListItem>
                                                <asp:ListItem Text="14" Value="14"></asp:ListItem>
                                                <asp:ListItem Text="15" Value="15"></asp:ListItem>
                                                <asp:ListItem Text="16" Value="16"></asp:ListItem>
                                                <asp:ListItem Text="17" Value="17"></asp:ListItem>
                                                <asp:ListItem Text="18" Value="18"></asp:ListItem>
                                                <asp:ListItem Text="19" Value="19"></asp:ListItem>
                                                <asp:ListItem Text="20" Value="20"></asp:ListItem>
                                                <asp:ListItem Text="21" Value="21"></asp:ListItem>
                                                <asp:ListItem Text="22" Value="22"></asp:ListItem>
                                                <asp:ListItem Text="23" Value="23"></asp:ListItem>
                                                <asp:ListItem Text="24" Value="24"></asp:ListItem>
                                                <asp:ListItem Text="25" Value="25"></asp:ListItem>
                                                <asp:ListItem Text="26" Value="26"></asp:ListItem>
                                                <asp:ListItem Text="27" Value="27"></asp:ListItem>
                                                <asp:ListItem Text="28" Value="28"></asp:ListItem>
                                                <asp:ListItem Text="29" Value="29"></asp:ListItem>
                                                <asp:ListItem Text="30" Value="30"></asp:ListItem>
                                                <asp:ListItem Text="31" Value="31"></asp:ListItem>
                                            </asp:DropDownList>
                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:RadioButton ID="rbEveryMonthOnTheDayOfWeek" runat="server" Text="<%$ resources: rbEveryMonthOnTheDayOfWeek.Text %>"  GroupName="monthly" AutoPostBack="true"/>&nbsp;&nbsp;
                                            <asp:TextBox ID="txtEveryMonthOnTheDayOfWeek" runat="server" Width="35px" AutoPostBack="true" MaxLength="3" Text="1"  onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                           <asp:Localize ID="localizeMonthsOnThe" runat="server" Text="<%$ resources: localizeMonthsOnThe.Text %>" />&nbsp;
                                            <asp:DropDownList ID="ddlWeekOfMonth" runat="server" AutoPostBack="true">
                                                <asp:ListItem Text="<%$ resources: ddlWeekOfMonth.Items.First %>" Value="1"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlWeekOfMonth.Items.Second %>" Value="2"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlWeekOfMonth.Items.Third %>" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlWeekOfMonth.Items.Fourth %>" Value="4"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlWeekOfMonth.Items.Last %>" Value="5"></asp:ListItem>
                                            </asp:DropDownList>&nbsp;
                                            <asp:DropDownList ID="ddlMonthlyWeekDay" runat="server" AutoPostBack="true">
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Sunday %>" Value="1"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Monday %>" Value="2"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Tuesday %>" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Wednesday %>" Value="4"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Thursday %>" Value="5"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Friday %>" Value="6"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Saturday %>" Value="7"></asp:ListItem>
                                            </asp:DropDownList>
                                        </td>
                                    </tr>
                                     <tr>
                                        <td>
                                            <asp:RadioButton ID="rbMonthsAfterCompletion" runat="server" Text="<%$ resources: rbMonthsAfterCompletion.Text %>" AutoPostBack="true" GroupName="monthly"/>&nbsp;&nbsp;
                                            <asp:TextBox ID="txtMonthsAfterCompletion" runat="server" Width="35px" AutoPostBack="true" MaxLength="3" Text="1"  onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                            <asp:Localize ID="localizeMonthsAfterCompletion" runat="server" Text="<%$ resources: localizeMonthsAfterCompletion.Text %>" />&nbsp;
                                        </td>   
                                    </tr>
                                </table>
                            </asp:Panel>

                            <asp:Panel ID="pnlYear" runat="server" Style="display:none">
                                <table cellspacing="2">
                                    <tr>
                                        <td colspan="2" >
                                            <asp:Localize ID="localizeRecurringYearly" runat="server" Text="<%$ resources: localizeRecurringYearly.Text %>" />
                                        </td>
                                    </tr>
                                    <tr><td colspan="2"><hr /></td></tr>
                                    <tr>
                                        <td><asp:RadioButton ID="rbYearlyEveryOnDayOfTheMonth" runat="server" Text="<%$ resources: rbYearlyEveryOnDayOfTheMonth.Text %>"  Checked="true" GroupName="yearly" AutoPostBack="true" />&nbsp;&nbsp;</td>
                                        <td>
                                            <asp:TextBox ID="txtYearlyOnDayOfTheMonth" runat="server" Width="35px" AutoPostBack="true" MaxLength="3" Text="1"  onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                            <asp:Localize ID="localizeYearsOn" runat="server" Text="<%$ resources: localizeYearsOn.Text %>" />
                                            <asp:DropDownList ID="ddlMonthOfTheYear" runat="server" AutoPostBack="true">
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Jan %>" Value="1"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Feb %>" Value="2"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Mar %>" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Apr %>" Value="4"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.May %>" Value="5"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Jun %>" Value="6"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Jul %>" Value="7"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Aug %>" Value="8"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Sep %>" Value="9"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Oct %>" Value="10"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Nov %>" Value="11"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Dec %>" Value="12"></asp:ListItem>
                                            </asp:DropDownList>
                                            &nbsp;
                                            <asp:DropDownList ID="ddlYearlyDayOfMonth" runat="server" AutoPostBack="true">
                                                <asp:ListItem Text="1" Value="1"></asp:ListItem>
                                                <asp:ListItem Text="2" Value="2"></asp:ListItem>
                                                <asp:ListItem Text="3" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="4" Value="4"></asp:ListItem>
                                                <asp:ListItem Text="5" Value="5"></asp:ListItem>
                                                <asp:ListItem Text="6" Value="6"></asp:ListItem>
                                                <asp:ListItem Text="7" Value="7"></asp:ListItem>
                                                <asp:ListItem Text="8" Value="8"></asp:ListItem>
                                                <asp:ListItem Text="9" Value="9"></asp:ListItem>
                                                <asp:ListItem Text="10" Value="10"></asp:ListItem>
                                                <asp:ListItem Text="11" Value="11"></asp:ListItem>
                                                <asp:ListItem Text="12" Value="12"></asp:ListItem>
                                                <asp:ListItem Text="13" Value="13"></asp:ListItem>
                                                <asp:ListItem Text="14" Value="14"></asp:ListItem>
                                                <asp:ListItem Text="15" Value="15"></asp:ListItem>
                                                <asp:ListItem Text="16" Value="16"></asp:ListItem>
                                                <asp:ListItem Text="17" Value="17"></asp:ListItem>
                                                <asp:ListItem Text="18" Value="18"></asp:ListItem>
                                                <asp:ListItem Text="19" Value="19"></asp:ListItem>
                                                <asp:ListItem Text="20" Value="20"></asp:ListItem>
                                                <asp:ListItem Text="21" Value="21"></asp:ListItem>
                                                <asp:ListItem Text="22" Value="22"></asp:ListItem>
                                                <asp:ListItem Text="23" Value="23"></asp:ListItem>
                                                <asp:ListItem Text="24" Value="24"></asp:ListItem>
                                                <asp:ListItem Text="25" Value="25"></asp:ListItem>
                                                <asp:ListItem Text="26" Value="26"></asp:ListItem>
                                                <asp:ListItem Text="27" Value="27"></asp:ListItem>
                                                <asp:ListItem Text="28" Value="28"></asp:ListItem>
                                                <asp:ListItem Text="29" Value="29"></asp:ListItem>
                                                <asp:ListItem Text="30" Value="30"></asp:ListItem>
                                                <asp:ListItem Text="31" Value="31"></asp:ListItem>
                                            </asp:DropDownList>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><asp:RadioButton ID="rbDayOfTheYear" runat="server" Text="<%$ resources: rbDayOfTheYear.Text %>"  GroupName="yearly" AutoPostBack="true" /></td>
                                        <td>
                                            <asp:DropDownList ID="ddlYearlyWeekOfMonth" runat="server" AutoPostBack="true">
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekOfMonth.Items.First %>" Value="1"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekOfMonth.Items.Second %>" Value="2"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekOfMonth.Items.Third %>" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekOfMonth.Items.Fourth %>" Value="4"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekOfMonth.Items.Last %>" Value="5"></asp:ListItem>
                                            </asp:DropDownList>
                                            &nbsp;
                                            <asp:DropDownList ID="ddlYearlyWeekDay" runat="server" AutoPostBack="true">
                                                 <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Sunday %>" Value="1"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Monday %>" Value="2"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Tuesday %>" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Wednesday %>" Value="4"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Thursday %>" Value="5"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Friday %>" Value="6"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyWeekDay.Items.Saturday %>" Value="7"></asp:ListItem>    
                                           </asp:DropDownList>
                                           &nbsp;
                                           <asp:DropDownList ID="ddlYearlyMonthOfYear" runat="server" AutoPostBack="true">
                                                 <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Jan %>" Value="1"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Feb %>" Value="2"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Mar %>" Value="3"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Apr %>" Value="4"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.May %>" Value="5"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Jun %>" Value="6"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Jul %>" Value="7"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Aug %>" Value="8"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Sep %>" Value="9"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Oct %>" Value="10"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Nov %>" Value="11"></asp:ListItem>
                                                <asp:ListItem Text="<%$ resources: ddlYearlyMonthOfYear.Items.Dec %>" Value="12"></asp:ListItem>
                                           </asp:DropDownList>
                                        </td>
                                    </tr>
                                     <tr>
                                        <td colspan="2">
                                            <asp:RadioButton ID="rbYearlyAfterCompletion" runat="server" Text="<%$ resources: rbYearlyAfterCompletion.Text %>" AutoPostBack="true" GroupName="yearly"/>&nbsp;&nbsp;
                                            <asp:TextBox ID="txtYearlyAfterCompletion" runat="server" MaxLength="3" Width="35px" AutoPostBack="true" Text="1" onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)"></asp:TextBox>
                                            &nbsp;<asp:Localize ID="localizeYearsAfterCompletion" runat="server" Text="<%$ resources: localizeYearsAfterCompletion.Text %>" />
                                        </td>   
                                    </tr>
                               </table>
                             </asp:Panel>
                         </asp:Panel>
                    </td>
                </tr>
                 <tr><td><hr /></td></tr>
                 <tr>
                    <td>
                        <asp:Panel ID="pnlDuration" runat="server" >
                            <table cellspacing="2">
                                <tr>
                                    <td><asp:Localize ID="localizeRecurring" runat="server" Text="<%$ resources: localizeRecurring.Text %>" />&nbsp;</td>
                                    <td><SalesLogix:DateTimePicker ID="dtpStartRecurring" runat="server" AutoPostBack="true" DisplayTime="false" Timeless="true" ></SalesLogix:DateTimePicker></td>
                                </tr>
                                <tr>
                                    <td><asp:RadioButton ID="rbEndAfter" runat="server" Text="<%$ resources: rbEndAfter.Text %>" Checked="true" /></td>
                                    <td>
                                        <asp:TextBox ID="txtEndAfter" runat="server" Width="35px" AutoPostBack="true" onchange="ForceDefaultValue(this, 1)" onkeypress="return RestrictToNumeric(event)" MaxLength="3"></asp:TextBox>
                                        <asp:Localize ID="localizeOccurrences" runat="server" Text="<%$ resources: localizeOccurrences.Text %>" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><asp:Localize ID="localizeEndRecurring" runat="server" Text="<%$ resources: localizeEndRecurring.Text %>" /></td>
                                    <td><SalesLogix:DateTimePicker ID="dtpEndRecurring" runat="server" AutoPostBack="true" DisplayTime="false" Timeless="true"></SalesLogix:DateTimePicker></td>
                                </tr>
                            </table>
                       </asp:Panel>
                   </td>
                </tr>
            </table>
         </td>
    </tr>
 </table>
  
