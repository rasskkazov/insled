import json
import random

import gpxpy
import gpxpy.gpx

def parse(gpx_file):

    gpx = gpxpy.parse(gpx_file)

    # Tracks = []
    Segments = []
    Points = []

    # for track in gpx.tracks:
    #     for segment in track.segments:
    #         for point in segment.points:
    #             PointObj = {
    #                 "lat": point.latitude,
    #                 "lon": point.longitude,
    #                 "ele": point.elevation
    #             }
    #             Points.append(PointObj)
            
    #         SegmentObj = { "points": Points }
    #         Segments.append(SegmentObj)
    #     TrackObj = { "segments": Segments}
    # Tracks.append(TrackObj)

    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                PointObj = {
                    "lat": point.latitude,
                    "lon": point.longitude,
                    "ele": point.elevation
                }
                Points.append(PointObj)
            SegmentObj = { 
                "points": Points}
            Segments.append(SegmentObj)
        Track = {
            "name": track.name,
            "segments": Segments
        }

    waypointsArr = []

    for waypoint in gpx.waypoints:
        WaypointObj = {
            "name": waypoint.name,
            "lat": waypoint.latitude,
            "lon": waypoint.longitude,
        }
        waypointsArr.append(WaypointObj)

    RoutePoints = []

    Route = {}

    for route in gpx.routes:
        for point in route.points:
            PointObj = {
                    "lat": point.latitude,
                    "lon": point.longitude,
                    "ele": point.elevation
                }
            RoutePoints.append(PointObj)
        Route = {
            "name": route.name,
            "rtept": {RoutePoints}
        }

    res_json = {
        "Track": Track,
        "Waypoints": waypointsArr,
        "Route": Route
    }

    result = json.dumps(res_json)
    return result


def parseJSON(json_file):

    data = json_file


    gpx = gpxpy.gpx.GPX()

    gpx_track = gpxpy.gpx.GPXTrack()


    # Track = data["Track"]
    segments = data['Track']['segments']

    for segment in segments:
        gpx_segment = gpxpy.gpx.GPXTrackSegment()
        points = segment['points']  
        for point in points:
            gpx_segment['points'].append(gpxpy.gpx.GPXTrackPoint(point['lat'], point['lon'], point['ele']))
        gpx_track.segments.append(segment)

    gpx.tracks.append(gpx_track)

    print(gpx)
    
    return gpx   

# for route in gpx.routes:
#     print('Route:')
#     for point in route.points:
#         print('Point at ({0},{1}) -> {2}'.format(point.latitude, point.longitude, point.elevation))
