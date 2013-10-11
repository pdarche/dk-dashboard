$(document).ready(function(){
    var eventId = window.location.pathname.split('/')
    eventId = eventId[eventId.length-1]

    $('#meetup_nav li').click(function(){
        var el = $(this)
          , attr, path, program;

        $('.active').removeClass('active')
        el.addClass('active')
        attr = el.attr('id')
        path = '/api/meetups/project/' + eventId


        $.when($.get(path, {attr: attr}), $.get('/static/js/templates/meetups/rsvps.handlebars'))
         .done(function(data, template){
          
          var source = $(template[0]).html()
            , template = Handlebars.compile(source)
            , $('#meetup_data').html(template({rsvps:}))      
         })

    })
})