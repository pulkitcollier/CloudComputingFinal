import UIKit

class ConnectViewController: UIViewController {

    @IBOutlet weak var username: UITextField!
    @IBOutlet weak var password: UITextField!

    @IBAction func connectClicked(_ sender: UIButton) {
        username.resignFirstResponder()
        password.resignFirstResponder()

        HttpService.post("/users/login", withBody: ["username": username.text!, "password": password.text!], handler: {
            [weak self] e, j in
            if e != nil {
                let alert = UIAlertController(title: "Oops", message: e.debugDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            } else {
                Data.UserId = Int(j!["userid"].stringValue)!
                print("UserId: " + String(Data.UserId))
                let alert = UIAlertController(title: "Done", message: "Welcome!", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self?.present(alert, animated: true, completion: nil)
            }
        })
    }

    override func viewDidAppear(_ animated: Bool) {
        registerForKeyboardNotifications()
        username.delegate = self
        password.delegate = self
    }

    override func viewDidDisappear(_ animated: Bool) {
        deregisterFromKeyboardNotifications()
    }

    func registerForKeyboardNotifications(){
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow(_:)), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide(_:)), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }

    func deregisterFromKeyboardNotifications(){
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        self.view.endEditing(true)
        super.touchesBegan(touches, with: event)
    }

    func keyboardWillShow(_ notification: NSNotification) {
        self.view.window?.frame.origin.y = -1 * getKeyboardHeight(notification)
    }

    func keyboardWillHide(_ notification: NSNotification) {
        if self.view.window?.frame.origin.y != 0 {
            self.view.window?.frame.origin.y += getKeyboardHeight(notification)
        }
    }

    func getKeyboardHeight(_ notification: NSNotification) -> CGFloat {
        return ((notification.userInfo?[UIKeyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue.height)!;
    }

}

extension ConnectViewController : UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        username.resignFirstResponder()
        password.resignFirstResponder()
        return true
    }
}
