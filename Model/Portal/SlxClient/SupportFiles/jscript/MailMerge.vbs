'/* Copyright ©1997-2007                               */
'/* Sage Software, Inc.                                */
'/* All Rights Reserved                                */
'/*  MailMerge.vbs                                      */
'/*  This is a compilation of the vbscript necessary for */
'/* MailMerge, email notification and export to excel for */
'/* the Gobi project.  Will be obsoleted once we have a cross */
'/* browser solution.        */
'Option Explicit
'On Error Resume Next

	Function getClientDateFormat()
		Dim loc
		Dim dDateObj
		Dim original
		Dim strClDate
		Dim strDateFmt

		'what locale is the client? '
		loc = GetLocale
		'create a date object  '
		dDateObj = DateSerial(1999, 11, 22)
		dDateObj2 = DateSerial(2222,3,6)

		'change the locale to the client locale  '
		original = SetLocale(loc)

		'format the date  '
		strClDate = FormatDateTime(dDateObj, 2)

		'replace the date numbers with letters  '
		strDateFmt = replace(strClDate, "1999", "yyyy")
		strDateFmt = replace(strDateFmt, "11", "mm")
		strDateFmt = replace(strDateFmt, "22", "dd")


		'should the month be M or m?

		strClDate = FormatDateTime(dDateObj2, 2)
		if (InStr(strClDate, "03") > 0) then
			strDateFmt = replace(strDateFmt, "mm", "MM")
			strDateFmt = replace(strDateFmt, "dd", "DD")
		end if

		'set the locale back to default '
		SetLocale(original)

		getClientDateFormat = strDateFmt
	End Function

	Function getClientDateSeparator()
		Dim loc
		Dim dDateObj
		Dim original
		Dim strClDate
		Dim strDateFmt
		'what locale is the client? '
		loc = GetLocale
		'create a date object  '
		dDateObj = DateSerial(1999, 11, 22)

		'change the locale to the client locale  '
		original = SetLocale(loc)

		'format the date  '
		strClDate = FormatDateTime(dDateObj, 2) 'Short Date'

		'get rid of the numbers so all we have left is a couple separators  '
		strDateFmt = replace(strClDate, "1999", "")
		strDateFmt = replace(strDateFmt, "11", "")
		strDateFmt = replace(strDateFmt, "22", "")
		strDateFmt = trim(strDateFmt)

		'set the locale back to default '
		SetLocale(original)

		getClientDateSeparator = left(strDateFmt, 1)
	End Function

	Function getClientTimeSeparator()
		Dim loc
		Dim dTimeObj
		Dim original
		Dim strClTime
		Dim strTimeFmt
		'what locale is the client? '
		loc = GetLocale
		'create a time object  '
		dTimeObj = TimeSerial(12, 33, 44)

		'change the locale to the client locale  '
		original = SetLocale(loc)

		'format the time  '
		strClTime = FormatDateTime(dTimeObj, 3) 'Long Time'

		'get rid of the numbers so all we have left is a couple separators  '
		strTimeFmt = replace(strClTime, "12", "")
		strTimeFmt = replace(strTimeFmt, "33", "")
		strTimeFmt = replace(strTimeFmt, "44", "")
		strTimeFmt = trim(strTimeFmt)

		'set the locale back to default '
		SetLocale(original)

		getClientTimeSeparator = left(strTimeFmt, 1)
	End Function

function UrlEncode(item)
	Dim i
	sValid = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" ':/.?=_-$(){}~&"
	sRtn = ""
    For i = 1 To Len(item)
		sTmp = Mid(item, i, 1)
        If InStr(1, sValid, sTmp, vbBinaryCompare) = 0 Then
	        sTmp = "%" & Hex(Asc(sTmp))
            sTmp = Replace(sTmp, "%20", "+")
        End If
        sRtn = sRtn & sTmp
    Next
    UrlEncode = sRtn
end function

'<script type="text/vbscript" language="VBScript" id="groupmanagervb_vbs">

Class GobiMailMergeVb 'groupmanagervb

' Since javascript does not support by ref parameters, we need a vb object to replace the activeX groupmanager
' functions that require out parameters.  This should just be necessary for reports and mailmerge.

'globals
dim mUrl
dim mReportServer
dim xmlhttp
dim gReportID
dim gReportSQL
dim gReportPath
dim	gPwd
dim	gUserName
dim gUseUnicode

private sub class_initialize()
	mReportServer = ""
	mUrl = ASPCOMPLETEPATH
	set xmlhttp = CreateObject("Microsoft.XMLHTTP")
end sub

private function getFromServer(vURL)
	xmlhttp.Open "GET", vURL, false
	xmlhttp.Send
	getFromserver = xmlhttp.responseText
end function

private function postToServer(vURL, vData)
	xmlhttp.Open "POST", vURL, false
	xmlhttp.Send(vData)
	postToServer = xmlhttp.responseText
end function

' Reporting functions

public function ShowReportManager()
	'window.open mUrl + "/reports/ShowReport.aspx", "", "height=530px,width=730px,status=no,toolbar=no,resizable=yes"
end function

public function RequestReportURL(strReportID, strWhereSQL)
	'Dim ReportInfo
	'Dim vDoc
	'Dim reportURL

	'ReportInfo = getReportXML(strReportID, strWhereSQL, varSortFields)
	'set vDoc = CreateObject("Microsoft.XMLDOM")
	'vDoc.loadXML(ReportInfo)
	'reportURL = vDoc.selectSingleNode("//URL").text
	'set vDoc = nothing

	'RequestReportURL = reportURL
	msgbox lclERROR
end function

Dim AddressLabelViewer


function RequestReport(strReportID, strSQL, varSortFields, varCRViewer, outErrorMsg)
	dim url
    Dim bUseActiveReporting
    bUseActiveReporting = UseActiveReporting()
    If Not bUseActiveReporting Then
	gReportID = strReportID
	gReportSQL = strSQL
	gReportPath = REPORTURL
	gPwd = PWD
	gUserName = USERNAME
	
	url = GM.baseUrl + "/getReport.aspx?isAL=T"
    on error resume next 'IE7 gives an error here when it works
	AddressLabelViewer = window.open(url, "AddressLabelViewer", "height=300,width=600, left=10, top=10,location=no, menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no")
	Else
	    ShowReportUsingActiveReporting strSQL, strReportID
	End If
	RequestReport = true
end function

function GetSLQueryData(strUserID, strMainTable, strAddressField, strCriteria, strSorts, byref varLayouts, byref outData, byref outError)
	Dim i
	outSuccess = false
	qstring = mUrl & "/SLXGroupManager.aspx?action=GetQueryData"

	postData = "<slqueryrequest><layouts><![CDATA["
	for i = LBound(varLayouts) to UBound(varLayouts) 'LBound(varLayouts) or 1
		if i <> LBound(varLayouts) then
			postData = postData + ","
		end if
		postData = postData + varLayouts(i)
	next
	postData = postData & "]]></layouts>"
	postData = postData & "<maintable>" & strMainTable & "</maintable>"
	postData = postData & "<userid>" & strUserID & "</userid>"
	postData = postData & "<addressfield><![CDATA[" & strAddressField & "]]></addressfield>"
	postData = postData & "<criteria><![CDATA[" & strCriteria & "]]></criteria>"
	postData = postData & "<sorts><![CDATA[" & strSorts & "]]></sorts>"
	postData = postData & "</slqueryrequest>"
	retXML = postToServer(qstring, postData)

	set gDoc = CreateObject("Msxml.DomDocument") '("Microsoft.XMLDOM")
	gDoc.async = false
	gDoc.loadXML(retXML)

	outData = gDoc.SelectSingleNode("returndata/data").text
	Dim nodes
	set nodes = gDoc.SelectSingleNode("returndata/layouts").childNodes

	ReDim varLayouts(nodes.length)
	for i = 0 to nodes.length - 1
		varLayouts(i) = nodes(i).text
	next


	outSuccess = true
	GetSLQueryData = true
end function

function GetSLQueryWhereClause(strTable, varConditions, outSLWhereClause, outError, outSuccess)
	Dim i
	outSuccess = false
	qstring = mUrl & "/SLXGroupManager.aspx?action=GetWhereClause"
	for i = LBound(varConditions) to UBound(varConditions)
		qstring = qstring & "&DataPath=" & UrlEncode(varConditions(i)(0))
		qstring = qstring & "&Operator=" & UrlEncode(varConditions(i)(1))
		qstring = qstring & "&Value=" & UrlEncode(varConditions(i)(2))
	next
	qstring = qstring & "&table=" & strTable
	outSLWhereClause = getFromServer(qstring)
	outSuccess = true
	GetSLQueryWhereClause = ""
end function


' Mail Merge functions

public function onRequestGroupInfo(strUserID, strGroupID, outContactIDs, outCount, outError)
'gets all members of a group and the count - use grouptranslator
	On Error Resume Next
	qstring = mUrl & "/SLXGroupManager.aspx?action=GetGroupMembers&id=" + UrlEncode(strGroupID) + "&delim=" + UrlEncode(",")
	outContactIDs = getFromServer(qstring)
	outCount = pop(outContactIDs, ",")
	outError = err.Description
	if err.number = 0 then
		onRequestGroupInfo = true
	else
		onRequestGroupInfo = false
	end if
end function


private function pop(byref groups, byval delim)
	if delim = "" then
		delim = "|"
	end if
	if instr(groups, delim) = 0 then
		pop = groups
		groups = ""
	else
		pop = left(groups, instr(groups, delim)-1)
		groups = right(groups, len(groups) - instr(groups, delim))
	end if
end function

