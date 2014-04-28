$(document).ready(function () {

    var taskId;

    intThisPage();

    //初始化页面
    function intThisPage() {
        getPageCount();
    }

    //获得分享任务详细信息
    function doButton() {
        $("[id^=intShareTask-]").click(function () {
            $("#newTitle").val("");
            $("#newStartDate").val("");
            $("#newDescription").val("");
            $("#newTagOne").val("");
            $("#newTagTwo").val("");
            $("#newTagThree").val("");
            $("#newBox").val(0);
            $("#newPriority").val(0);
            taskId = $(this).val();
            $.getJSON("/getShareTaskById/" + $(this).val()+ "?rand=" + Math.floor(Math.random()*100000), function (data) {
                var task = eval(data);
                $("#newTitle").val(task.title);
                $("#newDescription").val(task.description);
                $("#newTagOne").val(task.tags[0]);
                $("#newTagTwo").val(task.tags[1]);
                $("#newTagThree").val(task.tags[2]);
            });
        });
    }

    //添加任务
    $("#addTaskPost").click(function () {
        var titleVal = $("#newTitle").val();
        var startDateVal = $("#newStartDate").val();
        var descriptionVal = $("#newDescription").val();
        var newTagOne = $("#newTagOne").val(),
            newTagTwo = $("#newTagTwo").val(),
            newTagThree = $("#newTagThree").val();
        if (titleVal == "" || startDateVal == "" || descriptionVal == "" || newTagOne == "" || newTagTwo == "" || newTagThree == "") {
            alert("请填写完全");
            return false;
        }

        $.post("addTask"+ "?rand=" + Math.floor(Math.random()*100000), {title: titleVal, start_date: startDateVal, description: descriptionVal, box: $("#newBox").val(), priority: $("#newPriority").val(), tag_one: newTagOne, tag_two: newTagTwo, tag_three: newTagThree  }, function (data) {
            if (data.status == 1) {
                $("#addTaskClose").click();
                //intThisPage();
            }
        });
    });

    //获得总页数
    function getPageCount() {
        $.getJSON("/getShareTasksSumPage"+ "?rand=" + Math.floor(Math.random()*100000), function (result) {
            if (result.count == 1 || result.count == 0) {
                $('#pagination').empty();
                if (result.count == 1) {
                    $("#shareTaskTbody").empty();
                    getShareTasks(1);
                } else {
                    $("#shareTaskTbody").empty();
                }
            } else {
                getShareTasks(1);
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
                getShareTasks(page);
            }
        };
        $('#pagination').bootstrapPaginator(options);
    }

    function getShareTasks(page){
        $("#shareTaskTbody").empty();
        $.getJSON("/getShareTasksByPageCount/Page/" + page+ "?rand=" + Math.floor(Math.random()*100000), function (data) {
            $.each(data, function (idx, item) {
                var create_task_date = moment(item.create_task_date).format('YYYY-MM-DD');
                $("#shareTaskTbody").append("<tr id='" + item._id + "'><td>" + item.user_email + "</td><td>" + item.title + "</td><td>" + item.description + "</td><td><label class='label label-info'>" + item.tags[0] + "</label> <label class='label label-info'>" + item.tags[1] + "</label> <label class='label label-info'>" + item.tags[2] + "</label></td><td>" + create_task_date + "</td><td><button id='intShareTask-" + item._id + "' data-toggle='modal' data-target='#DoIt' title='将此任务添加到您的任务列表？' class='btn btn-primary btn-sm' value='" + item._id + "'>Yes! I Do It!</button></td></tr>");

            });
            //初始化更改任务窗口
            doButton();
        });
    }
});
