# -*- coding: utf-8 -*-

import tornado.web
import requests
from helpers import meetup
from settings import settings

class MainHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def get(self):
        self.render('index.html')

class UpdateMeetup(tornado.web.RequestHandler):
	def get(self):
		# get the last meetup
		base_url = 'https://api.meetup.com'
		res = requests.get(
			base_url + '/find/groups', 
			params={'text':'datakind', 'key':key}
		)

class MeetupHandler(tornado.web.RequestHandler):
	def get(self):
		# get the last meetup
		dkid = '4300032'
		base_url = 'https://api.meetup.com'
		params = {
			'group_id':dkid, 
			'key':settings['meetup_api_key'], 
			'signed':'true', 
			'status':'past'
		}
		res = requests.get(base_url + '/2/events', params=params)
		events = res.json['results']
		print meetup.descriptive_stats(events)
		self.render('meetup.html', events=events)