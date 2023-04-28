#!/bin/bash
#
# Upload data from ./dist/ to a testing environment.


echo "Loading up .env-testing file ..."
set -o allexport
[[ -f ../.env-testing ]] && source ../.env-testing
set +o allexport

if [[ -z "$user" && -z "$server" && -z "$destination" ]]; then
    echo "Error: No env vars found! Did you create an .env-testing file?"
    exit 1
else
    echo "Testing Env vars found and loaded."

    while true; do
	read -p "Do you really wish to overwrite all files on your testing system on $server (y/n)? " yn
	case $yn in
            [Yy]* ) break;;
            [Nn]* ) exit;;
            * ) echo "Please answer y or n.";;
	esac
    done
fi


echo "Uploading to $server ..."


rsync -avH ../dist                 -e ssh $user@$server:"$destination/"
# rsync -avH ../*.*                  -e ssh $user@$server:"$destination/"