public function OnRequestGroups(strUserID, outGroups, outError)
'gets all group names, families and ids in a 2d array - all .net
	On Error Resume Next
	qstring = mUrl & "/SLXGroupManager.aspx?action=GetAllGroups"
	groups = getFromServer(qstring)
	dim aryGroups()
	count = pop(groups, "|")
	ReDim aryGroups(count, 2)
	i = 0
	while (i < count) and (len(groups) > 0)
		aryGroups(i, 0) = pop(groups, "|") 'family
		aryGroups(i, 1) = pop(groups, "|") 'name
		aryGroups(i, 2) = pop(groups, "|") 'id
		i = i + 1
	wend
	outGroups = aryGroups
	outError = Err.Description
	if Err.number = 0 then
		OnRequestGroups = true
	else
		OnRequestGroups = false
	end if
end function

public function OnRequestUsers(strUserID, outUsers, outError)
'user names, titles, ids in a 2d array - all in .net, note that usertypes are converted in uBaseDataDicttypes.pas
	On Error Resume Next
	qstring = mUrl & "/SLXGroupManager.aspx?action=GetUsers"
	data = getFromServer(qstring)
	dim aryData()
	count = pop(data, "|")
	ReDim aryData(count, 2)
	i = 0
	while (i < count) and (len(data) > 0)
		aryData(i, 0) = pop(data, "|") 'family
		aryData(i, 1) = pop(data, "|") 'name
		aryData(i, 2) = pop(data, "|") 'id
		i = i + 1
	wend
	outUsers = aryData
	outError = err.Description
	if err.number = 0 then
		OnRequestUsers = true
	else
		OnRequestUsers = false
	end if
end function

public function ShowNamesDialog(strViewType, strInID)
'dialog gets to, cc, bcc; note that it returns an IRecipients
' only used in writeemailto in salestopnavvb, can we combine this into there?
'Actually, it is not even called there.  Not implementing unless we use it somewhere
end function


private function getMainTableAlias(strFromClause)
	Dim position
	Dim alias
	position = Instr(strFromClause, " ")
	alias = mid(strFromClause, position + 1)
	position = InStr(alias, " ")
	If (position > 0) Then
	    alias = left(alias, position)
	End If
	getMainTableAlias = trim(alias)
end function

private function quote(str)
	dim i
	quote = str
	for i = 1 to len(quote)
		if Mid(str, i, 1) = "'" then
			quote = left(quote, i-1) & "'" & right(quote, len(quote)-i)
		end if
	next
	quote = "'" & quote & "'"
end function

Private Function GetISODate(ByVal DateValue)
    If IsDate(DateValue) Then
        Dim y
        Dim m
        Dim d
        Dim h
        Dim n
        Dim s        
        y = Year(DateValue)        
        m = Month(DateValue)       
        d = Day(DateValue)          
        h = Hour(DateValue)    
        n = Minute(DateValue)
        s = Second(DateValue)

        If m < 10 Then m = "0" & m
        If d < 10 Then d = "0" & d
        If h < 10 Then h = "0" & h
        If n < 10 Then n = "0" & n
        If s < 10 Then s = "0" & s
        
        GetISODate = y & "-" & m & "-" & d & " " & h & ":" & n & ":" & s
   Else
        GetISODate = DateValue
   End If
End Function

private function StripParameters(strSql, groupXmlDoc)
    Set parameters = groupXmlDoc.SelectSingleNode("SLXGroup/parameters").childNodes
    Set conditions = groupXmlDoc.SelectSingleNode("SLXGroup/conditions").childNodes
	result = strSql
	result = Replace(result, ":NOW", quote(GetISODate(Now())), 1, -1, 1)
	result = Replace(result, ":userid", quote(GM.CurrentUserID), 1, -1, 1)
    for each p in parameters
        operator = ""        
        for each c in conditions
            conditionParamName = Replace(c.SelectSingleNode("value").text, ":", "", 1, -1, 1)           
            paramParamName = Replace(p.selectSingleNode("name").text, ":", "", 1, -1, 1)
            if UCase(conditionParamName) = UCase(paramParamName) then
                operator = c.SelectSingleNode("operator").text
                exit for
            end if
        next
        datatype = p.selectSingleNode("datatype").text
        bIsInClause = (Trim(UCase(operator)) = "IN")
        bIsNumber = (Trim(UCase(datatype)) = "NUMBER")
	    if USEUNICODE = "T" and not bIsInClause then
		    result = Replace(result, ":" & p.selectSingleNode("name").text, "?", 1, -1, 1)
    	else
    	    if not bIsInClause and not bIsNumber then
		        result = Replace(result, ":" & p.selectSingleNode("name").text, quote(p.selectSingleNode("value").text), 1, -1, 1)
		    else
		        result = Replace(result, ":" & p.selectSingleNode("name").text, p.selectSingleNode("value").text, 1, -1, 1)
		    end if
	    end if 
    next
	StripParameters = result
end function

public function GetGroupInfoEx(strGroupID, boolUseTableAliases, outSelectSQL, outFromSQL, outWhereSQL, outOrderBySQL, outConditions, outLayouts, outSorts, outInClause, outFamily, outAdHoc, outEmpty, outParameters, outError, outSuccess)
'Note that we are not passing boolUseTableAliases
	On Error Resume Next
	strXml = getFromServer(mUrl & "/SLXGroupManager.aspx?action=GetGroupXML&groupID=" & strGroupID)

	set gDoc = CreateObject("Msxml.DomDocument") '("Microsoft.XMLDOM")
	gDoc.async = false
	gDoc.loadXML(strXml)
		
	' Get the parameters, if any
	outParameters = ""		
	if USEUNICODE = "T" then
	    Set params = gDoc.SelectSingleNode("SLXGroup/parameters").childNodes  
	    for each p in params
		    name = p.selectSingleNode("name").text		    
		    value = p.selectSingleNode("value").text
		    datatype = p.selectSingleNode("fieldtype").text 
		    datapath = p.selectSingleNode("datapath").text 
            tablename = p.selectSingleNode("tablename").text 
            fieldname = p.selectSingleNode("fieldname").text 
            operator = p.selectSingleNode("operator").text 
		    outParameters = outParameters & "|" & name & "|" & value & "|" & datatype & "|" & datapath & "|" & tablename & "|" & fieldname & "|" & operator & "|" & vbCrLf
	    next	
	else
		outParameters = ""
	end if	
	
	fam = uCase(gDoc.documentElement.selectSingleNode("plugindata").getAttribute("family"))
	if (fam = "CONTACT") then
		outFamily = 0
	elseif (fam = "ACCOUNT") then
		outFamily = 1
	elseif (fam = "OPPORTUNITY") then
		outFamily = 2
	elseif (fam = "TICKET") then
		outFamily = 8
	else
		outFamily = 0
	end if

	outFromSQL = gDoc.SelectSingleNode("SLXGroup/fromsql").text		
	outSelectSQL = getMainTableAlias(outFromSQL) & "." & fam & "ID"
	outWhereSQL = StripParameters(gDoc.SelectSingleNode("SLXGroup/wheresql").text, gDoc)
	outOrderBySQL = StripParameters(gDoc.SelectSingleNode("SLXGroup/orderbysql").text, gDoc)

	set vNodes = gDoc.SelectSingleNode("SLXGroup/conditions").childNodes

	outConditions = ""
	for each m in vNodes
		alias = m.selectSingleNode("alias").text
		datapath = m.selectSingleNode("datapath").text
		displayname = m.selectSingleNode("displayname").text
		displaypath = m.selectSingleNode("displaypath").text
		fieldtypecode = m.selectSingleNode("fieldtype").text
		fieldtypename = ""'this.getTypeName();
		vOperator = m.selectSingleNode("operator").text
		vValue = m.selectSingleNode("value").text
		connector = m.selectSingleNode("connector").text
		leftparens = m.selectSingleNode("leftparens").text
		rightparens = m.selectSingleNode("rightparens").text
		isliteral = m.selectSingleNode("isliteral").text
		isnegated = m.selectSingleNode("isnegated").text
		casesens = m.selectSingleNode("casesens").text
		'Condition Terms:  |DataPath|Alias|Condition|Value|AND/OR|Type|CS|(|)|IsLiteral|NOT|
		outConditions = outConditions & "|" & datapath & "|" & alias & "|" & vOperator & "|" & vValue &_
			"|" & connector & "|" & fieldtypecode & "|" & casesens & "|" & leftparens & "|" & rightparens & _
			"|" & isliteral & "|" & isnegated & "|" & vbCRLF
	next
	set vNodes = gDoc.SelectSingleNode("SLXGroup/layouts").childNodes
	outLayouts = ""
	for each m in vNodes
		ishidden = (m.nodeName = "hiddenfield")
		caption = m.selectSingleNode("caption").text
		width = m.selectSingleNode("width").text
		align = m.selectSingleNode("align").text
		captalign = m.selectSingleNode("captalign").text
		format = m.selectSingleNode("format").text
		formatstring = m.selectSingleNode("formatstring").text
		alias = m.selectSingleNode("alias").text
		datapath = m.selectSingleNode("datapath").text
		displayname = m.selectSingleNode("displayname").text
		displaypath = m.selectSingleNode("displaypath").text
		'Layout Terms:|DataPath|Alias|Caption|Width|Format|FormatType|Alignment|CaptionAlignment|
		outLayouts = outLayouts & "|" & datapath & "|" & alias & "|" & caption & "|" & width & "|" & formatstring & _
			"|" & format & "|" & align & "|" & captalign & "|" & vbCRLF
	next
	set vNodes = gDoc.SelectSingleNode("SLXGroup/sorts").childNodes
	outSorts = ""
	for each m in vNodes
		alias = m.selectSingleNode("alias").text
		datapath = m.selectSingleNode("datapath").text
		displayname = m.selectSingleNode("displayname").text
		displaypath = m.selectSingleNode("displaypath").text
		sortorder = m.selectSingleNode("sortorder").text
		'Sort Terms:       |DataPath|Alias|ASC/DESC|
		outSorts = outSorts & "|" & datapath & "|" & alias & "|" & sortorder & "|" & vbCRLF
	next
	outInClause = "" 'even in the delphi this was always empty
	outAdHoc = gDoc.SelectSingleNode("SLXGroup/adhocgroup").text
	if fam <> "CONTACT" and fam <> "OPPORTUNITY" and fam <> "ACCOUNT" then
		outEmpty = true  'this is just weird.  The delphi sets this to true unless is CAO
	else
		outEmpty = false
	end if
	outError = err.Description
	if err.number = 0 then
		outSuccess = true
	else
		outSuccess = false
	end if
