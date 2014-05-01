$(document).ready(function () {

    var register = $("#registerForm");
    register.validate({
        rules: {
            username: {
                required: true,
                minlength: 4
            },
            password: {
                required: true,
                minlength: 5
            },
            confirm_password: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            },
            confirm_email:{
                required: true,
                email: true,
                equalTo:"#email"
            },
            i_agree: {
                required: true
            }
        },
        messages: {
            username: {
                required: "请输入用户名",
                minlength: "用户名长度必须大于4"
            },
            password: {
                required: "请输入密码",
                minlength: "密码长度必须大于5"
            },
            confirm_password: {
                required: "请输入密码",
                minlength: "密码长度必须大于5",
                equalTo: "与上方输入的密码不相同"
            },
            email: "请输入正确的邮件地址",
            confirm_email: {
                email: "请输入正确的邮件地址",
                equalTo: "与上方输入的邮件地址不相同"
            },
            i_agree: "同意此协议方可注册"
        }
    });

});

