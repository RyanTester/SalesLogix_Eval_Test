<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="QueryBuilderMain.ascx.cs" Inherits="Sage.SalesLogix.Client.GroupBuilder.QueryBuilderMain" %>
<%@ Register TagPrefix="SLX" TagName="QBAddCondition" Src="~/GroupBuilder/QBAddCondition.ascx" %>
<%@ Register TagPrefix="SLX" TagName="QBEditLayout" Src="~/GroupBuilder/QBEditLayout.ascx" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
        
<input type="hidden" name="groupID" id="groupID" runat="server" />
<input type="hidden" name="family" id="family" runat="server" />
<input type="hidden" name="groupType" id="groupType" runat="server" />
<input type="hidden" name="mainTable" id="mainTable" runat="server" />
<input type="hidden" name="isAdHoc" id="isAdHoc" value="false" />
<input type="hidden" name="loadMode" id="loadMode" value="" runat="server" />
<input type="hidden" name="sqlonly" id="sqlonly" value="" runat="server" />
<input type="hidden" name="groupSQL" id="groupSQL" />
<input type="hidden" name="groupXML" id="groupXML" />
<div id="divGroupXML" runat="server" class="dispnone"></div>

<table class="tbodylt" cellspacing="0" cellpadding="0">
	<tr>
		<td>
			<table cellspacing="0" cellpadding="0">
				<tr>
					<td class="padding" vAlign="top">
						<div id="divTableTree">
							 <asp:UpdatePanel ID="UpdatePanel1" runat="server">
	                            <ContentTemplate>
						            <asp:Button ID="btnForcePostback" runat="server" style="display:none;" />
							        <asp:TreeView ID="TableTreeView" runat="server" ExpandDepth="1" NodeIndent="15" EnableViewState="false">
							        </asp:TreeView>
							   
                                </ContentTemplate>
							</asp:UpdatePanel>
						</div>
					</td>
					<td class="padrt" vAlign="top">
						<div id="divFieldList">
							<table id="fieldList" cellpadding="2" cellspacing="0" onclick="selectField(event)" ondblclick="runFieldSelected(event);">
							</table>
						</div>
					</td>
					<td class="padrt" vAlign="top">
						<table cellpadding="0" cellspacing="0" height="220px">
							<tr>
								<td valign="top">
									<input id="btnOK" class="W1" onclick="ok_Click()" type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeOK.Text %>" />'><br >
									<input id="btnCancel" class="W1" onclick="cancel_Click()" type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeCancel.Text %>" />'><br >
									<br >
									<input id="btnViewSQL" class="W1" onclick="viewSQL_Click()" type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeViewSQL.Text %>" />' ><br >
									<input id="btnCalc" class="W1" onclick="calculations_Click()" type="button" value="<%$ resources: localizeCalc.Text %>" runat="server"><br >
									<input id="btnJoins" class="W1" onclick="joins_Click()" type="button" value="<%$ resources: localizeGlobalJoins.Text %>" runat="server"><br >
								</td>
							</tr>
							<tr>
								<td vAlign=bottom >
									<a href="javascript: toggleHiddenFields()" id="hiddenFieldSwitch" class="dispnone"><asp:Localize ID="Localize1" runat="server" Text="<%$ resources: localizeHideHiddenFields.Text %>" /></a>
									 <br />
									<a href="javascript: createLocalJoin()" id="lnkCreateLocalJoin"><asp:Localize ID="Localize2" runat="server" Text="<%$ resources: localizeCreateLocalJoin.Text %>" /></a><!--  -->
								</td>
							</tr>
						</table>									
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td id="makespace">
			<table cellSpacing="0" cellPadding="0" border="0">
				<tr>
					<td>
						<table cellSpacing="0" cellPadding="0" width="100%">
							<tr>
								<td id="tabsimg0" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
								<td id="tab0" class="tab" onclick="tabClick(0)"><asp:Localize ID="Localize3"  runat="server" Text="<%$ resources: localizeProperties.Text %>" /></td>
								<td id="tabeimg0" style="background-image:url(images/groupbuilder/endcap.gif)" >&nbsp;</td>
								<td id="tabsimg1" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
								<td id="tab1" class="tab" onclick="tabClick(1)"><asp:Localize ID="Localize4" runat="server" Text="<%$ resources: localizeConditions.Text %>" /></td>
								<td id="tabeimg1" style="background-image:url(images/groupbuilder/endcap.gif)" >&nbsp;</td>
								<td id="tabsimg2" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
								<td id="tab2" class="tab" onclick="tabClick(2)"><asp:Localize ID="Localize5"  runat="server" Text="<%$ resources: localizeLayout.Text %>" /></td>
								<td id="tabeimg2" style="background-image:url(images/groupbuilder/endcap.gif)" >&nbsp;</td>
								<td id="tabsimg3" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
								<td id="tab3" class="tab" onclick="tabClick(3)"><asp:Localize ID="Localize6"  runat="server" Text="<%$ resources: localizeSorting.Text %>" /></td>
								<td id="tabeimg3" style="background-image:url(images/groupbuilder/endcap.gif)" >&nbsp;</td>
								<td id="tabsimg4" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
								<td id="tab4" class="tab" onclick="tabClick(4)"><asp:Localize ID="Localize7"  runat="server" Text="<%$ resources: localizeDefaults.Text %>" /></td>
								<td id="tabeimg4" style="background-image:url(images/groupbuilder/endcap.gif)">&nbsp;&nbsp;&nbsp;</td>
								<td class="W100">&nbsp;</td>
								<td id="helpButtons">
								<span id="helptab0"><SalesLogix:PageLink ID="PropertiesHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: localizeHelp.Text %>" Target="Help" NavigateUrl="querybuilderproperties.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink></span>
								<span id="helptab1" style="display:none"><SalesLogix:PageLink ID="ConditionsHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: localizeHelp.Text %>" Target="Help" NavigateUrl="querybuilderconditions.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink></span>
								<span id="helptab2" style="display:none"><SalesLogix:PageLink ID="LayoutHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: localizeHelp.Text %>" Target="Help" NavigateUrl="querybuilderlayout.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink></span>
								<span id="helptab3" style="display:none"><SalesLogix:PageLink ID="SortingHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: localizeHelp.Text %>" Target="Help" NavigateUrl="querybuildersorting.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink></span>
								<span id="helptab4" style="display:none"><SalesLogix:PageLink ID="DefaultsHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: localizeHelp.Text %>" Target="Help" NavigateUrl="querybuilderdefaults.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink></span>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td>
						<table cellSpacing="0" cellPadding="0">
							<tr>
								<td id="tabControl" class="border" colSpan="12">
									<div id="tabpage0"> <!-- Properties  -->
										<table>
											<tr>
												<td><asp:Localize ID="localizeName" runat="server" Text="<%$ resources: localizeName.Text %>" /></td>
												<td><input id="txtGrpName" class="W2" type="text" maxlength="24" /></td>
											</tr>
											<tr>
												<td><asp:Localize ID="localizeDisplayName" runat="server" Text="<%$ resources: localizeDisplayName.Text %>" /></td>
												<td><input id="txtDisplayName" class="W2" type="text" maxlength="128"  /></td>
											</tr>
											<tr>
												<td valign="top"><asp:Localize ID="localizeDescription" runat="server" Text="<%$ resources: localizeDescription.Text %>" /></td>
												<td><textarea id="txtGrpDescription" class="W2" rows="15" onkeypress="limitLength(128);event.cancelBubble=true" onblur="limitLength(128)"></textarea></td>
											</tr>
										</table>
									</div>
									<div id="tabpage1" class="dispnone"> <!-- Conditions  -->
										<table>
											<tr>
												<td colspan="2">
													<div class="W2"><asp:Localize ID="localizeConditionInstructions" runat="server" Text="<%$ resources: localizeConditionInstructions.Text %>" /></div>
												</td>
											</tr>
											<tr>
												<td><img height="200" src="images/groupbuilder/blank.gif" width="1"></td>
												<td valign="top" >
													<table id="grdConditions" >
														<tr>
															<th><asp:Localize ID="localizeNot" runat="server" Text="<%$ resources: localizeNot.Text %>" /></th>
															<th>(</th>
															<th><asp:Localize ID="localizeField" runat="server" Text="<%$ resources: localizeField.Text %>" /></th>
															<th><asp:Localize ID="localizeOperator" runat="server" Text="<%$ resources: localizeOperator.Text %>" /></th>
															<th><asp:Localize ID="localizeValue" runat="server" Text="<%$ resources: localizeValue.Text %>" /></th>
															<th><asp:Localize ID="localizeCaseSens" runat="server" Text="<%$ resources: localizeCaseSens.Text %>" /></th>
															<th>)</th>
															<th><asp:Localize ID="localizeAndOr" runat="server" Text="<%$ resources: localizeAndOr.Text %>" /></th>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</div>
									<div id="tabpage2" class="dispnone"> <!-- Layout  -->
										<table>
											<tr>
												<td colSpan="2">
													<div class="W2"><asp:Localize ID="localizeLayoutInstructions" runat="server" Text="<%$ resources: localizeLayoutInstructions.Text %>" /></div>
												</td>
											</tr>
											<tr>
												<td width="1"><img height="200" src="images/groupbuilder/blank.gif" width="1"></td>
												<td vAlign="top" id="layoutContainer">
													<table id="grdLayout" cellSpacing="0" cellPadding="0">
														<tr>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</div>
									<div id="tabpage3" class="dispnone"> <!-- Sorting  -->
										<table cellSpacing="0" cellPadding="2">
											<tr>
												<td colSpan="2">
													<div class="W2"><asp:Localize ID="localizeSortInstructions" runat="server" Text="<%$ resources: localizeSortInstructions.Text %>" /></div>
												</td>
											</tr>
											<tr>
												<td width="1"><img height="200" src="images/groupbuilder/blank.gif" width="1"></td>
												<td vAlign="top">
													<table id="grdSorts">
														<tr>
															<th><asp:Localize ID="localizeGrdSortsOrder" runat="server" Text="<%$ resources: localizeGrdSortsOrder.Text %>" /></th>
															<th><asp:Localize ID="localizeGrdSortsSortBy" runat="server" Text="<%$ resources: localizeGrdSortsSortBy.Text %>" /></th>
															<th><asp:Localize ID="localizeGrdSortsDirection" runat="server" Text="<%$ resources: localizeGrdSortsDirection.Text %>" /></th>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</div>
									<div id="tabpage4" class="dispnone"> <!-- Defaults  -->
										<table cellSpacing="0" cellPadding="2" width="500">
											<tr>
												<td><img id="tabpage4blank" runat="server" height="200" src="images/tabs/blank.gif" width="1"></td>
												<td vAlign="top" align="left">
													<input id="chkUseDistinct" type="checkbox" name="chkUseDistinct"> <label accessKey="D" for="chkUseDistinct">
														<asp:Localize ID="localizeReturnDistinct" runat="server" Text="<%$ resources: localizeReturnDistinct.Text %>" /></label>
												</td>
											</tr>
										</table>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td style="PADDING-TOP: 8px">
					        <input id="btnEdit" onclick="edit_Click(event)" type="button" value='<asp:Localize  runat="server" Text="<%$ resources: localizeEdit.Text %>" />'  style="width:70px"/>
						    <input id="btnDel"  onclick="delete_Click()" type="button" value='<asp:Localize  runat="server" Text="<%$ resources: localizeDelete.Text %>" />' style="width:70px"/>
						    <input id="btnMoveUp"  onclick="moveup_Click()" type="button" value='<asp:Localize  runat="server" Text="<%$ resources: localizeMoveUp.Text %>" />' style="width:70px"/>
						    <input id="btnMoveDn"  onclick="movedown_Click()" type="button" value='<asp:Localize  runat="server" Text="<%$ resources: localizeMoveDown.Text %>" />' style="width:70px"/>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
		
