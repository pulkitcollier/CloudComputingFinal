import UIKit
import MapKit

struct Tweet {
    var userName: String
    var content: String
    var score: Double
    var lon: Double
    var lat: Double
}

class MapsViewController: UIViewController {

    private var tweets: [Tweet] = []

    @IBOutlet weak var mapView: MKMapView!

    override func viewWillAppear(_ animated: Bool) {
        let loc = CLLocation(latitude: MapsConstant.latitude, longitude: MapsConstant.longitude)
        let dis = CLLocationDistance(MapsConstant.distance)

        mapView.setRegion(MKCoordinateRegionMakeWithDistance(loc.coordinate, dis * 2.0, dis * 2.0), animated: true)

        HttpService.get("/tweets/" + String(Data.UserId), handler: {
            [weak self] e, j in
            if e != nil {
                let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            } else {
                self?.tweets = (j?["tweets"].arrayValue.map({jo in
                    return Tweet(userName: jo["username"].stringValue, content: jo["tweet"].stringValue, score: jo["score"].doubleValue, lon: jo["lat"].doubleValue, lat: jo["lon"].doubleValue)
                }))!

                for tweet in (self?.tweets)! {
                    let marker = MKPointAnnotation()
                    marker.coordinate = CLLocationCoordinate2D(latitude: tweet.lat, longitude: tweet.lon)
                    marker.title = tweet.userName + "|" + String(tweet.score)
                    marker.subtitle = tweet.content
                    self?.mapView.addAnnotation(marker)

                    let region = MKCoordinateRegionMakeWithDistance(CLLocationCoordinate2D(latitude: tweet.lat, longitude: tweet.lon), 200, 200)
                    self?.mapView.setRegion(region, animated: true)
                }
            }
        })

    }
}
