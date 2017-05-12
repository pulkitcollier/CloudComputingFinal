import UIKit

class AlertsViewController: UITableViewController {

    var alerts: [String] = []

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        HttpService.get("/alerts", handler: {
            [weak self] e, j in
            if e != nil {
                let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            } else {
                self?.alerts = (j?["alerts"].arrayValue.map({jo in
                    return jo.stringValue
                }))!
            }

            self?.tableView.reloadData()
        })

    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }

}

extension AlertsViewController {

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.alerts.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "alertsCell", for: indexPath)

        cell.textLabel?.text = self.alerts[indexPath.row]

        return cell
    }

}
