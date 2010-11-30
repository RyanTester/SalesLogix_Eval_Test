
Const conDebugMode = 1 'Change this to 0 to turn On - On Error Resume Next
    Const conSetDate = 1  'Change this to 0 if want to set activites on WeekDays
    Const conMMType = 2  ' 2 = SalesProcess

    ' Mail Merge Engine Error Types
    Const errSuccess = -1 ' No error was reported by the mail merge engine.
    Const errAccessViolation = 0 ' An access violation occurred.
    Const errAttachmentPath = 1 ' The attachment path was not defined.
    Const errConnectionString = 2 ' The ConnectionString property was not set.
    Const errEmailSystem = 3 ' The EmailSystem property was not set.
    Const errException = 4 ' An internal exception occurred (generic).
    Const errHTTP = 5 ' A HTTP related error occurred (Web only).
    Const errInternal = 6 ' An internal error occurred.
    Const errInvalidEmail = 7 ' The e-mail address was invalid.
    Const errInvalidFax = 8 ' The fax number was invalid.
    Const errLibraryPath = 9 ' The library path was not defined.
    Const errMissingEmail = 10 ' The e-mail address was missing.
    Const errMissingFax = 11 ' The fax number was missing.
    Const errDefaultPrinter = 12 ' Not used.
    Const errOther = 13 ' A known but undefined error occurred.
    Const errOutlook = 14 ' A Microsoft Outlook related error occurred.
    Const errQueryEmpty = 15 ' A query returned an unexpected empty result set.
    Const errRemote = 16 ' The BaseKeyCode property was set and the Remote property was not.
    Const errSiteCode = 17 ' The SiteCode property was not set.
    Const errSLXDocument = 18 ' The SalesLogix Document Description (*.sdd) could not be opened, created, or was invalid.
    Const errTemplateID = 19 ' The requested TemplateID (type 25 template) was not found in the PLUGIN table.
    Const errTransportType = 20 ' The TrnasportType property was not set.
    Const errUnknown = 21 ' An unknown error occurred.
    Const errUserID = 22 ' The UserID property was not set.
    Const errWinFax = 23 ' A WinFax related error occurred.
    Const errWord = 24 ' A Microsoft Word related error occurred.
    Const errAbort = 25 ' The merge was canceled by the user.
    Const errMergeSilently = 26 ' There was a conflicting property when MergeSilently was set to True.

    ' AttachmentType
    Const atRegularAttachment = 0 ' Default. An attachment stored in the PLUGINATTACHMENT table.
    Const atLibraryAttachment = 1 ' A Sales Library file, referenced in the PLUGINATTACHMENT table.
    Const atTempAttachment = 2 ' A "temporary" attachment "not" stored in the PLUGINATTACHMENT table (e.g. a local file).

    ' EmailFormat
    Const formatHTML = 0 ' Default
    Const formatPlainText = 1

    ' EmailSystem
    Const emailNone = 0
    Const emailExchange = 1 ' Not used
    Const emailOutlook = 2 ' Default
    Const emailSalesLogix = 3

    ' FaxDelivery
    Const fdASAP = 0 ' Default
    Const fdDateTime = 1
    Const fdOffPeak = 2
    Const fdHold = 3

    ' FaxPriority
    Const fpHigh = 0
    Const fpNormal = 1 ' Default
    Const fpLow = 2

    ' FollowUp
    Const fuNone = 0 ' Default
    Const fuMeeting = 1
    Const fuPhoneCall = 2
    Const fuToDo = 3

    ' GroupFamily
    Const famContact = 0 ' Default
    Const famAccount = 1
    Const famOpportunity = 2

    ' MergeWith
    Const withCurrentContact = 0
    Const withCurrentGroup = 1
    Const withSpecificGroup = 2
    Const withAccount = 3
    Const withOpportunity = 4
    Const withContactIDs = 5 ' Default

    ' OutputType
    Const otPrinter = 0
    Const otFile = 1
    Const otEmail = 2 ' Default
    Const otFax = 3

    ' TransportType
    Const transHTTP = 0
    Const transNative = 1
    Const transSockets = 2 ' Not Used
    Const transUndefined = 3 ' Default

	const atMeeting = 262145
    const atPhoneCall = 262146
    const atToDo = 262147

