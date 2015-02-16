<%@ Page Title="ArchSite: User Documentation" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="userDoc.aspx.cs" Inherits="userDoc" %>

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
                            <li><a href="<%= ResolveUrl("~/subscribermapredirect.aspx") %>" >Subscriber Map</a></li>
                            <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span> &#8212 </span>License Agreement</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" ><span> &#8212 </span>Create Account</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>" ><span> &#8212 </span>Change Password</a></li>
                            <li><a href="<%= ResolveUrl("~/ForgotPassword.aspx") %>" ><span> &#8212 </span>Forgot Password</a></li>
                            <li><a href="<%= ResolveUrl("~/userDoc.aspx") %>" id="current"><span> &#8212 </span>User Documentation</a></li>
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
        <h2 class="pageTitle">User Documentation</h2>
    </div>
    <div class="grid-3">
        <h3>Video Tutorials</h3>
<%--        <hr class="no-space-top no-space-bottom" />--%>
        <ul class="space-bottom">
            <li><a href="http://scarchsite.com/Map/videos/ArchSite_Intro.mp4">Introduction to ArchSite</a></li>
            <li><a href="http://scarchsite.com/Map/videos/ArchSite_CreateSites.mp4">Create an archeological site</a></li>
        </ul>
    </div>
    <div class="grid-3">
        <h3>User Guides</h3>
<%--        <hr class="no-space-top no-space-bottom" />--%>
        <ul class="no-space-top">
            <li><a href="<%= ResolveUrl("~/PDF/Toolbar.pdf") %>" target="_blank" >Guide to the Interface and Toolbar</a> <span class="text-small">(PDF)</span></li>
        </ul>
    </div>
</asp:Content>

