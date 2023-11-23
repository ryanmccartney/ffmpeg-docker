#!/bin/bash

#
# FFmpeg Docker, an API wrapper around FFmpeg running in a configurable docker container
# Copyright (C) 2022 Ryan McCartney
#
# This file is part of the FFmpeg Docker (ffmpeg-docker).
#
# FFmpeg Docker is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#

# Install host dependencies for BMD Decklink

echo Input the URL for Blackmagic Video Driver URL:
read DEKSTOP_VIDEO_DRIVER_URL

echo Input the Version for Blackmagic Video Driver:
read DESKTOP_VIDEO_DRIVER_VERSION

echo Input the Name of the .deb frole for the Blackmagic Video Driver:
read DESKTOP_VIDEO_DRIVER_DEB

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