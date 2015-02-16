<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default2.aspx.cs" Inherits="Default2" %>

<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="utf-8">
	    <!-- Force latest available IE rendering engine and Chrome Frame (if installed) -->
	    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

        <!-- Document Title & Description -->
        <title>South Carolina ArchSite</title>
        <meta name="description" content="">

        <!-- Mobile Screen Resizing -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">


        <!-- stylesheet -->
        <link rel="stylesheet" href="<%= ResolveUrl("~/Styles/scarch6.css") %>" type="text/css">

        <!-- HTML5 Shim for IE 6-8 -->
        <!--[if lt IE 9]>
            <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->

        <script>
            (function () {
                if ("-ms-user-select" in document.documentElement.style && navigator.userAgent.match(/IEMobile\/10\.0/)) {
                    var msViewportStyle = document.createElement("style");
                    msViewportStyle.appendChild(
                        document.createTextNode("@-ms-viewport{width:auto!important}")
                    );
                    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
                }
            })();
		</script>

</head>
<body>
    <div class="container">
        <div class="grid-6">
            <div class="grid-6">
                <h3 class="tb"><a href="<%= ResolveUrl("~/default.aspx") %>" >scarchsite.com</a></h3>
            </div><!-- close 6 -->

        </div><!-- close six -->

     </div><!-- close container -->

    <div class="container">
        <div class="grid-6">
            <nav class="nav-wrap">
	        <a class="nav-toggle" href="#nav-menu">Menu &#9660;</a>
	            <div class="nav-collapse" id="nav-menu">
		            <ul class="nav">
                        <li><a href="<%= ResolveUrl("~/PublicView.aspx") %>" >Public View Map</a></li>
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
                        <li><a href="<%= ResolveUrl("~/about.aspx") %>" >About</a></li>
                    </ul>
                </div><!-- close nav-collapse -->
            </nav>
        </div><!-- close six -->
    </div><!-- close container -->

    <div class="container">
        <div class="grid-6 logo">
            <h1 class="no-space-bottom no-space-top header"><a href="default.aspx" >SC <span class="arch">Arch</span><span class="site">Site</span></a> <span class="sublogo">SCIAA&nbsp;+&nbsp;SCDAH</span>
                    <img src="<%= ResolveUrl("~/Images/AS/logos60x89.png") %>" />
            </h1>
        </div><!-- close six logo -->
    </div><!-- close container -->

    <div class="container">
    <div class="grid-6">
        <hr class="no-space-top no-space-top" />

