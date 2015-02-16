/* =============================================================
 * drop.js v1.0.0
 * Simple, progressively enhanced dropdown menus.
 * Script by Chris Ferdinandi - http://gomakethings.com
 * Licensed under WTFPL - http://www.wtfpl.net
 * ============================================================= */

$(function () {
    $('.dropdown > a').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active').next($('.dropdown-menu')).toggleClass('active');
        $(this).parent().siblings('.dropdown').removeClass('active').children('a').removeClass('active').next($('.dropdown-menu')).removeClass('active');
        $(this).parent('.dropdown').toggleClass('active');
    });
});





/* =============================================================
 * js-accessibility.js v1.0.0
 * Adds .js class to <body> for progressive enhancement.
 * Script by Chris Ferdinandi - http://gomakethings.com
 * Licensed under WTFPL - http://www.wtfpl.net
 * ============================================================= */

$(function () {
    $('body').addClass('js'); // On page load, add the .js class to the <body> element.
});



/* =============================================================
 * SCRIPTS USED FOR NAVIGATION MENU EXPAND-AND-COLLAPSE.
 * Not required for Dropdown Menus.
 * Learn more about Astro - http://cferdinandi.github.com/astro/
 * ============================================================= */





/* =============================================================
 * astro.js v1.0.0
 * Mobile-first navigation patterns.
 * Script by Chris Ferdinandi - http://gomakethings.com
 * Licensed under WTFPL - http://www.wtfpl.net/
 * ============================================================= */

$(function () {
    $('.nav-toggle').click(function (e) { // When a link or button with the .nav-toggle class is clicked
        e.preventDefault(); // Prevent the default action from occurring

        // Set Variables
        var dataID = $(this).attr('data-target'); // dataID is the data-target value
        var hrefID = $(this).attr('href'); // hrefID is the href value

        // Toggle the Active Class
        if (dataID) { // If the clicked element has a data-target
            $(dataID).toggleClass('active'); // Add or remove the .active class from the element whose ID matches the data-target value
        }
        else { // Otherwise
            $(hrefID).toggleClass('active'); // Add or remove the .active class from the element whose ID matches the href value
        }
    });
});





/* =============================================================
 * js-accessibility.js v1.0.0
 * Adds .js class to <body> for progressive enhancement.
 * Script by Chris Ferdinandi - http://gomakethings.com
 * Licensed under WTFPL - http://www.wtfpl.net
 * ============================================================= */

$(function () {
    $('body').addClass('js'); // On page load, add the .js class to the <body> element.
});