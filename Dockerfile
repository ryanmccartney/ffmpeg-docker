# NAME: Dockerfile
# AUTH: Ryan McCartney <ryan@mccartney.info>
# DATE: 29/10/2023
# DESC: FFmpeg compiled with configurable options link BMD Decklink or Newtec NDI

FROM ubuntu:jammy

ARG FFMPEG_VERSION="5.0"
ARG NON_FREE="false"

ARG DECKLINK_SUPPORT="false"
ARG DECKLINK_SDK_URL="https://swr.cloud.blackmagicdesign.com/DeckLink/v12.4.1/Blackmagic_DeckLink_SDK_12.4.1.zip?verify="
ARG DECKLINK_DRIVER_URL="https://swr.cloud.blackmagicdesign.com/DesktopVideo/v12.4.1/Blackmagic_Desktop_Video_Linux_12.4.1.tar.gz?verify="
ARG DECKLINK_DRIVER_VERSION="12.4.1"

ARG NDI_SUPPORT="false"
ARG NDI_SDK_URL="https://downloads.ndi.tv/SDK/NDI_SDK_Linux/Install_NDI_SDK_v5_Linux.tar.gz"

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_MAJOR=18 

# Create folder structure
RUN mkdir $HOME/ffmpeg_sources
RUN mkdir $HOME/bin

RUN LINUX_KERNAL_PACKAGES="" && \
    # Detect Linux OS and add kernel packages
    if [[ "$OSTYPE" == "linux-gnu"* ]];\
    then \
        LINUX_KERNAL_PACKAGES="linux-oem-22.04c linux-tools-oem-22.04c"; \
    fi && \
    # Print any extra packages being added
    echo "Extra Packages: $LINUX_KERNAL_PACKAGES" && \
    # Install additional dependencies
    apt update && \
    apt -y install \
        autoconf \
        automake \
        build-essential \
        cmake \
        git-core \
        libass-dev \
        libfreetype6-dev \
        libgnutls28-dev \
        libmp3lame-dev \
        libsdl2-dev \
        libtool \
        libva-dev \
        libvdpau-dev \
        libvorbis-dev \
        libxcb1-dev \
        libxcb-shm0-dev \
        libxcb-xfixes0-dev \
        meson \
        ninja-build \
        pkg-config \
        texinfo \
        wget \
        yasm \
        tclsh \
        zlib1g-dev \
        nasm \
        libnuma-dev \
        libvpx-dev \
        libmp3lame-dev \
        libunistring-dev \
        libopus-dev \
        libx264-dev \
        libx265-dev \
        libssl-dev \
        libaom-dev \
        libdav1d-dev \
        libopus-dev \
        libarchive-tools \
        $LINUX_KERNAL_PACKAGES

WORKDIR $HOME/decklink

# Get Blackmagic Desktop Video SDK (Link expires... You'll need to get a new one)
RUN if [ "$DECKLINK_SUPPORT" = "true" ];\
    then \
        #Decklink Driver: Download and extract
        wget -O "desktop-video-driver.tar.gz" "$DECKLINK_DRIVER_URL" &&\
        tar -xvf desktop-video-driver.tar.gz &&\
        #Decklink Driver: Get .deb name and location
        DECKLINK_DRIVER_DEB="./Blackmagic_Desktop_Video_Linux_$DECKLINK_DRIVER_VERSION/deb/x86_64/desktopvideo_12.4.1a15_amd64.deb" &&\
        SEARCH_DIR="./Blackmagic_Desktop_Video_Linux_$DECKLINK_DRIVER_VERSION/deb/x86_64" &&\ 
        echo "Searching for driver in $SEARCH_DIR" &&\
        for FILE in "$SEARCH_DIR"/*;\
        do\
            echo "$FILE" &&\
            if [[ $FILE == *"desktopvideo_"* ]]; then\
                echo "Found Desktop Video Drivers" &&\
                DECKLINK_DRIVER_DEB=$FILE;\
            fi\
        done &&\
        #Decklink Driver: Install the .deb
        dpkg --install $DECKLINK_DRIVER_DEB || true &&\
        apt install -f -y &&\
        dpkg --install $DECKLINK_DRIVER_DEB || true &&\
        #Decklink Driver: Cleanup files and folder
        rm -r "./Blackmagic_Desktop_Video_Linux_$DECKLINK_DRIVER_VERSION" &&\
        #Decklink SDK: Get SDK, extract and copy
        wget -O "desktop-video-sdk.zip" "$DECKLINK_SDK_URL" &&\
        bsdtar -xf desktop-video-sdk.zip -s'|[^/]*/|./desktopvideoSDK/|' &&\
        cp -r ./desktopvideoSDK/Linux/ $HOME/ffmpeg_sources/BMD_SDK &&\
        rm -r "./desktopvideoSDK";\
    else \
       echo "Decklink flag not set"; \
    fi

