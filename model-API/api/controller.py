# THIS FILE HOUSES MAIN APPLICATION AND ENDPOINTS
# COMPLEX CALCULATION AND DB QUERIES SHOULD BE MADE ELSEWHERE

from flask import Flask, Response
from flask_cors import cross_origin, CORS
import json
import service.model_service as s

application = Flask(__name__)
cors = CORS(application)


@application.route("/anomalies/<index>/<thresh>", methods=['GET', 'OPTIONS'])
@cross_origin()
def getAnomalies(index, thresh):
    df = s.get_anomalies(index , thresh)
    df.index = df.index.astype(str)
    print(df.index)
    return Response(json.dumps(df.reset_index().to_dict(orient='records')), mimetype='application/json')



if __name__ == "__main__":
    application.run(debug=True, port="5000")