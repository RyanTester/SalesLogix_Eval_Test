<%@ Control Language="C#" AutoEventWireup="true"  Inherits="Sage.SalesLogix.Client.Reports.Reporting" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<style type="text/css">
.imgBtn {
	cursor: pointer;
	border: 1px solid RGB(208,208,191);
}
</style>
<SalesLogix:ScriptResourceProvider ID="SR" runat="server">
    <Keys>
        <SalesLogix:ResourceKeyName Key="ActionCouldNotBeCompleted" />
        <SalesLogix:ResourceKeyName Key="All" />
        <SalesLogix:ResourceKeyName Key="AllRecords" />
        <SalesLogix:ResourceKeyName Key="ConditionsTH_Condition" />
        <SalesLogix:ResourceKeyName Key="ConditionsTH_Field" />
        <SalesLogix:ResourceKeyName Key="ConditionsTH_Operator" />
        <SalesLogix:ResourceKeyName Key="ConditionsTH_Table" />
        <SalesLogix:ResourceKeyName Key="ConditionsTH_Type" />
        <SalesLogix:ResourceKeyName Key="ConditionsToggle_Edit" />
        <SalesLogix:ResourceKeyName Key="ConditionsToggle_Hide" />
        <SalesLogix:ResourceKeyName Key="CurrentGroup" />
        <SalesLogix:ResourceKeyName Key="CurrentRecord" />
        <SalesLogix:ResourceKeyName Key="FilterExists" />
        <SalesLogix:ResourceKeyName Key="FilterNameRequired" />
        <SalesLogix:ResourceKeyName Key="GroupNoAccess" />
        <SalesLogix:ResourceKeyName Key="InitError" />
        <SalesLogix:ResourceKeyName Key="NoConditions" />
        <SalesLogix:ResourceKeyName Key="Operator_Contains" />
        <SalesLogix:ResourceKeyName Key="Operator_EndsWith" />
        <SalesLogix:ResourceKeyName Key="Operator_Is" />
        <SalesLogix:ResourceKeyName Key="Operator_IsAfter" />
        <SalesLogix:ResourceKeyName Key="Operator_IsBefore" />
        <SalesLogix:ResourceKeyName Key="Operator_IsGreaterThan" />
        <SalesLogix:ResourceKeyName Key="Operator_IsInTheRange" />
        <SalesLogix:ResourceKeyName Key="Operator_IsLessThan" />
        <SalesLogix:ResourceKeyName Key="Operator_IsNot" />
        <SalesLogix:ResourceKeyName Key="Operator_StartsWith" />
        <SalesLogix:ResourceKeyName Key="RemoveCondition" />
        <SalesLogix:ResourceKeyName Key="Condition_Group" />
        <SalesLogix:ResourceKeyName Key="Condition_DateRange" />
        <SalesLogix:ResourceKeyName Key="Condition_Query" />
        <SalesLogix:ResourceKeyName Key="Condition_User" />
        <SalesLogix:ResourceKeyName Key="DateRange_SpecificDates" />
        <SalesLogix:ResourceKeyName Key="DateRange_ThisWeek" />
        <SalesLogix:ResourceKeyName Key="DateRange_ThisMonth" />
        <SalesLogix:ResourceKeyName Key="DateRange_ThisQuarter" />
        <SalesLogix:ResourceKeyName Key="DateRange_ThisYear" />
        <SalesLogix:ResourceKeyName Key="DateRange_LastWeek" />
        <SalesLogix:ResourceKeyName Key="DateRange_LastMonth" />
        <SalesLogix:ResourceKeyName Key="DateRange_LastQuarter" />
        <SalesLogix:ResourceKeyName Key="DateRange_LastYear" />
        <SalesLogix:ResourceKeyName Key="DateRange_MonthToDate" />
        <SalesLogix:ResourceKeyName Key="DateRange_QuarterToDate" />
        <SalesLogix:ResourceKeyName Key="DateRange_YearToDate" />               
    </Keys>
