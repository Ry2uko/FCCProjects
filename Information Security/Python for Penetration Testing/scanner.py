import nmap

scanner = nmap.PortScanner()

print('Hello Nmap')
print('<------------------------------------------------------->')

ip_addr = input('IP Address: ')
print(f'Your IP Address: {ip_addr}') 

scan_type = input('''Scan Type: 
1) SYN ACK Scan
2) UDP Scan
3) Comprehensive Scan\n''')
print(f'Picked Scan Type: {scan_type}')

if scan_type == '1':
  print(f'Nmap version: {scanner.nmap_version()}')
  scanner.scan(ip_addr, '1-1024', '-v -sS')
  print(scanner.scaninfo())
  print(f'IP Status: {scanner[ip_addr].state()}')
  print(scanner[ip_addr].all_protocols())
  print(f'Open Ports: {scanner[ip_addr]["tcp"].keys()}')
elif scan_type == '2':
  print(f'Nmap version: {scanner.nmap_version()}')
  scanner.scan(ip_addr, '1-1024', '-v -sU')
  print(scanner.scaninfo())
  print(f'IP Status: {scanner[ip_addr].state()}')
  print(scanner[ip_addr].all_protocols())
  print(f'Open Ports: {scanner[ip_addr]["udp"].keys()}')
elif scan_type == '3':
  print(f'Nmap version: {scanner.nmap_version()}')
  scanner.scan(ip_addr, '1-1024', '-v -sS -sV -sC -A -O')
  print(scanner.scaninfo())
  print(f'IP Status: {scanner[ip_addr].state()}')
  print(scanner[ip_addr].all_protocols())
  print(f'Open Ports: {scanner[ip_addr]["tcp"].keys()}')  
else:
  print('Invalid scan type')  
