$(document).ready(function() {

    // try to get cookie.
    if(! ($.cookie('current-tool'))) {
        $.cookie('current-tool', 'eventb', { expires: 7 });
    }

    var tools = $(".tools");
    var currentToolName = $.cookie('current-tool');
    var currentTool = tools.filter("#"+currentToolName);
    var newToolName = '';
    var newTool;
    tools.hide();
    currentTool.show();

    // show the corresponding div of tools
    $(".hand").click(function() {
        newToolName = $(this).attr("id");
        newTool = tools.filter("#"+newToolName);
        currentToolName = $.cookie('current-tool');
        currentTool = tools.filter("#"+currentToolName);
        currentTool.fadeOut(400, function(){
            newTool.fadeIn();
        });
        $.cookie('current-tool', newToolName, { expires: 7 });
    });
});