Function sp_DoMailMergeVB(ByVal vXML, ByVal contactId, ByVal userId, ByVal leaderId)

    Dim vPath
    Dim vFileName
    Dim oWS
    Dim oFS
    Dim Result
    Result = False
    'Read the mail merge temp file path from the registry
    set oWS = CreateObject("WScript.Shell")
    vPath = oWS.RegRead("HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders\AppData") & "\SalesLogix\MailMerge\Temp\"
    set oFS = CreateObject("Scripting.FileSystemObject")
    
    If Not oFS.FolderExists(vPath) Then
        If IsObject(top.MailMergeGUI) Then
            vPath = top.MailMergeGUI.GetPersonalDataPath() & "\"
        Else
            'msgbox("Invalid path.")
            MsgBox (OppSPMessages.InvalidPath)
            sp_DoMailMergeVB = false
            Exit Function    
        End If  
    End If
    set oFS = Nothing
    set oWS = Nothing
    vFileName = vPath & "salesprocess.sdd"
    Result = sp_BuildMailMergeFile(vXML, vFileName, contactId, authorId, leaderId)
    If Result = True Then
        Result = sp_MergeFromFile(vFileName)
        sp_ShowMessage(OppSPMessages.MailMergeCompleted) 
        If Result = False Then
            
            MsgBox (OppSPMessages.MailMergeFailed)
        ELSE
            
            sp_ShowMessage(OppSPMessages.MailMergeSuccess)
        
        End If
         
    Else
        Result = False
    End If
    sp_DoMailMergeVB = Result

End Function

Function sp_MergeFromFile(aFileName)

    Dim oMME
  	Dim mmResult
  	Dim mmErrorType
  	Dim mmErrorMsg
  	Dim Result

  	If conDebugMode = 0 Then
        On Error Resume Next
    End If

  	Result = False
  	Set oMME = CreateObject("SLXMMEngine.MailMergeEngine")
  	top.EventHook.Connect oMME, "MailMergeEngine_"

		if top.reportingEnabled = false then
			oMME.AddressLabelsEnabled = false
		end if

  	mmResult = oMME.MergeFromFile(aFileName)
  	top.EventHook.Disconnect oMME
    Set oMME = Nothing
    Result = True
	sp_MergeFromFile = Result

End Function



