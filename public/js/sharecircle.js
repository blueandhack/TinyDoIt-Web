$(document).ready(function () {

    var taskId;

    intThisPage();

    function intThisPage() {
        $("#shareTaskTbody").empty();
        $.getJSON("/getAllShareTasks", function (data) {
            $.each(data, function (idx, item) {
                var create_task_date = moment(item.create_task_date).format('YYYY-MM-DD');
                $("#shareTaskTbody").append("<tr id='"+item._id+"'><td>"+item.user_email+"</td><td>"+item.title+"</td><td>"+item.description+"</td><td><label class='label label-info'>"+item.tags[0]+"</label> <label class='label label-info'>"+item.tags[1]+"</label> <label class='label label-info'>"+item.tags[2]+"</label></td><td>"+create_task_date+"</td><td><button id='intShareTask-"+item._id+"' data-toggle='modal' data-target='#DoIt' class='btn btn-primary btn-sm' value='"+item._id+"'>Yes! I Do It!</button></td></tr>");

            });

            //初始化更改任务窗口
            doButton();
        });
    }

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
            $.getJSON("/getShareTaskById/" + $(this).val(), function (data) {
                var task = eval(data);
                $("#newTitle").val(task.title);
                $("#newDescription").val(task.description);
                $("#newTagOne").val(task.tags[0]);
                $("#newTagTwo").val(task.tags[1]);
                $("#newTagThree").val(task.tags[2]);
            });
        });
    }

    $("#addTaskPost").click(function () {
        $.post("addTask", {title: $("#newTitle").val(), start_date: $("#newStartDate").val(), description: $("#newDescription").val(), box: $("#newBox").val(), priority: $("#newPriority").val(), tag_one: $("#newTagOne").val(), tag_two: $("#newTagTwo").val(), tag_three: $("#newTagThree").val()  }, function (data) {
            if (data.status == 1) {
                $("#addTaskClose").click();
                intThisPage();
            }
        });
    });

});
