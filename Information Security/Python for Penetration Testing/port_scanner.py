import socket

s  = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(10)

host = input('IP Adress: ')
port = int(input('Port: '))

def portScanner(port):
  if s.connect_ex((host, port)):
    print('Port is closed')
  else:
    print('Port is open')

portScanner(port)