Function sp_BuildMailMergeFile(ByVal vXML, ByVal vFileName, ByVal contactId, ByVal authorId, ByVal leaderId)

    Dim objFS
    Dim objFile
    Dim objSLXDOC
    Dim objxmlDoc
    Dim Result
    ' Merge Options
    Dim strMOTemplateName
    Dim strMOTemplateFamily
    Dim strMOAuthorType
    Dim strMOAuthorValue
    Dim strMOMergeWith
    Dim strMOEditAfter
    Dim strMODoNotSolict
    Dim objMONodes
    Dim objMONode

    ' Merge Options Out Put Node
    Dim objOONodes
    Dim objOPNode
    Dim strMODoLabels
    Dim strMOLabelName
    Dim strMOLabelFamily
    Dim strMOSubject
    Dim strMOCoverPage
    Dim strMOMessage
    Dim strMOFrom
    Dim strMOCC
    Dim strMOBCC
    Dim strMOFormat
    Dim strMOSaveCopyInSent
    Dim strMOOutPutType

    ' History Options
    Dim objHONodes
    Dim objHONode
    Dim strHOPromptUser
    Dim strHOAttachToEachContact
    Dim strHOAddHistToEachContact
    Dim strHOResult
    Dim strHoRegrading
    Dim strHOCategory
    Dim strHONotes

    ' Followup Activity
    Dim objFANodes
    Dim objFANode
    Dim strFAPromptUser
    Dim strFAType
    Dim strFACarryOverNotes
    Dim strFAScheduleDaysFromToday
    Dim strFATimless
    Dim strFADuration
    Dim strFAAutoSchedule
    Dim strFALeader
    Dim strFALeaderType
    Dim strFALeaderValue
    Dim strFARegarding
    Dim strFACategory
    Dim strFAHours
    Dim strFAMinutes

    ' Followup Activity  alarm
    Dim objFAAlarmNodes
    Dim objFAAlarmNode
    Dim strFASetAlarm
    Dim strFALeadDuration
    Dim strFALeadUnit

    'Other
    Dim strContactID
    Dim strOpportunityID
    Dim strAccountID
    Dim strAuthorID
    Dim strPluginID
    Dim strPluginName
    Dim strPluginFamily
    Dim strPrinterName
    Dim srtEXML
    Dim objEXMLDoc
    Dim strTO
    Dim strCC
    Dim strBCC
    Dim strHasEmailNodes
    Dim strFilePath
    Dim strHOLeaderID
    Dim strFALeaderID

    ' Setting the Mail Merger Schedule Followup Options
    Dim dtCurDate
    Dim dtDateTime
    Dim dtStartTime
    Dim lngDuration
    Dim lngFromToDay
    Dim lngHours
    Dim lngMinutes
    Dim lngLeadDuration
    Dim lngLeadDurationMin
    Dim lngLeadUnits
    Dim dblLeadDurationDay
    Dim dtAlarmTime

   
    If conDebugMode = 0 Then
        On Error Resume Next
    End If

    strOpportunityID = sp_GetOpportunity()
   
    ' Delete the temporary Mail Merge file, if it exists
    ' --------------------------------------------------------------------------
    set objFS = CreateObject("Scripting.FileSystemObject")
    If objFS.FileExists(vFileName) Then
        set objFile = objFS.GetFile(vFileName)
        objFile.Delete()
        set objFile = Nothing
    End If
    set objFS = Nothing
    set objSLXDOC = CreateObject("SLXDoc.SLXDocument")
    Result = objSLXDOC.CreateNew(vFileName)
    If Result = False Then
        sp_BuildMailMergeFile = False
        Exit Function
    End If

    set objxmlDoc = CreateObject("Msxml.DOMDocument")
    objxmlDoc.async = False
    objxmlDoc.loadXML(vXML)
    If objxmlDoc.xml = "" Then
        msgbox("Invaild MailMerge Action XML")
        sp_BuildMailMergeFile = False
        Exit Function
    End If

   set objActNodes = objXMLDoc.documentElement.selectNodes("//MergeAction")
   set objActNode = objActNodes.item(0)



    ' Get Merge Options
    ' --------------------------------------------------------------------------
    set objMONodes = objActNode.selectNodes("MergeOptions")
    set objMONode = objMONodes.item(0)
    strMOTemplateName = objMONode.selectSingleNode("Template/Name").text
    strMOTemplateFamily = objMONode.selectSingleNode("Template/Family").text
    strMOAuthorType = objMONode.selectSingleNode("Author/Type").Text
    strMOAuthorValue = objMONode.selectSingleNode("Author/Value").Text
    strMOMergeWith = objMONode.selectSingleNode("MergeWith").Text
    strMOEditAfter = objMONode.selectSingleNode("EditAfter").Text
    strMODoNotSolicit = objMONode.selectSingleNode("DoNotSolicit").Text

    ' Merge Options Out Put Node
    ' --------------------------------------------------------------------------
    set objOPNodes = objMONode.selectNodes("Output")
    set objOPNode = objOPNodes.item(0)
    strMOOutPutType = objOPNode.attributes.getNamedItem("Type").Text
    Select Case UCase(strMOOutPutType)
        Case "PRINTER"
            strMODoLabels = objOPNode.selectSingleNode("DoLabels").Text
            strMOLabelName = objOPNode.selectSingleNode("Label/Name").Text
            strMOLabelFamily = objOPNode.selectSingleNode("Label/Family").Text
        Case "EMAIL"
            strMOFrom = objOPNode.selectSingleNode("From").Text
            strMOCC = objOPNode.selectSingleNode("CC").Text
            strMOBCC = objOPNode.selectSingleNode("BCC").Text
            strMOSubject = objOPNode.selectSingleNode("Subject").Text
            strMOFormat = objOPNode.selectSingleNode("Format").Text
            strMOSaveCopyInSent = objOPNode.selectSingleNode("SaveCopyInSent").Text
        Case "FAX"
            strMOSubject = objOPNode.selectSingleNode("Subject").Text
            strMOCoverPage = objOPNode.selectSingleNode("CoverPage").Text
            strMOMessage = objOPNode.selectSingleNode("Message").Text
        Case "FILE"
        Case Else
    End Select

    ' Get History Options
    ' --------------------------------------------------------------------------
    set objHONodes = objActNode.selectNodes("HistoryOptions")
    set objHONode = objHONodes.item(0)
    strHOPromptUser = objHONode.selectSingleNode("PromptUser").Text
    strHOAttachToEachContact = objHONode.selectSingleNode("AttachToEachContact").Text
    strHOAddHistToEachContact = objHONode.selectSingleNode("AddHistToEachContact").Text
    strHOResult = objHONode.selectSingleNode("Result").Text
    strHORegarding = objHONode.selectSingleNode("Regarding").Text
    strHOCategory = objHONode.selectSingleNode("Category").Text
    strHONotes = objHONode.selectSingleNode("Notes").Text

    ' Get Followup Activity
    ' --------------------------------------------------------------------------
    set objFANodes = objActNode.selectNodes("FollowUpActivity")
    set objFANode = objFANodes.item(0)

    strFAPromptUser = objFANode.selectSingleNode("PromptUser").Text
    strFAType = objFANode.selectSingleNode("Type").Text
    strFACarryOverNotes = objFANode.selectSingleNode("CarryOverNotes").Text
    strFAScheduleDaysFromToday = objFANode.selectSingleNode("ScheduleDaysFromToday").Text
    strFATimless = objFANode.selectSingleNode("Timeless").Text
    strFADuration = objFANode.selectSingleNode("Duration").Text
    strFAAutoSchedule = objFANode.selectSingleNode("AutoSchedule").Text
    strFALeaderType = objFANode.selectSingleNode("Leader/Type").Text
    strFALeaderValue = objFANode.selectSingleNode("Leader/Value").Text
    strFARegarding = objFANode.selectSingleNode("Regarding").Text
    strFACategory = objFANode.selectSingleNode("Category").Text
    strFANotes = objFANode.selectSingleNode("Notes").Text
    strFAHours = objFANode.selectSingleNode("Time/Hours").Text
    strFAMinutes = objFANode.selectSingleNode("Time/Minutes").Text

    ' Get Followup Activity  alarm
    ' --------------------------------------------------------------------------
    set objFAAlarmNodes = objFANode.selectNodes("Alarm")
    set objFAAlarmNode = objFAAlarmNodes.item(0)
    strFASetAlarm = objFAAlarmNode.selectSingleNode("SetAlarm").Text
    strFALeadDuration = objFAAlarmNode.selectSingleNode("LeadDuration").Text
    strFALeadUnit = objFAAlarmNode.selectSingleNode("LeadUnit").Text

    ' Setting the Mail merge object
    '--------------------------------------------------------------------------

    objSLXDoc.MailMergeInformation.AttachmentPath = ATTACHPATH
    objSLXDoc.MailMergeInformation.LibraryPath = LIBRARYPATH
    objSLXDoc.MailMergeInformation.BaseKeyCode = ""
    objSLXDoc.MailMergeInformation.ConnectionString = CONNSTRING
    objSLXDoc.MailMergeInformation.Remote = False
    objSLXDoc.MailMergeInformation.SiteCode = SITECODE
    objSLXDoc.MailMergeInformation.TransPortType = transHTTP
    objSLXDoc.MailMergeInformation.UserID = USERID
    objSLXDoc.MailMergeInformation.RunAs = 2 'raSalesProcess
    objSLXDoc.MailMergeInformation.MergeSilently = False
    objSLXDoc.MailMergeInformation.BaseTable = "CONTACT"

    If strMODoNotSolicit = "T" Then
        objSLXDoc.MailMergeInformation.DoNotSolicit = True
    Else
        objSLXDoc.MailMergeInformation.DoNotSolicit = False
    End If
    If strMOEditAfter = "T" Then
        objSLXDoc.MailMergeInformation.EditAfter = True
    Else
        objSLXDoc.MailMergeInformation.EditAfter = False
    End If

    'Get the pluginID of the Template
    strPluginID = sp_Service("GetPluginId", strMOTemplateName & "," & strMOTemplateFamily & ",25")
    If strPluginID = "" Then
        ' MsgBox("The word template " & strMOTemplateFamily & ":" & strMOTemplateName & " was not found.")
         MsgBox (sp_Format(OppSPMessages.WordTemplateNotFound,strMOTemplateName,strMOTemplateFamily))
        sp_BuildMailMergeFile = False
        Exit Function
    End If
    objSLXDoc.MailMergeInformation.EditBefore = False
    objSLXDoc.MailMergeInformation.TemplatePluginID = strPluginID
    objSLXDoc.MailMergeInformation.TemplatePluginName = strMOTemplateName
    objSLXDoc.MailMergeInformation.UserName = ""

    'strAuthorID = authorId 'GetScheduleForID(strMOAuthorType, strMOAuthorValue)
    objSLXDOC.SummaryInformation.Author = authorId
    objSLXDOC.MailMergeInformation.MergeAsUserID = authorID

    ' Get the Contact to Merge with
    ' -------------------------------------------------------------------------

    strEXML = ""
    If strMOOutPutType = "Email" Then
        Select Case UCase(strMOMergeWith)
            Case "PRIMARYOPPCONTACT"
                strEXML = sp_GetOppContactEmail(False)
                objSLXDoc.MailMergeInformation.MergeWith = withContactIDs
            Case "USERSELECTEDCONTACT"
                strEXML = sp_GetOppContactEmail(True)
                objSLXDoc.MailMergeInformation.MergeWith = withContactIDs
            Case Else
                strEXML = sp_GetOppContactEmail(True)
                objSLXDoc.MailMergeInformation.MergeWith = withContactIDs
        End Select
        set objEXMLDoc = CreateObject("Msxml.DOMDocument")
        objEXMLDoc.async = False
        If strEXML = "" Then
            BuildMailMergeFile = False
            Exit Function
        End If

        objEXMLDoc.loadXML(strEXML)
        If (objEXMLDoc.XML = "") Then
            msgbox("Invaild email XML")
            sp_BuildMailMergeFile = False
            Exit Function
        End If
        strHasEmailNodes = objEXMLDoc.documentelement.selectsinglenode("/Email/EmailNodes").Text
        strContactID = objEXMLDoc.documentelement.selectsinglenode("/Email/SelectedContactID").Text
        If strHasEmailNodes = "T" Then
            strTO = objEXMLDoc.documentelement.selectsinglenode("/Email/TO").Text
            strCC = objEXMLDoc.documentelement.selectsinglenode("/Email/CC").Text
            strBCC = objEXMLDoc.documentelement.selectsinglenode("/Email/BCC").Text
        End If
        
        If strCC <> "" Then
            strMOCC = strMOCC & ";" & strCC
        End If
        If strBCC <> "" Then
            strMOBCC = strMOBCC & ";" & strBCC
        End If
        set objEXMLDoc = Nothing
        If strContactID = "" Then
             MsgBox (OppSPMessages.CanceledOrContactNotFound)
            sp_BuildMailMergeFile = False
            Exit Function
        End If
    Else
        strContactId = contactId 
        objSLXDoc.MailMergeInformation.MergeWith = withContactIDs
        'Select Case UCase(strMOMergeWith)
        '   Case "PRIMARYOPPCONTACT"
        '     'strContactID = GetOppContact(False)
        '     objSLXDoc.MailMergeInformation.MergeWith = withContactIDs
        '   Case "USERSELECTEDCONTACT"
             'strContactID = GetOppContact(True)
        '     objSLXDoc.MailMergeInformation.MergeWith = withContactIDs
        ' Case Else
            'strContactID = GetOppContact(True)
        '    objSLXDoc.MailMergeInformation.MergeWith = withContactIDs
        'End Select
      
        If strContactID = "" Then
            MsgBox (OppSPMessages.CanceledOrContactNotFound) '"You have cancled or a contact was not found selected for this action."
            sp_BuildMailMergeFile = False
            Exit Function
        End If
    End If
    sp_ShowMessage(OppSPMessages.ProcessingMailMerge) '"Processing mail merge please wait ...")
    objSLXDoc.MailMergeInformation.ContactIDs = strContactID
    objSLXDoc.MailMergeInformation.CurrentContactName = ""
    objSLXDOC.MailMergeInformation.OpportunityID = strOpportunityID

    ' Set the options for the specific output type
    ' -------------------------------------------------------------------------------
    Select Case UCase(strMOOutPutType)
        Case "EMAIL"
            objSLXDoc.MailMergeInformation.OutPutTo = otEmail
            objSLXDoc.MailMergeInformation.EmailClient = emailOutLook
            objSLXDoc.MailMergeInformation.MapiProfileName = ""
            objSLXDoc.MailMergeInformation.EmailFrom = strMOFrom
            objSLXDoc.MailMergeInformation.EmailCC = strMOCC
            objSLXDoc.MailMergeInformation.EmailBCC = strMOBCC
            objSLXDoc.MailMergeInformation.EmailSubject = strMOSubject
            objSLXDoc.MailMergeInformation.OverrideAttachments = False
            Select Case UCase(strMOFormat)
                Case "HTML"
                    objSLXDoc.MailMergeInformation.EmailFormat = formatHTML
                Case "PLAIN TEXT"
                    objSLXDoc.MailMergeInformation.EmailFormat = formatPlainText
                Case Else
                    objSLXDoc.MailMergeInformation.EmailFormat = formatHTML
            End Select
            If strMOSaveCopyInSent = "T" Then
                objSLXDoc.MailMergeInformation.EmailSaveCopy = True
            Else
                objSLXDoc.MailMergeInformation.EmailSaveCopy = False
            End If
        Case "PRINTER"
            objSLXDoc.MailMergeInformation.OutPutTo = otPrinter
            objSLXDoc.MailMergeInformation.PromptPrinter = True
            If strMODoLabels = "T" Then
                objSLXDoc.MailMergeInformation.DoPrintLabels = True
                strPluginID = sp_Service("GetPluginId", strMOLabelName & "," & strMOLabelFamily & ",19")
                If strPluginID = "" Then
                    MsgBox(sp_Format(OppSPMessages.LabelTemplateNotFound,strMOLabelName, strMOLabelFamily)) ' "The label template " & strMOLabelFamily & ":" & strMOLabelName & " was not found.")
                    sp_BuildMailMergeFile = False
                    Exit Function
                End If
                objSLXDoc.MailMergeInformation.LabelID = strPluginID
            Else
                objSLXDoc.MailMergeInformation.DoPrintLabels = False
            End If
        Case "FAX"
            objSLXDoc.MailMergeInformation.OutPutTo = otFax
            objSLXDoc.MailMergeInformation.FaxBillingCode = ""
            objSLXDoc.MailMergeInformation.FaxClientCode = ""
            objSLXDoc.MailMergeInformation.FaxCoverPage = ""
            objSLXDoc.MailMergeInformation.FaxDate = Now()
            objSLXDoc.MailMergeInformation.FaxDelivery = fdASAP
            objSLXDoc.MailMergeInformation.FaxKeyWords = ""
            objSLXDoc.MailMergeInformation.FaxMessage = strMOMessage
            objSLXDoc.MailMergeInformation.FaxPriority = fpNormal
            objSLXDoc.MailMergeInformation.FaxSendBy = ""
            objSLXDoc.MailMergeInformation.FaxSendSecure = False
            objSLXDoc.MailMergeInformation.FaxSubject = strMOSubject
            objSLXDoc.MailMergeInformation.PromptFaxCoverPage = (strMOCoverPage = "T")
        Case "FILE"
            objSLXDoc.MailMergeInformation.OutPutTo = otFile
            strFilePath = sp_GetFilePath()
            If strFilePath = "" Then
                MsgBox (OppSPMessages.SelectFolder) '"You must select a folder to use for this merge."
                sp_BuildMailMergeFile = False
                Exit Function
            End If
            objSLXDoc.MailMergeInformation.FileDirectory = strFilePath
        Case Else
    End Select

    ' Setting the Mail Merge History Options
    ' ---------------------------------------------------------------------
    ' Let the Mail Merge Engine process the History logic.

    If strHOAddHistToEachContact = "T" Then
        objSLXDoc.MailMergeInformation.DOHistory = True
    Else   'Don't add history to each Contact
        objSLXDoc.MailMergeInformation.DOHistory = False
    End If
    If strHOAttachToEachContact = "T" Then
        objSLXDoc.MailMergeInformation.DoAttachments = True
    Else   'Don't add history to each Contact
        objSLXDoc.MailMergeInformation.DoAttachments = False
    End If
    If strHOPromptUser = "T" Then
        objSLXDoc.MailMergeInformation.PromptHistory = True
    Else
        objSLXDoc.MailMergeInformation.PromptHistory = False
    End If

    objSLXDoc.MailMergeInformation.HistoryInfoCategory = strHOCategory
    objSLXDoc.MailMergeInformation.HistoryInfoNotes = strHONotes
    objSLXDoc.MailMergeInformation.HistoryInfoRegarding = strHORegarding
    objSLXDoc.MailMergeInformation.HistoryInfoResult = strHOResult

    ' Setting the Mail Merger Schedule Followup Options
    ' --------------------------------------------------------------------------
    dtCurDate = Date
    If strFAScheduleDaysFromToday <> "" Then
        lngFromToDay = CLng(strFAScheduleDaysFromToday)
    Else
        lngFromToDay = 0
    End If
    If strFADuration <> "" Then
        lngDuration = CLng(strFADuration)
    Else
        lngDuration = 15
    End If

    If strFATimeless = "T" Then
        dtStartTime = CDate(CLng(dtCurDate) + lngFromToDay)
        objSLXDoc.MailMergeInformation.ScheduleFollowUpTimeless = True
    Else
        If strFAHours = "" Then
            lngHours = 0
        Else
            lngHours = CLng(strFAHours)
        End If
        If strFAMinutes = "" Then
            lngMinutes = 0
        Else
            lngMinutes = CLng(strFAHours)
        End If
        dtStartTime = CDate(CLng(dtCurDate) + lngFromToDay + (lngHours / (24)) + (lngMinutes / (24 * 60)))
        objSLXDoc.MailMergeInformation.ScheduleFollowUpTimeless = False
    End If

    dtStartTime = sp_SetDateForWeekEnd(dtStartTime)
    objSLXDoc.MailMergeInformation.ScheduleFollowUpStartDate = dtStartTime
    objSLXDoc.MailMergeInformation.ScheduleFollowUpDuration = lngDuraton

    If strFALeadDuration <> "" Then
        lngLeadDuration = CLng(strFALeadDuration)
    Else
        lngLeadDuration = 0
    End If

    Select Case UCase(strFALeadUntit)
        Case "MINUTES"
            dblLeadDurationDay = lngLeadDuration / (24 * 60)
        Case "HOURS"
            dblLeadDurationDay = lngLeadDuration / (24)
        Case "DAYS"
            dblLeadDurationDay = lngLeadDuration
        Case Else
            dblLeadDurationDay = 0
    End Select
    If strFASetAlarm = "T" Then
        dtAlarmTime = CDate(CDbl(dtStartTime) - dblLeadDurationDay)
        objSLXDoc.MailMergeInformation.ScheduleFollowUpSetAlarm = True
        objSLXDoc.MailMergeInformation.ScheduleFollowUpAlarmTime = dtAlarmTime
    Else
        objSLXDoc.MailMergeInformation.ScheduleFollowUpSetAlarm = False
    End If
    Select Case UCase(strFAType)
        Case "PHONE CALL"
            objSLXDoc.MailMergeInformation.ScheduleFollowUpType = fuPhoneCall
        Case "MEETING"
            objSLXDoc.MailMergeInformation.ScheduleFollowUpType = fuMeeting
        Case "TO-DO"
            objSLXDoc.MailMergeInformation.ScheduleFollowUpType = fuToDo
        Case "NONE"
            objSLXDoc.MailMergeInformation.ScheduleFollowUpType = fuNone
        Case Else
            objSLXDoc.MailMergeInformation.ScheduleFollowUpType = fuToDo
    End Select
    objSLXDoc.MailMergeInformation.DoScheduleFollowUp = (objSLXDoc.MailMergeInformation.ScheduleFollowUpType <> fuNone)
    If (strFAPromptUser = "T") And (UCase(strFAType) <> "NONE") Then
        objSLXDoc.MailMergeInformation.PromptFollowUpActivity = True
    Else
        objSLXDoc.MailMergeInformation.PromptFollowUpActivity = False
    End If
    If strFACarryOverNotes = "T" Then
        objSLXDoc.MailMergeInformation.ScheduleFollowUpCarryOverNotes = True
    Else
        objSLXDoc.MailMergeInformation.ScheduleFollowUpCarryOverNotes = False
    End If

    objSLXDoc.MailMergeInformation.ScheduleFollowUpCategory = strFACategroy
    objSLXDoc.MailMergeInformation.ScheduleFollowUpNotes = strFANotes
    objSLXDoc.MailMergeInformation.ScheduleFollowUpRegarding = strFARegarding
    'strFALeaderID = GetScheduleForID(strFALeaderType, strFALeaderValue)
    objSLXDoc.MailMergeInformation.ScheduleFollowUpUserID = leaderID

    objSLXDoc.Commit()
    objSLXDoc.Close()
    set objSLXDoc = Nothing
    Result = True

    sp_BuildMailMergeFile = Result

