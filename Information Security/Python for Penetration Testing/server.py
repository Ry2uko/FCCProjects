import socket

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

host = socket.gethostname()
port = 1010

server_socket.bind((host, port))

server_socket.listen(3)

while True:
  client_socket, address = server_socket.accept()

  print(f'Connected: {str(address)}')

  message = 'Welcome Client!'
  client_socket.send(message.encode('ascii'))

  client_socket.close()