end function

public function FormatValue(varType, strFormatString, strValue, outError, outSuccess)
'only for ftowner and ftuser, return val is the formatted val
	On Error Resume Next
	qstring = mUrl & "/SLXInfoBroker.aspx?info=slformat&val=" & UrlEncode(strValue) & "&type=" & UrlEncode(varType) & "&formatstring=" & UrlEncode(strFormatString)
	FormatValue = getFromServer(qstring)
	outError = err.Description
	if err.number = 0 then
		outSuccess = true
	else
		outSuccess = false
	end if
end function

public function RebuildXMLSchema(Error)
	dim retval
	retval = getFromServer(mUrl & "/SLXGroupManager.aspx?action=RebuildXMLSchema")
	if retval = "true" then
		RebuildXMLSchema = true
	else
		Error = retval
		RebuildXMLSchema = false
	end if
end function

' Excel functions

private function GetColumnCharacters(IntNumber)
    if IntNumber < 1 then
		GetColumnCharacters = "A"
    else
		if IntNumber > 702 then
			GetColumnCharacters = "ZZ"
		else
	        if IntNumber > 26 then
				if IntNumber mod 26 = 0 then
					GetColumnCharacters = Chr(64 + (IntNumber \ 26)-1) + Chr(64+26)
				else
					GetColumnCharacters = Chr(64 + (IntNumber \ 26))+Chr(64 + (IntNumber mod 26))
				end if
			else
				GetColumnCharacters = Chr(64 + IntNumber)
			end if
		end if
    end if
end function

private function CleanGroupName(groupname)
dim i
dim achar
'filenames cannot contain <>?[]:|*
	for i = len(groupname) to 1 step -1
		achar = mid(groupname, i, 1)
		if InStr("./<>?[]:|*'""", achar) = 0 then
			CleanGroupName = achar & CleanGroupName
		end if
	next
end function

public Sub ExportGroup(gid,gname)
	'top.donotrefresh = true
  Dim strFileName
  Dim strPath
  Dim strGroupID
  Dim strPivotName
  Dim strPivotSourceName
  Dim strPivotTableName
  Dim blShowAfter
  Dim strSQL


  Dim oExcel
  Dim oWB
  Dim oSHGroup
  Dim oSHPivot
  Dim oRange
  Dim oSHLayout
  Dim oCellStart
  Dim oCellEnd
  Dim oPivotTable
  Dim oRowField
  Dim oColField
  Dim oDataFields

  Dim blCreatePivot
  Dim nStartRow
  Dim nEndRow
  Dim nCols
  Dim nStartCol
  Dim strGroupName
  Dim strGroupNameNSP
  Dim nTotalRecords
  Dim nColPivot
  Dim nDataFields

 'Excel const
 '***********************************************************************************************
  Const xlNone = -4142
  Const xlDiagonalDown = 5
  Const xlDiagonalUp = 6
  Const xlEdgeBottom = 9
  Const xlEdgeLeft= 7
  Const xlEdgeRight = 10
  Const xlEdgeTop = 8
  Const xlInsideHorizontal = 12
  Const xlInsideVertical = 11
  Const xlContinuous = 1
  Const xlAutomatic = -4105
  Const xlThin = 2
  Const xlThick = 4
  Const xlDouble = -4119
  Const xlWBATWorksheet = -4167 ' Blank Work Sheet Template
  Const xlDatabase = 1

  Const xlHidden = 0
  Const xlRowField = 1
  Const xlColumnField = 2
  Const xlPageField = 3
  Const xlDataField = 4

  Const xlSum =- 4157
  Const xlCount = -4112
  Const xlAverage = -4106

 'Sales Logix layout format type const
 '***********************************************************************************************
  Const ftNone = 0
  Const ftFixed = 1
  Const ftInteger = 2
  Const ftDateTime = 3
  Const ftPercent = 4
  Const ftCurrency = 5
  Const ftUser = 6
  Const ftPhone = 7
  Const ftOwner = 8
  Const ftBoolean = 9
  Const ftPosInteger = 10
  Const ftPickListItem = 11

 'INIT
 '***********************************************************************************************
  nStartRow = 0
  nEndRow = 0
  nCols = 0
  nStartCol = 0
  nDataFields = 0
  strGroupName = ""
  strGroupID = ""
  blShowAfter = False
  strFileName = ""
  strPivotName = "PivotTable"
  blCreatePivot = False

  'Get the group name and path
  '***********************************************************************************************

  strGroupName = GROUPNAME 
  if gname <> "" then
      strGroupName = gname
  end if
  strPath = top.GM.GetPersonalDataPath()
  strFileName = strPath & "\" & CleanGroupName(strGroupName) & "-grp-" & CleanGroupName(Now())
  
  if strPath ="" or strGroupName = "" Then
      exit sub
  end If

  'Create Spreadsheet with strFileName from SLX function
  'Two worksheets are created
  'Sheet 1 is the Group List
  'Sheet 2 is the Layout of the group list with format types
  '***********************************************************************************************
  InnerExportGroup gid, strFileName
  blShowAfter = True

  'Create Excel object and Open the SpreadSheet
  '***********************************************************************************************
  set oExcel = CreateObject("Excel.Application")
  set oWB = oExcel.WorkBooks.open (strFileName )
  oWb.Activate
  Set oSHGroup = oWB.Sheets(1)
  Set oSHLayout = oWB.Sheets(2)

  'Get the Layout information
  'nStartRow is the row that data starts at
  'nEndRow is the row that data ends at
  'nStartCol is th col that data starts at
  'nCols is the number of columns that contain data
  'strGroupName is the name of the Group that is being exported out
  '***********************************************************************************************
  nStartRow = oSHLayout.Cells(1,1).Value
  nEndRow = oSHLayout.Cells(1,2).Value
  nStartCol = oSHLayout.Cells(1,3).Value
  nCols = oSHLayout.Cells(1,4).Value
  strGroupName = oSHLayout.Cells(1,5).Value
  strGroupNameNSP = oSHLayout.Cells(1,6).Value
  if IsNumeric(nEndRow) and IsNumeric(nStartRow) then
    nTotalRecords =(nEndRow - nStartRow)+1
  else
  	nTotalRecords = 0
  end if
	if nTotalRecords = 0 then
	  oSHLayout.Visible = False
	  oExcel.Visible = True
		exit sub
	end if


  'Format the heading
  '***********************************************************************************************
  Set oCellStart = oSHGroup.Cells(nStartRow-1,nStartCol)
  Set oCellEnd = oSHGroup.Cells(nStartRow-1,ncols-(nStartCol-1))

  oSHGroup.Range(oCellStart, oCellEnd).Select
  oExcel.ActiveWindow.SplitRow = 1
  oExcel.ActiveWindow.FreezePanes = True

  oSHGroup.Range(oCellStart, oCellEnd).Font.Bold = True
  With oSHGroup.Range(oCellStart, oCellEnd)
    .Borders(xlDiagonalDown).LineStyle = xlNone
    .Borders(xlDiagonalUp).LineStyle = xlNone
    .Borders(xlEdgeLeft).LineStyle = xlNone
  End With
  With oSHGroup.Range(oCellStart, oCellEnd).Borders(xlEdgeTop)
     .LineStyle = xlContinuous
     .Weight = xlThin
     .ColorIndex = xlAutomatic
  End With
  With oSHGroup.Range(oCellStart, oCellEnd).Borders(xlEdgeLeft)
     .LineStyle = xlContinuous
     .Weight = xlThin
     .ColorIndex = xlAutomatic
  End With
  With oSHGroup.Range(oCellStart, oCellEnd).Borders(xlEdgeBottom)
     .LineStyle = xlContinuous
     .Weight = xlThick
     .ColorIndex = xlAutomatic
  End With
  oSHGroup.Range(oCellStart, oCellEnd).Borders(xlEdgeRight).LineStyle = xlNone
  oSHGroup.Range(oCellStart, oCellEnd).Borders(xlInsideVertical).LineStyle = xlNone
  oSHGroup.Range(oCellStart, oCellEnd).Borders(xlInsideHorizontal).LineStyle = xlNone
  oSHGroup.Range("A1").select

  'Set the total records and format the last row
  '***********************************************************************************************
  oSHGroup.Cells(nEndRow+1,nStartCol).Value = "=ROWS(A" & nStartRow & ":A"& nEndRow & ")"
  oSHGroup.Cells(nEndRow+1,nStartCol).Font.Bold = True

  Set oCellStart = oSHGroup.Cells(nEndRow+1,nStartCol)
  Set oCellEnd = oSHGroup.Cells(nEndRow+1,ncols-(nStartCol-1))

  With oSHGroup.Range(oCellStart, oCellEnd).Borders(xlEdgeTop)
     .LineStyle = xlDouble
     .Weight = xlThin
     .ColorIndex = xlAutomatic
  End With


