<%@ Page Title="" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="overview.aspx.cs" Inherits="overview" %>

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
                            <li><a href="<%= ResolveUrl("~/overview.aspx") %>" id="current"><span> &#8212 </span>Subscription Overview</a></li>
                            <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span> &#8212 </span>License Agreement</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" ><span> &#8212 </span>Create Account</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>" ><span> &#8212 </span>Change Password</a></li>
                            <li><a href="<%= ResolveUrl("~/ForgotPassword.aspx") %>" ><span> &#8212 </span>Forgot Password</a></li>
                            <li><a href="<%= ResolveUrl("~/userDoc.aspx") %>" ><span> &#8212 </span>User Documentation</a></li>
                        </ul>
                    </div><!-- close dropdown-menu -->
                </li>
                <li><a href="<%= ResolveUrl("~/disclaimers.aspx") %>" >Disclaimers</a></li>
                <li><a href="<%= ResolveUrl("~/about.aspx") %>" >About</a></li>
            </ul>
        </div><!-- close nav-collapse -->
    </nav>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="mainContent" Runat="Server">
        <div class="grid-6">
            <h2 class="pageTitle">Subscription Overview</h2>
        </div>

        <div class="grid-6">
            <h2 class="no-space-bottom">User Level Descriptions</h2>
            <hr class="no-space"/>
        </div><!-- close six -->

        <div class="grid-3">
            <h3>Public View</h3>
            <p>The Public View is for the general public and is available at no cost. Cultural resource data layers available in this application include: National Register Properties, Historic Buildings, and Historical Areas. The National Register data layer contains hyperlinks that allow the user to view nomination forms and photographs of the property. Archaeological site data is available as raw counts per topographic quadrangle.</p>

        </div><!-- close three -->
        <div class="grid-3">
            <div class="grid-6">
                <h3>Subscriber View</h3>
                <p>The Subscriber level view provides data and support to state and local professionals who need access for planning and stewardship activities, such as OCRM permits. The Subscriber View provides access to archaeological site data and restricted National Register properties in addition to the non-restricted data layers available in the Public Viewer. Access to this view requires a vetting procedure to ensure that their request for access of site location data is appropriate. The vetting procedure is in place to protect the resources represented in ArchSite, which are both vulnerable and non-renewable.</p>

                <p>The Subscriber View also includes additional tools for searching the database and provides an export functionality that allows users to obtain digital shapefiles from all of the data layers available with the annual subscription.</p>
                <p>The Subscriber View is password protected and only available to users who sign a <a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf">license agreement</a> and pay a subscription fee.</p>
            </div><!-- close six -->                   
        </div><!-- close three -->


        <div class="grid-6">
            <h2 class="no-space-bottom">Subscription Request Overview</h2>
            <hr class="no-space" />
        </div><!-- close six -->
        <div class="grid-3">
            <h3>Public Level Access</h3>
            <p>Access to the Public View is provided at no cost to interested persons and does not require a signed license agreement. <%--To view the Public Map, create a username and password by completing the "Create a New User Account" online form, which is accessed from the navigation menu.--%> You will automatically be given access to the Public Map and you do not need to do anything further. <%--Future access to the Public Map is available by logging in with your username and password. You will be directed to the Public Map when you click Submit.--%></p>
        </div><!-- close three -->

        <div class="grid-3">
            <div class="grid-6">
                <h3>Subscriber Level Access</h3>
                <p>Access to the Subscriber View requires a signed license agreement between SCIAA/SCDAH and the organization by whom the subscriber is employed or by the individual subscriber if not associated with an organization, and payment of the subscription fee . Each username will be associated with a specific individual within the organization and this name will be attached to any information submitted. As per the license agreement, the organization will be responsible for any miss-use of data obtained from ArchSite. Individual subscribers not affiliated with an organization will be assigned one username and will be solely responsible for the usage of data obtained from ArchSite.</p>
                <h4>Credentials</h4>
                <p>Access to the ArchSite system is not guaranteed and the ArchSite Administrator reserves the right to deny ineligible applicants. Persons requesting Subscriber level access must submit a resume or CV to the ArchSite Administrator for review. Instructions on how to access the Subscriber map will be made available upon approval of the subscription request by the ArchSite Administrator.</p>
            </div>                   
        </div><!-- close three -->

        <div class="grid-6">
            <h2 class="no-space-bottom">Fees</h2>
            <hr class="no-space-top" />
        </div><!-- close six -->

        <div class="grid-3">
            <p>In order to make ArchSite accessible to all interested persons, computers are available at SCDAH and SCIAA during business hours for use by both public viewers and subscribers free of charge. Off-site use by subscribers requires a subscription fee. The fee helps to offset administrative, personnel, and infrastructure costs. Organizations with more than one office location will be required to pay the subscription fee for each office. If an invoice is needed, please contact the ArchSite Administrator.</p>

        </div><!-- close three -->
                <div class="grid-3">
                    <div class="grid-6">
                    <table id="fees">
                      <thead>
                        <tr>
                          <th scope="col">ArchSite Fee Schedule</th>
                          <th scope="col">Annual</th>
                          <th scope="col">Weekly</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="rowgroup" colspan="3"><strong>For-profit entities</strong></th>
                        </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;One office location</td>
                                <td>$600</td>
                                <td>$50</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;Two or more office locations</td>
                                <td>$1200</td>
                                <td>n/a</td>
                            </tr>
                      </tbody>
                      <tbody>
                        <tr>
                          <th scope="rowgroup" colspan="3"><strong>Non-profit entities *</strong></th>
                        </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;One office location</td>
                                <td>$300</td>
                                <td>$30</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;Two or more office locations</td>
                                <td>$600</td>
                                <td>n/a</td>
                            </tr>
                        <tr>
                          <th scope="rowgroup" colspan="3"><strong>Free on-site access</strong></th>
                        </tr>
                            <tr>
                                <td></td>
                                <td>n/a</td>
                                <td>n/a</td>
                            </tr>

                      </tbody>
                    </table>
                        <h5>* Qualifying Non-profits</h5>
                            <ul class="footnote">
                                <li>South Carolina state universities, colleges and other higher education or research institutes</li>
                                <li>County governments engaged in land planning and/or stewardship</li>
                                <li>South Carolina state agencies engaged in land planning and/or stewardship</li>
                                <li>Cities and municipalities engaged in land planning and/or stewardship</li>
                                <li>Certified Local Governments</li>
                                <li>IRS recognized 501 c3 organizations</li>
                            </ul>

                    </div><!-- close six -->                  
                </div><!-- close three -->

    <div class="grid-6">
        <hr />
    </div>
    <div class="grid-4 offset-1 no-space-bottom">
        <p class="no=space-bottom">To request a subscription, please complete the <a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf">Subscription Request & Licence Agreement Form</a> and return it to SCIAA by mail, fax, or email.</p>

    </div>
<%--    <div class="grid-6">
        <div class="grid-2"><h4>By Mail</h4>
            <p>SCIAA<br />
                1321 Pendleton Street<br />
                Columbia, SC 29208<br />
                Attn: Tamara Wilson</p>
        </div>
        <div class="grid-2"><h4>By Phone / Fax</h4>
            <p>ArchSite Office: 803-777-9720<br />
                Direct Line: 803-576-6583<br />
                Fax: 803-254-1338</p>
        </div>
        <div class="grid-2"><h4>By Email</h4>
            <p>TAWILSON@mailbox.sc.edu</p>
        </div>
    </div>--%>
</asp:Content>

