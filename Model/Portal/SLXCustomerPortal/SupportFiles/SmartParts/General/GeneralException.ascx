<%@ Control Language="C#" ClassName="GeneralException" %>

<script runat="server">
	protected void Page_Load(object sender, EventArgs e)
	{
		if (Page.Request.QueryString["exceptionid"] != null)
		{
            Exception ex = Sage.Platform.Application.ApplicationContext.Current.State[Page.Request.QueryString["exceptionid"]] as Exception;
            if (ex != null)
            {
                ExceptionID.Text = ex.Message;
            }
		}
	}
</script>


<div style="padding:40px 40px;width:100%" class="lbl">
<asp:Label ID="GeneralExeptionMessage" runat="server" meta:resourcekey="ExceptionMessage"></asp:Label>&nbsp;&nbsp;<asp:Label runat="server" ID="ExceptionID"></asp:Label>
</div>