'Format the Data for each column from format in Layout Sheet
'***********************************************************************************************
  Dim i
  Dim iPos
  Dim strColFormat
  Dim strColName
  Dim strcolName2
  Dim strColFormatString
  strColFormat = ""
  i = 0
  iPos = 0
 'loop through each Col
  For i = 1 to nCols
    strColName = oSHLayout.Cells(4+(i-1),2).Value
    strColFormat =oSHLayout.Cells(4+(i-1),3).Value
    strColName2 = oSHGroup.cells(nStartRow-1,i).Value
    strColFormatString = oSHLayout.Cells(4+(i-1),4).Value
    if strColName = strColName2 then
      'oSHGroup.Cells.Item(1,(i)).Font.Bold = True
      Select Case strColFormat
        Case ftCurrency, ftFixed, "Currency", "Fixed"
          if strColFormatString <> "%2.0f%%" then
            oSHGroup.Range(oSHGroup.Cells(nStartRow,i),oSHGroup.Cells(nEndRow+1,i)).NumberFormat = "#,##0.00"
            oSHGroup.Cells(nEndRow+1,i).Font.Bold = True
            'Create Total at bottom Row
            oSHGroup.Cells(nEndRow+1,i).FormulaR1C1 = "=SUM(R[-"& nEndRow & "]C:R[-1]C)"
            blCreatePivot = True
	    'Bug in Excell 2003 where data dumped into spreedsheet is formated as text, although we change the formate type of the column,
            'the value itself remains text. This will convert each value in every cell to a double.
            For Each Cell In oSHGroup.Range(oSHGroup.Cells(nStartRow,i),oSHGroup.Cells(nEndRow+1,i))
                Cell.Value = cDbl(Cell.Value)
            Next
          end if
        Case ftInteger, "Integer"
          blCreatePivot = True
        Case ftPhone, "Phone"
          xlCellValue = 1
          xlBetween = 1
          oSHGroup.Range(oSHGroup.Cells(nStartRow,i),oSHGroup.Cells(nEndRow,i)).NumberFormat  = "##########################"
          oSHGroup.Range(oSHGroup.Cells(nStartRow,i),oSHGroup.Cells(nEndRow,i)).HorizontalAlignment = 2
          oSHGroup.Range(oSHGroup.Cells(nStartRow,i),oSHGroup.Cells(nEndRow,i)).FormatConditions.Add xlCellValue, xlBetween, 999999999, 10000000000          
          
          ' The FormatCondition.NumberFormat property is only available beginning with Excel 2007.
          If (CDbl(Eval(oExcel.Version)) >= 12.0) Then
		    oSHGroup.Range(oSHGroup.Cells(nStartRow,i),oSHGroup.Cells(nEndRow,i)).FormatConditions(1).NumberFormat  = "(###) ###-####"
		  Else
		    oSHGroup.Range(oSHGroup.Cells(nStartRow,i),oSHGroup.Cells(nEndRow,i)).NumberFormat = "[<=9999999]###-####;(###) ###-####"
		  End If
		  		  
        Case "DateTime"
        	oSHGroup.Range(oSHGroup.Cells(nStartRow,i),oSHGroup.Cells(nEndRow,i)).NumberFormat = top.GM.ShortDateFormat
        Case Else
            '
      End Select
    End If
    iPos = iPos + 1
  Next
  'Create the pivot table if set from above
  '***********************************************************************************************
  if  blCreatePivot = true then
    'Set a Data source range and global name to refrence
    nColPivot = nCols + nStartCol + 1
    'Set the DataSource
    oSHGroup.Name = strGroupName
    strPivotSourceName = "DataList" 'strGroupNameNSP
    strPivotTableName = "GroupPivotTable"
    oWB.Names.Add strPivotSourceName ,oSHGroup.Range(oSHGroup.Cells(nStartRow-1,nStartCol), oSHGroup.Cells(nEndRow,(1+(nCols-nStartCol))))
    oSHLayout.Activate
    'Create the PivotTable
    oWB.PivotCaches.Add(xlDatabase, strPivotSourceName).CreatePivotTable "", strPivotTableName
    Set oSHPivot = oWb.Sheets(2)

    oSHPivot.Name = strGroupName & " Pivot"
    oSHGroup.Activate

    set oPivotTable = oSHPivot.PivotTables(strPivotTableName)
    'Add Feilds to the PivotTable
    'First Row is a PivotRow
    oPivotTable.PivotFields(oSHGroup.Cells(nStartRow-1,nStartCol).Value).Orientation = xlRowField
    strColFormat = ""
    i = 0
    iPos = 0
    nDataFields = 0
    'loop through each Col
     for i = 1 to nCols
       strColName = oSHLayout.Cells(4+(i-1),2).Value
       strColFormat =oSHLayout.Cells(4+(i-1),3).Value
       strColName2 = oSHGroup.cells(nStartRow-1,i).Value
       strColFormatString = oSHLayout.Cells(4+(i-1),4).Value

       if strColName = strColName2 then

          Select Case strColFormat
            Case ftCurrency, ftFixed, "Currency", "Fixed"
              if strColFormatString <> "%2.0f%%" then 'this is to exclude percent columns
                nDataFields =  nDataFields + 1
                oPivotTable.PivotFields(strColName2).Orientation = xlDataField
                oPivotTable.DataFields(nDataFields).function = xlSum
                oPivotTable.DataFields(nDataFields).NumberFormat = "#,##0.00"
              end if
            Case ftInteger, "Integer"
              nDataFields =  nDataFields + 1
              oPivotTable.PivotFields(strColName2).Orientation = xlDataField
              oPivotTable.DataFields(nDataFields).function = xlsum
              oPivotTable.DataFields(nDataFields).NumberFormat = "#,##0"

            Case ftOwner, "Owner"
              If i <> 1 Then
			   oPivotTable.PivotFields(strColName2).Orientation = xlPageField
			  End If
            Case ftUser, "User"
              If i <> 1 Then
			    oPivotTable.PivotFields(strColName2).Orientation = xlPageField
			  End If
            Case Else
            '
          end select

      end if
      iPos = iPos + 1
    next

   if (nDataFields) > 1 then
    oPivotTable.PivotFields("Data").Orientation = xlColumnField
    oPivotTable.DataLabelRange.Font.Bold = True
   end if


  end if
 'Show the excel spread sheet
 '***********************************************************************************************
  if blShowAfter = True then
   oSHLayout.Visible = False
   oExcel.Visible = True
  else
     oWB.Save
     oWB.Close
     oExcel.Quit
     Set oExcel = Nothing
     Set oWB = Nothing
  end If

  'Set All objects to Null
  '***********************************************************************************************
  Set oRowField = Nothing
  set oColField = nothing
  Set oPivotTable = Nothing
  set oCellStart = Nothing
  Set oCellEnd = Nothing
  Set oRange = Nothing
  Set oSHLayout = Nothing
  Set oSHGroup = Nothing
  Set oSHPivot = Nothing
	'top.donotrefresh = false

End Sub