<!-- private user controls -->
<div id="dlgAddCondition" style="display:none" >
    <div class="hd" style="font-weight:bold"> 
        <table width="100%"><tr><td><asp:Localize ID="localizeAssignCondition" runat="server" Text="<%$ resources: localizeAssignCondition.Text %>" /></td><td align="right" style="text-align:right"><SalesLogix:PageLink ID="HelpAssignCondition" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: localizeHelp.Text %>" Target="Help" NavigateUrl="queryassigncondition.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr></table>
    </div> 
    <div class="bd" >
        <SLX:QBAddCondition ID="ucQBAddCondition" runat="server"  />
    </div> 
    <div class="ft"></div> 
</div>
<div id="dlgEditLayout" style="display:none" >
    <div class="hd" style="font-weight:bold"> 
        <table width="100%"><tr><td><asp:Localize ID="localizeAssignQueryLayout" runat="server" Text="<%$ resources: localizeAssignQueryLayout.Text %>" /></td><td align="right" style="text-align:right"><SalesLogix:PageLink ID="HelpAssignQueryLayout" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: localizeHelp.Text %>" Target="Help" NavigateUrl="queryassignlayout.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr></table>
	</div>
    <div class="bd" >
        <SLX:QBEditLayout ID="ucQBEditLayout" runat="server"  />
    </div> 
    <div class="ft"></div> 
</div>
		