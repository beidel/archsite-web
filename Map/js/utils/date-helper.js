define([],  function() {
    var formatDate = function (d) {
        var curr_date = d.getUTCDate();
        var curr_month = d.getUTCMonth() + 1; //Months are zero based
        var curr_year = d.getUTCFullYear();
        return curr_month + "/" + curr_date + "/" + curr_year;
    },

    convertDateDojoToDb = function (val) {
            //console.log(val);
        parts = val.split("/");
        var returnDate = parts[2] + "-" + parts[0] + "-" + parts[1] + " 12:00:00 AM";
            //console.log("returnDate", returnDate);
        return returnDate;
    },

    getDateNow = function (sep) {
        var d = new Date();
        var month, date
        if ((d.getUTCMonth() + 1) < 10) {
            month = "0" + (d.getUTCMonth() + 1);
        }
        else {
            month = (d.getUTCMonth() + 1);
        }
        if (d.getUTCDate() < 10) {
            date = "0" + d.getUTCDate();
        }
        else {
            date = d.getUTCDate();
        }

        var dateStr = "";

        if (sep == "/") {
            dateStr = month + sep + date + sep + d.getUTCFullYear();
        }
        else {
            dateStr = d.getUTCFullYear() + sep + month + sep + date;
        }

        return dateStr;
    };

    return {
        formatDate: formatDate,
        getDateNow: getDateNow
    };

});