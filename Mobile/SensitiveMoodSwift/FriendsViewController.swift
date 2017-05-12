import UIKit

struct Friend {
    var userId: Int
    var userName: String
}

class FriendsViewController: UITableViewController {

    var friends: [Friend] = []
    var filtered: [Friend] = []

    var searchActive: Bool = false

    @IBOutlet weak var searchBar: UISearchBar!

    @IBAction func addFriend(_ sender: UIBarButtonItem) {
        let alertControll = UIAlertController(title: "Add Friend", message: "Please specify their username:", preferredStyle: .alert)
        alertControll.addTextField { (textField : UITextField!) -> Void in
            textField.placeholder = "Enter Friend's UserName"
        }

        alertControll.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        alertControll.addAction(UIAlertAction(title: "Add", style: .default, handler: {action in
            let friendname = alertControll.textFields![0] as UITextField

            HttpService.post("/users/" + String(Data.UserId) + "/friends", withBody: ["friendname": friendname.text!], handler: {
                [weak self] e, j in
                if e != nil {
                    let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self?.present(alert, animated: true, completion: nil)
                } else {
                    let alert = UIAlertController(title: "Done", message: "Successfully added friend!", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self?.present(alert, animated: true, completion: nil)
                }
            })
        }))

        self.present(alertControll, animated: true, completion: nil)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        searchBar.delegate = self
        self.navigationItem.leftBarButtonItem = self.editButtonItem
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        HttpService.get("/users/" + String(Data.UserId) + "/friends", handler: {
            [weak self] e, j in
            if e != nil {
                let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            } else {
                self?.friends = (j?["friends"].arrayValue.map({jo in
                    return Friend(userId: jo["userid"].intValue, userName: jo["username"].stringValue)
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

extension FriendsViewController {

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return friends.count
    }

     override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "friendsCell", for: indexPath)

        cell.textLabel?.text = friends[indexPath.row].userName

        return cell
     }

     override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
        }
     }

}

extension FriendsViewController : UISearchBarDelegate {

    func searchBarTextDidBeginEditing(_ searchBar: UISearchBar) {
        searchActive = true;
    }

    func searchBarTextDidEndEditing(_ searchBar: UISearchBar) {
        searchActive = false;
    }

    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        searchActive = false;
    }

    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        searchActive = false;
    }

    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {

        filtered = friends.filter({ (friend) -> Bool in
            return friend.userName == searchText
        })

        if(filtered.count == 0){
            searchActive = false;
        } else {
            searchActive = true;
        }

        self.tableView.reloadData()
    }
}