End Function

Function sp_PopEmailAddress(aContactID)

    Const resOk = 1
    Const rtTo = 0
    Const rtCC = 1
    Const rtBCC = 2
    Const adMaxOne = 0
    Dim vXML
    Dim vRXML
    Dim oSelectNames
    Dim vAccountID
    Dim vAccountName
    Dim vContactID
    Dim vEmailAddress
    Dim vFirstName
    Dim vLastName
    Dim vOpportunityID
    Dim vOpportunityName
    Dim oRecipient
    Dim oXMLDOC
    Dim oConNodes
    Dim oConNode
    Dim i
    Dim oXMLHTTP
    Dim vURL
    Dim vTo
    Dim vCC
    Dim vBCC
    Dim vSelectedContactID
    
    vOpportunityID   = sp_GetOpportunity()
    vOpportunityName = "" 'sp_GetOpportuntiyDesc()
   
    vXML = sp_Service("GETOPPCONTACTSEMAIL", vOpportunityID )
    
    
    Set oSelectNames = CreateObject("SLXMMGUI.SelectEmailNames")
    oSelectNames.CreateWindow() ' This creates the form. This is done so we can set the OwnerWnd prior to the creation of the window.
    Set oXMLDoc = CreateObject("Msxml2.DOMDocument")
    oXMLDoc.async = False
    If (oXMLDoc.loadXML(vXML)= False) Then
        msgbox "Invaild opp conatact email XML"
        Exit Function
    End If
    Set oConNodes = oXMLDoc.documentElement.selectNodes("//CONTACTS/CONTACT")
    For i = 0 To oConNodes.length - 1
        Set oConNode = oConNodes.item(i)
        vAccountID       = oConNode.selectSingleNode("ACCOUNTID").Text
        vAccountName     = oConNode.selectSingleNode("ACCOUNT").Text
        vContactID       = oConNode.selectSingleNode("CONTACTID").Text
        vEmailAddress    = oConNode.selectSingleNode("EMAIL").Text
        vFirstName       = oConNode.selectSingleNode("FIRSTNAME").Text
        vLastName        = oConNode.selectSingleNode("LASTNAME").Text
        
        If vContactID = aContactID Then
	        oSelectNames.AddContactInfo vAccountID, vAccountName, vContactID, vEmailAddress, vFirstName, vLastName, vOpportunityID, vOpportunityName,True
	    Else
	        oSelectNames.AddContactInfo vAccountID, vAccountName, vContactID, vEmailAddress, vFirstName, vLastName, vOpportunityID, vOpportunityName,False
	    End If
    Next
    oSelectNames.MaxTo = admaxOne 'Only allow one To contact address
    boolDone = False
    Do While Not boolDone
  	    If oSelectNames.ShowModal() = resOk Then
     	    For I = 0 To oSelectNames.Recipients.Count -1
      		    Set oRecipient = oSelectNames.Recipients(I)
      		    Select Case oRecipient.Type_
        		    Case rtTo
		  		   	    vSelectedContctID = oRecipient.ContactID
          			    vTO = vTO & oRecipient.FirstName & " " & oRecipient.LastName & "(" & oRecipient.EmailAddress & ");"
        		    Case rtCC
          			    vCC = vCC & oRecipient.FirstName & " " & oRecipient.LastName & "(" & oRecipient.EmailAddress & ");"
        		    Case rtBCC
          		        vBCC = vBCC &  oRecipient.FirstName & " " & oRecipient.LastName & "(" & oRecipient.EmailAddress & ");"
      		     End Select
            Next
		    'msgbox vSelectedContctID
	        If vSelectedContctID = "" Then
		        boolDone = False
		        msgBox OppSPMessages.MustBeAtLeastOne '"There must be at least one name in the TO box."
		    Else
		        boolDone = True
		    End If
  	    Else
  	 	    boolDone = True
  	    End If
    Loop
    vRXML =  "<Email>" & Chr(13) & Chr(10)
    vRXML = vRXML & "    <Cancel>" & boolDone & "</Cancel> " &Chr(13) & Chr(10)
    vRXML = vRXML & "    <EmailNodes>T</EmailNodes>" & Chr(13) & Chr(10)
    vRXML = vRXML & "    <SelectedContactID>" & vSelectedContctID  & "</SelectedContactID>" & Chr(13) & Chr(10)
    vRXML = vRXML & "    <TO>" & vTO  & "</TO>" & Chr(13) & Chr(10)
    vRXML = vRXML & "    <CC>" & vCC  & "</CC>" & Chr(13) & Chr(10)
    vRXML = vRXML & "    <BCC>" & vBCC  & "</BCC>" & Chr(13) & Chr(10)
    vRXML = vRXML & "</Email>"

	oSelectNames.DestroyWindow()
    Set oSelectNames = Nothing
    sp_PopEmailAddress = vRXML