<%--        <h2>SC ArchSite</h2>--%>
    </div>
    <div class="grid-3">
        <p>The <a href="http://artsandsciences.sc.edu/sciaa/">South Carolina Institute of Archaeology and Anthropology</a> (SCIAA) and the <a href="http://scdah.sc.gov/Pages/default.aspx">South Carolina Department of Archives and History</a> (SCDAH) are pleased to offer ArchSite, an online cultural resource information system for the state of South Carolina. ArchSite combines data from the state's archaeological and built heritage to provide researchers with a online source for cultural resource information.</p>

        <p>ArchSite includes two applications that have been designed for specific users: Public View and Subscription View. <span class="attention"><strong>Note: </strong><em>The previous version of ArchSite required all viewers to register and log in; the current version requires that only subscribers do so. Users of the Public View Map may go directly to the map.</em></span></p>

        <div class="announce space-top">
            <h2>Beta Test</h2>
                <p>Last updated 20 May 2014</p>
                <p>Click for a list of <a href="http://scarchsite.com/Map/videos/Beta_issues_tracking.pdf" target="_blank">pending and resolved issues</a>.</p>
                <p>Please let us know if you encounter problems or would like to suggest changes for Archsite. Include the date on which you encountered the problem and versions of both the operating system and browser you used (e.g., Windows 7, Internet Explorer 9).</p>
                <p>Email this information to the <a href="mailto:archsite2problems@googlegroups.com">ArchSite team</a>.</p>
        </div><!-- close announcements -->

    </div><!-- close three -->

    <div class="grid-3">
        <div class="log">
        <p class="text-center"><a href="<%= ResolveUrl("~/PublicView.aspx") %>"  class="btn btn-xlarge">Go to Public<br />View Map</a></p>

        <p class="or"><img src="<%= ResolveUrl("~/Images/AS/flourishLeft.png") %>" / alt="--" /> OR <img src="<%= ResolveUrl("~/Images/AS/flourishRight.png") %>" / alt="--" /></p>
        <fieldset>
            <legend>Log in to Subscription View</legend>
            <label for="userName">User Name
                <input type="text" name="userName" id="userName" placeholder="user name" />
            </label>

            <label for="password">Password
                <input type="text" name="password" id="password" placeholder="password" />
            </label>

            <a href="#" class="btn btn-large space-bottom">Log In to Subscriber Map</a>
            <span class="forget"><a href="<%= ResolveUrl("~/overview.aspx") %>" >Who needs to subscribe?</a><br /><a href="<%= ResolveUrl("~/Account/register.aspx") %>" >Create an account</a><br /><a href="<%= ResolveUrl("~/ForgotPassword.aspx") %>" >I forgot my password</a></span>

        </fieldset>
        </div><!-- close log -->
        <div>
            <p>Consulting ArchSite does not satisfy the obligation of federal and/or state agencies to consult with the State Historic Preservation Office (SHPO) of the South Carolina Department of Archives and History (SCDAH) pursuant to Section 106 of the National Historic Preservation Act (as amended), and state laws including the Mining Act, the Coastal Zone Management Act, and the Protection of State-Owned or Leased Historic Properties law.</p>
            <p>Funding for the development of ArchSite was provided by the South Carolina Department of Transportation and the Federal Highway Administration.</p>
        </div>
    </div><!-- close 3 -->


    </div><!-- close container -->

    <div class="footer">
    <div class="container">
        <div class="grid-6">
            <hr class="no-space-top no-space-bottom" />
            <p class="no-space-bottom"><span class="text-small"><strong>Contact Us</strong></span></p>
        </div><!-- close 6 -->

            <div class="grid-2">
                <p class="no-space-top"><span class="text-small">
                SCIAA<br />
                1321 Pendleton Street<br />
                Columbia, SC 29208<br />
                Attn: Tamara Wilson</span></p>
            </div><!-- close 2 -->

            <div class="grid-2">
                <p class="no-space-top"><span class="text-small">
                ArchSite Office: 803-777-9720<br />
                Direct Line: 803-576-6583<br />
                Fax: 803-254-1338<br />
                <a href="mailto:TAWILSON@mailbox.sc.edu">Email the web administrator</a></span>
                </p>
            </div><!-- close 2 -->

            <div class="grid-2">
                <p class="copyright">
                    SC ArchSite<br />
                    &copy; 2004 &#8211; 2014<br />
                    Maintained by the <a href="http://artsandsciences.sc.edu/sciaa/">South Carolina Institute of Archaeology and Anthropology</a>
                </p>
            </div><!-- close 2 -->
    </div><!-- close container -->
    </div><!-- close footer -->

        <!-- Javascript -->
        <!-- In the footer for better performance -->
        <!--instantiate js plugins-->
<%--        <script type="text/javascript" src="<%= ResolveUrl("~/Javascript/jquery-1.7.1.min.js") %>" ></script>--%>
        <script src="http://code.jquery.com/jquery-1.9.1.js" type="text/javascript"></script>
        <script type="text/javascript" src="<%= ResolveUrl("~/Javascript/dropdowns.js") %>" ></script>

        <!-- Google Analytics -->

        <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-47078138-1']);
            _gaq.push(['_setDomainName', "scarchsite.com"]);
            _gaq.push(['_trackPageview']);
            (function () {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
        </script>
</body>
</html>
