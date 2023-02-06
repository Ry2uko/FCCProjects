#!/bin/bash

PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

echo -e "\n~~~~~ Salon Appointment Scheduler ~~~~~\n"
echo -e "Welcome to our Salon, how can I help?\n"

MAIN_MENU() {
  # For invalid responses
  if [[ $1 ]]
  then
    echo -e "\n$1. What would you like today?"
  fi

  # Get all services
  SERVICES=$($PSQL "SELECT service_id, name FROM services ORDER BY service_id")
  if [[ -z $SERVICES ]]
  then
    echo "Sorry we don't have any available service at the moment. Please come again later."
    return
  fi

  # Print services
  echo "$SERVICES" | while read SERVICE_ID BAR NAME
  do
    echo "$SERVICE_ID) $NAME"
  done
  echo "0) Exit"

  # Choose service
  read SERVICE_ID_SELECTED

  # if input is not a number
  if [[ ! $SERVICE_ID_SELECTED =~ ^[0-9]+$ ]]
  then
    MAIN_MENU "I could not find that service"
  else
    # if exit
    if [[ "$SERVICE_ID_SELECTED" == "0" ]]
    then
      EXIT
      return
    fi

    SELECTED_SERVICE=$($PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED")

    # if service does not exist
    if [[ -z $SELECTED_SERVICE ]]
    then
      MAIN_MENU "I could not find that service"
    else
      # Get phone number
      echo -e "\nWhat's your phone number?"
      read CUSTOMER_PHONE

      CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone = '$CUSTOMER_PHONE'")

      # if customer doesn't exist
      if [[ -z $CUSTOMER_NAME ]]
      then
        # Get new customer name
        echo -e "\nI don't have a record for that phone number, what's your name?"
        read CUSTOMER_NAME

        INSERT_CUSTOMER_RESULT=$($PSQL "INSERT INTO customers(phone, name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME')")
      fi

      # Get customer_id
      CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone = '$CUSTOMER_PHONE'")

      # Get time
      echo -e "\nWhat time would you like your cut, $(echo $CUSTOMER_NAME | sed -r  's/^ *| *$//g')?"
      read SERVICE_TIME

      # Add appointment
      INSERT_APPOINTMENT_RESULT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME')")

      # if all goes well,
      echo -e "\nI have put you down for a $(echo $SELECTED_SERVICE | sed -r  's/^ *| *$//g') at $SERVICE_TIME, $(echo $CUSTOMER_NAME | sed -r  's/^ *| *$//g').\n"
    fi
  fi
  
}

EXIT() {
  echo -e "\nThank you for stopping in.\n"
}

MAIN_MENU