import UIKit

class SettingsViewController: UITableViewController {

    @IBOutlet weak var smsSwitch: UISwitch!
    @IBOutlet weak var emailSwitch: UISwitch!

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        HttpService.get("/users/" + String(Data.UserId) + "/settings", handler: {
            [weak self] e, j in
            if e != nil {
                let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            } else {
                self?.smsSwitch.isOn = j!["usesms"].boolValue
                self?.emailSwitch.isOn = j!["useemail"].boolValue

            }
        })
    }
    
    @IBAction func toggleEmail(_ sender: UISwitch) {
        HttpService.post("/users/" + String(Data.UserId) + "/settings", withBody: ["useemail": emailSwitch.isOn, "usesms": smsSwitch.isOn], handler: {
            [weak self] e, j in
            if e != nil {
                let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            } else {
                let alert = UIAlertController(title: "Done", message: "You have successfully changed the settings!", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            }
        })
    }

    @IBAction func toggleSMS(_ sender: UISwitch) {
        HttpService.post("/users/" + String(Data.UserId) + "/settings", withBody: ["useemail": emailSwitch.isOn, "usesms": smsSwitch.isOn], handler: {
            [weak self] e, j in
            if e != nil {
                let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            } else {                let alert = UIAlertController(title: "Done", message: "You have successfully changed the settings!", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            }
        })
    }

    func logOut() {
        Data.UserId = 0;
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)

        if indexPath.section == 1 && indexPath.row == 0 {
            print("Logging out")

            let alertController = UIAlertController(title: "Log out", message: "Are you sure to log out?", preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "No", style: .cancel, handler: nil))
            alertController.addAction(UIAlertAction(title: "Yes", style: .destructive, handler: {action in
                    print(action)
            }))

            self.present(alertController, animated: true, completion: nil)
        }
    }
}
