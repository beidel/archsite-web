<%@ Page Title="SC ArchSite" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="DefaultOLD.aspx.cs" Inherits="_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="nav" Runat="Server">
    <ul>
        <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" >Create Account</a></li> 
        <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>" id="A1">Change Password</a></li>
        <li><a href="<%= ResolveUrl("~/userDoc.aspx") %>" >User Documentation</a></li>
        <li><a href="<%= ResolveUrl("~/overview.aspx") %>" >Subscription Overview</a></li>
        <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank">License Agreement</a></li>
        <li><a href="<%= ResolveUrl("~/disclaimers.aspx") %>" >Disclaimers</a></li>
<%--        <li><a href="<%= ResolveUrl("~/Administration/ManageRoles.aspx") %>" >Administration</a>
            <ul>
                <li><a href="<%= ResolveUrl("~/Administration/ManageRoles.aspx") %>" ><span> &#8212 </span>Manage Roles</a></li>
                <li><a href="<%= ResolveUrl("~/Administration/ManageUsers.aspx") %>" ><span> &#8212 </span>Manage Users</a></li>
                <li><a href="<%= ResolveUrl("~/Administration/RoleBasedAuthorization.aspx") %>" ><span> &#8212 </span>Role-Based Authorization</a></li>
                <li><a href="<%= ResolveUrl("~/Administration/UsersAndRoles.aspx") %>" ><span> &#8212 </span>User Role Management</a></li>
                <li><a href="<%= ResolveUrl("~/Administration/CreateUserWizardWithRoles.aspx") %>" ><span> &#8212 </span>Create Account Wizard</a></li>
            </ul>
        </li>--%>
        <li><a href="<%= ResolveUrl("~/about.aspx") %>" >About</a></li>
        <li><a href="<%= ResolveUrl("~/ArchSitePublic.html") %>" >Public Map</a></li>
    </ul>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="mainContent" Runat="Server">
    <div class="grid-6">
        <hr class="no-space-top" />
    </div>
    <div class="grid-3">
        <asp:Label ID="lblErrorMessage" Text="" runat=server CssClass="failureNotification"></asp:Label>
<%--        <h2>SC ArchSite</h2>--%>
        <p>The <a href="http://artsandsciences.sc.edu/sciaa/">South Carolina Institute of Archaeology and Anthropology</a> (SCIAA) and the <a href="http://scdah.sc.gov/Pages/default.aspx">South Carolina Department of Archives and History</a> (SCDAH) are pleased to offer ArchSite, an online cultural resource information system for the state of South Carolina. ArchSite combines data from the state's archaeological and built heritage to provide researchers with a online source for cultural resource information.</p>

        <p>ArchSite includes two applications that have been designed for specific users: Public View and Subscription View.</p>

        <p>Consulting ArchSite does not satisfy the obligation of federal and/or state agencies to consult with the State Historic Preservation Office (SHPO) of the South Carolina Department of Archives and History (SCDAH) pursuant to Section 106 of the National Historic Preservation Act (as amended), and state laws including the Mining Act, the Coastal Zone Management Act, and the Protection of State-Owned or Leased Historic Properties law.</p>

        <p>Funding for the development of ArchSite was provided by the South Carolina Department of Transportation and the Federal Highway Administration.</p>
    </div><!-- close three -->
    <div class="grid-3">

            <div class="announce">
                <h2>Beta Test</h2>
                    <p>Last updated 30 January 2014</p>

                    <p>Click for a list of <a href="http://scarchsite.com/Map/videos/Beta_issues_tracking.pdf" target="_blank">pending and resolved issues</a>.</p>

                    <p>Please let us know if you encounter problems or would like to suggest changes for Archsite. Include the date on which you encountered the problem and versions of both the operating system and browser you used (e.g., Windows 7, Internet Explorer 9).</p>
                    <p>Email this information to the <a href="mailto:archsite2problems@googlegroups.com">ArchSite team</a>.
                    </p>


            </div><!-- close announcements -->
<%--            <div class="grid-6">
                <h2 class="no-space-bottom">Contact Us</h2>
                <hr class="no-space" />
                <div class="grid-half">
                    <p><span class="text-small">SCIAA<br />
                    1321 Pendleton Street<br />
                    Columbia, SC 29208<br />
                    Attn: Tamara Wilson</span></p>
                </div>
                <div class="grid-half">
                    <p><span class="text-small">ArchSite Office: 803-777-9720<br />
                    Direct Line: 803-576-6583<br />
                    Fax: 803-254-1338<br />
                    <a href="mailto:TAWILSON@mailbox.sc.edu">Email the web administrator</a></span>
                    </p>
                </div>
            </div> --%><!-- close 6 -->
    </div><!-- close three -->
</asp:Content>
