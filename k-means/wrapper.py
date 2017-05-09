# -*- coding: utf-8 -*-
"""
    TweetMap Tweet Model
    ~~~~~~

"""

import os
import json
import flask
from sqlalchemy import *
from sqlalchemy.pool import NullPool
import hashlib
import datetime

from sqlalchemy.exc import IntegrityError
#from sqlalchemy.dialects.postgresql import insert
from flask import Flask, Response, request, session, g, redirect, url_for, abort, \
     render_template, flash

from sklearn.externals import joblib
from thresholds import activity_count_dic, sentiment_score_dic
import numpy as np
import json

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)

#connect to staff managed postgres
#DATABASEURL = "postgresql://yh2901:sy38d@104.196.175.120/postgres"
#engine = create_engine(DATABASEURL)

# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'doodlemeet.db'),
    DEBUG=True,
    SECRET_KEY='development key',
  	USERNAME2='emily',
    PASSWORD2='emily'
      
))

app.config.from_envvar('DOODLEMEET_SETTINGS', silent=True)

@app.before_request
def before_request():
  """
  This function is run at the beginning of every web request 
  """
  try:
    #g.conn = engine.connect()
    pass
  except:
    print ("uh oh, problem connecting to database")
    import traceback; traceback.print_exc()
    g.conn = None

@app.teardown_request
def teardown_request(exception):
  """
  At the end of the web request, this makes sure to close the database connection.
  If you don't the database could run out of memory!
  """
  try:
    #g.conn.close()
    pass
    
  except Exception as e:
    pass   



@app.route('/get_threshold', methods=['GET', 'POST'])
def get_threshold():
    error = None

    #clf = joblib.load('kmeans_p2.pkl')
    
    '''example payload:
    payload = {
        "followerCount": 1243,
    "favoritesCount": 19607,
    "friendsCount": 657,
    "statusesCount": 14259,
    "activity_count": 1,
    "averaged_scores": 0.437409,
    }
    '''
    variables = "followerCount", "favoritesCount", "friendsCount", "statusesCount", "activity_count", "averaged_scores"
    data = np.array([float(request.args.get(v)) for v in variables])
    print (data)
    clf = joblib.load('kmeans.pkl')
    #data = np.array([300, 400,400,400,0,1.8])
    cls = clf.predict(data.reshape(-1, len(data)))
    activity_count_std_key = "cluster"+str(cls[0])+"_acitivty_count_std"
    sentiment_score_std_key = "cluster"+str(cls[0])+"_sentiment_score_std"
    activity_count_std = round(activity_count_dic[activity_count_std_key],3)
    sentiment_score_std = round(sentiment_score_dic[sentiment_score_std_key],3)
    print ("cluster number: {}".format(cls[0]))
    
    ret = {
        "cluster_number" : int(cls[0]),
        "activity_count_std":  activity_count_std,
        "sentiment_score_std": sentiment_score_std 

    }
    return json.dumps(ret)

    
if __name__ == "__main__":
  import click

  @click.command()
  @click.option('--debug', is_flag = True)
  @click.option('--threaded', is_flag = True)
  @click.argument('HOST', default = '0.0.0.0')
  @click.argument('PORT', default = 8080, type=int)
  def run(debug, threaded, host, port):
    HOST, PORT = host, port
    print ("running on %s:%d" % (HOST, PORT))
    app.run(host = HOST, port = PORT, debug = debug, threaded = threaded,  use_reloader = False)
  run()
