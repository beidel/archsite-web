// -------------------------------------------------------- //
// Random Rotation for Features //
// -------------------------------------------------------- //
function GetRotatingFeature(pos)
{
var rnd18 = Math.floor(Math.random() * 1);
var allImages18 = new Array();
var allLinks18 = new Array();
var allTitles18 = new Array();
var allPopup18 = new Array();
allImages18[0] = '/portal2/rotatingphotos/m_1272648827.jpg';
allLinks18[0] = 'http://www.sc.edu/news/newsarticle.php?nid=937';
allTitles18[0] = 'Master Scholars summer series registration open';
if (pos == "Left2" && rnd18 > -1)
document.write("<a href=\"" + allLinks18[rnd18] + "\" " + allPopup18[rnd18] + "><img src=\"" + allImages18[rnd18] + "\" alt=\"" + allTitles18[rnd18] + "\" border=\"0\"></a>");

var rnd8 = Math.floor(Math.random() * 3);
var allImages8 = new Array();
var allLinks8 = new Array();
var allTitles8 = new Array();
var allPopup8 = new Array();
allImages8[0] = '/portal2/rotatingphotos/m_1268835686.jpg';
allLinks8[0] = 'http://saeu.sc.edu/testing/';
allTitles8[0] = 'University Test Prep';
allPopup8[0] = 'target="blank"';
allImages8[1] = '/portal2/rotatingphotos/m_1268839051.jpg';
allLinks8[1] = 'http://president.sc.edu/annualReport/index.php';
allTitles8[1] = 'President\'s Report';
allPopup8[1] = 'target="blank"';
allImages8[2] = '/portal2/rotatingphotos/m_1272027826.jpg';
allLinks8[2] = 'http://saeu.sc.edu/web-certificate/';
allTitles8[2] = 'University of South Carolina introduces new Web Design Certificate';
if (pos == "Left3" && rnd8 > -1)
document.write("<a href=\"" + allLinks8[rnd8] + "\" " + allPopup8[rnd8] + "><img src=\"" + allImages8[rnd8] + "\" alt=\"" + allTitles8[rnd8] + "\" border=\"0\"></a>");

var rnd13 = Math.floor(Math.random() * 1);
var allImages13 = new Array();
var allLinks13 = new Array();
var allTitles13 = new Array();
var allPopup13 = new Array();
allImages13[0] = '/portal2/rotatingphotos/m_1242233255.jpg';
allLinks13[0] = 'http://www.sc.edu/media/carolinaminutes.php';
allTitles13[0] = 'Carolina Minutes: Listen to the latest news and notes';
if (pos == "Media1" && rnd13 > -1)
document.write("<a href=\"" + allLinks13[rnd13] + "\" " + allPopup13[rnd13] + "><img src=\"" + allImages13[rnd13] + "\" alt=\"" + allTitles13[rnd13] + "\" border=\"0\"></a>");

var rnd14 = Math.floor(Math.random() * 1);
var allImages14 = new Array();
var allLinks14 = new Array();
var allTitles14 = new Array();
var allPopup14 = new Array();
allImages14[0] = '/portal2/rotatingphotos/m_1242233320.jpg';
allLinks14[0] = 'http://www.sc.edu/media/briefing.php';
allTitles14[0] = 'S.C. in the News: Media coverage of the University';
if (pos == "Media2" && rnd14 > -1)
document.write("<a href=\"" + allLinks14[rnd14] + "\" " + allPopup14[rnd14] + "><img src=\"" + allImages14[rnd14] + "\" alt=\"" + allTitles14[rnd14] + "\" border=\"0\"></a>");

var rnd17 = Math.floor(Math.random() * 1);
var allImages17 = new Array();
var allLinks17 = new Array();
var allTitles17 = new Array();
var allPopup17 = new Array();
allImages17[0] = '/portal2/rotatingphotos/m_1256566970.jpg';
allLinks17[0] = 'http://www.sc.edu/news/features/';
allTitles17[0] = 'Explore Carolina';
if (pos == "Media3" && rnd17 > -1)
document.write("<a href=\"" + allLinks17[rnd17] + "\" " + allPopup17[rnd17] + "><img src=\"" + allImages17[rnd17] + "\" alt=\"" + allTitles17[rnd17] + "\" border=\"0\"></a>");

}
