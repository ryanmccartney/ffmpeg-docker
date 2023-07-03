#!/bin/bash
# Install host dependencies for BMD Decklink

#Set download link and driver version as below
DEKSTOP_VIDEO_DRIVER_URL="https://sw.blackmagicdesign.com/DesktopVideo/v12.4.1/Blackmagic_Desktop_Video_Linux_12.4.1.tar.gz?Key-Pair-Id=APKAJTKA3ZJMJRQITVEA&Signature=eOC2OOTCzwnS2SwHH1npjsriDjtVBeMDShPpZS0jl535phYjJ0HgiWaoZZiQsMpDrmQlQHSd7WXtKnvqauCLF6iI0/Yx9+F7YeW0U45m7Klx8zhehH7v8z1f/OFHtMIrgWmjXf6svAfxIUR+0CXQyN1tHtMSpnGd+9llhiLFLfEJvENnOiMMUpulP8RpM8bL1sARS7jpFCdDF6pWn5rRZPH2hM5lWk0yO0/vCI5b0wxgeG43GtdrYfi06KvybGiXGxwsI1qjLpzYSknwKBZqR+0ojwcTXhYfHbS7dCX2LuW3dgcu/dkIjuo9gLnqqvGrLMdFSJncOG5toQYJa1Ps9g==&Expires=1688340514"
DESKTOP_VIDEO_DRIVER_VERSION="12.4.1"
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