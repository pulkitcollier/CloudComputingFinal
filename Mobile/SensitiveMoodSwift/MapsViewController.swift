import UIKit
import MapKit

class MapsViewController: UIViewController {

    @IBOutlet weak var mapView: MKMapView!

    override func viewWillAppear(_ animated: Bool) {
        let loc = CLLocation(latitude: MapsConstant.latitude, longitude: MapsConstant.longitude)
        let dis = CLLocationDistance(MapsConstant.distance)

        mapView.setRegion(MKCoordinateRegionMakeWithDistance(loc.coordinate, dis * 2.0, dis * 2.0), animated: true)
    }
}
