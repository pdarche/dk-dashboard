# -*- coding: utf-8 -*-

import tornado.web
import requests
import json
from helpers import meetup
from settings import settings

class MainHandler(tornado.web.RequestHandler):
    #@tornado.web.authenticated
    def get(self):
        self.render('index.html')

class LoginHandler(tornado.web.RequestHandler):
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

class MeetupProgramHandler(tornado.web.RequestHandler):
	def get(self):
		dkid = '4300032'
		base_url = 'https://api.meetup.com'
		params = {
			'group_id':dkid, 
			'key':settings['meetup_api_key'], 
			'signed':'true', 
			'status':'past'
		}
		res = requests.get(base_url + '/2/events', params=params)
		events = res.json()['results']
		js = '/js/meetup-program.js'
		self.render('meetup.html', events=events, js=js)


class MeetupProgramAPIHandler(tornado.web.RequestHandler):
	def get(self):
		dkid = '4300032'
		base_url = 'https://api.meetup.com'
		params = {
			'group_id':dkid,
			'key':settings['meetup_api_key'], 
			'signed':'true', 
			'status':'past'
		}
		res = requests.get(base_url + '/2/events', params=params)
		events = res.json()['results']
		# events = filter(lambda x: x['name'] != 'DataKind Open Office Hours', events)
		descriptive_stats = meetup.descriptive_stats(events)
		data = {
			'response':200,
			'data': {
				'events': events,
				'descriptive_stats': descriptive_stats
			}
		}
		self.write(json.dumps(data))