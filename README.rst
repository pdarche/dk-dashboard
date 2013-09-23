===========================
DataKind Analytics
===========================

This is DataKind's analytics platform and api.
 
Installation
============

Check out the source::

 $ git clone git://github.com/hkage/tornado-mongodb-boilerplate.git
 
Install the required Python libraries from within the project's directory::

 $ pip install -r requirements/stable-req.txt
 
And additionally also install the needed development tools::

 $ pip install -r requirements/dev-req.txt
 
Configuration
=============

Start the server
================

To start the final application, just run the following fabric command::

 $ fab devserver
 
This will tell Tornado to start the applicaton with the default port 8888. If
you want to use another port, just type::

 $ fab devserver:port=8000
 
In addition to that, see the fabfile.py Script for other parameters and comands.
 
__ http://www.turbogears.com
__ http://www.djangoproject.com
__ http://www.tornadoweb.org
__ http://www.mongodb.org
__ http://code.google.com/closure
