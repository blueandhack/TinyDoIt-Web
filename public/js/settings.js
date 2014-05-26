$(document).ready(function () {

    //获取用户信息
    getInformation();

    //用户信息点击事件
    $("#information").click(function () {
        $("#email").removeClass("active");
        $("#checkEmail").removeClass("active");
        $("#delete").removeClass("active");
        $("#password").removeClass("active");
        $("#information").addClass("active");
        getInformation();
    });
    //更改邮箱点击事件
    $("#email").click(function () {
        $("#checkEmail").removeClass("active");
        $("#information").removeClass("active");
        $("#delete").removeClass("active");
        $("#password").removeClass("active");
        $("#email").addClass("active");
        postEmail();
    });
    //删除账户点击事件
    $("#delete").click(function () {
        $("#checkEmail").removeClass("active");
        $("#email").removeClass("active");
        $("#information").removeClass("active");
        $("#password").removeClass("active");
        $("#delete").addClass("active");
        postDelete();
    });
    //更改密码点击事件
    $("#password").click(function () {
        $("#checkEmail").removeClass("active");
        $("#email").removeClass("active");
        $("#information").removeClass("active");
        $("#delete").removeClass("active");
        $("#password").addClass("active");
        postPassword();
    });
    //更改密码点击事件
    $("#checkEmail").click(function () {
        $("#checkEmail").addClass("active");
        $("#email").removeClass("active");
        $("#information").removeClass("active");
        $("#delete").removeClass("active");
        $("#password").removeClass("active");
        getCheckEmail();
    });

    //获取用户信息
    function getInformation() {
        $("#title").html("<h4>个人信息</h4>");
        $("#content").empty();
        $.getJSON("/getUserByUsername" + "?time=" + new Date().getTime(), function (data) {
            var create_date = moment(data.create).format('YYYY-MM-DD');
            $("#content").html("<form class='form-horizontal'><div class='form-group'><label class='control-label col-sm-2'>用户名</label><p class='form-control-static col-sm-5'>" + data.username + "</p></div><div class='form-group'><label class='control-label col-sm-2'>邮件地址</label><p class='form-control-static col-sm-5'>" + data.email + "</p></div><div class='form-group'><label class='control-label col-sm-2'>账号创建时间</label><p class='form-control-static col-sm-5'>" + create_date + "</p></div></form>");
        });
    }

    //
    function postEmail() {
        $("#title").html("<h4>修改电子邮箱</h4>");
        $.getJSON("/getUserByUsername" + "?time=" + new Date().getTime(), function (data) {
            $("#content").html("<div class='container'><div class='row'><form id='changeEmailForm' class='form-horizontal'><div class='form-group'><label class='control-label col-sm-2'>原始电子邮箱</label><div class='col-sm-4'><input id='originalEmail' type='text' class='form-control' readonly value='" + data.email + "'></div></div><div class='form-group'><label class='control-label col-sm-2'>新的电子邮箱</label><div class='col-sm-4'><input id='emailForm' type='text' class='form-control' placeholder='请输入您要更改的新邮箱地址' required='' autofocus='true'></div></div><div class='form-group'><label class='control-label col-sm-2'>确认电子邮箱</label><div class='col-sm-4'><input id='confirm_emailForm' type='text' class='form-control' placeholder='请确认新邮箱地址' required='' autofocus=''></div></div><div class='col-sm-offset-5'><button type='button' id='changeEmailButton' class='btn btn-primary'>确认更改</button></div></form></div></div>");
            changeEmail();
        });
    }

    function postPassword() {
        $("#title").html("<h4>修改密码</h4>");

        $("#content").html("<div class='container'><div class='row'><form id='changePasswordForm' class='form-horizontal'><div class='form-group'><label class='control-label col-sm-2'>新的密码</label><div class='col-sm-4'><input id='passwordForm' name='passwordForm' type='password' class='form-control' placeholder='请输入您要更改的新密码' required='true' autofocus='true'></div></div><div class='form-group'><label class='control-label col-sm-2'>确认密码</label><div class='col-sm-4'><input id='confirm_passwordForm' name='confirm_passwordForm' type='password' class='form-control' placeholder='请确认新密码' required='true' autofocus=''></div></div><div class='col-sm-offset-5'><button id='changePasswordButton' type='button' class='btn btn-primary'>确认更改</button></div></form></div></div>");
        changePassword();
    }

    function getCheckEmail() {
        $("#title").html("<h4>验证电子邮箱</h4>");
        $.getJSON("/getUserByUsername" + "?time=" + new Date().getTime(), function (data) {
            if (data.checkEmail == true) {
                $("#content").html("<button id='checkEmailButton' class='btn btn-primary' disabled='disabled'>验证邮箱</button><div id='checkEmailContent'><br/><p>邮箱已验证</p></div>");
                postCheckEmail();
            } else {
                $("#content").html("<button id='checkEmailButton' class='btn btn-primary'>验证邮箱</button><div id='checkEmailContent'></div>");
                postCheckEmail();
            }
        });

    }

    function postDelete() {
        $("#title").html("<h4>删除账号</h4>");
        var content = $("#content");
        content.empty();
        content.html("<button id='deleteAccount' class='btn btn-danger'>警告！删除此账号！</button>");
        deleteAccount();
    }

    function deleteAccount() {
        $("#deleteAccount").click(function () {
            if (confirm("删除此账号还会删除原有的任务记录！确认删除？")) {
                if (confirm("此账号删除后将无法找回！确认删除此账号？")) {
                    $.post("/deleteTasksByUsername" + "?time=" + new Date().getTime(), function (data) {
                        if (data.status == 1) {
                            $.post("/deleteAccount" + "?time=" + new Date().getTime(), function (data) {
                                if (data.status == 1) {
                                    alert("成功删除");
                                    window.location.href = '/signout';
                                }
                                if (data.status == 0) {
                                    alert("删除账户出现错误，请重试");
                                }
                            });
                        }
                        if (data.status == 0) {
                            alert("清空账户所有内容出现错误，请重试");
                        }
                    });
                }
            }
        });
    }

    //修改密码
    function changePassword() {
        $("#changePasswordButton").click(function () {
            var password = $("#passwordForm").val(),
                confirmPassword = $("#confirm_passwordForm").val();
            if ($.trim(password).length > 5) {
                if ($.trim(password) == $.trim(confirmPassword)) {
                    $.post("/changePassword", {password: password}, function (data) {
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
                    $.post("/changeEmail", {email: email}, function (data) {
                        if (data.status == 1) {
                            $("#emailForm").val("");
                            $("#confirm_emailForm").val("");
                            $.getJSON("/getUserByUsername" + "?time=" + new Date().getTime(), function (data) {
                                $("#originalEmail").val(data.email);
                            });
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

    function postCheckEmail() {
        $("#checkEmailButton").click(function () {
            $.post("/postCheckEmail", function (data) {
                if (data.status == 1) {
                    $("#checkEmailButton").attr("disabled", "disabled");
                    $("#checkEmailContent").append("<br/><p>邮件已发送，请您前往邮箱接收确认</p>");
                }
            });
        });
    }

});