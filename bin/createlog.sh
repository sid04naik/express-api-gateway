#!/bin/bash

# Load environment variables from the .env file
source .env

# Use environment variables or set defaults if not set in .env
BASE_DIR=${LOG_PATH}/${NAME}
FOLDERS=("nginx")
OWNER="root"
GROUP="wheel"
PERMISSIONS="777"

# Create the base directory if it doesn't exist
if [ ! -d "$BASE_DIR" ]; then
  echo "Creating base directory $BASE_DIR..."
  sudo mkdir -p "$BASE_DIR"
else
  echo "Base directory $BASE_DIR already exists."
fi

# Change the ownership of the base directory
echo "Changing ownership of $BASE_DIR to $OWNER:$GROUP..."
sudo chown "$OWNER:$GROUP" "$BASE_DIR"

# Iterate over the array and create each folder inside the base directory
for folder in "${FOLDERS[@]}"; do
  FOLDER_PATH="$BASE_DIR/$folder"
  if [ ! -d "$FOLDER_PATH" ]; then
    echo "Creating directory $FOLDER_PATH..."
    sudo mkdir -p "$FOLDER_PATH"
    # Change ownership of each created folder
    sudo chown "$OWNER:$GROUP" "$FOLDER_PATH"
  else
    echo "Directory $FOLDER_PATH already exists."
  fi
done

# Set permissions recursively on the base directory
echo "Setting $PERMISSIONS permissions on $BASE_DIR recursively..."
sudo chmod -R "$PERMISSIONS" "$BASE_DIR"

# Verify the ownership and permissions of the created folders
echo "Verifying the created directories, their ownership, and permissions:"
ls -ld "$BASE_DIR"/*
