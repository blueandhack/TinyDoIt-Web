$(document).ready(function () {

    var taskId;
    //初始化当前页面
    intThisPage();

    //初始化
    function intThisPage() {
        getTodayPageCount();
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

        var titleVal = $("#newTitle").val();
        var startDateVal = $("#newStartDate").val();
        var descriptionVal = $("#newDescription").val();
        var newTagOne = $("#newTagOne").val(),
            newTagTwo = $("#newTagTwo").val(),
            newTagThree = $("#newTagThree").val();
        //表单验证
        if (titleVal == "" || startDateVal == "" || descriptionVal == "" || newTagOne == "" || newTagTwo == "" || newTagThree == "") {
            alert("请填写完全！");
            return false;
        }

        $.post("addTask" + "?rand=" + Math.floor(Math.random() * 100000), {title: titleVal, start_date: startDateVal, description: descriptionVal, box: $("#newBox").val(), priority: $("#newPriority").val(), tag_one: newTagOne, tag_two: newTagTwo, tag_three: newTagThree  }, function (data) {
            if (data.status == 1) {
                $("#addTaskClose").click();
                goToTodayButton();
                intThisPage();
            }
        });
    });

    //提交更改任务按钮
    $("#changeTaskPost").click(function () {
        var titleVal = $("#changeTitle").val();
        var startDateVal = $("#changeStartDate").val();
        var descriptionVal = $("#changeDescription").val();
        var newTagOne = $("#changeTagOne").val(),
            newTagTwo = $("#changeTagTwo").val(),
            newTagThree = $("#changeTagThree").val();
        if (titleVal == "" || startDateVal == "" || descriptionVal == "" || newTagOne == "" || newTagTwo == "" || newTagThree == "") {
            alert("请填写完全！");
            return false;
        }
        $.post("updateTaskById/" + taskId + "?rand=" + Math.floor(Math.random() * 100000), {title: titleVal, start_date: startDateVal, description: descriptionVal, box: $("#changeBox").val(), priority: $("#changePriority").val(), tag_one: newTagOne, tag_two: newTagTwo, tag_three: newTagThree  }, function (data) {
            if (data.status == 1) {
                $("#changeTaskClose").click();
                goToTodayButton();
                intThisPage();
            }
        });
    });

    //提交分享任务按钮
    $("#shareTaskPost").click(function () {
        var titleVal = $("#shareTitle").val();
        var descriptionVal = $("#shareDescription").val();
        var newTagOne = $("#shareTagOne").val(),
            newTagTwo = $("#shareTagTwo").val(),
            newTagThree = $("#shareTagThree").val();
        if (titleVal == "" || descriptionVal == "" || newTagOne == "" || newTagTwo == "" || newTagThree == "") {
            alert("请填写完全");
            return false;
        }
        $.post("addShareTask/" + "?rand=" + Math.floor(Math.random() * 100000), {user_email: $("#shareAuthor").val(), title: titleVal, description: descriptionVal, tag_one: newTagOne, tag_two: newTagTwo, tag_three: newTagThree  }, function (data) {
            if (data.status == 1) {
                $("#shareTaskClose").click();
//                goToTodayButton();
//                intThisPage();
            }
        });
    });

    //今日分类点击事件
    $("#today").click(function () {
        $("#tomorrow").removeClass("active");
        $("#done").removeClass("active");
        $("#miss").removeClass("active");
        $("#today").addClass("active");
        getTodayPageCount();
    });

    //明日分类点击事件
    $("#tomorrow").click(function () {
        $("#done").removeClass("active");
        $("#today").removeClass("active");
        $("#miss").removeClass("active");
        $("#tomorrow").addClass("active");
        getTomorrowPageCount();
    });

    //已完成分类点击事件
    $("#done").click(function () {
        $("#tomorrow").removeClass("active");
        $("#today").removeClass("active");
        $("#miss").removeClass("active");
        $("#done").addClass("active");
        getDonePageCount();
    });

    //错过分类点击事件
    $("#miss").click(function () {
        $("#tomorrow").removeClass("active");
        $("#done").removeClass("active");
        $("#today").removeClass("active");
        $("#miss").addClass("active");
        getMissPageCount();
    });


    //更改任务按钮
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

            $.getJSON("/getTaskById/" + $(this).val() + "?rand=" + Math.floor(Math.random() * 100000), function (data) {
                var task = eval(data);
                var start_date = moment(task.start_date).format('YYYY-MM-DD');
                $("#changeTitle").val(task.title);
                $("#changeStartDate").val(start_date);
                $("#changeDescription").val(task.description);
                $("#changeTagOne").val(task.tags[0]);
                $("#changeTagTwo").val(task.tags[1]);
                $("#changeTagThree").val(task.tags[2]);
                $("#changeBox").val(task.box);
                $("#changePriority").val(task.priority);
            });
        });
    }

    //完成任务按钮
    function doneButton() {
        $("[id^=doneTask-]").click(function () {
            taskId = $(this).val();
            $.post("doneTaskById/" + $(this).val() + "?rand=" + Math.floor(Math.random() * 100000), {}, function (data) {
                if (data.status == 1) {
                    $("tr[id=" + taskId + "]").remove();
                }
            });
            getTodayTomorrowDoneMiss();
        });
    }

    //获取今日明日已完成错过分类各项任务数
    function getTodayTomorrowDoneMiss() {
        $.getJSON("/getTaskByuId" + "?rand=" + Math.floor(Math.random() * 100000), function (data) {
            var today_badge = 0,
                tomorrow_badge = 0,
                done_badge = 0,
                miss_badge = 0;
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
                if (moment().format('YYYY-MM-DD') > start_date && item.check_task == false) {
                    miss_badge = miss_badge + 1;
                }

            });
            $("#today-badge").html(today_badge);
            $("#tomorrow-badge").html(tomorrow_badge);
            $("#done-badge").html(done_badge);
            $("#miss-badge").html(miss_badge);

        });
    }

    //删除任务按钮
    function deleteButton() {
        $("[id^=deleteTask-]").click(function () {
            if (confirm("确认删除？")) {
                taskId = $(this).val();
                $.get("deleteTaskById/" + $(this).val() + "?rand=" + Math.floor(Math.random() * 100000), function (data) {
                    if (data.status == 1) {
                        $("tr[id=" + taskId + "]").remove();
                    }
                });
                getTodayTomorrowDoneMiss();
            }
        });
    }

    //分享任务按钮
    function shareButton() {
        $("[id^=intShareTask-]").click(function () {
            taskId = $(this).val();
            $.getJSON("/getTaskById/" + $(this).val() + "?rand=" + Math.floor(Math.random() * 100000), function (data) {
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

    //去今天
    function goToTodayButton() {
        $("#tomorrow").removeClass("active");
        $("#done").removeClass("active");
        $("#miss").removeClass("active");
        $("#today").addClass("active");
    }


    //获得今天任务总页数
    function getTodayPageCount() {
        var today = moment().format('YYYY-MM-DD');
        $.getJSON("/getTasksByToday/Date/" + today + "/SumPage" + "?rand=" + Math.floor(Math.random() * 100000), function (result) {
            if (result.count == 1 || result.count == 0) {
                $('#pagination').empty();
                if (result.count == 1) {
                    getTodayTasks(1);
                } else {
                    $("#taskTbody").empty();
                    getTodayTomorrowDoneMiss();
                }
            } else {
                getTodayTasks(1);
                todayPagination(result.count);
            }
        });
    }

    //初始化今日任务分页导航
    function todayPagination(pageCount) {
        //分页参数
        var options = {
            bootstrapMajorVersion: 3,
            currentPage: 1,
            totalPages: pageCount,
            onPageClicked: function (e, originalEvent, type, page) {
                getTodayTasks(page);
            }
        };
        $('#pagination').bootstrapPaginator(options);
    }

    //获得今日任务并分页显示
    function getTodayTasks(page) {
        $("#taskTbody").empty();
        $.getJSON("/getTasksByToday/Date/" + moment().format('YYYY-MM-DD') + "/Page/" + page + "?rand=" + Math.floor(Math.random() * 100000), function (data) {
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                $("#taskTbody").append("<tr id='" + item._id + "'><td><button id='doneTask-" + item._id + "' class='btn btn-default btn-sm' value='" + item._id + "'>标记</button></td><td>" + start_date + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><button id='intChangeTask-" + item._id + "' data-toggle='modal' data-target='#ChangeTask' class='btn btn-primary btn-sm' value='" + item._id + "'>更改</button><span>&nbsp;</span><button id='deleteTask-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>删除</button><span>&nbsp;</span><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#ShareTask' title='觉得不错，分享到分享圈吧！' class='btn btn-info btn-sm' value='" + item._id + "'>分享圈</button></td></tr>");
            });

            //初始化更改任务窗口
            changButton();
            doneButton();
            deleteButton();
            shareButton();
            //获得左侧列表徽章更新
            getTodayTomorrowDoneMiss();
        });
    }


    //获得以前任务总页数
    function getMissPageCount() {
        var today = moment().format('YYYY-MM-DD');
        $.getJSON("/getTasksByMiss/Date/" + today + "/SumPage" + "?rand=" + Math.floor(Math.random() * 100000), function (result) {
            if (result.count == 1 || result.count == 0) {
                $('#pagination').empty();
                if (result.count == 1) {
                    getMissTasks(1);
                } else {
                    $("#taskTbody").empty();
                    getTodayTomorrowDoneMiss();
                }
            } else {
                getMissTasks(1);
                missPagination(result.count);
            }
        });
    }

    //初始化以前任务分页导航
    function missPagination(pageCount) {
        //分页参数
        var options = {
            bootstrapMajorVersion: 3,
            currentPage: 1,
            totalPages: pageCount,
            onPageClicked: function (e, originalEvent, type, page) {
                getMissTasks(page);
            }
        };
        $('#pagination').bootstrapPaginator(options);
    }

    //获得以前任务并分页显示
    function getMissTasks(page) {
        $("#taskTbody").empty();
        $.getJSON("/getTasksByMiss/Date/" + moment().format('YYYY-MM-DD') + "/Page/" + page + "?rand=" + Math.floor(Math.random() * 100000), function (data) {
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                $("#taskTbody").append("<tr id='" + item._id + "'><td><button id='doneTask-" + item._id + "' class='btn btn-default btn-sm' value='" + item._id + "'>标记</button></td><td>" + start_date + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><button id='intChangeTask-" + item._id + "' data-toggle='modal' data-target='#ChangeTask' class='btn btn-primary btn-sm' value='" + item._id + "'>更改</button><span>&nbsp;</span><button id='deleteTask-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>删除</button><span>&nbsp;</span><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#ShareTask' title='觉得不错，分享到分享圈吧！' class='btn btn-info btn-sm' value='" + item._id + "'>分享圈</button></td></tr>");

            });

            //初始化更改任务窗口
            changButton();
            doneButton();
            deleteButton();
            shareButton();
            //获得左侧列表徽章更新
            getTodayTomorrowDoneMiss();
        });
    }


    //获得未来任务总页数
    function getTomorrowPageCount() {
        var today = moment().format('YYYY-MM-DD');
        $.getJSON("/getTasksByTomorrow/Date/" + today + "/SumPage" + "?rand=" + Math.floor(Math.random() * 100000), function (result) {
            if (result.count == 1 || result.count == 0) {
                $('#pagination').empty();
                if (result.count == 1) {
                    getTomorrowTasks(1);
                } else {
                    $("#taskTbody").empty();
                    getTodayTomorrowDoneMiss();
                }
            } else {
                getTomorrowTasks(1);
                tomorrowPagination(result.count);
            }
        });
    }

    //初始化以前任务分页导航
    function tomorrowPagination(pageCount) {
        //分页参数
        var options = {
            bootstrapMajorVersion: 3,
            currentPage: 1,
            totalPages: pageCount,
            onPageClicked: function (e, originalEvent, type, page) {
                getMissTasks(page);
            }
        };
        $('#pagination').bootstrapPaginator(options);
    }

    //获得以前任务并分页显示
    function getTomorrowTasks(page) {
        $("#taskTbody").empty();
        $.getJSON("/getTasksByTomorrow/Date/" + moment().format('YYYY-MM-DD') + "/Page/" + page + "?rand=" + Math.floor(Math.random() * 100000), function (data) {
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                $("#taskTbody").append("<tr id='" + item._id + "'><td><button id='doneTask-" + item._id + "' class='btn btn-default btn-sm' value='" + item._id + "'>标记</button></td><td>" + start_date + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><button id='intChangeTask-" + item._id + "' data-toggle='modal' data-target='#ChangeTask' class='btn btn-primary btn-sm' value='" + item._id + "'>更改</button><span>&nbsp;</span><button id='deleteTask-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>删除</button><span>&nbsp;</span><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#ShareTask' title='觉得不错，分享到分享圈吧！' class='btn btn-info btn-sm' value='" + item._id + "'>分享圈</button></td></tr>");

            });

            //初始化更改任务窗口
            changButton();
            doneButton();
            deleteButton();
            shareButton();
            //获得左侧列表徽章更新
            getTodayTomorrowDoneMiss();
        });
    }


    //获得已完成任务总页数
    function getDonePageCount() {
        $.getJSON("/getTasksPageByDone/SumPage" + "?rand=" + Math.floor(Math.random() * 100000), function (result) {
            if (result.count == 1 || result.count == 0) {
                $('#pagination').empty();
                if (result.count == 1) {
                    getDoneTasks(1);
                } else {
                    $("#taskTbody").empty();
                    getTodayTomorrowDoneMiss();
                }
            } else {
                getDoneTasks(1);
                donePagination(result.count);
            }
        });
    }

    //初始化已完成任务分页导航
    function donePagination(pageCount) {
        //分页参数
        var options = {
            bootstrapMajorVersion: 3,
            currentPage: 1,
            totalPages: pageCount,
            onPageClicked: function (e, originalEvent, type, page) {
                getDoneTasks(page);
            }
        };
        $('#pagination').bootstrapPaginator(options);
    }

    //获得已完成任务并分页显示
    function getDoneTasks(page) {
        $("#taskTbody").empty();
        $.getJSON("/getTasksByDone/Page/" + page + "?rand=" + Math.floor(Math.random() * 100000), function (data) {
            $.each(data, function (idx, item) {
                var start_date = moment(item.start_date).format('YYYY-MM-DD');
                $("#taskTbody").append("<tr id='" + item._id + "'><td><button id='doneTask-" + item._id + "' class='btn btn-default btn-sm' value='" + item._id + "' disabled='disabled'>标记</button></td><td>" + start_date + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><button id='intChangeTask-" + item._id + "' data-toggle='modal' data-target='#ChangeTask' class='btn btn-primary btn-sm' value='" + item._id + "'>更改</button><span>&nbsp;</span><button id='deleteTask-" + item._id + "' class='btn btn-danger btn-sm' value='" + item._id + "'>删除</button><span>&nbsp;</span><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#ShareTask' title='觉得不错，分享到分享圈吧！' class='btn btn-info btn-sm' value='" + item._id + "'>分享圈</button></td></tr>");

            });
            //初始化更改任务窗口
            changButton();
            doneButton();
            deleteButton();
            shareButton();
            getTodayTomorrowDoneMiss();
        });
    }

});