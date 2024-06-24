function getDistance(polyline) {
    var distance = 0
    var previousPoint
    var points = polyline.getLatLngs()



    points.forEach(latLng => {
        if (previousPoint) {
            distance += previousPoint.distanceTo(latLng)
        }
        previousPoint = latLng;
    })


    return (distance / 1000).toFixed(1)
}

function getDistanceToPoint(polyline, target) {

    var distance = 0
    var previousPoint
    var points = polyline.getLatLngs()

    for (var i = 0; i < points.length - 1; i++) {
        previousPoint = points[i]
        distance += previousPoint.distanceTo(points[i + 1])


        if ((previousPoint.distanceTo(target) <= 150) || (previousPoint.distanceTo(target) <= previousPoint.distanceTo(points[i + 1]))) {
            distance += previousPoint.distanceTo(target)

            console.log(distance)

            if (distance < 1000) return distance

            else return (distance / 1000).toFixed(1)


        }

    }

    // points.forEach(latLng => {
    //         if (previousPoint) {
    //             distance += previousPoint.distanceTo(latLng)

    //             if (previousPoint.distanceTo(target) <= 100) {
    //                 distance += previousPoint.distanceTo(target)
    //                 console.log(distance)
    //                 return (distance)
    //             }

    //         }
    //         previousPoint = latLng;
    // })

    console.log('outter return')
    return 0;

}