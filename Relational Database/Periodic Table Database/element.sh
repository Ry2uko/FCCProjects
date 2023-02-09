#!/bin/bash

PSQL="psql -X --username=freecodecamp --dbname=periodic_table --tuples-only -c"

if [[ $1 ]]
then

  # Get element
  # check if number
  if [[ $1 =~ ^[0-9]+$ ]]
  then
    atomic_number=$($PSQL "SELECT atomic_number FROM elements WHERE atomic_number = $1")
    symbol=$($PSQL "SELECT symbol FROM elements WHERE atomic_number = $1")
    name=$($PSQL "SELECT name FROM elements WHERE atomic_number = $1")
  else
    atomic_number=$($PSQL "SELECT atomic_number FROM elements WHERE symbol = '$1' OR name = '$1'")
    symbol=$($PSQL "SELECT symbol FROM elements WHERE symbol = '$1' OR name = '$1'")
    name=$($PSQL "SELECT name FROM elements WHERE symbol = '$1' OR name = '$1'")
  fi

  if [[ -z $symbol || -z $name ]]
  then
    # if not found
    echo "I could not find that element in the database."
  else
    # Get properties
    type_id=$($PSQL "SELECT type_id FROM properties WHERE atomic_number = $atomic_number")
    type=$($PSQL "SELECT type FROM types WHERE type_id = $type_id")
    atomic_mass=$($PSQL "SELECT atomic_mass FROM properties WHERE atomic_number = $atomic_number")
    melting_point_celsius=$($PSQL "SELECT melting_point_celsius FROM properties WHERE atomic_number = $atomic_number")
    boiling_point_celsius=$($PSQL "SELECT boiling_point_celsius FROM properties WHERE atomic_number = $atomic_number")
    
    # format all (trim whitespaces)
    atomic_number=$(echo $atomic_number | sed -r  's/^ *| *$//g')
    symbol=$(echo $symbol | sed -r  's/^ *| *$//g')
    name=$(echo $name | sed -r  's/^ *| *$//g')
    type=$(echo $type | sed -r  's/^ *| *$//g')
    atomic_mass=$(echo $atomic_mass | sed -r  's/^ *| *$//g')
    melting_point_celsius=$(echo $melting_point_celsius | sed -r  's/^ *| *$//g')
    boiling_point_celsius=$(echo $boiling_point_celsius | sed -r  's/^ *| *$//g')

    echo "The element with atomic number $atomic_number is $name ($symbol). It's a $type, with a mass of $atomic_mass amu. $name has a melting point of $melting_point_celsius celsius and a boiling point of $boiling_point_celsius celsius."
  fi

else
  # if no argument is passed
  echo "Please provide an element as an argument."
fi