WORKDIR $HOME/ffmpeg_sources

ENV PATH="$HOME/bin:${PATH}"
RUN echo "export PATH=$HOME/bin:${PATH}" >> "$HOME/.bashrc"

# Compile addtional libraries when Non Free option is selected
RUN if [ "$NON_FREE" = "true" ];\
    then \
        # Add source and compile for Fraunhofer AAC codec support
        cd /ffmpeg_sources && \
        git -C fdk-aac pull 2> /dev/null || git clone --depth 1 https://github.com/mstorsjo/fdk-aac && \
        cd fdk-aac && \
        autoreconf -fiv && \
        ./configure --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin" --disable-shared && \
        make && \
        make install && \
        # Add source and compile for AV1 codec support
        cd /ffmpeg_sources && \
        git -C SVT-AV1 pull 2> /dev/null || git clone https://gitlab.com/AOMediaCodec/SVT-AV1.git && \
        mkdir -p SVT-AV1/build && \
        cd SVT-AV1/build && \
        cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX="$HOME/ffmpeg_build" -DCMAKE_BUILD_TYPE=Release -DBUILD_DEC=OFF -DBUILD_SHARED_LIBS=OFF .. && \
        make && \
        make install && \
        # Add source and compile for Haivision SRT support
        cd /ffmpeg_sources && \
        git -C srt pull 2> /dev/null || git clone --depth 1 https://github.com/Haivision/srt.git && \
        mkdir -p srt/build && \
        cd srt && \
        ./configure --prefix='/ffmpeg_build' --disable-shared --enable-bonding && \
        cmake -DCMAKE_INSTALL_PREFIX='/ffmpeg_build' -DENABLE_C_DEPS=ON -DENABLE_SHARED=OFF -DENABLE_STATIC=ON && \
        make && \
        make install && \
        ldconfig && \
        # Add source and compile for libklvanc support
        cd /ffmpeg_sources && \
        git -C libklvanc pull 2> /dev/null || git clone --depth 1 https://github.com/stoth68000/libklvanc && \
        mkdir -p libklvanc/build && \
        cd libklvanc && \
        ./autogen.sh --build && \
        ./configure --enable-shared=no --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin" && \
        make && \
        make install && \
        # Add source and compile for Netflix VMAF support
        cd /ffmpeg_sources && \
        git -C libvmaf pull 2> /dev/null || git clone --depth 1 https://github.com/Netflix/vmaf.git && \
        cd ./vmaf/libvmaf && \
        apt -y install ninja-build meson && \
        meson build --buildtype release && \
        ninja -vC build && \
        ninja -vC build install;\
    fi

# Add source for FFMPEG
WORKDIR $HOME/ffmpeg_sources
RUN git clone https://git.ffmpeg.org/ffmpeg.git
WORKDIR $HOME/ffmpeg_sources/ffmpeg
RUN git checkout n$FFMPEG_VERSION
RUN git config --global user.email "hello@mccartney.info" && git config --global user.name "FFMPEG Docker"

# Static source files option - now using git for NDI patching
#RUN wget -O ffmpeg-snapshot.tar.bz2 https://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
#RUN tar xjvf ffmpeg-snapshot.tar.bz2

WORKDIR $HOME/ffmpeg_sources

