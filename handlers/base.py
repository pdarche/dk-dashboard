# -*- coding: utf-8 -*-

import tornado.web
import requests
import json
from helpers import meetup
from settings import settings
from pymongo import MongoClient
import time

client = MongoClient('localhost', 27017)

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


class MeetupProjectHandler(tornado.web.RequestHandler):
	# note this should be done synchronously with torndado.gen.task 
	# and  
	def get(self, meetup_id):
		dkid = '4300032'
		base_url = 'https://api.meetup.com'
		dcr_params = {
		    'key': settings['meetup_api_key'],
		    'signed':'true', 
		    'status':'past',
		}
		e_res = requests.get(base_url + '/2/event/' + meetup_id, params=dcr_params)
		dcr_data = e_res.json()
		self.render('meetup_project.html', event=dcr_data)


class MeetupProjectAPIHandler(tornado.web.RequestHandler):
	def get(self, meetup_id):		
		params = {
			'group_id': '4300032', 
			'key': settings['meetup_api_key'], 
	    	'signed':'true',
	    	'status': 'past',
	    	'event_id': meetup_id
	    }
		meetup_attr = self.get_argument('attr')		
		url = self.build_path(meetup_attr, meetup_id)
		res = requests.get(url,params=params)
		self.write(json.dumps(res.json()))

	def build_path(self, attr, event_id):
		base_url = 'https://api.meetup.com'
		mapping = {
			'description' : '/2/event/' + event_id,
			'speakers': '/2/event/' + event_id,
			'venue': '/2/event/' + event_id,
			'sposors': '/2/event/' + event_id,
			'photos': '/2/photos',
			'comments': '/2/event_comments',
			'ratings': '/2/event_ratings',
			'attendance': '/DataKind-NYC/events/' + event_id + '/attendance/',
			'rsvps': '/2/rsvps'
		}
		return base_url + mapping[attr]


class MeetupCheckinHandler(tornado.web.RequestHandler):
	def get(self, event_id):
		url = 'https://api.meetup.com/2/rsvps'
		params = {
			'group_id': '4300032', 
			'key': settings['meetup_api_key'], 
			'signed':'true',
			'status': 'past',
			'event_id': event_id
		}
		res = requests.get(url, params=params)
		self.render('meetup_checkin.html', rsvps=res.json())

	def post(self, event_id):
		db = client.oh_attendance
		db.rsvpd

		attendee_dict = {
			'meetup_user_id': self.get_argument('user_id'),
			'event_id': self.get_argument('event_id'),
			'status': self.get_argument('status')
		}
		db.rsvpd.insert(attendee_dict)
		self.write('success')


class OfficeHourProjectHandler(tornado.web.RequestHandler):
	# note this should be done synchronously with torndado.gen.task 
	# and  
	def get(self, meetup_id):
		dkid = '4300032'
		base_url = 'https://api.meetup.com'
		dcr_params = {
		    'key': settings['meetup_api_key'],
		    'signed':'true', 
		    'status':'past',
		}
		e_res = requests.get(base_url + '/2/event/' + meetup_id, params=dcr_params)
		dcr_data = e_res.json()
		self.render('office_hour_project.html', event=dcr_data)


class OfficeHourProjectAPIHandler(tornado.web.RequestHandler):
	def get(self, meetup_id):		
		params = {
			'group_id': '4300032', 
			'key': settings['meetup_api_key'], 
	    	'signed':'true',
	    	'status': 'past',
	    	'event_id': meetup_id,

	    }
		meetup_attr = self.get_argument('attr')		
		url = self.build_path(meetup_attr, meetup_id)
		data = []

		if meetup_attr == 'attendance':
			offset = 0
			for x in range(5):
				params['offset'] = offset
				params['filter'] = 'all'
				params['page'] = 200
				data = data + requests.get(url,params=params).json()
				offset += 1 
				time.sleep(.25)
		else:
			data = requests.get(url,params=params).json()

		self.write(json.dumps(data))

	def build_path(self, attr, event_id):
		base_url = 'https://api.meetup.com'
		mapping = {
			'event' : '/2/event/' + event_id,
			'description' : '/2/event/' + event_id,
			'speakers': '/2/event/' + event_id,
			'venue': '/2/event/' + event_id,
			'sposors': '/2/event/' + event_id,
			'photos': '/2/photos',
			'comments': '/2/event_comments',
			'ratings': '/2/event_ratings',
			'attendance': '/DataKind-NYC/events/' + event_id + '/attendance/',
			'rsvps': '/2/rsvps'
		}
		return base_url + mapping[attr]


class OfficeHourCheckinHandler(tornado.web.RequestHandler):
	def get(self, event_id):
		url = 'https://api.meetup.com/2/rsvps'
		params = {
			'group_id': '4300032', 
			'key': settings['meetup_api_key'], 
			'signed':'true',
			'status': 'past',
			'event_id': event_id
		}
		res = requests.get(url, params=params)
		self.render('meetup_checkin.html', rsvps=res.json())

	def post(self, event_id):
		db = client.oh_attendance
		db.rsvpd

		attendee_dict = {
			'meetup_user_id': self.get_argument('user_id'),
			'event_id': self.get_argument('event_id'),
			'status': self.get_argument('status')
		}
		db.rsvpd.insert(attendee_dict)
		self.write('success')

