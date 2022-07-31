$(document).ready(function () {
    var sidebarToggle = $('#sidebar-toggle');
    var sidebar = $('#sidebar');
    var overlay = $('#overlay');

    sidebarToggle.click(toggleSidebar);
    overlay.click(toggleSidebar);

    function toggleSidebar() {
        // Toggle the class of the sidebar elements.
        sidebar.toggleClass('active');
        overlay.toggleClass('active');
    
        // Toggle the class of the menu button.
        sidebarToggle.toggleClass('active');
    
        // Change the text of the menu button.
        if (sidebarToggle.hasClass('active')) {
            sidebarToggle.text("<<");
        } else {
            sidebarToggle.text(">>");
        }
    
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    }
});

