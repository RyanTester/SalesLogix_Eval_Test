<%@ Control Language="C#" AutoEventWireup="true" CodeFile="WorkSurveyOffer.ascx.cs" Inherits="SmartParts_WorkSurvey_WorkSurveyOffer" %>
<style type="text/css">
    .outerDiv
    {
        width: 500px;
        margin: 0 auto; 
        background-color: #fff; 
        border: solid 1px #000; 
        padding: 12px;
    }
    .titleDiv
    {
        width: 500px;
    }
    .titleImage
    {
        float:left;
      border-style: none;
      margin-right: 10px;
    }
    .titleText
    {
        float:left;
      margin-left: 30px;
      margin-top: 20px;
      font-size: 18px; 
      font-weight: bold;
      text-align: center;
    }
    .offerOptionsDiv
    {
      margin-left: 120px; 
      margin-top: 20px;
    }
    .okButton
    {
      width: 100px; 
      margin-left: 130px; 
    }
    .surveyInfo
    {
      clear: both;
      margin: 10px;
      padding-top: 16px;
    }
    .bottomDiv
    {
       margin-top: 20px;
    }
</style>

<div class="outerDiv">

<div class="titleDiv">
    <asp:Image ID="imgTitle" runat="server" ImageUrl="~/SmartParts/WorkSurvey/images/SurveyOfferImage.jpg" AlternateText='Sage Software' CssClass="titleImage" />
    <asp:Label ID="lblTitle" runat="server" class="titleText" Text="Tell Us What You Think"></asp:Label>
</div>

<div id="divError" style="visibility: hidden"></div>    

<div class="surveyInfo">
    <asp:Label ID="lblSurveyInfo" runat="server" Text=""></asp:Label>
</div>

<div class="offerOptionsDiv">
    <asp:RadioButton GroupName="surveyGroup" Text="I want to make a difference and take the survey!" Checked="true" ID="rbYes" runat="server" /><br />
    <asp:RadioButton GroupName="surveyGroup" Text="Remind me in" ID="rbLater" runat="server" />&nbsp;<asp:DropDownList ID="ddlDelayDays" runat="server"></asp:DropDownList>&nbsp;<asp:Label ID="lblDelayUnits" runat="server" Text="Days" ></asp:Label> <br />
    <asp:RadioButton GroupName="surveyGroup" Text="No thanks" ID="rbNo" runat="server" />
</div>
    
<div class="bottomDiv">
<!-- the privacy link is set in the WorkSurvey module -->
    <asp:HyperLink ID="lnkPrivacy" runat="server" NavigateUrl="http://sagesoftware.com/company/privacy.cfm" Text="Privacy Policy" Target="_blank"></asp:HyperLink>
    <input type="button" id="btnOk" runat="server" onclick="ProcessSurveyOffer()" class="okButton" value="OK"  />
</div>
</div>


<script type='text/javascript'>
    var surveyUrl = '<%= Server.UrlDecode(CurrentSurvey.SurveyOfferPage.SurveyUrl) %>';
    var surveyAttemptCount = 0;
    function ProcessSurveyOffer() {
        var opt = 'd';
        var noOption = document.getElementById('<%= rbNo.ClientID %>');
        var yesOption = document.getElementById('<%= rbYes.ClientID %>');
        var delayDays = document.getElementById('<%= ddlDelayDays.ClientID %>').value;
        
        if (yesOption && yesOption.checked) {
            opt = 'y';
        }
        else if (noOption && noOption.checked)
            opt = 'n';
        
        var initialDelayDays = '<%= CurrentSurvey.OfferDelayDays.ToString() %>';
        var maxDelays = '<%= CurrentSurvey.MaxAllowedDelays.ToString() %>';
        var surveyVersion = '<%= CurrentSurvey.Version %>';
        var isRequired = '<%= CurrentSurvey.IsRequired.ToString() %>';
        var postUrl = 'slxdata.ashx/slx/crm/-/survey/processoffer?opt=' + opt + '&ddays=' + delayDays + '&idays=' + initialDelayDays + '&mdel=' + maxDelays + '&ver=' + surveyVersion + '&req=' + isRequired + '&_dc=' + (new Date().getTime());
        $.ajax({
            type: 'GET',
            url: postUrl,
            contentType: 'application/json',
            data: Ext.encode(arraySelections),
            processData: false,
            success: ProcessResult,
            failure: ProcessFailure
        });
    }
    function ProcessResult(request, status) {
        if (status && status == 'success') {
            if (request && request == 'y')
                window.open(surveyUrl);

            HideSurveyDiv();
        }
    }
    function ProcessFailure(request, status) {
        surveyAttemptCount++;

        if (surveyAttemptCount > 1)
            HideSurveyDiv();
        
        var errorDiv = document.getElementById('divError');
        if (errorDiv != null) {
            errorDiv.innerHTML = status;
            offerDiv.style.visibility = 'visible';
        }

    }

    function HideSurveyDiv() {
        var offerDiv = document.getElementById('surveyDiv');
        if (offerDiv != null) offerDiv.style.visibility = 'hidden';
    }
</script>
