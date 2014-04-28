/**
 * Created by Yoga on 14-3-26.
 */
jQuery(document).ready(function ($) {
    $('.form_date').datetimepicker({
        startDate: new Date(),
        format: "yyyy-mm-dd",
        weekStart: 1,
        todayBtn: 1,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        minuteStep: 2,
        minView: 2,
        language: 'zh-CN'
    });
    $('.form_time').datetimepicker({
        startDate: new Date(),
        format: "HH:ii",
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        minuteStep: 2,
        minView: 0,
        language: 'zh-CN'
    });

});
