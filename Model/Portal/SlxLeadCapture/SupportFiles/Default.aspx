<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="LeadCapture" Culture="auto" UICulture="auto" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Lead Capture</title>
    <link rel="stylesheet" type="text/css" href="~/css/SlxBase.css" />
    <style type="text/css">
        body { font-size:90% }
        .row { clear: both; padding-bottom : 30px;}
        .secondcolumn { float:left; }
        .secondcolumn DIV { float:left; }
        .firstcolumn { width:300px; float:left; text-indent:50px }
        .namefields {  }
        .buttondiv { padding-top:16px; position:absolute; left:100px; }
        .required { width:300px; float:left; text-indent:50px; color:#FF0000; }
    </style>
    <script type="text/javascript" src="jscript/YUI/yui-combined-min.js"></script>
          
    <script type="text/javascript" src="Libraries/jQuery/jquery.js"></script>
    <script type="text/javascript" src="Libraries/jQuery/jquery.selectboxes.js"></script>
    <script type="text/javascript" src="Libraries/jQuery/jquery-ui.js"></script>
    <script type="text/javascript" src="Libraries/Ext/adapter/jquery/ext-jquery-adapter.js"></script>
    <script type="text/javascript" src="Libraries/Ext/ext-all.js"></script>
    <script type="text/javascript" src="Libraries/Ext/ext-overrides.js"></script>
    <script type="text/javascript" src="Libraries/Ext/ext-tablegrid.js"></script>
    <script type="text/javascript" src="Libraries/Ext/ux/ext-ux-livegrid-combined-min.js"></script>
    <script type="text/javascript" src="jscript/FormViewPort.js"></script>
    <script type="text/javascript" src="jscript/general.js"></script>        
        
    <script pin="pin" type="text/javascript" src="jscript/YUI/yui-combined-min.js"></script>     
    <script pin="pin" type="text/javascript" src="jscript/sage-platform/sage-platform.js"></script>
    <script pin="pin" type="text/javascript" src="jscript/sage-controls/sage-controls.js"></script>
    <script type="text/javascript" src="jscript/cookiesobj.js"></script> 
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager runat="server" ID="scriptManager"></asp:ScriptManager>
    <div id="Page1" runat="server">
    <div class="row">
        <asp:Label ID="Label1" runat="server" Text="<%$ resources:rscName %>" CssClass="required"></asp:Label>
        <span class="secondcolumn">
        <asp:DropDownList ID="ddlPrefix" runat="server" >
            <asp:ListItem Value="mr" Text="<%$ resources:rscPrefixMr %>"></asp:ListItem>
            <asp:ListItem Value="mrs" Text="<%$ resources:rscPrefixMrs %>"></asp:ListItem>
            <asp:ListItem Value="ms" Text="<%$ resources:rscPrefixMs %>"></asp:ListItem>
        </asp:DropDownList>
        <asp:TextBox ID="txtFirstName" runat="server" CssClass="namefields" MaxLength="32"></asp:TextBox>
        <asp:TextBox ID="txtLastName" runat="server" CssClass="namefields" MaxLength="32"></asp:TextBox>
        <asp:TextBox ID="txtSuffix" runat="server" Width="47px" CssClass="namefields" MaxLength="32"></asp:TextBox>
        <asp:RequiredFieldValidator ID="rfvFirstName" runat="server" ErrorMessage="<%$ resources:rscFirstNameRequiredMsg %>" ControlToValidate="txtFirstName"></asp:RequiredFieldValidator>
        <asp:RequiredFieldValidator ID="rfvLastName" runat="server" ErrorMessage="<%$ resources:rscLastNameRequiredMsg %>" ControlToValidate="txtLastName"></asp:RequiredFieldValidator>
        </span>
        </div>
    <div class="row">
         <asp:Label ID="Label2" runat="server" Text="<%$ resources:rscTitle %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <SalesLogix:PickListControl id="txtTitle" picklistname="Title"  runat="server" MustExistInList="true" ValueStoredAsText="true" MaxLength="64" ></SalesLogix:PickListControl>
             <asp:RequiredFieldValidator ID="rfvTitle" runat="server" ErrorMessage="<%$ resources:rscTitleRequiredMsg %>" ControlToValidate="txtTitle" ></asp:RequiredFieldValidator>
        </span>
    </div>
    <div class="row">
         <asp:Label ID="Label3" runat="server" Text="<%$ resources:rscAddress %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtAddress1" runat="server" MaxLength="64"></asp:TextBox>
             <asp:RequiredFieldValidator ID="rfvAddress" runat="server" ErrorMessage="<%$ resources:rscAddressRequiredMsg %>" ControlToValidate="txtAddress1"></asp:RequiredFieldValidator>
        </span>
    </div>
    <div class="row">
         <span class="firstcolumn">&nbsp;</span><asp:TextBox ID="txtAddress2" runat="server" CssClass="secondcolumn" MaxLength="64"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label4" runat="server" Text="<%$ resources:rscCity %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtCity" runat="server"  MaxLength="32"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvCity" runat="server" ErrorMessage="<%$ resources:rscCityRequiredMsg %>" ControlToValidate="txtCity"></asp:RequiredFieldValidator>
       </span>
   </div>
    <div class="row">
        <asp:Label ID="Label5" runat="server" Text="<%$ resources:rscState %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <SalesLogix:PickListControl id="State" picklistname="State" PickListId="kSYST0000390" runat="server" MustExistInList="true" MaxLength="32"></SalesLogix:PickListControl>
             <asp:RequiredFieldValidator ID="rfvState" runat="server" ErrorMessage="<%$ resources:rscStateRequiredMsg %>" ControlToValidate="State"></asp:RequiredFieldValidator>
        </span>
    </div>
    <div class="row">
         <asp:Label ID="Label6" runat="server" Text="<%$ resources:rscPostal %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtPostal" runat="server" MaxLength="24"></asp:TextBox>
             <asp:RequiredFieldValidator ID="rfvPostal" runat="server" ErrorMessage="<%$ resources:rscPostalRequiredMsg %>" ControlToValidate="txtPostal"></asp:RequiredFieldValidator>
        </span>
   </div>
    <div class="row">
        <asp:Label ID="Label7" runat="server" Text="<%$ resources:rscCountry %>" CssClass="required"></asp:Label>
        <span class="secondcolumn">
            <SalesLogix:PickListControl id="Country" PickListId="kSYST0000386" picklistname="Country" runat="server" MustExistInList="true" MaxLength="32"></SalesLogix:PickListControl>
             <asp:RequiredFieldValidator ID="rfvCountry" runat="server" ErrorMessage="<%$ resources:rscCountryRequiredMsg %>" ControlToValidate="Country"></asp:RequiredFieldValidator>
        </span>
    </div>
    <div class="row">
         <asp:Label ID="Label8" runat="server" Text="<%$ resources:rscMainPhone %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtPhone" runat="server"  MaxLength="32"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvPhone" runat="server" ErrorMessage="<%$ resources:rscPhoneRequiredMsg %>" ControlToValidate="txtPhone"></asp:RequiredFieldValidator>
        </span>
   </div>
    <div class="row">
         <asp:Label ID="Label9" runat="server" Text="<%$ resources:rscFax %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtFax" runat="server" CssClass="secondcolumn" MaxLength="32"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label10" runat="server" Text="<%$ resources:rscMobilePhone %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtMobile" runat="server" CssClass="secondcolumn" MaxLength="32"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label11" runat="server" Text="<%$ resources:rscHomePhone %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtHomePhone" runat="server" CssClass="secondcolumn" MaxLength="32"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label12" runat="server" Text="<%$ resources:rscPager %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtPager" runat="server" CssClass="secondcolumn" MaxLength="32"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label13" runat="server" Text="<%$ resources:rscPin %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtPin" runat="server" CssClass="secondcolumn" MaxLength="7"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label14" runat="server" Text="<%$ resources:rscEmail %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtEmail" runat="server" MaxLength="128"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ErrorMessage="<%$ resources:rscEmailRequiredMsg %>" ControlToValidate="txtEmail"></asp:RequiredFieldValidator>
         </span>
    </div>
    <div class="row">
         <asp:Label ID="Label15" runat="server" Text="<%$ resources:rscWebUrl %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtWebUrl" runat="server" CssClass="secondcolumn" MaxLength="128"></asp:TextBox>
    </div>
    <div class="row">
        <asp:Label ID="Label16" runat="server" Text="<%$ resources:rscHowDidYouHear %>" CssClass="required"></asp:Label>
        <span class="secondcolumn">
            <asp:DropDownList ID="ddlHowDidYouHear" runat="server"></asp:DropDownList>
            <asp:RequiredFieldValidator ID="rfvHowDidYouHear" runat="server" ErrorMessage="<%$ resources:rscFieldRequiredMsg %>" ControlToValidate="ddlHowDidYouHear"></asp:RequiredFieldValidator>
        </span>
    </div>
    <div class="row">
        <asp:Label ID="Label17" runat="server" Text="<%$ resources:rscHowToContact %>" CssClass="firstcolumn"></asp:Label>
        <asp:DropDownList ID="ddlHowContact" runat="server" CssClass="secondcolumn">
				<asp:ListItem Value="phone" Text="<%$ resources:rscContactPhone %>"></asp:ListItem>
				<asp:ListItem Value="mail" Text="<%$ resources:rscContactMail %>"></asp:ListItem>
				<asp:ListItem Value="fax" Text="<%$ resources:rscContactFax %>"></asp:ListItem>
				<asp:ListItem Value="e-mail" Text="<%$ resources:rscContactEmail %>"></asp:ListItem>
        </asp:DropDownList>
    </div>
    <div class="row">
        <asp:Label ID="Label18" runat="server" Text="<%$ resources:rscRepresentCompany %>" CssClass="firstcolumn"></asp:Label>
        <asp:RadioButtonList ID="rblRepresent" runat="server" CssClass="secondcolumn" RepeatDirection="Horizontal">
            <asp:ListItem Selected="True" Value="Yes" Text="<%$ resources:rscYes %>"></asp:ListItem>
            <asp:ListItem Value="No" Text="<%$ resources:rscNo %>"></asp:ListItem>
        </asp:RadioButtonList>
    </div>
    </div>
    <div id="Page2" runat="server">
        <div class="row">
            <asp:Label ID="Label19" runat="server" Text="<%$ resources:rscCompany %>" CssClass="required"></asp:Label>
            <span class="secondcolumn">
                <asp:TextBox ID="txtCompany" runat="server" MaxLength="32"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvCompany" runat="server" ErrorMessage="<%$ resources:rscCompanyRequiredMsg %>" ControlToValidate="txtCompany"></asp:RequiredFieldValidator>
            </span>
        </div>
     <div class="row">
         <asp:Label ID="Label20" runat="server" Text="<%$ resources:rscDivision %>" CssClass="firstcolumn"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtDivision" runat="server" MaxLength="32"></asp:TextBox>
        </span>        
    </div>
    <div class="row">
         <asp:Label ID="Label21" runat="server" Text="<%$ resources:rscAddress %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtCompanyAddress" runat="server" MaxLength="64"></asp:TextBox>
             <asp:RequiredFieldValidator ID="rfvCoAddress" runat="server" ErrorMessage="<%$ resources:rscAddressRequiredMsg %>" ControlToValidate="txtCompanyAddress"></asp:RequiredFieldValidator>
        </span>
    </div>
    <div class="row">
         <span class="firstcolumn">&nbsp;</span><asp:TextBox ID="txtCompanyAddress2" runat="server" CssClass="secondcolumn" MaxLength="64"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label22" runat="server" Text="<%$ resources:rscCity %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtCompanyCity" runat="server"  MaxLength="32"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvCoCity" runat="server" ErrorMessage="<%$ resources:rscCityRequiredMsg %>" ControlToValidate="txtCompanyCity"></asp:RequiredFieldValidator>
         </span>
   </div>
    <div class="row">
        <asp:Label ID="Label23" runat="server" Text="<%$ resources:rscState %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <SalesLogix:PickListControl id="CompanyState" picklistname="State"  runat="server" MustExistInList="true" MaxLength="32"></SalesLogix:PickListControl>
            <asp:RequiredFieldValidator ID="rfvCompanyState" runat="server" ErrorMessage="<%$ resources:rscStateRequiredMsg %>" ControlToValidate="CompanyState"></asp:RequiredFieldValidator>
        </span>
    </div>
    <div class="row">
         <asp:Label ID="Label24" runat="server" Text="<%$ resources:rscPostal %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtCompanyPostal" runat="server" MaxLength="24"></asp:TextBox>
             <asp:RequiredFieldValidator ID="rfvCoPostal" runat="server" ErrorMessage="<%$ resources:rscPostalRequiredMsg %>" ControlToValidate="txtCompanyPostal"></asp:RequiredFieldValidator>
        </span>
   </div>
    <div class="row">
        <asp:Label ID="Label25" runat="server" Text="<%$ resources:rscCountry %>" CssClass="firstcolumn"></asp:Label>
        <span class="secondcolumn">
            <SalesLogix:PickListControl id="CompanyCountry" picklistname="Country"  runat="server" MustExistInList="true" MaxLength="32"></SalesLogix:PickListControl>
        </span>
    </div>
    <div class="row">
         <asp:Label ID="Label26" runat="server" Text="<%$ resources:rscMainPhone %>" CssClass="required"></asp:Label>
         <span class="secondcolumn">
            <asp:TextBox ID="txtCompanyPhone" runat="server"  MaxLength="32"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvCoPhone" runat="server" ErrorMessage="<%$ resources:rscPhoneRequiredMsg %>" ControlToValidate="txtCompanyPhone"></asp:RequiredFieldValidator>
        </span>
   </div>
    <div class="row">
         <asp:Label ID="Label27" runat="server" Text="<%$ resources:rscFax %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtCompanyFax" runat="server" CssClass="secondcolumn" MaxLength="32"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label29" runat="server" Text="<%$ resources:rscTollFree %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtTollFree" runat="server" CssClass="secondcolumn" MaxLength="32"></asp:TextBox>
    </div>
    <div class="row">
         <asp:Label ID="Label28" runat="server" Text="<%$ resources:rscWebUrl %>" CssClass="firstcolumn"></asp:Label>
         <asp:TextBox ID="txtCompanyWeb" runat="server" CssClass="secondcolumn" MaxLength="32"></asp:TextBox>
    </div>
    <div class="row">
        <asp:Label ID="Label30" runat="server" Text="<%$ resources:rscIndustry %>" CssClass="firstcolumn"></asp:Label>
        <span class="secondcolumn">
            <SalesLogix:PickListControl id="Industry" picklistname="Industry"  runat="server" MustExistInList="true" MaxLength="64"></SalesLogix:PickListControl>
        </span>
    </div>
     <div class="row">
         <asp:Label ID="Label31" runat="server" Text="<%$ resources:rscRevenues %>" CssClass="firstcolumn"></asp:Label>
         <span class="secondcolumn">
            $<asp:TextBox ID="txtRevenues" runat="server"  MaxLength="32"></asp:TextBox>/yr
         </span>
    </div>
  </div>
    <div id="Page3" runat="server" class="row">
        <asp:Literal Runat="server" Text="<%$ resources:rscThankYou %>"></asp:Literal>
    </div>
    <div class="buttondiv row" id="ButtonDiv" runat="server">
        <asp:Button ID="btnSubmit" runat="server" Text="<%$ resources:rscSubmit %>" />
        <input type="reset" id="btnReset" runat="server" onserverclick="btnReset_Click" />
    </div>
    </form>
</body>
</html>
