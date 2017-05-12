import UIKit

class StatusViewController: UITableViewController {
    @IBOutlet weak var weekGreat: UILabel!
    @IBOutlet weak var weekBad: UILabel!
    @IBOutlet weak var weekNeutral: UILabel!
    @IBOutlet weak var monthGreat: UILabel!
    @IBOutlet weak var monthBad: UILabel!
    @IBOutlet weak var monthNeutral: UILabel!

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        HttpService.get("/users/" + String(Data.UserId) + "/status", handler: {
            [weak self] e, j in
            if e != nil {
                let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            } else {
                self?.weekGreat.text = j!["weekgood"].stringValue + " feel Great"
                self?.weekBad.text = j!["weekbad"].stringValue + " feel Bad"
                self?.weekNeutral.text = j!["weekneutral"].stringValue + " feel Neutral"
                self?.monthGreat.text = j!["monthgood"].stringValue + " feel Great"
                self?.monthBad.text = j!["monthbad"].stringValue + " feel Bad"
                self?.monthNeutral.text = j!["monthneutral"].stringValue + " feel Neutral"
            }
        })
    }
}
