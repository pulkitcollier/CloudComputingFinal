import Foundation
import Alamofire
import SwiftyJSON

class HttpService {

    class func get(_ url: String, handler: @escaping (Error?, JSON?) -> Void) {
        Alamofire.request(url).responseJSON(completionHandler: { res in
            if (res.error != nil) {
                handler(res.error, nil)
            } else {
                handler(nil, JSON(data: res.data!))
            }
        })
    }

    class func get(_ url: String, withParams params: [String : Any], handler: @escaping (Error?, JSON?) -> Void) {
        request(url, parameters: params).responseJSON(completionHandler: { res in
            if (res.error != nil) {
                handler(res.error, nil)
            } else {
                handler(nil, JSON(data: res.data!))
            }
        })
    }

    class func post(_ url: String, withBody body: [String : Any], handler: @escaping (Error?, JSON?) -> Void) {
        request(url, method: .post, parameters: body, encoding: JSONEncoding.default).responseJSON(completionHandler: { res in
            if (res.error != nil) {
                handler(res.error, nil)
            } else {
                handler(nil, JSON(data: res.data!))
            }
        })
    }

}
