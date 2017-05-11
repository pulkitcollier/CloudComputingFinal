import UIKit

class StatusViewController: UITableViewController {
    @IBOutlet weak var weekGreat: UILabel!
    @IBOutlet weak var weekBad: UILabel!
    @IBOutlet weak var weekNeutral: UILabel!
    @IBOutlet weak var monthGreat: UILabel!
    @IBOutlet weak var monthBad: UILabel!
    @IBOutlet weak var monthNeutral: UILabel!

    override func viewDidLoad() {
        weekGreat.text = "xx feel Great"
        weekBad.text = "xx feel bad"
        weekNeutral.text = "xx feel neu"
        monthGreat.text = "xx feel Great"
        monthBad.text = "xx feel bad"
        monthNeutral.text = "xx feel neu"
    }
}