</SalesLogix:ScriptResourceProvider>

<input type="hidden" name="showthisreport" id="showthisreport" runat="server" />
<input type="hidden" name="showrptfamily" id="showrptfamily" runat="server" />
<input type="hidden" name="filterbygroupid" id="filterbygroupid" runat="server" />

<input type="hidden" name="usercode"  id="usercode"/>
<input type="hidden" name="pass"  id="pass"/>
<input type="hidden" name="pluginid"  id="pluginid"/>
<input type="hidden" name="keyfield" id="keyfield"/>
<input type="hidden" name="rsf" id="rsf"/>
<input type="hidden" name="wsql" id="wsql"/>
<input type="hidden" name="sqlqry" id="sqlqry"/>
<input type="hidden" name="forcesql" id="forcesql" value="0" />
<input type="hidden" name="sortfields" id="sortfields"/>
<input type="hidden" name="sortdirections" id="sortdirections"/>
<input type="hidden" name="ss" id="ss"/>
<input type="hidden" name="reportpath" id="reportpath"/>

<div style="display:none">
<asp:Panel ID="Reporting_LTools" runat="server">
</asp:Panel>
<asp:Panel ID="Reporting_CTools" runat="server">
</asp:Panel>
<asp:Panel ID="Reporting_RTools" runat="server">
    <SalesLogix:PageLink ID="lnkReportOverview" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="reportoverview.aspx"
        ImageUrl="ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</asp:Panel>
</div>

