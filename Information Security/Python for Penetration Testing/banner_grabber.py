import socket

def banner(ip, port):
  s = socket.socket()
  s.connect((ip, port))
  print(s.recv(1024).decode('ascii'))

def main():
  ip = input('IP Address: ')
  port = int(input('Port: '))
  banner(ip, port)  

main()  