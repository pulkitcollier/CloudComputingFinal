import UIKit

class SettingsViewController: UITableViewController {
    @IBAction func toggleNotification(_ sender: UISwitch) {
        print(sender.isOn)
    }

    func logOut() {

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
