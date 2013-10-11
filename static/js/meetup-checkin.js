$(document).ready(function(){
	$('.submit').click(function(ev){
		ev.preventDefault()
		var el = $(this)
			, url
			, meetupId
			, meetupUserName
			, data
			, meetupUserId;
		
		meetupUserId = el.parent().parent().attr('class').split(' ')[1]
		meetupId = eventIdFromPathname(window.location.pathname)
		url = '/meetups/checkin/' + meetupId
		if (el.hasClass('here')){
			data = {'user_id' : meetupUserId, 'event_id': meetupId, 'status': 'attended'}	
		} else {
			data = {'user_id' : meetupUserId, 'event_id': meetupId, 'status': 'noshow'}	
		}
		

		console.log(el.hasClass('here'))
		$.ajax({
			type: 'POST',
			url: url,
			data: data,
			success: function(data) {
				console.log('the data is', data)
				el.parent().parent().hide()		
			},
			error: function(){
				alert('sorry, something went wrong')
			}
		})

	})
})

function eventIdFromPathname(url) {
	return url.split('/')[3]
} 