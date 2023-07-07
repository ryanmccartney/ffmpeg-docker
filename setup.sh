#!/bin/bash
# Install host dependencies for BMD Decklink

#Set download link and driver version as below
DEKSTOP_VIDEO_DRIVER_URL="https://sw.blackmagicdesign.com/DesktopVideo/v12.4.1/Blackmagic_Desktop_Video_Linux_12.4.1.tar.gz?Key-Pair-Id=APKAJTKA3ZJMJRQITVEA&Signature=UjDtda2H6z/WMC1uYZ5Nm2l85Nbja0HGtWrMkSkCPjB8zUENNwAlyI8B5auUkH22znBETsVaa0jNCjndy9DxGfZE3e0nbx83KJA4ZZE2DkVOk2z+eKiYdrMkij5lKkUvZmyACs2HtRi6bDlKX/YETzmq1+48xyONKxhUZa27KZIh4tzqNP8TWkeGGbynQGn6TNsdtyeFQVomBWPAPvFrZMidyYra3Zk6uA6uTjyCu8j+5ZpZCk7mWq94AoWYpSH0YzbeT1+c4W11VaXQcJGQRSBImgZxkYiEDmnoR6rSa9wJm0HBxz++Ou1X1oLlaBXOB+fj0YSI9St/dcewg6I6og==&Expires=1688676477"
DESKTOP_VIDEO_DRIVER_VERSION="12.4.1"
DESKTOP_VIDEO_DRIVER_DEB="desktopvideo_12.4a4_amd64.deb"

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