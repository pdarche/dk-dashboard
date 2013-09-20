def average(list):
	return sum(list) / float(len(list))

def pluck(list,attr):
	return map(lambda x: event['yes_rsvp_count'], events)

def descriptive_stats(events):
	yes_rsvps = map(lambda x: x['yes_rsvp_count'], events)
	maybe_rsvps = map(lambda x: x['maybe_rsvp_count'], events)
	waitlist = map(lambda x: x['waitlist_count'], events)
	headcount = map(lambda x: x['headcount'], events)
	avg_rating = map(lambda x: x['rating']['average'], events)
	rating_count = map(lambda x: x['rating']['count'], events)

	return {
		'avg_yes_rsvps' : average(yes_rsvps),
		'avg_maybe_rsvps' : average(maybe_rsvps),
		'avg_waiglist' : average(waitlist),
		'avg_headcount' : average(headcount),
		'avg_rating' : average(avg_rating),
		'avg_rating_count' : average(rating_count)
	}


