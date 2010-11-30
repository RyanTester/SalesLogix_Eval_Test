using System;
using System.Web;
using Sage.Platform.Application.UI.Web;

namespace SlxClient
{
	public partial class ExternalPage : ApplicationPage
	{	
        #region Page Lifetime Overrides
        protected override void OnPreInit(EventArgs e)
        {
            base.OnPreInit(e);
            HttpContext.Current.Response.Redirect("Default.aspx");
        }
        #endregion
		
    }
}