# Add NDI SDK if option is selected
RUN if [ "$NDI_SUPPORT" = "true" ];\
    then \
        # Get NDI SDK and install it (https://framagit.org/tytan652/ffmpeg-ndi-patch/-/issues/1)
        wget -O "ndiSDK.tar.gz" "$NDI_SDK_URL" &&\
        tar -xf ndiSDK.tar.gz &&\
        # Path to the target script
        SCRIPT_PATH="./Install_NDI_SDK_v5_Linux.sh" &&\
        # Find and replace text
        SEARCH_PATTERN='read -p "Type y or Y to agree: " REPLY' &&\
        REPLACEMENT='REPLY="Y"' &&\
        sed -i "s/${SEARCH_PATTERN}/${REPLACEMENT}/g" "$SCRIPT_PATH" &&\
        # Find and replace text
        SEARCH_PATTERN='	view_eula="\$PAGER"'&&\
        REPLACEMENT='	view_eula=cat' &&\
        sed -i "s/${SEARCH_PATTERN}/${REPLACEMENT}/g" "$SCRIPT_PATH" &&\
        # Make it executable and execute it
        chmod +x $SCRIPT_PATH &&\
        $SCRIPT_PATH && \
        # Copy files to new location
        cp -r ./NDI\ SDK\ for\ Linux/lib/x86_64-linux-gnu /usr/local/lib/x86_64-linux-gnu &&\
        cp -r ./NDI\ SDK\ for\ Linux/include /usr/local/include/ndi &&\
        # Delete the bash scripts and downloads
        rm $SCRIPT_PATH &&\
        rm ndiSDK.tar.gz &&\
        # A Patch to re-add NDI to FFmpeg on building. (https://framagit.org/tytan652/ffmpeg-ndi-patch)
        git clone https://framagit.org/tytan652/ffmpeg-ndi-patch.git &&\
        # Set the directory for the FFmpeg source
        cd ffmpeg &&\
        # Apply the patch for 5.x and later versions
        git am ../ffmpeg-ndi-patch/master_Revert-lavd-Remove-libndi_newtek.patch &&\
        # Add needed files
        cp ../ffmpeg-ndi-patch/libavdevice/libndi_newtek_* libavdevice/;\
    else \
       echo "Newtek NDI flag not set"; \
    fi

WORKDIR $HOME/ffmpeg_sources/ffmpeg

ENV PKG_CONFIG_PATH="$HOME/ffmpeg_build/lib/pkgconfig"
ENV PKG_CONFIG_PATH="$PKG_CONFIG_PATH:$HOME/ffmpeg_sources/srt"

RUN CONFIGURE_OPTIONS="" && FDK_ACC="" &&\
    # Add Non Free Config if option is selected
    if [ "$NON_FREE" = "true" ];\
    then \
       CONFIGURE_OPTIONS="--enable-nonfree --enable-libsrt --disable-libaom --disable-libsvtav1 --enable-libklvanc --enable-libvmaf --enable-libfdk-aac " && \
       FDK_AAC="--enable-libfdk-aac"; \
    fi && \
    # Add NDI Config if option is selected
    if [ "$NDI_SUPPORT" = "true" ];\
    then \
        CONFIGURE_OPTIONS="$CONFIGURE_OPTIONS --enable-libndi_newtek ";\
    fi &&\
    # Add Decklink Config if option is selected
    if [ "$DECKLINK_SUPPORT" = "true" ];\
    then \
        CONFIGURE_OPTIONS="$CONFIGURE_OPTIONS--enable-decklink "; \
    fi && \
    # Print Configuration Options
    echo "Extra Configured Options: $CONFIGURE_OPTIONS" && \
    # Configure Make file before compiling
    ./configure \
        --prefix="$HOME/ffmpeg_build" \
        --pkg-config-flags="--static" \
        --extra-cflags="-I$HOME/ffmpeg_build/include -I$HOME/ffmpeg_sources/BMD_SDK/include" \
        --extra-ldflags="-L$HOME/ffmpeg_build/lib" \
        --extra-libs="-lpthread -lm" \
        --ld="g++" \
        --bindir="$HOME/bin" \
        --enable-gnutls \
        --enable-libass \
        $FDK_AAC \
        --enable-libfreetype \
        --enable-libmp3lame \
        --enable-libopus \
        --enable-libdav1d \
        --enable-libvorbis \
        --enable-libvpx \
        --enable-libx264 \
        --enable-libx265 \
        --enable-gpl \
        $CONFIGURE_OPTIONS

RUN make && \
    make install && \
    hash -r

#Install Node.js
WORKDIR $HOME

RUN apt remove nodejs && apt-get install -y ca-certificates curl gnupg && mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y

#Install Node.js API
WORKDIR $HOME/home/node/app
COPY . .
RUN npm install

CMD [ "sh", "-c", "npm run $NODE_ENV" ]