private function InnerExportGroup(strGroupID, strFileName)
	Dim I
	'excel constants
	xlWBATWorksheet = -4167
	xlTemplate = 17

	data = getFromServer(mUrl + "/SLXGroupManager.aspx?action=GetGroupDatasetAsXML&gid=" + strGroupID)
	group = getFromServer(mUrl + "/SLXGroupManager.aspx?action=GetGroupXML&groupid=" + strGroupID)
	set xmldata = CreateObject("Msxml.DomDocument")
	xmldata.async = false
	xmldata.loadXML(data)
	set xmlgroup = CreateObject("Msxml.DomDocument")
	xmlgroup.async = false
	xmlgroup.loadXML(group)
	set XLApp = CreateObject("Excel.Application")
    XLApp.Visible = false
    XLApp.ScreenUpdating = false
    set xlWorkBook = XLApp.Workbooks.Add(xlWBATWorksheet)
    ' Set the sheet name to group name or localized SalesLogix Export
    ' First Sheet becomes last sheet
    set xlSHLayout = xlWorkBook.ActiveSheet
    set xlSheet = xlWorkBook.WorkSheets.Add
    xlSheet.Name = xmlgroup.documentElement.selectSingleNode("plugindata").getAttribute("name")
    xlSHLayout.name = "Layout"
    xlSheet.Activate

    ' Write header columns
    xlSHLayout.Cells(3,2) = "ColName:"
    xlSHLayout.Cells(3,3) = "ColType:"
	iColumns = 0
	set vNodes = xmlgroup.SelectSingleNode("SLXGroup/layouts").childNodes
	for iColumns = 1 to vNodes.length
		set layout = vNodes.nextNode()
		if layout.selectSingleNode("caption").text = "" then
			if layout.selectSingleNode("width").text <> "0" then
				xlSheet.Cells(1, iColumns) = "unknown -" & iColumns
      	xlSHLayout.Cells(iColumns+3,2) = "unknown -" & iColumns
      end if
    else
			xlSheet.Cells(1, iColumns) = layout.selectSingleNode("caption").text
      xlSHLayout.Cells(iColumns+3,2) = layout.selectSingleNode("caption").text
    end if
    xlSHLayout.Cells(iColumns+3,3) = layout.selectSingleNode("format").text 
    xlSHLayout.Cells(iColumns+3,4) = layout.selectSingleNode("formatstring").text
  next

	'build matrix - faster than putting the data directly in the worksheet
	On Error Resume Next 'otherwise errors when a value is missing in the xml
	numrecs = xmldata.selectSingleNode("NewDataSet").childNodes.length
	numcols = xmlgroup.selectSingleNode("SLXGroup/layouts").getAttribute("count")
	irec = 0
	icol = 0
	redim matrix(numrecs-1, numcols-1)
	for each rec in xmldata.selectSingleNode("NewDataSet").childNodes
		icol = 0
		for each layout in xmlgroup.selectSingleNode("SLXGroup/layouts").childNodes
			if layout.selectSingleNode("width").text <> "0" then
				alias = layout.selectSingleNode("alias").text
				select case layout.selectSingleNode("format").text
					case "Phone"
						matrix(irec, icol) = rec.selectSingleNode(alias).text
					case "User"
						alias = alias & "NAME"
						matrix(irec, icol) = rec.selectSingleNode(alias).text
					case "Owner"
						alias = alias & "NAME"
						matrix(irec, icol) = rec.selectSingleNode(alias).text
					case "DateTime"
						matrix(irec, icol) = Replace(Left(rec.selectSingleNode(alias).text, 16), "T", " ")  'Strip off extra, so we only have date/time
					case else
						matrix(irec, icol) = rec.selectSingleNode(alias).text
				end select
				icol = icol + 1
			end if
		next
		irec = irec + 1
	next
	on error goto 0 ' turns off error handling

	'copy matrix to worksheet
    for I = 0 to icol-1
        vColFormat = xlSHLayout.Cells(4+(I-1),3).Value
        if (vColFormat = "0") Or (vColFormat = "3") then
			xlSheet.Range(xlSheet.Cells(2,I),xlSheet.Cells(iRow,I)).NumberFormat = "@"
        end if
    next
    xlSheet.Range("A2", GetColumnCharacters(icol) & (numrecs+1)).Value = matrix
    xlSheet.Range("A1").Select
    xlSheet.Cells.Select
    xlSheet.Cells.EntireColumn.Autofit
    xlSheet.Range("A1").Select
    XLApp.ScreenUpdating = true
    if (strFileName = "") then
			XLApp.Visible = True
		else
			xlApp.DisplayAlerts = False
			xlSHLayout.Cells(1,1) = 2 'Starting Row
			xlShLayout.Cells(1,2) = (numrecs+1) ' Ending Row, num rows plus the header
			xlshLayout.Cells(1,3) = 1 ' Starting Column
			xlShLayout.Cells(1,4) = icol 'Number of Columns
			xlShLayout.Cells(1,5) = xlSheet.Name 'GroupName
			'xlShLayout.Cells(1,6] = RemoveSpaces(StripNonAN(stSheetName)) 'GroupName No Spaces
			xlWorkbook.SaveAs strFileName ', xlTemplate
			xlApp.Quit
			xlApp.DisplayAlerts = True
    end if
    set XLApp = nothing
    set xmlgroup = nothing
    set xmldata = nothing
end function


Public Function fmtLocalLongDate(iyear, imon, idate)
	Dim loc
	Dim dDateObj
	Dim original
	Dim strClDate

	loc = GetLocale
	'dDateObj = Now
	dDateObj = DateSerial(iyear, imon, idate)

	original = SetLocale(loc)
	strClDate = FormatDateTime(dDateObj, 1)
	SetLocale(original)
	fmtLocalLongDate = strClDate
End Function

End Class

function makeGobiMailMergeVb ' need this to instantiate from javascript
	set makeGobiMailMergeVb = new GobiMailMergeVb
end function

'<script id="MailMergeVBScript" language="VBScript">

Const ggresNone = 0
Const gresOk = 1
Const gresCancel = 2
Const gresAbort = 3
Const gresRetry = 4
Const gresIgnore = 5
Const gresYes = 6
Const gresNo = 7
Const gtransHTTP = 0
Const gtransNative = 1
Const gemailOutlook = 2
Const gastPrimary = 0
Const gastShip = 1
Const gastOther = 2

Dim gType, gRegarding, gNotes, gLeader, gHistoryID

	dim sRptPath
	sRptPath = REPORTPATH

'___________________________________________________________________Address Labels Event Handlers (VB)______________________________
' Events:
'		JS: OnCancel
'		JS: OnHelp
'		JS: OnPrint
'		VB: OnRequestCrystalReport(ReportID, WhereSQL: WideString; LeftMargin, TopMargin: Integer; var Report: OleVariant; out Error, Success: OleVariant)
'		VB: OnRequestGroupInfo(UserID, GroupID: WideString; out ContactIDs, Count, Error, Success: OleVariant)
'		VB: OnRequestGroups(UserID: WideString; out Groups, Error, Success: OleVariant)


Sub AddressLabels_OnRequestCrystalReport(ReportID, SQL, LeftMargin, TopMargin, SortFields, Report, Error, Success)
	Dim vError, vSuccess
	vSuccess = GMvb.RequestReport(ReportID, SQL, SortFields, Report, vError)
	Success = vSuccess
	Error = vError
	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description & "  --  " & vError
		Err.Clear
	End If
End Sub


Sub AddressLabels_OnRequestGroupInfo(UserID, GroupID, ContactIDs, Count, Error, Success)
	Success = GMvb.OnRequestGroupInfo((UserID), CStr(GroupID), ContactIDs, Count, Error)
	If Err.Number > 0 Then
		MsgBox lclERROR & Err.Description
		Err.Clear
	End If
End Sub


Sub AddressLabels_OnRequestGroupInfoEx(GroupID, UseTableAlias, SelectSQL, FromSQL, WhereSQL, OrderBySQL, InClause, Family, AdHoc, Epty, Parameters, Error, Success)
	Dim Conditions, Layouts, Sorts
	Success = True
	GMvb.GetGroupInfoEx GroupID, UseTableAlias, SelectSQL, FromSQL, WhereSQL, OrderBySQL, Conditions, Layouts, Sorts, InClause, Family, AdHoc, Epty, Parameters, Error, Success

	If Err.Number > 0 Then
		Error = Err.Description
		Success = False
	End If
End Sub


Sub AddressLabels_OnRequestGroups(UserID, Groups, Error, Success)
	Success = GMvb.OnRequestGroups(CStr(UserID), Groups, Error)

	If Err.Number > 0 Then
		MsgBox lclERROR & Err.Description
		Err.Clear
	End If
End Sub


Sub AddressLabels_OnPrint(ReportID, WhereSQL, SortFields, Report, Error, Success)
	Success = True
	Error = ""
End Sub


'___________________________________________________________________Mail Merge Object Event Handlers (VB)___________________________
' Events:
'		JS: OnCancel
'		JS: OnHelp
'		VB: OnMerge(var SLXDocument: OleVariant)
'		VB: OnRequestAddressBook(UserID: WideString; OwnerWnd: Integer; Field: RecipientField; var Recipients: OleVariant; out Error, Success: OleVariant)
'		VB: OnRequestCrystalReport(ReportID, WhereSQL: WideString; LeftMargin, TopMargin: Integer; var Report: OleVariant; out Error, Success: OleVariant)
'		VB: OnRequestGroupInfo(UserID, GroupID: WideString; out ContactIDs, Count, Error, Success: OleVariant)
'		VB: OnRequestGroups(UserID: WideString; out Groups, Error, Success: OleVariant)
'		VB: OnRequestLeaders(UserID: WideString; out Leaders, Error, Success: OleVariant)
'		VB: OnRequestAlarmLeadInfo(UserID: WideString; ActivityType: ActivityType; out Lead, Duration, Error, Success: OleVariant)
'		VB: MailMerge_OnPreview(FileName)

Sub MailMerge_OnRequestRebuildSchema(Error, Success)
	Success = GMvb.RebuildXMLSchema(Error)
End Sub

Sub MailMerge_OnMerge(SLXDocument)
  Dim vMME

  Set vMME = CreateObject("SLXMMEngineW.MailMergeEngine")
  EventHook.Connect vMME, "MailMergeEngine_"

	vMME.AttachmentPath = ATTACHPATH
	vMME.ConnectionString = CONNSTRING
	vMME.EmailSystem = gemailOutlook
	vMME.LibraryPath = LIBRARYPATH
	vMME.MergeSilently = false
	vMME.BaseKeyCode = ""
	vMME.Remote = false
	vMME.SiteCode = SITECODE
	vMME.TransportType = gtransHTTP
	vMME.UserID = USERID

	vMME.BaseCurrencySymbol = BASECURRENCY
	vMME.MultiCurrency = (MULTICURRENCY = "T")

	vMME.Merge(SLXDocument)

	EventHook.Disconnect vMME
	Set vMME = nothing


	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.description
		Err.Clear
	End If
End Sub


Sub MailMerge_OnRequestCrystalReport(ReportID, WhereSQL, LeftMargin, TopMargin, SortFields, Report, Error, Success)
	Dim vError, vSuccess
	vSuccess = GMvb.RequestReport(ReportID, WhereSQL, SortFields, Report, vError)

	Success = vSuccess
	Error = vError
	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Err.Clear
	End If
End Sub


Sub MailMerge_OnRequestGroupInfo(UserID, GroupID, ContactIDs, Count, Error, Success)
	Success = GMvb.OnRequestGroupInfo((UserID), CStr(GroupID), ContactIDs, Count, Error)

	If Err.Number > 0 Then
		MsgBox lclERROR & Err.Description
		Err.Clear
	End If
End Sub