<asp:Panel ID="pnlReportManager" runat="Server">
<table class="tbodylt" cellSpacing="0" cellPadding="0">
	<tr>
		<td>
        	<div id="leftcontrols">
				<div ><label id="SELECTTHETYPEOFREPORT" for="reporttype"><asp:Localize ID="localizeSelectTypeReport" runat="server" Text="<%$ resources: localizeSelectTypeReport.Text %>" /></label></div>
				<div><select name="reporttype" id="reporttype" onchange="reportTypeChanged()"></select></div>
				<div ><label id="SELECTTHENAMEOFTHEREPORT" for="reportname"><asp:Localize ID="localizeSelectNameReport" runat="server" Text="<%$ resources: localizeSelectNameReport.Text %>" /></label></div>
				<div><select name="reportname" id="reportname" onchange="reportNameChanged()" size="12"></select></div>
				<div id="infobox">
					<div id="description"></div>
					<br />
					<span id="releasedto">
					    <label id="ReleasedToLabel">
					        <asp:Localize ID="localizeReleasedTo" runat="server" Text="<%$ resources: localizeReleasedTo.Text %>" />
					    </label>&nbsp;
					    <span id="relto"></span>
					</span>
				</div>
				<div>
				    <label id="SHOWRECORDSTHATMATCH">
				        <asp:Localize ID="localizeShowRecordsThatMatch" runat="server" Text="<%$ resources: localizeShowRecordsThatMatch.Text %>" />
				    </label>
				</div>
				<div>
					<select name="filternamelist" onchange="filternamelistChanged(true);" id="filternamelist">
					    <option value=""><asp:Localize ID="localizeAllRecords" runat="server" Text="<%$ resources: AllRecords %>" /></option>
					</select>
					<input type="button" id="showconditions" name="showconditions" onclick="toggleConditionsView()" value='<asp:Localize ID="localizeEdit" runat="server" Text="<%$ resources: ConditionsToggle_Edit %>" />' />
				</div>
				<div>
				    <input type="button" id="viewReport" name="viewReport" onclick="showReport();" value='<asp:Localize ID="localizeViewReport" runat="server" Text="<%$ resources: localizeViewReport.Text %>" />' />
			    </div>
				<br />
			</div>
				
			<div id="filtercontrols">
				<fieldset id="Conditions"><asp:Localize ID="localizeConditions" runat="server" Text="<%$ resources: localizeConditions.Text %>" />
					<div >
					    <label id="MATCH"><asp:Localize ID="localizeMatch" runat="server" Text="<%$ resources: localizeMatch.Text %>" /></label>&nbsp;
					        <select name="jointype" id="jointype" onchange="jointypechange();">
					            <option value="ALL"><asp:Localize ID="localizeAll" runat="server" Text="<%$ resources: All %>" /></option>
					            <option value="ANY"><asp:Localize ID="localizeAny" runat="server" Text="<%$ resources: Any %>" /></option>
					        </select>&nbsp;
					        <label id="OFTHEFOLLOWINGCONDITIONS"><asp:Localize ID="localizeOfFollowingConditions" runat="server" Text="<%$ resources: localizeOfFollowingConditions.Text %>" /></label>
					</div>
					<br />
					<div id="conditionsgroups">
						<div id="conditionType">
							<div ><label id="MATCHBY"><asp:Localize ID="localizeMatchBy" runat="server" Text="<%$ resources: localizeMatchBy.Text %>" /></label></div>
							<div>
								<select id="selConditionType" name="selConditionType" onchange="conditionTypeChange()">
									<option value="GRP"><asp:Localize ID="localizeGroup" runat="server" Text="<%$ resources: localizeGroup.Text %>" /></option>
									<option value="DTR"><asp:Localize ID="localizeDateRange" runat="server" Text="<%$ resources: localizeDateRange.Text %>" /></option>
									<option value="USR"><asp:Localize ID="localizeUser" runat="server" Text="<%$ resources: localizeUser.Text %>" /></option>
									<option value="QRY"><asp:Localize ID="localizeQuery" runat="server" Text="<%$ resources: localizeQuery.Text %>" /></option>
								</select>
							</div>
						</div>
						
						<div id="queryConditionControls">
							<div id="table" class="fieldgroup">
								<div ><label id="labelTable"><asp:Localize ID="localizeTable" runat="server" Text="<%$ resources: localizeTable.Text %>" /></label></div>
								<div><select id="selTableNames" name="selTableNames" onchange="window.setTimeout('getFieldNameList()',10);"></select></div>
							</div>
							<div id="field" class="fieldgroup">
								<div ><label id="labelField"><asp:Localize ID="localizeField" runat="server" Text="<%$ resources: localizeField.Text %>" /></label></div>
								<div><select id="selFieldNames" name="selFieldNames" onchange="setOperatorList();"></select></div>
							</div>
							<div id="queryoperator" class="fieldgroup">
								<div ><label id="OPERATOR"><asp:Localize ID="localizeOperator" runat="server" Text="<%$ resources: localizeOperator.Text %>" /></label></div>
								<div><select id="selOperator" onchange="operatorChange()"></select></div>
							</div>
							<div id="queryvalue" class="fieldgroup">
								<div ><label id="VALUE"><asp:Localize ID="localizeValue" runat="server" Text="<%$ resources: localizeValue.Text %>" /></label></div>
								<span id="oneValue"><input type="text" id="stdValue" name="stdValue" /></span>
								<span id="twoValue"><input type="text" id="txtFrom" name="txtFrom" />&nbsp;-&nbsp;<input type="text" id="txtTo" name="txtTo" /></span>										
								<span id="oneDateValue">
									<SalesLogix:DateTimePicker ID="DateTimePickerOne" runat="server" DisplayTime="False" DateText="">
                            </SalesLogix:DateTimePicker>
								
								</span>
							</div>
						</div>
					
						<div id="groupConditionControls">
							<div id="groupname" class="fieldgroup">
								<div ><label id="labelGroupName"><asp:Localize ID="localizeGroupName" runat="server" Text="<%$ resources: localizeGroupName.Text %>" /></label></div>
								<div id="putgrouplisthere"></div>
							</div>
						</div>
					
						<div id="dateConditionControls">
							<div id="range" class="fieldgroup">
								<div ><label id="labelRange"><asp:Localize ID="localizeRange" runat="server" Text="<%$ resources: localizeRange.Text %>" /></label></div>
								<div>
									<select id="selDateRange" onchange="dateRangeChange()">
										<option value="Specific Dates"><asp:Localize ID="localizeSpecDates" runat="server" Text="<%$ resources: localizeSpecDates.Text %>" /></option>
										<option value="This Week"><asp:Localize ID="localizeThisWeek" runat="server" Text="<%$ resources: localizeThisWeek.Text %>" /></option>
										<option value="This Month"><asp:Localize ID="localizeThisMonth" runat="server" Text="<%$ resources: localizeThisMonth.Text %>" /></option>
										<option value="This Quarter"><asp:Localize ID="localizeThisQuarter" runat="server" Text="<%$ resources: localizeThisQuarter.Text %>" /></option>
										<option value="This Year"><asp:Localize ID="localizeThisYear" runat="server" Text="<%$ resources: localizeThisYear.Text %>" /></option>
										<option value="Last Week"><asp:Localize ID="localizeLastWeek" runat="server" Text="<%$ resources: localizeLastWeek.Text %>" /></option>
										<option value="Last Month"><asp:Localize ID="localizeLastMonth" runat="server" Text="<%$ resources: localizeLastMonth.Text %>" /></option>
										<option value="Last Quarter"><asp:Localize ID="localizeLastQuarter" runat="server" Text="<%$ resources: localizeLastQuarter.Text %>" /></option>
										<option value="Last Year"><asp:Localize ID="localizeLastYear" runat="server" Text="<%$ resources: localizeLastYear.Text %>" /></option>
										<option value="Month To Date"><asp:Localize ID="localizeMonthToDate" runat="server" Text="<%$ resources: localizeMonthToDate.Text %>" /></option>
										<option value="Quarter To Date"><asp:Localize ID="localizeQuarterToDate" runat="server" Text="<%$ resources: localizeQuarterToDate.Text %>" /></option>
										<option value="Year To Date"><asp:Localize ID="localizeYearToDate" runat="server" Text="<%$ resources: localizeYearToDate.Text %>" /></option>
									</select>
								</div>
							</div>
						</div>
				
						<div id="userConditionControls">
							<div id="user" class="fieldgroup">
								<div ><label id="labelUser"><asp:Localize ID="localizeUserCondition" runat="server" Text="<%$ resources: localizeUserCondition.Text %>" /></label></div>
								<div>
								   	<span id="CurrentUserLabel"><asp:Localize ID="localizeCurrentCondition" runat="server" Text="<%$ resources: localizeCurrentCondition.Text %>" />&nbsp;</span><input type="checkbox" id="chkCurrentUser" checked onclick="ToggleUserSelection(this);"/>
									<div id="SpecificUser" style="display:none">
									    <span id="SpecificUserLabel"><asp:Localize ID="localizeSelectUser" runat="server" Text="<%$ resources: localizeSelectUser.Text %>" />&nbsp;</span>
									    <SalesLogix:LookupControl runat="server" ID="SelUser" Enabled="true" LookupEntityName="User" LookupEntityTypeName="Sage.SalesLogix.Security.User, Sage.SalesLogix.Security" AutoPostBack="false"> 
	                                        <LookupProperties> 
		                                        <SalesLogix:LookupProperty PropertyHeader="User Name" PropertyName="UserName" UseAsResult="True"></SalesLogix:LookupProperty> 
	                                        </LookupProperties> 
                                        </SalesLogix:LookupControl>
								    </div>
								</div>
							</div>
						</div>
						
						
						<div id="datePickers" class="fieldgroup">
							<div ><label id="DATEFROM"></label></div>
							<SalesLogix:DateTimePicker ID="DateTimePickerFrom" runat="server" DisplayTime="False" DateText="">
                            </SalesLogix:DateTimePicker>
                            <SalesLogix:DateTimePicker ID="DateTimePickerTo" runat="server" DisplayTime="False" DateText="">
                            </SalesLogix:DateTimePicker>
						</div>
						
					</div>
					<div id="conditionbuttons">
					  	<div class="fieldgroup">
							<img src="images/add.gif" id="Img1" class="imgBtn" onclick="addCondition();" 
							    alt='<asp:Localize ID="localizeAddButton" runat="server" Text="<%$ resources: AddCondition %>" />' />
						</div>
					</div>
					
					<div id="conditionresults">
						<table id="conditionsTable" cellpadding="2" cellspacing="0" border="1">
							<col />
							<col />
							<col />
							<col />
							<col />
							<tr>
								<th><label id="colTYPE"><asp:Localize ID="localizeTypeHeader" runat="server" Text="<%$ resources: ConditionsTH_Type %>" /></label></th>
								<th><label id="colTABLE"><asp:Localize ID="localizeTableHeader" runat="server" Text="<%$ resources: ConditionsTH_Table %>" /></label></th>
								<th><label id="colFIELD"><asp:Localize ID="localizeFieldHeader" runat="server" Text="<%$ resources: ConditionsTH_Field %>" /></label></th>
								<th><label id="colOPERATOR"><asp:Localize ID="localizeOperatorHeader" runat="server" Text="<%$ resources: ConditionsTH_Operator %>" /></label></th>
								<th><label id="colCONDITIONVALUE"><asp:Localize ID="localizeConditionHeader" runat="server" Text="<%$ resources: ConditionsTH_Condition %>" /></label></th>
							</tr>
							<tbody></tbody>
						</table>
					</div>
					
					<div>
						<label id="SAVECONDITIONAS"><asp:Localize ID="localizeSaveConditionAs" runat="server" Text="<%$ resources: localizeSaveConditionAs.Text %>" /></label>&nbsp;
						<input type="text" id="txtConditionName" name="txtConditionName" onkeyup="txtConditionName_change()" maxlength="64"/>
						<input type="button" id="saveConditionSet" name="saveConditionSet" onclick="saveConditions();" 
						    value='<asp:Localize ID="localizeSaveConditionSetButton" runat="server" Text="<%$ resources: localizeSaveConditionSetButton.Text %>" />' />
						<img src="images/delete.gif" id="deletebutton" align="absmiddle" class="imgBtn" onclick="deleteCondition();" 
						    alt='<asp:Localize ID="localizeDeleteButton" runat="server" Text="<%$ resources: RemoveCondition %>" />' />
						<input type="checkbox" id="isPublic" name="isPublic" onclick="saveConditions()" /><label id="PUBLIC" for="isPublic"><asp:Localize ID="localizePublic" runat="server" Text="<%$ resources: localizePublic.Text %>" /></label>
						<input type="button" id="clearfilter" name="clearfilter" onclick="clearCurrentFilters();" 
						    value='<asp:Localize ID="localizeClearFilterButton" runat="server" Text="<%$ resources: localizeClearFilterButton.Text %>" />' />
    				</div>
			    </fieldset>

			    <div id="adminonly">
				    <div id="adminbtns">
					    <input type="button" id="viewxml" name="viewxml" onclick="viewXML();" 
					        value='<asp:Localize ID="localizeViewXmlButton" runat="server" Text="<%$ resources: localizeViewXmlButton.Text %>" />' />
					    <input type="button" id="viewsql" name="viewsql" onclick="viewSQL();" 
					        value='<asp:Localize ID="localizeViewSqlButton" runat="server" Text="<%$ resources: localizeViewSqlButton.Text %>" />' />
				    </div>
				    <!-- <div id="viewingArea"> </div> -->
				    <br />
				    <div>
				        <textarea id="viewingArea2" readonly="true" rows="10" cols="110"></textarea>
				    </div>
			    </div>
		    </div>
		
			</td>
		</tr>
	</table>
</asp:Panel>
<asp:Panel ID="pnlReportingNotConfigured" runat="Server" >
    <asp:Localize ID="localizeNotConfigured" runat="server" Text="<%$ resources: localizeNotConfigured.Text %>" />
</asp:Panel>


<div id="reportnamesxml" runat="server" class="dispnone"></div>
<div id="tabledisplaynamesxml" runat="server" class="dispnone"></div>
