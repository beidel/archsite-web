<%@ Page Title="SC ArchSite: About" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="about.aspx.cs" Inherits="about" %>

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
                <li><a href="<%= ResolveUrl("~/disclaimers.aspx") %>" >Disclaimers</a></li>
                <li><a href="<%= ResolveUrl("~/about.aspx") %>" id="current">About</a></li>
            </ul>
        </div><!-- close nav-collapse -->
    </nav></asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="mainContent" Runat="Server">

        <div class="grid-6">
        <h2 class="pageTitle">About SC ArchSite</h2>
        </div>

        <div class="grid-3">
            <h3>History</h3>
            <p>The idea behind the development of SC ArchSite dates back to 1996 when the South Carolina Department of Transportation (SCDOT) awarded a Transportation Enhancement grant to the SCDAH and SCIAA for the digitization of the state’s National Register properties and archaeological sites. Thousands of paper files were digitized and incorporated into a Geographic Information System (GIS) that was made available to consultants, government agencies, and planners at different workstations. The benefits to using GIS technology to manage cultural resource information were quickly realized and the development of additional data layers soon followed.</p>

            <p>In 2004, the SCDOT awarded an additional grant to SCDAH and SCIAA to create a web-based mapping application that would provide increased access to cultural resource information in the state. The goal of the project was two fold: to provide online access to a comprehensive source of cultural resource information and to create a digital process for archaeological site recordation. The proponents of the project met with representatives from the ESRI Charlotte to discuss possible solutions. A decision was made to utilize ESRI’s ArcGIS Server software because of its functionality, usability, and analytical capabilities. ESRI’s professional services were hired to build the application.</p>
        
            <p>In 2012, the ArchSite Steering Committee (SCIAA, SCDOT, SCDAH) conducted an online needs assessment to determine who was using ArchSite, how it was being used and the features users considered most useful, and potential improvements users would like. The response to the survey was strong with 157 people completing the survey. (<a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Needs%20Assessment%20Summary%20Report.pdf" target="_blank">View a PDF of the results.</a>) Using the survey results, the ArchSite Steering Committee negotiated with the University of South Carolina Geography Department to develop a new ArchSite application based on current software and technologies. An interim version was released in 2013, and a beta version in early 2014.</p>

        </div><!-- close three -->
        <div class="grid-3">

                <h3>The Development Team</h3>

                <p>The team responsible for developing the new SC ArchSite brought together individuals from SCDAH, SCIAA, and USC-Geography, again under the auspices of the SCDOT. Members of the University of South Carolina's Department of Geography developed the technical concepts and implemented the solution in a cloud environment.</p>

                <p>Last ArchSite Steering Committee Meeting:  February 10, 2015<br />
                Next ArchSite Steering Committee Meeting:  ~May 15, 2015<br />
                ArchSite II target release date: July 31, 2015</p>
                
                <p class="text-small text-center"><img src="Images/AS/steeringCommittee.png" alt="SC ArchSite Steering Committee">The SC ArchSite Development Team, May 2015</p>

                <h4 class="h5 no-space-bottom">South Carolina Institute of Archaeology and Anthropology</h4>
                    <p class="no-space-top">Jonathan Leader<br />
                    Karen Y. Smith<br />
                    Steven D. Smith<br />
                    Tamara Wilson</p>

                <h4 class="h5 no-space-bottom">South Carolina Department of Archives and History</h4>
                    <p class="no-space-top">Emily Dale<br />
                    Elizabeth Johnson<br />
                    Brad Sauls<br />
                    Sarah A. Stephens</p>

                <h4 class="h5 no-space-bottom">South Carolina Department of Transportation</h4>
                    <p class="no-space-top">Bill Jurgelski<br />
                    Chad C. Long</p>

                <h4 class="h5 no-space-bottom">University of South Carolina Department of Geography</h4>
                    <p class="no-space-top">Michael E. Hodgson, <em>principal investigator</em><br />
                    Tommy Bramble, <em>principal programmer</em><br />
                    Karen Beidel, <em>user experience</em><br />
                    Silvia Piovan (Visiting Scholar, DISSGEA, U. Padova)<em>, website evaluation </em><br />
                    Ian Kramer, <em>programmer</em><br />
                    Kevin Remington<br />
                    Wm. Lynn Shirley, <em>project manager</em>
                </p>

        </div><!-- close three -->


</asp:Content>

