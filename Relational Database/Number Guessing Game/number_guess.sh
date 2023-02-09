#!/bin/bash
PSQL="psql -X --username=freecodecamp --dbname=users --tuples-only -c"

RANDOM_NUM=$((1 + $RANDOM % 1000))
USER_ATTEMPTS=0

# get username
echo -e "\nEnter your username:"
read username

# if username length is greater than 22 characters
if [[ ${#username} -gt 22 ]]
then
  echo "Username must not be greater than 22 characters"
  exit
fi

user_name=$($PSQL "SELECT user_name FROM users_info WHERE user_name = '$username'")

# check if username exists
if [[ ! -z $user_name ]]
then
  # if username exists
  user_games=$($PSQL "SELECT user_games FROM users_info WHERE user_name = '$username'")
  user_best=$($PSQL "SELECT user_best FROM users_info WHERE user_name = '$username'")

  # format (trim whitespaces)
  user_name=$(echo $user_name | sed -r  's/^ *| *$//g')
  user_games=$(echo $user_games | sed -r  's/^ *| *$//g')
  user_best=$(echo $user_best | sed -r  's/^ *| *$//g')

  echo -e "\nWelcome back, $user_name! You have played $user_games games, and your best game took $user_best guesses."
else
  user_name=$(echo $username | sed -r  's/^ *| *$//g')

  echo -e "\nWelcome, $user_name! It looks like this is your first time here."
fi

# guess number
GUESS_NUMBER() {
  if [[ $1 ]]
  then
    echo -e "\n$1"
  else
    echo -e "\nGuess the secret number between 1 and 1000:"
  fi

  read guessed_number

  # if not number
  if [[ ! $guessed_number =~ ^-*[0-9]+$ ]]
  then
    GUESS_NUMBER "That is not an integer, guess again:"
    return
  # if number is greater than 1000 or lower than 0
  elif [[ $guessed_number -gt 1000 || $guessed_number -lt 0 ]]
  then
    GUESS_NUMBER "Number must be between 1 and 1000, guess again:"
    return
  fi

  # if secret number
  if [[ $guessed_number = $RANDOM_NUM ]]
  then
    USER_ATTEMPTS=$((USER_ATTEMPTS+1))
    USER_ATTEMPTS=$(echo $USER_ATTEMPTS | sed -r  's/^ *| *$//g')
    echo -e "\nYou guessed it in $USER_ATTEMPTS tries. The secret number was $RANDOM_NUM. Nice job!"

    # save to database
    user_name=$($PSQL "SELECT user_name FROM users_info WHERE user_name = '$username'")

    # check if username exists
    if [[ ! -z $user_name ]]
    then
      user_name=$(echo $user_name | sed -r  's/^ *| *$//g')

      # user already exists
      incremented_user_games=$((user_games+1))
      USER_GAMES_INCREMENT_RESULT=$($PSQL "UPDATE users_info SET user_games = $incremented_user_games WHERE user_name = '$user_name'")

      # check if best is broken
      if [[ $USER_ATTEMPTS -lt $user_best ]]
      then
        USER_NEW_BEST_RESULT=$($PSQL "UPDATE users_info SET user_best = $USER_ATTEMPTS WHERE user_name = '$user_name'")
      fi

    else
      # new user
      INSERT_NEW_USER_RESULT=$($PSQL "INSERT INTO users_info(user_name, user_games, user_best) VALUES('$username', 1, $USER_ATTEMPTS)")
      echo 
    fi
  else
    # if not secret number
    USER_ATTEMPTS=$((USER_ATTEMPTS+1))

    if [[ $RANDOM_NUM -lt $guessed_number ]]
    then
      # if guessed number is lower than secret number
      GUESS_NUMBER "It's lower than that, guess again:"
    elif [[ $RANDOM_NUM -gt $guessed_number ]]
    then
      # if guessed number is higher than secret number
      GUESS_NUMBER "It's higher than that, guess again:"
    fi

  fi
}

GUESS_NUMBER
