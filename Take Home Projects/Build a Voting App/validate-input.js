function validateInput(body) {
  // [true]
  // [false, error message]
  let username = body.username || '', 
  email = body.email || '', 
  login = body.login || '',
  password = body.password || '', 
  confirmPassword = body.confirmPassword || '', 
  loginType, errMsg = '';

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  usernameRegex = /^[a-zA-Z0-9]+$/

  if (body.confirmPassword !== undefined) {
    // Signup validation
    if (username === '' || email === '' || 
    password === '' || confirmPassword === '') return [false, 'Missing input field(s).'];
    if (!emailRegex.test(email)) errMsg = 'Invalid email address.';
    if (username.length < 6) errMsg = 'Username must be 6-20 characters long.';
    else if (!usernameRegex.test(username)) errMsg = 'Invalid username.';
    if (confirmPassword !== password) errMsg = 'Confirm password does not match password.';
  } else {
    // Login validation
    if (login === '' || password === '') return [false, 'Missing input field(s).'];
    if (login.includes('@')) {
      if (!emailRegex.test(login)) errMsg = 'Invalid email address.';
    } else {
      if (login.length < 6) errMsg = 'Username must be 6-20 characters long.';
      else if (!usernameRegex.test(login)) errMsg = 'Invalid username.';
    }
  }
  if (password.length < 8) errMsg = 'Password is too short.';
  
  if (errMsg) return [false, errMsg];
  return [true];
}

export default validateInput;