$(document).ready(function(){
    var eventId = window.location.pathname.split('/')
    eventId = eventId[eventId.length-1]

    $('#meetup_nav li').click(function(){
        var el = $(this)
          , attr, path, program
          , templateData;

        $('.active').removeClass('active')
        el.addClass('active')
        attr = el.attr('id')
        path = '/api/office-hours/project/' + eventId

        $.when($.getJSON(path, {attr: attr}), $.get('/static/js/templates/office-hours/' + attr + '.handlebars'))
         .done(function(data, template){

            console.log(data[0])
            console.log(template[0])
            var source = $(template[0]).html()
              , template = Handlebars.compile(source);          

            templateData = formatTemplateData(attr, data[0])
            $('#meetup_data').html(template({rsvps: templateData}))            
         })
    })

    $('#meetup_data').on('click', 'li', function(){
      var el = $(this)
        , tally = '.' + tallyType(el.find('.label').attr('class'))

      console.log('the tally is', tally)
      $(tally).show()
      $('.rsvper, .attn').not(tally).hide();
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
    templateData = { 
      total: data.meta.count, 
      tallies: data.results[0].tallies,
      results: data.results
    }
  } else if (attr === 'attendance') {
    templateData = { 
      attended: returnLen(data, 'attended'),
      noshow: returnLen(data, 'noshow'),
      absent: returnLen(data, 'absent'),
      results: data
    }
  } else if (attr === 'comments') {
    templateData = data
  }

  return templateData
}