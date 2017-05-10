# -*- coding: utf-8 -*-
"""
    Tweet+Accelormeter Model
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
from acc_cluster_stats import X_avg_dic, Y_avg_dic, Z_avg_dic, X_absdif_dic, Y_absdif_dic, Z_absdif_dic
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



@app.route('/getTstats', methods=['GET', 'POST'])
def get_tweet_threshold():
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

@app.route('/getAstats', methods=['GET', 'POST'])
def get_acc_threshold():
    error = None

    #clf = joblib.load('kmeans_p2.pkl')
    
    '''example payload:
    payload = { # predict 1
        "X_avg": 4.55959462e-01,
        "Y_avg": 7.41013868e+00,
        "Z_avg":  4.66521159e+00,
        "X_absdif": 3.68739588e+03,
        "Y_absdif":  3.28397478e+03,
        "Z_absdif":  3.98681194e+03,
    }
    payload1 = { # predict 0 
    "X_avg": 0.870 ,
    "Y_avg":  2.875,
    "Z_avg": 4.791,
    "X_absdif": 212750.185,
    "Y_absdif":   193742.799,
    "Z_absdif":  233020.013,
    }
    '''
    variables = ["X_avg", "Y_avg", "Z_avg", "X_absdif", "Y_absdif", "Z_absdif"]
    data = np.array([float(request.args.get(v)) for v in variables])
    print (data)
    clf = joblib.load('acc_kmeans.pkl')
    # test = [  4.55959462e-01,   7.41013868e+00,   4.66521159e+00,
    #       3.68739588e+03,   3.28397478e+03,   3.98681194e+03]
    # data = np.array(test)
    cls = clf.predict(data.reshape(-1, len(data)))
    X_avg_std_key = "cluster"+str(cls[0])+"_X_avg_std"
    Y_avg_std_key = "cluster"+str(cls[0])+"_Y_avg_std"
    Z_avg_std_key = "cluster"+str(cls[0])+"_Z_avg_std"
    X_absdif_std_key = "cluster"+str(cls[0])+"_X_absdif_std"
    Y_absdif_std_key = "cluster"+str(cls[0])+"_Y_absdif_std"
    Z_absdif_std_key = "cluster"+str(cls[0])+"_Z_absdif_std"
    
    X_avg_std = round(X_avg_dic[X_avg_std_key],3)
    Y_avg_std = round(Y_avg_dic[Y_avg_std_key],3)
    Z_avg_std = round(Z_avg_dic[Z_avg_std_key],3)
    
    X_absdif_std = round(X_absdif_dic[X_absdif_std_key],3)
    Y_absdif_std = round(Y_absdif_dic[Y_absdif_std_key],3)
    Z_absdif_std = round(Z_absdif_dic[Z_absdif_std_key],3)
    
    print ("cluster number: {}".format(cls[0]))
    
    ret = {
        "cluster_number" : int(cls[0]),
        "X_avg_std":  X_avg_std,
        "Y_avg_std": Y_avg_std,
        "Z_avg_std" : Z_avg_std,
        "X_absdif_std" : X_absdif_std,
        "Y_absdif_std" : Y_absdif_std,
        "Z_absdif_std" : Z_absdif_std
    }
    return json.dumps(ret)
    
if __name__ == "__main__":
  import click

  @click.command()
  @click.option('--debug', is_flag = True)
  @click.option('--threaded', is_flag = True)
  @click.argument('HOST', default = '0.0.0.0')
  @click.argument('PORT', default = 8081, type=int)
  def run(debug, threaded, host, port):
    HOST, PORT = host, port
    print ("running on %s:%d" % (HOST, PORT))
    app.run(host = HOST, port = PORT, debug = debug, threaded = threaded,  use_reloader = False)
  run()
