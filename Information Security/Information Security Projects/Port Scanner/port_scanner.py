from common_ports import ports_and_services
import socket, re

def get_open_ports(target, port_range, verbose=None):
    open_ports = []
    ports = range(port_range[0], port_range[1] + 1)

    try: 
        host = socket.gethostbyname(target)
    except:
        if re.search('[a-zA-Z]', target):
            return 'Error: Invalid hostname'
        else:
            return 'Error: Invalid IP address'

    if host == target:
        try:
            domain = socket.gethostbyaddr(host)[0]
        except:
            domain = 'not found'
    else:
        domain = target

    for port in ports:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                s.connect((host, port))
                open_ports.append(port)
        except:
            pass
    
    if verbose:
        if domain == 'not found':
            verbose_str = f'Open ports for {host}\nPORT     SERVICE\n'
        else:
            verbose_str = f'Open ports for {domain} ({host})\nPORT     SERVICE\n'

        for port in open_ports:
            verbose_str += f'{port}       {ports_and_services[port]}\n'

        return verbose_str[:-1] # remove newline at end
    else:
        return open_ports



   