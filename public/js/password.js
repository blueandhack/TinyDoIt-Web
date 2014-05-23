$(document).ready(function () {
    $("#changePassword").click(function () {
        var password = $("#password").val(),
            confirm_password = $("#confirm_password").val(),
            uid = getUrlParam("uid"),
            code = getUrlParam("code");
        if ($.trim(password).length < 6) {
            $("#tip").html("<div class='alert alert-warning alert-dismissable'>密码长度必须大于5</div>");
            return false;
        }
        if (password != confirm_password) {
            $("#tip").html("<div class='alert alert-warning alert-dismissable'>两次密码输入不相同</div>");
            return false;
        }
        $.post("/password/verify", {password: password, uid: uid, code: code}, function (data) {
            if (data.status == 1) {
                $("#tip").html("<div class='alert alert-warning alert-dismissable'>已经重新设置密码，即将跳转登录页面</div>");
                setTimeout("window.location.href = '/signin'", 3000);
            } else {
                $("#tip").html("<div class='alert alert-warning alert-dismissable'>无法重设密码请重试</div>");
            }
        });
    });

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]);
        return null; //返回参数值
    }
});