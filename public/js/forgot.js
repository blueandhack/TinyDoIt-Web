$(document).ready(function () {
    $("#forgot").click(function () {
        var username = $("#username").val(),
            email = $("#email").val();
        $.post("/forgot", {username: username, email: email}, function (data) {
            if(data.status == 1){
                $("#tip").html("<div class='alert alert-warning alert-dismissable'>一封包含了重设密码指令的邮件已经发送到你的注册邮箱，按照邮件中的提示，即可重设你的密码。</div>");
            }else{
                $("#tip").html("<div class='alert alert-warning alert-dismissable'>用户名和电子邮件地址不匹配</div>");
            }
        });
    });
});
