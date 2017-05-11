import UIKit

class FriendsViewController: UITableViewController {

    var searchActive: Bool = false

    @IBOutlet weak var searchBar: UISearchBar!

    @IBAction func addFriend(_ sender: UIBarButtonItem) {
        let alertControll = UIAlertController(title: "Add Friend", message: "Please specify their username:", preferredStyle: .alert)
        alertControll.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        alertControll.addAction(UIAlertAction(title: "Add", style: .default, handler: {action in
            print(action)
        }))

        self.present(alertControll, animated: true, completion: nil)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        searchBar.delegate = self
         self.navigationItem.leftBarButtonItem = self.editButtonItem
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
        // TODO: return count
        return 0
    }

     override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

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

//        filtered = data.filter({ (text) -> Bool in
//            let tmp: NSString = text
//            let range = tmp.rangeOfString(searchText, options: NSStringCompareOptions.CaseInsensitiveSearch)
//            return range.location != NSNotFound
//        })
//        if(filtered.count == 0){
//            searchActive = false;
//        } else {
//            searchActive = true;
//        }
        self.tableView.reloadData()
    }
}
