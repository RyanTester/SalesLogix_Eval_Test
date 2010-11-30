<%@ WebHandler Language="C#" Class="SparkHandler" %>

/*
Copyright (c) 2005 Eric W. Bachtal

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial 
  portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO 
EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE 
USE OR OTHER DEALINGS IN THE SOFTWARE.    

-------------

http://ewbi.blogs.com/develops/2005/07/sparklines.html

Based on spark.py, Copyright 2005, Joe Gregorio.  See http://bitworking.org/projects/sparklines/ 
for more on Mr. Gregorio's original Python-based sparklines work, including an explanation of the 
parameters expected for the smooth and disrete types.

See http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001OR&topic_id=1&topic= for more 
on sparklines from Edward Tufte, the man who invented them.

The bars sparkline type represents custom logic not found in the original spark.py.  Like the other
sparklines, it takes a "d" parameter containing a list of comma-delimited values between 0 and 100.
In addition, it accepts optional "bar-colors", "bar-height", "width", "shadow-color", and "align-right"
parameters.

This code doesn't really represent a best-practice C# ASP.NET IHttpHandler.  However, it was intended to 
replicate Mr. Gregorio's original Python code and its run-time behavior, not produce an outstanding example 
of C# ASP.NET programming.  It's behavior differs from Mr. Gregorio's code in the following ways:

- It includes support for a "bars" type.
- It includes error traps in the plot routines that will result in the error mark (an "X") being returned
  if there are problems with the parameters.  Mr. Gregorio's code will simply return an untrapped Python
  error, which, because it follows the content-type already being set, results in the browser reporting the 
  graphic as invalid.
- It ignores non-numeric values in the "d" parameter, whereas Mr. Gregorio's code returns an untrapped Python
  error.
- It is more forgiving of incomplete RGB colors (i.e., "#CE").

v2.0 7/16/2005 ewb
  - Added support for barlines.

v2.1 8/3/2005 ewb
  - Added new options for marking a normal range beneath smooth sparklines.  See updates to Edward Tufte's
    Beautiful Evidence http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001OR&topic_id=1&topic=.
  - Changed smooth sparkline line color to avoid dithering.

v2.2 8/25/2005 ewb
  - Added support for transparent backgrounds via the new transparent=true/false parameter.  Would liked to 
    have made transparent backgrounds the default behavior, but needed to preserve backward compatibility 
    (maybe someone was counting on the White background?), and it does require additional processing and so 
    isn't as fast.  However, I did change the error graphic so it is always transparent.  The background is 
    made transparent by setting the White palette entry transparent.  This means it affects any use of White.  
    So, if White is used for anything other than the background (like bar, bar-shadow, min/max/final ticks, 
    etc.), it will be transparent there, too.  See these resources for additional information on GIF 
    transparency with .NET:
      http://support.microsoft.com/default.aspx?scid=kb;EN-US;Q319061
      http://www.bobpowell.net/giftransparency.htm    
      http://msdn.microsoft.com/library/en-us/dnaspp/html/colorquant.asp
      
v2.3 8/31/2005 ewb
  - Added support for auto-scaling results (i.e., the series of values passed via the "d" parameter) to the
    expected range of 0-100 using a new scale=true parameter.  Note that the smooth sparkline's range-lower 
    and range-upper parameters are still expected to reflect a 0-100 range, as is the discrete sparkline's
    upper parameter.  For bars, when scaling, a decision had to be made about what to do with unavoidable
    0-bar.  Rather than eliminate it or always show it as a blank bar, the descision was made to give it a
    value of 1.
  
*/

using System.Net;
using System.Web;

using Sage.Platform.Sparklines;

public class SparkHandler : IHttpHandler
{
    const string VERSION = "2.5";
    private HttpRequest _request;
    private HttpResponse _response;
    
    public void ProcessRequest(HttpContext context)
    {
        _request = context.Request;
        _response = context.Response;

        if (!(("GET" == _request.RequestType) || ("HEAD" == _request.RequestType)))
            error(HttpStatusCode.MethodNotAllowed, "Method Not Allowed");

        SparklineBase spark = null;
        string type = GetArg("type", "").ToLower();
        switch (type)
        {
            case "discrete":
                spark = new Discrete(_request.QueryString);
                break;
            case "smooth":
                spark = new Smooth(_request.QueryString);
                break;
            case "bars":
                spark = new Bar(_request.QueryString);
                break;
            case "impulse":
                spark = new Impulse(_request.QueryString);
                break;
            case "column":
                spark = new Column(_request.QueryString);
                break;
            case "pie":
                spark = new Pie(_request.QueryString);
                break;
            case "bullet":
                spark = new Bullet(_request.QueryString);
                break;
            default:
                error();
                break;
        }
        
        if (spark != null)
        {
            ok();
            _response.BinaryWrite(spark.PlotImage().ToArray());
        }
        else
        {
            _response.BinaryWrite(SparklineBase.ErrorImage().ToArray());
        }


    }

    public bool IsReusable
    {
        get { return false; }
    }

    // --------------------------------------------------------------------
    void error()
    {
        error(HttpStatusCode.BadRequest, "Bad Request");
    }
    void error(HttpStatusCode statusCode, string statusDescription)
    {
        SetResponse(statusCode, statusDescription);
        _response.BinaryWrite(SparklineBase.ErrorImage().ToArray());
        _response.End();
    }
    protected void ok()
    {
        SetResponse(HttpStatusCode.OK, "Ok");
    }




    protected string GetArg(string argName, string argDefault)
    {
        string arg = _request.QueryString[argName];
        if (null == arg) return argDefault;
        return arg;
    }

    void SetResponse(HttpStatusCode statusCode, string statusDescription)
    {
        _response.ContentType = "image/gif";
        _response.StatusCode = (int)statusCode;
        _response.StatusDescription = statusDescription;
        _response.AddHeader("ETag", ((_request.QueryString + VERSION)).GetHashCode().ToString());
        _response.Flush();
    }




}