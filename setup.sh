#!/bin/bash
# Install host dependencies for BMD Decklink

#Set download link and driver version as below
DEKSTOP_VIDEO_DRIVER_URL="https://sw.blackmagicdesign.com/DesktopVideo/v12.4.1/Blackmagic_Desktop_Video_Linux_12.4.1.tar.gz?Key-Pair-Id=APKAJTKA3ZJMJRQITVEA&Signature=aWHPJ+Q8ZhMOnBnxECWE170sc7bWVJt3qriUxMvCTV8J8EO+dIXDhetlqy1lAs+/OViH1ipubZDUpceJEwLcsav6cTUYX/8mjLXEaq01hTy4ckGlX61OMukt5EBxboBa2Tjm65SktVQcRhuW4VgoAAH/ipjkhTEVW5SEdLr9FZqDgP2jIMN6NgiiVz6B71dIf+BnCzdWAHxLJSDStd3LEGAc8DkmFVDTVElBZvFRHRb3Fqc6dVOWhARTKZeEUGbJRhbaGk+rOsR2/0XdRanIXz/f4ybQEVS1z/uN/eFQRFmolZzA01r4rHewIl1LV5mxux7cx3AZmVbeE0CZIW6OtA==&Expires=1688397756"
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