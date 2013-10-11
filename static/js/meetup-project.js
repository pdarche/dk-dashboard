$(document).ready(function(){
    var eventId = window.location.pathname.split('/')
    eventId = eventId[eventId.length-1]

    $('#meetup_nav li').click(function(){
        var el = $(this)
          , attr, path;

        $('.active').removeClass('active')
        el.addClass('active')
        attr = el.attr('id')
        path = '/api/meetups/project/' + eventId

        $.get(path, {attr: attr}, function(data){
          console.log("api response", data)
        })
    })
})

