<%@ Page Title="SC ArchSite: Disclaimers" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="disclaimers.aspx.cs" Inherits="disclaimers" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="nav" Runat="Server">
    <nav class="nav-wrap">
	<a class="nav-toggle" href="#nav-menu">Menu &#9660;</a>
	    <div class="nav-collapse" id="nav-menu">
		    <ul class="nav">
                <li><a href="<%= ResolveUrl("~/PublicView.aspx") %>" >Public View Map</a></li>
                <li><a href="<%= ResolveUrl("~/subscribermapredirect.aspx") %>" >Subscriber Map</a></li>
                <li class="dropdown"><a href="#">Subscription Info</a>
                    <div class="dropdown-menu">
                        <ul>
                            <li><a href="<%= ResolveUrl("~/overview.aspx") %>" ><span> &#8212 </span>Subscription Overview</a></li>
                            <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span> &#8212 </span>License Agreement</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" ><span> &#8212 </span>Create Account</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>" ><span> &#8212 </span>Change Password</a></li>
                            <li><a href="<%= ResolveUrl("~/ForgotPassword.aspx") %>" ><span> &#8212 </span>Forgot Password</a></li>
                            <li><a href="<%= ResolveUrl("~/userDoc.aspx") %>" ><span> &#8212 </span>User Documentation</a></li>
                        </ul>
                    </div><!-- close dropdown-menu -->
                </li>
                <li><a href="<%= ResolveUrl("~/disclaimers.aspx") %>" id="current">Disclaimers</a></li>
                <li><a href="<%= ResolveUrl("~/about.aspx") %>" >About</a></li>
            </ul>
        </div><!-- close nav-collapse -->
    </nav>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="mainContent" Runat="Server">

    <div class="grid-6">
        <h2 class="pageTitle">Disclaimers</h2>
    </div>
    
    <div class="grid-2">
        <p>The data layers in ArchSite were compiled from various sources, including government agencies, non-profit organizations, and cultural resource consultants. Although every effort has been made to ensure the quality of the spatial and attribute information, the accuracy of the data cannot be guaranteed. In some cases, properties have been demolished since surveys were performed or a property’s address may have changed.</p>
        <p>Certain data, such as the cultural resource survey area data layer, represent incomplete data sets and should not be interpreted as a comprehensive resource. Researchers are therefore encouraged to review paper files (e.g., state site forms and reports) and additional sources of information to ensure the quality of the data.   Please contact us if you become aware of any errors in the data.</p>
    </div><!-- close two -->
    <div class="grid-2">
        <p>We are continually editing our maps to improve accuracy of position and information. No warranties, expressed or implied, are provided for the positional or thematic accuracy of the data herein, its use, or its interpretation. Although it is periodically updated, this information may not reflect the data currently on file and SCIAA or SCDAH assumes no liability either for any errors, omissions, or inaccuracies in the information provided regardless of the cause of such or for any decision made, action taken, or action not taken by the user in reliance upon any maps or information provided herein. Use of the ArchSite system indicates your acceptance of these terms.</p>
    </div><!-- close two -->
    <div class="grid-2">
        <p>The South Carolina SHPO began submitting electronic National Register nominations to the National Park Service in 2014. The new process requires Lat/Long data along with a map, typically from Google Earth or Bing. This data is more accurate than the older data, causing location discrepancies between the old and new data since prior to 2014 properties were plotted on USGS topographic maps. Previous National Register properties will not be corrected since their location in GIS is how they appear in their nomination maps.</p>                        
    </div><!-- close two -->



</asp:Content>