Sub MailMerge_OnRequestGroupInfoEx(GroupID, UseTableAlias, SelectSQL, FromSQL, WhereSQL, OrderBySQL, InClause, Family, AdHoc, Epty, Parameters, Error, Success)
	Dim Conditions, Layouts, Sorts
	Success = True
	'                 GroupID, UseTableAliases, SelectSQL, FromSQL, WhereSQL, OrderBySQL,                             InClause, Family, AdHoc, Empty, Parameters, Error, Success
	GMvb.GetGroupInfoEx GroupID, UseTableAlias, SelectSQL, FromSQL, WhereSQL, OrderBySQL, Conditions, Layouts, Sorts, InClause, Family, AdHoc, Epty, Parameters, Error, Success
	If Err.Number > 0 Then
		Error = Err.Description
		Success = False
	End If
End Sub


Sub MailMerge_OnRequestGroups(UserID, Groups, Error, Success)
	Success = GMvb.OnRequestGroups(CStr(UserID), Groups, CStr(Error))

	If Err.Number > 0 Then
		MsgBox lclERROR & Err.Description
		Err.Clear
	End If
End Sub


Sub MailMerge_OnRequestLeaders(UserID, Leaders, Error, Success)
	Success = GMvb.OnRequestUsers(UserID, Leaders, Error)

	If Err.Number > 0 Then
		MsgBox lclERROR & Err.Description
		Err.Clear
	End If
End Sub


Sub MailMerge_OnRequestAlarmLeadInfo(UserID, ActivityType, Alarm, Lead, Duration, Error, Success)
	Dim vLead, vDur, alarmenable
	vLead = 0
	vDur = 0
	vDur = getPref("alarmlead")
  vLead = getPref("alarmleadperiod")
	If vLead <> "" then
		Lead = vLead - 1
	Else
		Lead = 0
	End If
	If vDur <> "" then
		Duration = vDur
	Else
		Duration = 15
	End If
	Error = ""
	Success = True

	alarmenable = getPref("alarmenable")
	If alarmenable = "" Then
		alarmenable = "T"
	End If

	If alarmenable = "T" Then
		Alarm = True
	Else
		Alarm = False
	End If

	If Err.Number > 0 Then
		Error = Error & Err.Description
		Success = False
		Err.Clear
	End If

End Sub


Sub MailMerge_OnMergePreview(TempFileName, ContactID, MergedFileName)
	Dim vMME
  Set vMME = CreateObject("SLXMMEngineW.MailMergeEngine")
  EventHook.Connect vMME, "MailMergeEngine_"

	vMME.AttachmentPath = ATTACHPATH
	vMME.ConnectionString = CONNSTRING
	vMME.LibraryPath = LIBRARYPATH
	vMME.BaseKeyCode = ""
	vMME.Remote = false
	vMME.SiteCode = SITECODE
	vMME.TransportType = gtransHTTP
	vMME.UserID = USERID
	vMME.BaseCurrencySymbol = BASECURRENCY
	vMME.MultiCurrency = (MULTICURRENCY = "T")
	vMME.MergePreview TempFileName, ContactID, MergedFileName

	EventHook.Disconnect vMME
	Set vMME = nothing

	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Err.Clear
	End If
End Sub


'___________________________________________________________________Template Editor Event Handlers (VB)_____________________________

Sub TemplateEditor_OnRequestRebuildSchema(Error, Success)
	Success = GMvb.RebuildXMLSchema(Error)
End Sub

Sub TemplateEditor_OnRequestLeaders(UserID, Leaders, Error, Success)
	Success = GMvb.OnRequestUsers(UserID, Leaders, Error)

	If Err.Number > 0 Then
		MsgBox lclERROR & Err.Description
		Err.Clear
	End If
End Sub


Sub TemplateEditor_OnRequestOwners(UserID, Owners, Error, Success)
	Success = GMvb.OnRequestUsers(UserID, Owners, Error)

	If Err.Number > 0 Then
		MsgBox lclERROR & Err.Description
		Err.Clear
	End If

End Sub


Sub TemplateEditor_OnShowPreview(TempFileName, EntityID, MergedFileName, bShow)
	Dim vMME, vGroupID
  Set vMME = CreateObject("SLXMMEngineW.MailMergeEngine")
  EventHook.Connect vMME, "MailMergeEngine_"

	vMME.AttachmentPath = ATTACHPATH
	vMME.ConnectionString = CONNSTRING
	vMME.LibraryPath = LIBRARYPATH
	vMME.BaseKeyCode = ""
	vMME.Remote = false
	vMME.SiteCode = SITECODE
	vMME.TransportType = gtransHTTP
	vMME.UserID = USERID
	vMME.BaseCurrencySymbol = BASECURRENCY
	vMME.MultiCurrency = (MULTICURRENCY = "T")

	vMME.MergePreview TempFileName, EntityID, MergedFileName

	If bShow Then
		TemplateEditor.DisplayPreview MergedFileName
	End If

	EventHook.Disconnect vMME
	Set vMME = nothing

	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Err.Clear
	End If
End Sub

Function WriteMenu(UserID, Caption, PluginID, Menu)
'this function adds the selected PluginID to the Write xxx Using> list....
	Dim vError
	Dim strEntity
	If GM.CurrentEntityIsLead Then
	    strEntity = "Lead"
	Else
	    strEntity = "Contact"
	End If
	If MailMergeGUI.WriteMRU(SITECODE, UserID, Caption, strEntity, PluginID, Menu, vError) Then
		WriteMenu = ""
		Exit Function
	Else
		WriteMenu = vError
		Exit Function
	End If
	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Err.Clear
	End If
End Function


'___________________________________________________________________MailMergeEngine Events (VB)_____________________________________

'Sub MailMergeEngine_OnOutputDebug(msg)
'	msgbox msg
'End Sub

Sub MailMergeEngine_OnRequestCompleteFax(vType, EntityID, HistoryID, OpportunityID, Regarding, Notes, Leader, Error, Success, MainTable, TicketID)
	Dim ref

	gType = vType
	gRegarding = Regarding
	gNotes = Notes
	gLeader = Leader
	gHistoryID = HistoryID

	ref = "EmailPromptForHistory.aspx?historyid=" & HistoryID & "&entityid=" & EntityID & "&ticketid=" & TicketID & "&oppid=" & OpportunityID & "&mmtype=fax&maintable=" & MainTable
	Regarding = OpenDialog(ref)
	Success = true

	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Error = Err.Description
		Err.Clear
	End If

	gType = ""
	gRegarding = ""
	gNotes = ""
	gLeader = ""
	gHistoryID = ""
End Sub


Sub MailMergeEngine_OnRequestCompleteLetter(vType, EntityID, HistoryID, OpportunityID, Regarding, Notes, Leader, Error, Success, MainTable, TicketID)
	Dim ref
	gType = vType
	gRegarding = Regarding
	gNotes = Notes
	gLeader = Leader
	gHistoryID = HistoryID
	ref = "EmailPromptForHistory.aspx?historyid=" & HistoryID & "&entityid=" & EntityID & "&ticketid=" & TicketID & "&oppid=" & OpportunityID & "&mmtype=letter&maintable=" & MainTable
	Regarding = OpenDialog(ref)
	Success = true

	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Error = Err.Description
		Err.Clear
	End If

	gType = ""
	gRegarding = ""
	gNotes = ""
	gLeader = ""
	gHistoryID = ""
End Sub

Function OpenDialog(ref)
	OpenDialog = window.showModalDialog(ref, window, "status:no;resizable:yes;dialogheight:580px;dialogwidth:740px;edge:sunken;help:no")
End function


Sub MailMergeEngine_OnRequestCreateAdHocGroup(Contacts, GroupName, GroupID, Error, Success, vMainTable, vLayoutID)
	Error = ""
	dim url
	url = ASPCOMPLETEPATH & "/SLXGroupManager.aspx?action=CreateAdHocGroup&family=" & UrlEncode(cstr(vMainTable)) & "&name=" & UrlEncode(cstr(GroupName)) & "&ids=" & cstr(Contacts)
	GroupID = getFromServer(url) 'GM.CreateAdHocGroup(Contacts, GroupName, 0, vLayoutID)
	Success = (GroupID <> "")
	If not Success Then
		Error = "There was an error creating the Group " + GroupName
	End If
	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Err.Clear
	End If
End Sub


Sub MailMergeEngine_OnRequestCrystalReport(ReportID, WhereSQL, LeftMargin, TopMargin, SortFields, Viewer, Error, Success)
	Dim vError, vSuccess
	vSuccess = GMvb.RequestReport(ReportID, WhereSQL, SortFields, Viewer, vError)
	Success = vSuccess
	Error = vError
	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Err.Clear
	End If
End Sub


Sub MailMergeEngine_OnRequestData(UserID, MainTable, AddressField, Criteria, OpportunityDataPath, OpportunityValue, Sorts, Layouts, Data, Error, Success)
  Dim vError, vSuccess
  if not IsObject(GMvb)then
    set GMvb = makeGobiMailMergeVb
  end if
  vSuccess = GMvb.GetSLQueryData(UserID, MainTable, AddressField, Criteria, Sorts, Layouts, Data, vError)
  Success = vSuccess
  Error = vError
End Sub