End Function

Function sp_GetOppContactEmail(Promptfor)

	Dim voppcontactid
    Dim voppcount
    Dim result
    Dim vXML
    vXML = ""
    voppcount = CInt(sp_GetOppContactCount())
    voppcontactid = sp_GetPrimaryOppContact()
    sp_ShowMessage(OppSPMessages.SelectEMailAddr) '"Selecting the contacts to mail to ..."
    If voppcount < 1 Then
        msgbox OppSPMessages.NoContactAssociated '"There are no contacts associated to the opportunity for this step."
	    vXML = ""
    Else
        If promptfor = True Then
	        If (voppcount > 1) Then
	            vXML = sp_PopEmailAddress("")
	        Else
	            If voppcontactid = "" Then
	                vXML = sp_PopEmailAddress("")
	  	        Else
		            vXML = "<Email>"
		            vXML = vXML & "<EmailNodes>F</EmailNodes>"
		            vXML = vXML & "<SelectedContactID>" & voppcontactid & "</SelectedContactID>"
		            vXML = vXML & "</Email>"
	            End If
	        End If
	    Else
	        If voppcontactid = "" Then
	            vXML = sp_PopEmailAddress("")
	        Else
	            vXML = "<Email>"
		        vXML = vXML & "<EmailNodes>F</EmailNodes>"
		        vXML = vXML & "<SelectedContactID>" & voppcontactid & "</SelectedContactID>"
		        vXML = vXML & "</Email>"
	        End If
	    End If
    End If
    sp_GetOppContactEmail = vXML
