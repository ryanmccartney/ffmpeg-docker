#!/bin/bash
# Install host dependencies for BMD Decklink

#Set download link and driver version as below
DEKSTOP_VIDEO_DRIVER_URL="https://sw.blackmagicdesign.com/DesktopVideo/v12.4.1/Blackmagic_Desktop_Video_Linux_12.4.1.tar.gz"
DESKTOP_VIDEO_DRIVER_VERSION="12.4.1"
DESKTOP_VIDEO_DRIVER_DEB="driver.deb"

apt update
apt install -y wget dkms dctrl-tools

#Download and extract
#wget -O "desktop-video-driver.tar.gz" "$DEKSTOP_VIDEO_DRIVER_URL"
tar -xvf desktop-video-driver.tar.gz

#Get .deb name and location
SEARCH_DIR="./Blackmagic_Desktop_Video_Linux_$DESKTOP_VIDEO_DRIVER_VERSION/deb/x86_64"
for FILE in "$SEARCH_DIR"/*
do
    echo "$FILE"
    DESKTOP_VIDEO_DRIVER_DEB=$FILE
done

#Install the .deb
dpkg --install $DESKTOP_VIDEO_DRIVER_DEB

apt-get install -f

#Cleanup files and folder
rm -r "./Blackmagic_Desktop_Video_Linux_$DESKTOP_VIDEO_DRIVER_VERSION"
rm "desktop-video-driver.tar.gz"

#Get the firmware info and update if needed
DesktopVideoUpdateTool --list
DesktopVideoUpdateTool --update --all