Sub MailMergeEngine_OnRequestEditAfter(EditInfos, Mode, OutputTo, Canceled, Error, Success, MainTable)
	Dim vEditMergedDocs
	Error = ""
	Success = False
	Canceled = False
	Set vEditMergedDocs = CreateObject("SLXMMGUIW.EditMergedDocs")
	vEditMergedDocs.CreateWindow
	vEditMergedDocs.TransportType    = 0
	vEditMergedDocs.ConnectionString = CONNSTRING
	vEditMergedDocs.AttachmentPath   = ATTACHPATH
	vEditMergedDocs.LibraryPath      = LIBRARYPATH
	vEditMergedDocs.UserID = USERID
	vEditMergedDocs.UserName = USERNAME
	vEditMergedDocs.BaseKeyCode = ""
	vEditMergedDocs.Remote = False
	vEditMergedDocs.SiteCode = SITECODE
	vEditMergedDocs.EditInfos = EditInfos
	vEditMergedDocs.OutputType = Mode
	vEditMergedDocs.OutputTo = OutputTo
	If vEditMergedDocs.ShowModal = gresCancel Then
		Canceled = True
	Else
		'EditInfos = vEditMergedDocs.EditInfos
	End If
	' Michael Cessna - 10/14/2003 - Defect #1-28172. Pass back the Err.Description.
	If Err.Number > 0 Then
		Error = Err.Description
		Err.Clear
		Success = False
	Else
		Success = True
	End If

	Set vEditMergedDocs = nothing
End Sub


Sub MailMergeEngine_OnRequestFormat(vType, FormatString, Value, Result, Error, Success)
	Dim vError, vSuccess, vResult
	vResult = GMvb.FormatValue(vType, FormatString, Value, vError, vSuccess)
	Result = vResult
	Error = vError
	Success = vSuccess
	If Err.Number > 0 Then
		MailMergeGUI.ShowError "Error", Err.Description
		Err.Clear
	End If
End Sub


Sub MailMergeEngine_OnRequestEditDocument(EInfo, Mode, vType, Error, Success, MainTable)
	Dim vError
	vError = ""
	Success = false
	TemplateEditor.CreateWindow

	TemplateEditor.TransportType    = 0
	TemplateEditor.ConnectionString = CONNSTRING
	TemplateEditor.AttachmentPath   = ATTACHPATH
	TemplateEditor.LibraryPath      = LIBRARYPATH
	TemplateEditor.UserID = USERID
	TemplateEditor.UserName = USERNAME
	TemplateEditor.BaseKeyCode = ""
	TemplateEditor.Remote = False
	TemplateEditor.SiteCode = SITECODE

	TemplateEditor.EditDocumentByEditInfo EInfo, CInt(vType), CInt(Mode), vError
	TemplateEditor.DestroyWindow

	if vError <> "" Then
		Success = False
		Error = vError
	else
		Success = True
	end if

	If Err.Number > 0 Then
		Error = Error & Err.Description
		Err.Clear
	End If
End Sub


Sub MailMergeEngine_OnRequestFaxOptions(ToName, ToNumber, Subject, CoverPage, Message, UseOptions, BillingCode, ClientID, DeliveryType, DeliveryDateTime, Keywords, Priority, SendSecure, SendBy, Canceled, FaxProvider, JobOptions, Error, Success, MainTable)
	Dim tFax, x
	set tFax = CreateObject("SLXMMGUIW.fFaxOptions")

	tFax.CreateWindow
	Success = False
	tFax.To_ = ToName
	tFax.Subject = Subject
	tFax.UserID = USERID
	tFax.Number = ToNumber
	tFax.CoverPage = CoverPage
	tFax.FaxProvider = FaxProvider
	x = tFax.ShowModal
	If x = gresOk Then
		Subject = tFax.Subject
		CoverPage = tFax.CoverPage
		Message = tFax.MessageText
		BillingCode = tFax.BillingCode
		DeliveryDateTime = tFax.DeliveryDate + tFax.DeliveryTime
		Keywords = tFax.Keywords
		DeliveryType = tFax.Delivery
		Priority = tFax.Priority
		ClientID = tFax.ClientID
		SendSecure = tFax.SendSecure
		SendBy = tFax.SendBy
		Success = True
		JobOptions = tFax.FaxJobOptions
	Elseif x = gresCancel Then
		Canceled = True
		Success = True
	End If

	tFax.DestroyWindow
	set tFax = nothing
	If Err.Number > 0 Then
		Error = Err.Description
		Err.Clear
		Success = False
	End If
End Sub


Sub MailMergeEngine_OnRequestGroupInfo(GroupID, ContactIDs, Count, Error, Success)
	Dim vUserID
	vUserID = USERID
	Success = GMvb.OnRequestGroupInfo(vUserID, CStr(GroupID), ContactIDs, Count, Error)

	If Err.Number > 0 Then
		MsgBox lclERROR & Err.Description
		Err.Clear
	End If
End Sub


Sub MailMergeEngine_OnRequestGroupInfoEx(GroupID, UseTableAlias, SelectSQL, FromSQL, WhereSQL, OrderBySQL, Conditions, Layouts, Sorts, InClause, Family, AdHoc, Epty, Parameters, Error, Success)
	Success = True
	GMvb.GetGroupInfoEx GroupID, UseTableAlias, SelectSQL, FromSQL, WhereSQL, OrderBySQL, Conditions, Layouts, Sorts, InClause, Family, AdHoc, Epty, Parameters, Error, Success

	If Err.Number > 0 Then
		Error = Err.Description
		Success = False
	End If
End Sub


Sub MailMergeEngine_OnRequestPrintAddressLabels(Canceled, Error, Success)
	Success = False
	AddressLabels.CreateWindow()
	AddressLabels.TransportType = gtransHTTP
	AddressLabels.ConnectionString = CONNSTRING
	AddressLabels.UserID = USERID
	AddressLabels.ShowMergeWith = False
	
	If (GM.CurrentEntityIsContact Or GM.CurrentEntityIsLead) Then
	    AddressLabels.CurrentEntityID = GM.CurrentEntityID
	    AddressLabels.CurrentEntityName = GM.CurrentEntityDescription
	    AddressLabels.CurrentEntityType = GM.CurrentEntityDisplayName
	End If

    If GM.CurrentGroupCanBeMergedTo Then
	    AddressLabels.CurrentGroupID = GM.CurrentGroupID
	    AddressLabels.CurrentGroupType = GM.CurrentGroupTableName
	    If GM.CurrentGroupName <> Empty Then
		    AddressLabels.CurrentGroupName = "No group"
	    Else
		    AddressLabels.CurrentGroupName = GM.CurrentGroupName
	    End If
	End If

	If AddressLabels.ShowModal() = gresCancel Then
		Canceled = True
	Else
		Canceled = False
	End If
	Success = True

	AddressLabels.DestroyWindow()

	If Err.Number > 0 Then
		Success = False
		Error = Err.description
		Err.Clear
	End If
End Sub


Sub MailMergeEngine_OnRequestSelectAddressType(AddressType, OtherAddressID, OtherAddressText, Canceled, Error, Success)
	Dim vSelectAddressDialog, x
	Success = False
	Set vSelectAddressDialog = CreateObject("SLXMMGUIW.SelectAddressType")
	vSelectAddressDialog.CreateWindow()
	vSelectAddressDialog.TransportType = gtransHTTP
	vSelectAddressDialog.ConnectionString = CONNSTRING
	vSelectAddressDialog.UserID = USERID
	Canceled = False
	x = vSelectAddressDialog.ShowModal()
	If x = gresOk Then
		AddressType = vSelectAddressDialog.SelectedAddressType
		OtherAddressID = vSelectAddressDialog.OtherAddressID
		OtherAddressText = vSelectAddressDialog.OtherAddressText
	Elseif x = gresCancel Then
		Canceled = True
	End If
	Success = True
	vSelectAddressDialog.DestroyWindow()
	Set vSelectAddressDialog = Nothing
	If Err.Number > 0 Then
		Success = False
		Error = Err.Description
		Err.Clear
	End If
End Sub


Sub MailMergeEngine_OnRequestViewGroup(GroupID, Error, Success)
	Error = ""
	Success = True
    location = SWCPATH + "/contact.aspx"
  If Err.Number > 0 Then
  	Success = False
  	Error = Err.Description
  	Err.Clear
  End If
End Sub


Sub MailMergeEngine_OnShowProgress(Message1, Message2, Message3, ProgressHandlerWnd, ProgressMax, ProgressPosition, ProgressTotalPosition, EnableCancel, ShowProgress)
	'donotrefresh = true
	ProgressDlg.OwnerWnd = ProgressHandlerWnd
	ProgressDlg.Message1 = Message1
	ProgressDlg.Message2 = Message2
	ProgressDlg.Message3 = Message3
	ProgressDlg.ProgressHandlerWnd = ProgressHandlerWnd
	ProgressDlg.ProgressMax = ProgressMax
	ProgressDlg.ProgressPosition = ProgressPosition
	ProgressDlg.ProgressTotalPosition = ProgressTotalPosition
	ProgressDlg.EnableCancel = EnableCancel
	ProgressDlg.ShowProgress = ShowProgress
	ProgressDlg.Show
End Sub


Sub MailMergeEngine_OnHideProgress()
	ProgressDlg.Hide
End Sub

Sub MailMergeEngine_OnSelectPrinter(Caption, Printer, Canceled, Error, Success)
'	Dim oSelectPrinter
'	Printer = ""
	Error = ""
'	Success = False
'	Set oSelectPrinter = CreateObject("SLXMMGUIW.SelectPrinter")
'	oSelectPrinter.CreateWindow(0)
'	oSelectPrinter.Caption = Caption
'	If oSelectPrinter.ShowModal() = gresOk Then
'		Printer = oSelectPrinter.SelectedPrinter
		Success = True
		Canceled = False
'	Else
'		Canceled = True
'		Success = True
'	End If
'	oSelectPrinter.DestroyWindow()
'	Set oSelectPrinter = Nothing
	If Err.Number > 0 Then
		Success = False
		Error = Err.Description
		Err.Clear
	End If
End Sub

