#!/bin/bash
# Install host dependencies for BMD Decklink

#Set download link and driver version as below
DEKSTOP_VIDEO_DRIVER_URL="https://sw.blackmagicdesign.com/DesktopVideo/v12.5-1/Blackmagic_Desktop_Video_Linux_12.5.tar.gz?Key-Pair-Id=APKAJTKA3ZJMJRQITVEA&Signature=DGhQD04iRl3ZusAO39qNksNVp9hwA5jDTrOTnPVFk51/FYpO6sMuWg4hXj+wDWOM3EaJQIEAPqGpaV7YSiYPGxZCMsBhR/SLUCr+tDsspzWp4IQgaruHnNWK8nm9a/uqkyxE97vjpUIrSilEV6wxFv+DkV+4X9lVVaME6v3JD3XmwEQfcOze8/qYiMY4B4GwayVU02Y/2M7360T8WrewHecAGaWoX60QbN4gMV6AW8qP7r2/oROiaJE7qrz9iVpFZD6eXCo5V3ZyFNvTd39cuIGVu1nJpcReVqzOOcd8B2AMAFlVlrvC6jj6HLMDGSP2B6GHkvlVHoRDTetWCvAGWg==&Expires=1688323163"
DESKTOP_VIDEO_DRIVER_VERSION="12.5"
DESKTOP_VIDEO_DRIVER_DEB="driver.deb"

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