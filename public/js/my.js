$(document).ready(function () {

    var taskId;
    //初始化当前页面
    intThisPage();

    function intThisPage() {
        $("#taskTbody").empty();
        $.getJSON("/getTaskByuId", function (data) {
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                if (moment().format('YYYY-MM-DD') == start_date && item.check_task == false) {
                    $("#taskTbody").append("<tr id='" + item._id + "'><td><button id='doneTask-" + item._id + "' class='btn btn-default btn-sm' value='" + item._id + "'>Done</button></td><td>" + start_date + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><button id='intChangeTask-" + item._id + "' data-toggle='modal' data-target='#ChangeTask' class='btn btn-primary btn-sm' value='" + item._id + "'>Change</button><span>&nbsp;</span><button id='deleteTask-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>Delete</button><span>&nbsp;</span><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#ShareTask' class='btn btn-info btn-sm' value='" + item._id + "'>Share Circle</button></td></tr>");
                }
            });

            //初始化更改任务窗口
            changButton();
            doneButton();
            deleteButton();
            shareButton();
            getTodayTomorrowDone();
        });
    }

    //初始化添加任务窗口
    $("#intAddTask").click(function () {
        $("#newTitle").val("");
        $("#newStartDate").val("");
        $("#newEndDate").val("");
        $("#newDescription").val("");
        $("#newTagOne").val("");
        $("#newTagTwo").val("");
        $("#newTagThree").val("");
        $("#newBox").val(0);
        $("#newPriority").val(0);
    });

    //提交添加任务按钮
    $("#addTaskPost").click(function () {
        $.post("addTask", {title: $("#newTitle").val(), start_date: $("#newStartDate").val(), description: $("#newDescription").val(), box: $("#newBox").val(), priority: $("#newPriority").val(), tag_one: $("#newTagOne").val(), tag_two: $("#newTagTwo").val(), tag_three: $("#newTagThree").val()  }, function (data) {
            if (data.status == 1) {
                $("#addTaskClose").click();
                intThisPage();
            }
        });
    });

    //提交更改任务按钮
    $("#changeTaskPost").click(function () {
        $.post("updateTaskById/" + taskId, {title: $("#changeTitle").val(), start_date: $("#changeStartDate").val(), description: $("#changeDescription").val(), box: $("#changeBox").val(), priority: $("#changePriority").val(), tag_one: $("#changeTagOne").val(), tag_two: $("#changeTagTwo").val(), tag_three: $("#changeTagThree").val()  }, function (data) {
            if (data.status == 1) {
                $("#changeTaskClose").click();
                intThisPage();
            }
        });
    });

    //提交分享任务按钮
    $("#shareTaskPost").click(function () {
        $.post("addShareTask/", {user_email: $("#shareAuthor").val(), title: $("#shareTitle").val(), description: $("#shareDescription").val(), tag_one: $("#shareTagOne").val(), tag_two: $("#shareTagTwo").val(), tag_three: $("#shareTagThree").val()  }, function (data) {
            if (data.status == 1) {
                $("#shareTaskClose").click();
                intThisPage();
            }
        });
    });


    $("#today").click(function () {
        $("#tomorrow").removeClass("active");
        $("#done").removeClass("active");
        $("#today").addClass("active");
        $("#taskTbody").empty();
        $.getJSON("/getTaskByuId", function (data) {
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                if (moment().format('YYYY-MM-DD') == start_date && item.check_task == false) {
                    $("#taskTbody").append("<tr id='" + item._id + "'><td><button id='doneTask-" + item._id + "' class='btn btn-default btn-sm' value='" + item._id + "'>Done</button></td><td>" + start_date + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><button id='intChangeTask-" + item._id + "' data-toggle='modal' data-target='#ChangeTask' class='btn btn-primary btn-sm' value='" + item._id + "'>Change</button><span>&nbsp;</span><button id='deleteTask-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>Delete</button><span>&nbsp;</span><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#ShareTask' class='btn btn-info btn-sm' value='" + item._id + "'>Share Circle</button></td></tr>");
                }
            });
            //初始化更改任务窗口
            changButton();
            doneButton();
            deleteButton();
            shareButton();
            getTodayTomorrowDone();
        });
    });


    $("#tomorrow").click(function () {
        $("#done").removeClass("active");
        $("#today").removeClass("active");
        $("#tomorrow").addClass("active");
        $("#taskTbody").empty();
        $.getJSON("/getTaskByuId", function (data) {
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                if (moment().format('YYYY-MM-DD') < start_date && item.check_task == false) {
                    $("#taskTbody").append("<tr id='" + item._id + "'><td><button id='doneTask-" + item._id + "' class='btn btn-default btn-sm' value='" + item._id + "'>Done</button></td><td>" + start_date + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><button id='intChangeTask-" + item._id + "' data-toggle='modal' data-target='#ChangeTask' class='btn btn-primary btn-sm' value='" + item._id + "'>Change</button><span>&nbsp;</span><button id='deleteTask-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>Delete</button><span>&nbsp;</span><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#ShareTask' class='btn btn-info btn-sm' value='" + item._id + "'>Share Circle</button></td></tr>");
                }
            });
            //初始化更改任务窗口
            changButton();
            doneButton();
            deleteButton();
            shareButton();
            getTodayTomorrowDone();
        });
    });

    $("#done").click(function () {
        $("#tomorrow").removeClass("active");
        $("#today").removeClass("active");
        $("#done").addClass("active");
        $("#taskTbody").empty();
        $.getJSON("/getTaskByuId", function (data) {
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                if (item.check_task == true) {
                    $("#taskTbody").append("<tr id='" + item._id + "'><td><button id='doneTask-" + item._id + "' class='btn btn-default btn-sm' value='" + item._id + "' disabled='disabled'>Done</button></td><td>" + start_date + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><button id='intChangeTask-" + item._id + "' data-toggle='modal' data-target='#ChangeTask' class='btn btn-primary btn-sm' value='" + item._id + "'>Change</button><span>&nbsp;</span><button id='deleteTask-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>Delete</button><span>&nbsp;</span><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#ShareTask' class='btn btn-info btn-sm' value='" + item._id + "'>Share Circle</button></td></tr>");
                }
            });
            //初始化更改任务窗口
            changButton();
            doneButton();
            deleteButton();
            shareButton();
            getTodayTomorrowDone();
        });
    });


    //任务更改按钮
    function changButton() {
        $("[id^=intChangeTask-]").click(function () {
            $("#changeTitle").val("");
            $("#changeStartDate").val("");
            $("#changeDescription").val("");
            $("#changeTagOne").val("");
            $("#changeTagTwo").val("");
            $("#changeTagThree").val("");
            $("#changeBox").val(0);
            $("#changePriority").val(0);
            taskId = $(this).val();
            $.getJSON("/getTaskById/" + $(this).val(), function (data) {
                var task = eval(data);
                var start_date = moment(task.start_date).format('YYYY-MM-DD');
                $("#changeTitle").val(task.title);
                $("#changeStartDate").val(start_date);
                $("#changeDescription").val(task.description);
                $("#changeTagOne").val(task.tags[0]);
                $("#changeTagTwo").val(task.tags[1]);
                $("#changeTagThree").val(task.tags[2]);
                $("#changeBox").val(task.box);
                console.log(task.box);
                $("#changePriority").val(task.priority);
            });
        });
    }

    function doneButton() {
        $("[id^=doneTask-]").click(function () {
            taskId = $(this).val();
            $.post("doneTaskById/" + $(this).val(), {}, function (data) {
                if (data.status == 1) {
                    $("tr[id=" + taskId + "]").remove();
                }
            });
            getTodayTomorrowDone();
        });
    }

    function getTodayTomorrowDone() {
        $.getJSON("/getTaskByuId", function (data) {
            var today_badge = 0,
                tomorrow_badge = 0,
                done_badge = 0;
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                if (moment().format('YYYY-MM-DD') == start_date && item.check_task == false) {
                    today_badge = today_badge + 1;
                }
                if (moment().format('YYYY-MM-DD') < start_date && item.check_task == false) {
                    tomorrow_badge = tomorrow_badge + 1;
                }
                if (item.check_task == true) {
                    done_badge = done_badge + 1;
                }

            });
            $("#today-badge").html(today_badge);
            $("#tomorrow-badge").html(tomorrow_badge);
            $("#done-badge").html(done_badge);
        });
    }

    function deleteButton() {
        $("[id^=deleteTask-]").click(function () {
            taskId = $(this).val();
            $.get("deleteTaskById/" + $(this).val(), function (data) {
                if (data.status == 1) {
                    $("tr[id=" + taskId + "]").remove();
                }
            });
            getTodayTomorrowDone();
        });
    }

    function shareButton() {
        $("[id^=intShareTask-]").click(function () {
            taskId = $(this).val();
            $.getJSON("/getTaskById/" + $(this).val(), function (data) {
                var task = eval(data);
                $("#shareAuthor").val(task.user_email);
                $("#shareTitle").val(task.title);
                $("#shareDescription").val(task.description);
                $("#shareTagOne").val(task.tags[0]);
                $("#shareTagTwo").val(task.tags[1]);
                $("#shareTagThree").val(task.tags[2]);
            });
        });

    }

});