import Foundation
import Alamofire
import SwiftyJSON

class HttpService {

    private static let urlBase: String = "http://ec2-54-84-217-246.compute-1.amazonaws.com"

    class func get(_ url: String, handler: @escaping (Error?, JSON?) -> Void) {
        Alamofire.request(urlBase + url).responseJSON(completionHandler: { res in
            if (res.error != nil) {
                handler(res.error, nil)
            } else {
                handler(nil, JSON(data: res.data!))
            }
        })
    }

    class func get(_ url: String, withParams params: [String : Any], handler: @escaping (Error?, JSON?) -> Void) {
        request(urlBase + url, parameters: params).responseJSON(completionHandler: { res in
            if (res.error != nil) {
                handler(res.error, nil)
            } else {
                handler(nil, JSON(data: res.data!))
            }
        })
    }

    class func post(_ url: String, withBody body: [String : Any], handler: @escaping (Error?, JSON?) -> Void) {
        request(urlBase + url, method: .post, parameters: body, encoding: JSONEncoding.default).responseJSON(completionHandler: { res in
            if (res.error != nil) {
                handler(res.error, nil)
            } else {
                handler(nil, JSON(data: res.data!))
            }
        })
    }

}
