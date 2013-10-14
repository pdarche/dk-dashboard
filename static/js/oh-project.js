$(document).ready(function(){
    var eventData
    var eventId = window.location.pathname.split('/')
    eventId = eventId[eventId.length-1]

    $.getJSON('/api/office-hours/project/' + eventId, {attr:'event'}, function(data){
      eventData = data
    })

    $('#meetup_nav li').click(function(){
        var el = $(this)
          , attr, path, program
          , templateData;

        $('.active').removeClass('active');
        el.addClass('active');
        attr = el.attr('id');
        path = '/api/office-hours/project/' + eventId;

        $.when(
            $.getJSON(path, {attr: attr}), 
            $.get('/static/js/templates/office-hours/' + attr + '.handlebars'),
            $.get('/static/js/templates/office-hours/' + attr + '-subnav.handlebars'))
         .done(function(data, template, subnavTemplate){
            var source = $(template[0]).html()
              , subnavSource = $(subnavTemplate[0]).html()
              , template = Handlebars.compile(source)
              , subnavTemplate = Handlebars.compile(subnavSource);

            console.log(data[0])
            templateData = formatTemplateData(attr, data[0])
            $('#meetup_data').html(template({rsvps: templateData, event_data: eventData}))
            $('#office_hours_subnav').html(subnavTemplate)
         })

         $('#office_hours_subnav').slideDown('fast').delay(500).queue(function(){
          $('html').animate({
              scrollTop: $("#meetup_nav").offset().top
           }, 500);
         }).dequeue()
    })

    // refactor 
    $('#meetup_data').on('click', '#left_pane li', function(){
      var el = $(this)
        , tally = '.' + tallyType(el.find('.label').attr('class'))

      $(tally).show()
      $('.rsvper, .attn').not(tally).hide();
      $('.active-tally').removeClass('active-tally')
      el.addClass('active-tally')
    })

    $('#office_hours_subnav').on('click', '.subnav-list li', function(){
      var el = $(this)
        , returningStatus = '.' + el.attr('class').split(' ')[0] 

      // $(returningStatus).show()
      $('.rsvper, .attn').not(returningStatus).hide();
      $('.active-subnav').removeClass('active-subnav')
      el.addClass('active-subnav')
    })
})

function tallyType(classes){
  var tally 
    , total
  
  tally = classes.split(' ')[1] 
  tally === 'total' ? tally = 'rsvper' : null
  return tally
}

function returnLen(data, attr){
  var arr = _.filter(data, function(d) { return d.status === attr})
  return String(arr.length)
}

function formatTemplateData(attr, data) {
  var templateData

  if (attr === 'rsvps') {
    var rsvps = data.results[0]
      , member_ids

    rsvps.concat(data.results[1].concat(data.results[2]))
    member_ids = _.pluck(_.pluck(rsvps, 'member'), 'member_id')
    
    _.each(data.results[3], function(rsvp){
      if (_.indexOf(member_ids, rsvp.member.member_id) !== -1 ){
        rsvp.returningStatus = 'returning' 
      } else {
        rsvp.returningStatus = 'new'
      }
    })

    templateData = {
      total: data.results[3].length, 
      tallies: data.results[3][0].tallies,
      results: data.results[3]
    }
  } else if (attr === 'attendance') {
    templateData = { 
      attended: returnLen(data, 'attended'),
      noshow: returnLen(data, 'noshow'),
      absent: returnLen(data, 'absent'),
      results: data
    }
  } else if (attr === 'comments' || 'ratings') {
    templateData = data
  }

  return templateData
}

function timeFormat(timestamp){
  var format = d3.time.format("%Y/%m/%d %I:%M");
  return format(new Date(timestamp * 1000));
}

Handlebars.registerHelper('formatDate', function(timestamp) {
  var format = d3.time.format("%Y/%m/%d %I:%M");
  return format(new Date(timestamp));
});

