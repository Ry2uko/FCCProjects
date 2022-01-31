import hashlib


def convert(to_salt):
    digest = hashlib.sha1(
        to_salt.encode()
    ).hexdigest()

    return digest
        

def crack_sha1_hash(hash, use_salts=None):
    cleaned_hash = hash.strip().lower()
    
    with open('./top-10000-passwords.txt') as f:
        for line in f:
            password = line.strip()
            if use_salts:
                with open('./known-salts.txt') as s:
                    for salt in s:
                        salt = salt.strip()
                        salt1 = convert(password + salt)
                        salt2 = convert(salt + password)

                        if cleaned_hash == salt1 or cleaned_hash == salt2:
                            return password
            else:
                converted_hash = convert(password)

                if cleaned_hash == converted_hash:
                    return password
    
    return 'PASSWORD NOT IN DATABASE' 