End Function

Function sp_SetDateForWeekEnd(aDate)

    const vbUseSystem = 0
    const vbSunday = 1 'Default
    const vbMonday = 2
    const vbTuesday = 3
    const vbWednesday = 4
    const vbThursday = 5
    const vbFriday = 6
    const vbSaturday = 7

    Dim NewDate
    Dim WeekDay

    If conSetDate = 0 Then
        sp_SetDateForWeekEnd = aDate
        Exit Function
    End IF
    If ISDate(aDate) Then
        WeekDay = DatePart("w",aDate,vbSunday)
        Select Case WeekDay
            Case 1 'Sunday
                NewDate = DateAdd("d",1,aDate) 'Move it to Monday
            Case 7 'Saturday
                NewDate = DateAdd("d",2,aDate) 'Move it to Monday
            Case Else
                NewDate = aDate
        End Select
    Else
        NewDate = Now()
    End If

    sp_SetDateForWeekEnd = NewDate

End Function

Function sp_GetFilePath()

    Dim oSLXMMGUI
    Dim oWS
    Dim strPath
    Dim strCaption
    Dim strTitle
    Dim strSelection

    If conDebugMode = 0 Then
        On Error Resume Next
    End If
    vPath = ""
    strCaption = OppSPMessages.SelectFolderCaption '"Select Folder To Use For Merge"
    strTitle = OppSPMessages.SelectFolderTitle '"Folder"
    set oWS = CreateObject("WScript.Shell")
    On Error Resume Next ' Needed in case Reg path does not exist
    strSelection = oWS.RegRead("HKEY_CURRENT_USER\Software\SalesLogix\SalesProcess\MMFilePath")
    If Err.Number <> 0 Then
        strSelection = top.GM.GetPersonalDataPath
        oWS.RegWrite "HKEY_CURRENT_USER\Software\SalesLogix\SalesProcess\MMFilePath", strSelection
    End If
    If strSelection = "" Then
        strSelection = top.GM.GetPersonalDataPath
    End If
    set oSLXMMGUI = CreateObject("SLXMMGUI.MailMergeGUI")
    If oSLXMMGUI.SelectFolder(strCaption, strTitle, strSelection) Then
        strPath = strSelection
    End If
    oSLXMMGUI = Nothing
    If strPath = "" Then
    Else
        oWS.RegWrite "HKEY_CURRENT_USER\Software\SalesLogix\SalesProcess\MMFilePath", strPath 
    End If
    oWS = Nothing

    sp_GetFilePath = strPath

End Function
