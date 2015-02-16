<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Register_kb.aspx.cs" Inherits="Account_Register" %>

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
        <link  rel="stylesheet" href="<%= ResolveUrl("~/Styles/scarch6.css") %>" type="text/css">

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
    <form id="form1" runat="server">
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
                        <li><a href="<%= ResolveUrl("~/subscribermapredirect.aspx") %>" >Subscriber Map</a></li>
                        <li class="dropdown"><a href="#">Subscription Info</a>
                            <div class="dropdown-menu">
                                <ul>
                                    <li><a href="<%= ResolveUrl("~/overview.aspx") %>" ><span> &#8212 </span>Subscription Overview</a></li>
                                    <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span> &#8212 </span>License Agreement</a></li>
                                    <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" id="current"><span> &#8212 </span>Create Account</a></li>
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
            <h1 class="no-space-bottom no-space-top header"><a href="<%= ResolveUrl("~/default.aspx") %>" >SC <span class="arch">Arch</span><span class="site">Site</span></a> <span class="sublogo">SCIAA&nbsp;+&nbsp;SCDAH</span>
                    <img src="<%= ResolveUrl("~/Images/AS/logos60x89.png") %>" />
            </h1>
        </div><!-- close six logo -->
    </div><!-- close container -->

    <div class="container">
    <div class="grid-6">
        <h2 class="pageTitle">
            Create a New Account
        </h2>
    </div><!-- close 6 -->
    <div class="grid-3">
        <p>
            NOTE:  When you click the Submit button on this form to create a new account you will automatically be directed to the Public View Map regardless of the access level you request. If you are requesting a Subscriber account, you must complete the necessary paperwork as outlined on the <a href="<%= ResolveUrl("~/overview.aspx") %>" >Subscription Overview</a> page before your account will be given access to the Subscriber Map. You will not be contacted by the ArchSite Administrator after you create an account unless the required paperwork has been submitted.
        </p>
    </div>
    <div class="grid-3">
        <p>
            The Subscriber Map has additional data layers, more tools for working with the data and an option to export shapefiles. Please refer to the <a href="<%= ResolveUrl("~/overview.aspx") %>" >Subscription Overview</a> page for an explanation of the differences between the Public and Subscriber Maps.
        </p>
    </div>
    <div class="grid-4 offset-1">
        <fieldset class="log">
            <legend></legend>
            <label for="firstName"><span  class="title">First Name: </span>
                <input type="text" name="firstName" id="firsName" autocomplete="off" />
            </label>
            <label for="lastName"><span class="title">Last Name: </span>
                <input type="text" name="lastName" id="lastName" autocomplete="off" />
            </label>
            <label for="phone"><span class="title">Phone Number: </span>
                <input type="text" name="phone" id="phone" autocomplete="off" placeholder="555-555-5555" />
            </label>
            <label for="email"><span class="title">Email: </span>
                <input type="email" name="email" id="email" autocomplete="off" />
            </label>
            <label for="organization"><span class="title">Organization: </span>
                <input type="text" name="organization" id="organization" autocomplete="off" />
            </label>
            <label for="usrName"><span class="title">Create a User Name: </span>
                <input type="text" name="userName" id="userName" autocomplete="off" />
            </label>
            <label for="pass"><span class="title">Password: </span><span class="smallprint">(Passwords are required to be a minimum of <%= Membership.MinRequiredPasswordLength %> characters in length.)</span>
                <input type="password" name="pass" id="pass" autocomplete="off" />
                
            </label>
            <label for="confirmpass"><span class="title">Confirm Password: </span>
                <input type="password" name="confirmpass" id="confirmpass" autocomplete="off" placeholder="Re-enter your password" />
            </label>
            <label for="securityQuestion"><span class="title2">Select a Security Question: </span><br />
                <select name="securityQuestion" id="securityQuestion">
                    <option> </option>
                    <option>Name of your first pet?</option>
                    <option>City where you were born?</option>
                    <option>Your high school mascot?</option>
                </select>
            </label>
            <label for="securityAnswer"><span class="title">Answer: </span>
                <input type="text" name="securityAnswer" id="securityAnswer" />
            </label>
            <input class="btn btn-large space-bottom white" type="submit" value="Submit" />

           </fieldset><br />

    </div><!-- close 4 -->
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
    </form>
</body>
</html>

