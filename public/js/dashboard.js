$(document).ready(function () {

    //获取用户信息
    getInformation();

    //用户信息点击事件
    $("#information").click(function () {
        $("#email").removeClass("active");
        $("#delete").removeClass("active");
        $("#password").removeClass("active");
        $("#information").addClass("active");
        getInformation();
    });
    //更改邮箱点击事件
    $("#email").click(function () {
        $("#information").removeClass("active");
        $("#delete").removeClass("active");
        $("#password").removeClass("active");
        $("#email").addClass("active");
        postEmail();
    });
    //删除账户点击事件
    $("#delete").click(function () {
        $("#email").removeClass("active");
        $("#information").removeClass("active");
        $("#password").removeClass("active");
        $("#delete").addClass("active");
        postDelete();
    });
    //更改密码点击事件
    $("#password").click(function () {
        $("#email").removeClass("active");
        $("#information").removeClass("active");
        $("#delete").removeClass("active");
        $("#password").addClass("active");
        postPassword()
    });

    //获取用户信息
    function getInformation() {
        $("#title").html("<h4>站点信息</h4>");
        $("#content").empty();
        $.getJSON("/getUsersCount" + "?time=" + new Date().getTime(), function (data) {
            $("#content").html("<form class='form-horizontal' id='content-more'><div class='form-group'><label class='control-label col-sm-3'>注册用户总数</label><p class='form-control-static col-sm-5'>" + data.count + "</p></div></form>");
        });
        $.getJSON("/getShareTasksCount" + "?time=" + new Date().getTime(), function (data) {
            $("#content-more").append("<div class='form-group'><label class='control-label col-sm-3'>用户分享任务总数</label><p class='form-control-static col-sm-5'>" + data.count + "</p></div>");
        });
        $.getJSON("/getTasksCount" + "?time=" + new Date().getTime(), function (data) {
            $("#content-more").append("<div class='form-group'><label class='control-label col-sm-3'>用户私有任务总数</label><p class='form-control-static col-sm-5'>" + data.count + "</p></div>");
        });
    }

    //
    function postEmail() {
        $("#title").html("<h4>修改管理员电子邮箱</h4>");
        $("#content").html("<div class='container'><div class='row'><form id='changeEmailForm' class='form-horizontal'><div class='form-group'><label class='control-label col-sm-2'>新的电子邮箱</label><div class='col-sm-4'><input id='emailForm' type='text' class='form-control' placeholder='请输入您要更改的新邮箱地址' required='' autofocus='true'></div></div><div class='form-group'><label class='control-label col-sm-2'>确认电子邮箱</label><div class='col-sm-4'><input id='confirm_emailForm' type='text' class='form-control' placeholder='请确认新邮箱地址' required='' autofocus=''></div></div><div class='col-sm-offset-5'><button type='button' id='changeEmailButton' class='btn btn-primary'>确认更改</button></div></form></div></div>");
        changeEmail();
    }

    function postPassword() {
        $("#title").html("<h4>修改管理员密码</h4>");

        $("#content").html("<div class='container'><div class='row'><form id='changePasswordForm' class='form-horizontal'><div class='form-group'><label class='control-label col-sm-2'>新的密码</label><div class='col-sm-4'><input id='passwordForm' name='passwordForm' type='password' class='form-control' placeholder='请输入您要更改的新密码' required='true' autofocus='true'></div></div><div class='form-group'><label class='control-label col-sm-2'>确认密码</label><div class='col-sm-4'><input id='confirm_passwordForm' name='confirm_passwordForm' type='password' class='form-control' placeholder='请确认新密码' required='true' autofocus=''></div></div><div class='col-sm-offset-5'><button id='changePasswordButton' type='button' class='btn btn-primary'>确认更改</button></div></form></div></div>");
        changePassword();
    }

    function postDelete() {
        $("#title").html("<h4>删除管理员账号</h4>");
        var content = $("#content");
        content.empty();
        content.html("<button id='deleteAccount' class='btn btn-danger'>警告！删除此账号！</button>");
        deleteAccount();
    }

    function deleteAccount() {
        $("#deleteAccount").click(function () {

            if (confirm("此账号删除后将无法找回！同时也将删除配置文件，您需要重新通过/admin/config路径再次配置，确认删除此账号？")) {
                $.post("/deleteAdminAccount" + "?time=" + new Date().getTime(), function (data) {
                    if (data.status == 1) {
                        alert("成功删除");
                        window.location.href = '/';
                    }
                    if (data.status == 0) {
                        alert("删除账户出现错误，请重试");
                    }
                });
            }
        });
    }

    //修改密码
    function changePassword() {
        $("#changePasswordButton").click(function () {
            var password = $("#passwordForm").val(),
                confirmPassword = $("#confirm_passwordForm").val();
            if ($.trim(password).length >= 5) {
                if ($.trim(password) == $.trim(confirmPassword)) {
                    $.post("/changeAdminPassword", {password: password}, function (data) {
                        if (data.status == 1) {
                            $("#passwordForm").val("");
                            $("#confirm_passwordForm").val("");
                            alert("密码修改成功");
                        }
                        if (data.status == 0) {
                            alert("密码未能修改成功请重试");
                        }
                    });
                } else {
                    alert("两次输入的密码不同");
                    return false;
                }
            } else {
                alert("密码长度必须大于5");
                return false;
            }
        });
    }

    //修改电子邮箱
    function changeEmail() {
        $("#changeEmailButton").click(function () {
            var email = $("#emailForm").val(),
                confirmEmail = $("#confirm_emailForm").val();
            var mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            if (mailReg.test($.trim(email))) {
                if ($.trim(email) == $.trim(confirmEmail)) {
                    $.post("/changeAdminEmail", {email: email}, function (data) {
                        if (data.status == 1) {
                            $("#emailForm").val("");
                            $("#confirm_emailForm").val("");
                            alert("邮箱修改成功");
                        }
                        if (data.status == 2) {
                            alert("此邮箱已存在，请重新输入");
                        }
                        if (data.status == 0) {
                            alert("邮箱未能修改成功请重试");
                        }
                    });
                } else {
                    alert("两次输入的邮箱不相同，请重新输入");
                    return false;
                }
            } else {
                alert("您输入的邮箱格式不正确，请重新输入");
                return false;
            }
        });
    }

});