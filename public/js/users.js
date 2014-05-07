$(document).ready(function () {

    var userId,
        thisPage;

    intThisPage();

    //初始化页面
    function intThisPage() {
        thisPage = 1;
        getPageCount();
    }

    //获得分享任务详细信息并弹出修改对话框
    function changeButton() {
        $("[id^=intChangeUser-]").click(function () {
            $("#changePassword").val("");
            userId = $(this).val();
            $.getJSON("/getUserById/" + userId + "?time=" + new Date().getTime(), function (data) {
                var user = eval(data);
                var create_user_date = moment(user.create).format('YYYY-MM-DD');
                $("#changeUsername").val(user.username);
                $("#changeEmail").val(user.email);
                $("#changeCreate").val(create_user_date);
            });
        });
    }

    //删除分享任务按钮
    function deleteButton() {
        $("[id^=deleteUser-]").click(function () {
            if (confirm("删除此账号还会删除原有的任务记录！确认删除？")) {
                if (confirm("此账号删除后将无法找回！确认删除此账号？")) {
                    userId = $(this).val();
                    $.post("/deleteTaskByuID/" + userId + "?time=" + new Date().getTime(), function (data) {
                        if (data.status == 1) {
                            $.post("/deleteAccountById/" + userId + "?time=" + new Date().getTime(), function (data) {
                                if (data.status == 1) {
                                    alert("成功删除");
                                    $("tr[id=" + userId + "]").remove();
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

    //提交更改用户信息按钮
    $("#changeUserPost").click(function () {
        var passwordVal = $("#changePassword").val();
        if (passwordVal == "") {
            alert("请填写完全");
            return false;
        }
        if(passwordVal.length<5){
            alert("密码长度必须大于5");
            return false;
        }
        console.log(userId);
        $.post("/changePasswordById/" + userId, {password: passwordVal}, function (data) {
            if (data.status == 1) {
                $("#changeUserClose").click();
            }
        });
    });

    //获得总页数
    function getPageCount() {
        $.getJSON("/getUsersPage/SumPage" + "?time=" + new Date().getTime(), function (result) {
            if (result.count == 1 || result.count == 0) {
                $('#pagination').empty();
                if (result.count == 1) {
                    $("#usersTbody").empty();
                    getUsers(1);
                } else {
                    $("#usersTbody").empty();
                }
            } else {
                getUsers(1);
                pagination(result.count);
            }
        });
    }

    //初始化分页导航
    function pagination(pageCount) {
        console.log(pageCount);
        //分页参数
        var options = {
            bootstrapMajorVersion: 3,
            currentPage: 1,
            totalPages: pageCount,
            onPageClicked: function (e, originalEvent, type, page) {
                thisPage = page;
                getUsers(page);
            }
        };
        $('#pagination').bootstrapPaginator(options);
    }

    function getUsers(page) {
        $("#usersTbody").empty();
        $.getJSON("/getUsersByPage/Page/" + page + "?time=" + new Date().getTime(), function (data) {
            $.each(data, function (idx, item) {

                var create_user_date = moment(item.create).format('YYYY-MM-DD');
                $("#usersTbody").append("<tr id='" + item._id + "'><td><img class='img-circle user-avatar' src='" + item.head + "'></td><td>" + item.username + "</td><td>" + item.email + "</td><td>" + create_user_date + "</td><td><button id='intChangeUser-" + item._id + "' data-toggle='modal' data-target='#ChangeUser' class='btn btn-info btn-sm' value='" + item._id + "'>更改用户密码</button>&nbsp;<button id='deleteUser-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>删除</button></td></tr>");
            });
            //初始化更改任务窗口
            changeButton();
            deleteButton();
        });
    }

});
