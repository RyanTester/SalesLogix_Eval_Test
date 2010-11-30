<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
  	<title>Sage CRM SalesLogix - More Information</title>
	
<style>
BODY {
  background-color: white; /* #F2F2ED; */
	font-family: Tahoma, MS San Serif;
	font-size: 8pt;
	margin-left: 5px;
	margin-top: 5px;
	margin-right: 5px;
	behavior: url(/slxweb/jscript/behaviors/pageinfo.htc);
	border-width:0px;
}

TD {
	font-size: 8pt;
}


.outside {
	border: solid 1px black;
	width:350px;
}

.Header {
	font-size: 12pt;
	font-weight: bold;
}

.padleft {
	padding-left: 20px;
}

.padtop {
	padding-top: 10px;
}
</style>

</head>
<body>
<table cellpadding="5" cellspacing="0" border="0" class="outside">
	<tr>
		<td>
			<p>
				<div class="Header"><asp:label id="lblExtFeatures" runat="server" Text="Extended Features" meta:resourcekey="lblExtFeatures"></asp:label></div>
				<div><asp:label id="lblExtInfo" runat="server" Text="You may use optional extended features in the Web Client which may require additional components to be downloaded and/or require additional bandwidth to use." meta:resourcekey="lblExtInfo"></asp:label></div>
			</p>
			<p>
				<div class="Header"><asp:label id="lblActiveMail" runat="server" Text="ActiveMail" meta:resourcekey="lblActiveMail"></asp:label></div>
				<div><asp:label id="lblActiveMailInfo" runat="server" Text="ActiveMail includes Mail Merge and Outlook Send SLX features.  ActiveMail requires a ActiveX and may require an additional download." meta:resourcekey="lblActiveMailInfo"></asp:label></div>
				<div class="padtop"><asp:label id="lblDownloadInfo" runat="server" Text="ActiveMail download is approximately 4MB.  Download times are approximately (estimate only, your time may vary):" meta:resourcekey="lblDownloadInfo"></asp:label></div>
				<div class="padtop">
					<table cellpadding="0" cellspacing="0" border="0">
						<tr>
							<td><asp:label id="lblModem28k" runat="server" Text="28.8K modem" meta:resourcekey="lblModem28k"></asp:label></td>
							<td>&nbsp;=</td>
							<td class="padleft"><asp:label id="lblMin28" runat="server" Text="28 minutes" meta:resourcekey="lblMin28"></asp:label></td>
						</tr>
						<tr>
							<td><asp:label id="lblModem56K" runat="server" Text="56K modem" meta:resourcekey="lblModem56k"></asp:label></td>
							<td>&nbsp;=</td>
							<td class="padleft"><asp:label id="lblmin15" runat="server" Text="15 minutes" meta:resourcekey="lblMin15"></asp:label></td>
						</tr>
						<tr>
							<td><asp:label id="lblDSLModem" runat="server" Text="DSL/Cable Modem" meta:resourcekey="lblModemDSL"></asp:label></td>
							<td>&nbsp;=</td>
							<td class="padleft"><asp:label id="lblMin1" runat="server" Text="1 minute" meta:resourcekey="lblMin1"></asp:label></td>
						</tr>
					</table>
				</div>
			</p>
			
		</td>
	</tr>
</table>


</body>
</html>
