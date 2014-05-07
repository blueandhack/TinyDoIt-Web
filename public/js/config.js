$(document).ready(function () {

    var config = $("#configForm");
    config.validate({
        rules: {
            path:{
                required: true,
                minlength: 5
            },
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
            confirm_email: {
                required: true,
                email: true,
                equalTo: "#email"
            }
        },
        messages: {
            path: {
                required: "请输入路径名",
                minlength: "路径名长度必须大于5"
            },
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
            email: {
                required: "请输入邮件地址",
                email: "请输入正确的邮件地址"
            },
            confirm_email: {
                required: "请输入邮件地址",
                email: "请输入正确的邮件地址",
                equalTo: "与上方输入的邮件地址不相同"
            }
        }
    });

});

