# -*- coding: utf-8 -*-

from handlers import base

url_patterns = [
    (r"/", base.MainHandler),
    (r"/meetups/program", base.MeetupProgramHandler),
    (r"/api/meetups/program", base.MeetupProgramAPIHandler),
    (r"/update-meetup", base.UpdateMeetup),
    (r"/meetups/project/([0-9]*)", base.MeetupProjectHandler),
    (r"/api/meetups/project/([0-9]*)", base.MeetupProjectAPIHandler),
    (r"/meetups/checkin/([0-9]*)", base.MeetupCheckinHandler),
]