Sub MailMergeEngine_OnRequestScheduleFollowUp(FollowUpType, AccountID, AccountName, ContactID, ContactName, OpportunityID, OpportunityName, Error, Success, MainTable, TicketID)
	Dim strPath
	Dim strTheIDs
	Dim strPage
	Dim x

	Error = ""
	Success = False

	strPath = SWCPATH & "/view?name=addactivity&acttype=';"
  strTheIDs = "&conid=" & ContactID & "&accid=" & AccountID & "&oppid=" & OpportunityID & "&tickid=" & TicketID
	strPage = ""
	Select Case FollowUpType
        Case 1 'Meeting
	       strPage = "meet"
	    Case 2 'Phone Call
		   strPage = "call"
		Case 3 'To-Do
		   strPage = "todo"
		Case Else
	       strPage = ""
	End Select
	If strPage <> "" Then
	    strURL = strPath & strPage & strTheIDs
		x = showModalDialog(strURL,window,"status:no;resizable:yes;dialogheight:660px;dialogwidth:750px;edge:raised;help:no")
  	    Success = True
	End IF
	If Err.Number > 0 Then
		Success = False
		Error = Err.Description
		Err.Clear
	End If

End Sub

Sub MailMergeEngine_OnCustomFieldName(FieldName, Range, AccountID, AddressID, ContactID, OpportunityID, PluginID, UserID, Preview, Error, Success, MainTable, EntityID, MailMergeID, OneOffTicketID)
'*******************************************************************************
'                         This is an example only
'*******************************************************************************
'   FieldName     - The custom merge field name inserted using the Template
'                   Editor.
'   Range         - The Microsoft Word Range object. This is the object you work
'                   with to insert content into the Word document. This content
'                   will replace the custom merge field.
'   AccountID     - The AccountID for the Contact.
'   AddressID     - The AddressID for the Contact.
'   ContactID     - The ContactID for the Contact.
'   OpportunityID - The OpportunityID associated with the Contact (if any).
'   PluginID      - The PluginID of the Word Template being used.
'   UserID        - The UserID of the Mail Merge user (may or may not be the
'                   logged in user).
'   Preview       - This is True if the merge is for the Preivew used by both
'                   the Template Editor and the Select a Template or Manage
'                   Templates dialogs. When Preview is True the PluginID
'                   parameter is unavailable.
'   Error         - This is the Error message that you pass back if there was an
'                   error.
'   Success       - If there was an error set this to False.
'*******************************************************************************

	Const gwdTableFormat3DEffects1 = 32
	Const gwdAutoFitContent        = 1
	Const gwdAutoFitWindow         = 2
	Const gwdWord8TableBehavior    = 0
	Const gwdWord9TableBehavior    = 1
	Dim oTable
	Dim strResultError
	Success = False
	Error	= ""
	Select Case FieldName
		' This is an example only
		Case "CustomFieldName_Example_A"
			Range.InsertAfter "Last Name|First Name"
			Range.InsertParagraphAfter
			Range.InsertAfter "Abbott|John"
			Range.InsertParagraphAfter
			Range.InsertAfter "Balbo|Lou"
			Range.InsertParagraphAfter
			Range.InsertAfter "Drew|Dean"
			Range.InsertParagraphAfter
			Range.InsertAfter "Velazquez|Mike"
			Range.InsertParagraphAfter
			Range.InsertAfter "Zessner|Louise"
			Range.InsertParagraphAfter
			Set oTable = Range.ConvertToTable("|", , , , gwdTableFormat3DEffects1, True, True, True, True, True, _
			  False, False, False, True, gwdAutoFitContent, gwdWord9TableBehavior)
			'oTable... ' Do something with the Table object
		' This is an example only
		Case "CustomFieldName_Example_B"
			Range.InsertParagraphAfter
			Range.InsertAfter("SalesLogix Mail Merge")
			Range.Bold = True
		' If the FieldName is not handled then pass back an error.
		Case Else
			strResultError = "The custom merge field could not be processed because it was not handled in the OnCustomFieldName event."
			Err.Number = 1000
			Err.Description = strResultError
			'oRange.Text = "FieldName=" & FieldName & "; AccountID=" & AccountID & "; AddressID=" & AddressID & "; ContactID=" & _
			'  ContactID & "; OpportunityID=" & OpportunityID & "; PluginID=" & PluginID & "; UserID=" & UserID & "; Preview=" & Preview
	End Select
	If Err.Number > 0 Then
		Success = False
		Error = Err.Description
		Err.Clear
	Else
		Success = True
		Error	= ""
	End If
End Sub


'___________________________________________________________________Function Library________________________________________________
'
' getPref(prefname)  pass a preference name to have the value returned............................................................
' getCookie(cookieName)  pass a cookie name to have the value returned............................................................
' getCookieParm(parmName, cookieName)  pass a cookie and parm to have the single value returned...................................
'.................................................................................................................................

Function getPref(prefname)
	GetPref = getCookieParm(prefname,"userprefs")
End Function


Function getCookie(cookieName)
	' gets a named cookie from the document.cookie(s)
	Dim cookiestring, cookies, search, i, retval
	cookiestring = unescape(document.cookie)
	cookies = split(cookiestring, "; ")
	search = cookieName & "="
	For i = 0 To Ubound(cookies)
		If InStr(cookies(i),search) > 0 Then
			retval = mid(cookies(i), InStr(cookies(i),"=") + 1)
		End If
	Next
	getCookie = retval
End Function


Function getCookieParm(parmName, cookieName)
	' searches for the value of an individual name/value pair stored
	' in the cookie, using parseCookie
	Dim cookiestring, crumbs, search, i, retval
	cookiestring = getCookie(cookieName)
	crumbs = split(cookiestring, "&")
	search = parmName & "="
	For i = 0 To Ubound(crumbs)
		If InStr(crumbs(i), search) > 0 Then
			retval = mid(crumbs(i), InStr(crumbs(i), "=") + 1)
		End If
	Next
	getCookieParm = retval
End Function



'<script id="FromSalesTopNavvb" language="vbscript">
Sub MergeFromPlugin(mode, PluginID)   
	Dim vMME
	Dim oppid, tickid
	Dim bool
	Dim exists
	Dim Error, Success
    Dim strEntityID

	top.MailMergeGUI.ConnectionString = CONNSTRING
	top.MailMergeGUI.TransportType = 0
	top.MailMergeGUI.UserID = gCurrentUserID
	exists = top.MailMergeGUI.MRUPluginExists(gSiteCode, gCurrentUserID, PluginID, mode, Error, Success)

	If exists = True Then
		Set vMME = CreateObject("SLXMMEngineW.MailMergeEngine")
	  top.EventHook.Connect vMME, "MailMergeEngine_"


		vMME.AttachmentPath = ATTACHPATH
		vMME.ConnectionString = CONNSTRING
		vMME.EmailSystem = 2   'gemailOutlook
		vMME.LibraryPath = LIBRARYPATH
		vMME.MergeSilently = false
		vMME.BaseKeyCode = ""
		vMME.Remote = false
		vMME.SiteCode = SITECODE
		vMME.TransportType = 0  'gtransHTTP
		vMME.UserID = USERID

		if top.reportingEnabled = false then
			vMME.AddressLabelsEnabled = false
		end if

		oppid = ""
		tickid = ""
		
		If GM.CurrentEntityIsTicket Then
		    tickid = GM.CurrentEntityID
		End If
		
		If GM.CurrentEntityIsOpportunity Then	
		    oppid = GM.CurrentEntityID
		End If
		
        If ((GM.CurrentEntityIsContact Or GM.CurrentEntityIsLead) And GM.IsDetailView) Then
            strEntityID = GM.CurrentEntityID
        Else
            strEntityID = GetMergeEntityID()
        End If

		If strEntityID <> "" Then
			bool = vMME.MergeFromPlugin(PluginID, mode, strEntityID, oppid, tickid)
		Else
			MsgBox lclFirstSelectAContact
		End If

		top.EventHook.Disconnect vMME
		set vMME = nothing
	else
	    msgbox lclCouldNotFindTemplate
	End If
	'top.donotrefresh = false
End Sub

'email notification
Sub SEN_OnRequestCompleteWebEmail(HistoryID, AttachmentInfos, MainTable)
	'donotrefresh = true
	Dim vError, vSuccess
	Dim x, ref, cmd, pref 
	
    If (AttachmentInfos.Count > 0) Then
		vError = ""
		MailMergeGUI.ConnectionString = CONNSTRING
		MailMergeGUI.TransportType = 0
		MailMergeGUI.UserID = USERID
		vSuccess = MailMergeGUI.ProcessEmailAttachments(AttachmentInfos, ATTACHPATH, "", vError)
		if (vError <> "") then
			msgbox lclErrorProcessingAttachments & vbcrlf & vError
		end if

	End If
	
	' the dialog that is called tries to send output calls (showHelp()) that cannot happen while the
	' ActiveX object is still running.  It waits for this event handler to stop running before it gets
	' cleaned up.  Using a setTimeOut call runs the dialog in a separate thread and allows the event
	' handler to finish and stop the input-synchronous call that blocks outgoing calls. (window.open)

	pref = GetUserPreference("DoNotPromptHistory", "Email")
	pref = UCase(pref)
	if ((pref = "F") or (pref = "0") or (pref = "N")) then
		ref = "EmailPromptForHistory.aspx?historyid=" & HistoryID & "&maintable=" & MainTable
		cmd = "OpenDialog(""" & ref & """)"
		window.setTimeOut cmd, 8000
	end if
End Sub

function GetUserPreference(strName, strCategory)
	GetUserPreference = getFromServer(ASPCOMPLETEPATH & "/SLXInfoBroker.aspx?info=" & "userpref&prefname=" & strName & "&prefcategory=" & strCategory)
end function
