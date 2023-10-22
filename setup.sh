#!/bin/bash
# Install host dependencies for BMD Decklink

#Set download link and driver version as below
DEKSTOP_VIDEO_DRIVER_URL="https://swr.cloud.blackmagicdesign.com/DesktopVideo/v12.4.1/Blackmagic_Desktop_Video_Linux_12.4.1.tar.gz?verify=1697908812-1f7rrMkhP0aqofYc4hhVOuLdCJhqpWd2B2Dl8%2Bten0k%3D"
DESKTOP_VIDEO_DRIVER_VERSION="12.4.1"
DESKTOP_VIDEO_DRIVER_DEB="desktopvideo_12.4.1a15_amd64"

apt update
apt install -y wget dkms dctrl-tools
apt autoremove -y

#Download and extract
wget -O "desktop-video-driver.tar.gz" "$DEKSTOP_VIDEO_DRIVER_URL"
tar -xvf desktop-video-driver.tar.gz

#Get .deb name and location
SEARCH_DIR="./Blackmagic_Desktop_Video_Linux_$DESKTOP_VIDEO_DRIVER_VERSION/deb/x86_64/"
echo "Searching for driver in $SEARCH_DIR"

for FILE in "$SEARCH_DIR"/*
do
    echo "$FILE"
    if [[ $FILE == *"desktopvideo_"* ]]; then
        echo "Found Desktop Video Drivers"
        DESKTOP_VIDEO_DRIVER_DEB=$FILE
    fi
done

#Install the .deb
echo "Installing driver from $DESKTOP_VIDEO_DRIVER_DEB"
dpkg --install $DESKTOP_VIDEO_DRIVER_DEB | true
apt install -f -y
dpkg --install $DESKTOP_VIDEO_DRIVER_DEB || true &&\

#Cleanup files and folder
rm -r "./Blackmagic_Desktop_Video_Linux_$DESKTOP_VIDEO_DRIVER_VERSION"
rm "desktop-video-driver.tar.gz"

#Get the firmware info and update if needed
DesktopVideoUpdateTool --list
DesktopVideoUpdateTool --update --all