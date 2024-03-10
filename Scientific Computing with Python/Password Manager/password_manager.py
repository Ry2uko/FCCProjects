""" Project 4: Password Manager """
# https://youtu.be/O8596GPSJV4?si=OyIu9YLVfVad0tcY


from cryptography.fernet import Fernet

class PasswordManager:
    """ Password manager class for creating and loading keys and passwords """
    def __init__(self):
        self.key = None
        self.passwords = {}
        self.passwords_file = None
    
    def create_key(self, path):
        """ Creates key for encrypting and decrypting passwords from a file. """
        self.key = Fernet.generate_key()
        with open(path, 'wb') as f:
            f.write(self.key)
    
    def load_key(self, path):
        """ Loads key to class  """
        try:
            with open(path, 'rb') as f:
                self.key = f.read()
        except FileNotFoundError:
            print('Key not found.')
    
    def create_password_file(self, path, initial_values=None):
        """ Set password file path and add initial values, if provided. """
        self.passwords_file = path

        if initial_values is not None:
            for key, value in initial_values.items():
                self.add_password(key, value)

    def load_password_file(self, path):
        """ Load passwords (encrypted with current key) from a file """
        self.passwords_file = path

        with open(path, 'r') as f:
            for line in f:
                site, encrypted = line.split(':')
                self.passwords[site] = Fernet(self.key).decrypt(encrypted.encode()).decode()
    
    def add_password(self, site, password):
        """ Add password to dictionary and write to file """
        self.passwords[site] = password

        if self.passwords_file is not None:
            with open(self.passwords_file, 'a+') as f:
                token = Fernet(self.key).encrypt(password.encode())
                f.write(f'{site}:{token.decode()}\n')

    def get_password(self, site):
        """ Get password stored in passwords dictionary. """
        return self.passwords.get(site)


def main():
    initial_passwords = {
        'facebook': 'facebookpassword123',
        'gmail': 'mailpassword098',
        'youtube': 'hehehe',
    }

    pm = PasswordManager()

    print('''What do you want to do?
(1) Create a new key
(2) Load an existing key
(3) Create new password file
(4) Load existing password file
(5) Add a new password
(6) Get a password
(q) Quit
    ''')
    
    while True:
        choice = input(">> ")
        match choice:
            case '1':
                path = input("Enter path: ")
                pm.create_key(path)
            case '2':
                path = input("Enter path: ")
                pm.load_key(path)
            case '3':
                path = input("Enter path: ")
                pm.create_password_file(path, initial_passwords)
            case '4':
                path = input("Enter path: ")
                pm.load_password_file(path)
            case '5':
                site = input("Enter site: ")
                password = input("Enter password: ")
                pm.add_password(site, password)
            case '6':
                site = input("Enter site: ")
                print(f'Password for {site}: {pm.get_password(site)}')
            case 'q':
                break


if __name__ == '__main__':
    main()
