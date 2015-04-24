define([ "esri/request"],
    function (request) {
        var sendEmail = function (emailMsg, emailTo) {
            var layersRequest = esriRequest({
                url: "http://localhost/ArchSite.org/EmailService.asmx/SendPwd_toUserEmail",
                content: { TO_email_address: emailTo, email_msg: emailMsg, Service_Password: "2jds0dsa3lsd2fk@d./skdls7f"},
                handleAs: "json",
                callbackParamName: "callback"
            });

            layersRequest.then(
              function (response) {
                  console.log("Success", response);
              }, function (error) {
                  console.log("Error: ", error.message);
              });
        };

        return {
            sendEmail: sendEmail
        };

    }
);
