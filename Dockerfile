# NAME: Dockerfile
# AUTH: Ryan McCartney <ryan@mccartney.info>
# DATE: 08/01/2023
# DESC: FFmpeg compiled with configurable options link BMD Decklink or Newtec NDI

FROM ubuntu:lunar

ARG DECKLINK_SUPPORT="false"
ARG DECLINK_SDK_URL="https://sw.blackmagicdesign.com/DeckLink/v12.4.2/Blackmagic_DeckLink_SDK_12.4.2.zip"
ARG DECKLINK_DRIVER_URL="https://sw.blackmagicdesign.com/DesktopVideo/v12.4.1/Blackmagic_Desktop_Video_Linux_12.4.1.tar.gz"
ARG DECKLINK_DRIVER_VERSION="12.4.1"

ARG NDI_SUPPORT="false"
ARG NDI_SDK_URL="https://downloads.ndi.tv/SDK/NDI_SDK_Linux/Install_NDI_SDK_v5_Linux.tar.gz"

ENV DEBIAN_FRONTEND=noninteractive

# Create folder structure
RUN mkdir $HOME/ffmpeg_sources
RUN mkdir $HOME/bin

# Install additional dependencies
RUN apt update
RUN apt -y install \
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
  libarchive-tools

# Get Blackmagic Desktop Video SDK (Link expires... You'll need to get a new one)
RUN if [ "$DECKLINK_SUPPORT" = "true" ];\
    then \
        #Decklink Driver: Download and extract
        wget -O "desktop-video-driver.tar.gz" "$DECKLINK_DRIVER_URL" &&\
        tar -xvf desktop-video-driver.tar.gz &&\
        #Decklink Driver: Get .deb name and location
        DECKLINK_DRIVER_DEB="driver.deb" &&\
        SEARCH_DIR="./Blackmagic_Desktop_Video_Linux_$DECKLINK_DRIVER_VERSION/deb/x86_64" &&\ 
        for FILE in "$SEARCH_DIR"/*;\
        do\
            echo $FILE &&\
            DECKLINK_DRIVER_DEB=$FILE;\
        done &&\
        #Decklink Driver: Install the .deb
        set -e &&\
        dpkg --install $DECKLINK_DRIVER_DEB || true &&\
        apt install -f -y &&\
        dpkg --install $DECKLINK_DRIVER_DEB || true &&\
        #Decklink Driver: Cleanup files and folder
        rm -r "./Blackmagic_Desktop_Video_Linux_$DECKLINK_DRIVER_VERSION" &&\
        rm "desktop-video-driver.tar.gz" &&\
        #Decklink SDK: Get SDK, extract and copy
        wget -O "desktopvideoSDK.zip" "$DECLINK_SDK_URL" &&\
        bsdtar -xf desktopvideoSDK.zip -s'|[^/]*/|./desktopvideoSDK/|' &&\
        cp -r ./desktopvideoSDK/Linux/ $HOME/ffmpeg_sources/BMD_SDK;\
    else \
       echo "Decklink flag not set"; \
    fi

WORKDIR $HOME/ffmpeg_sources

ENV PATH="$HOME/bin:${PATH}"
RUN echo "export PATH=$HOME/bin:${PATH}" >> "$HOME/.bashrc"

RUN git -C fdk-aac pull 2> /dev/null || git clone --depth 1 https://github.com/mstorsjo/fdk-aac && \
    cd fdk-aac && \
    autoreconf -fiv && \
    ./configure --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin" --disable-shared && \
    make && \
    make install

RUN git -C SVT-AV1 pull 2> /dev/null || git clone https://gitlab.com/AOMediaCodec/SVT-AV1.git && \
    mkdir -p SVT-AV1/build && \
    cd SVT-AV1/build && \
    cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX="$HOME/ffmpeg_build" -DCMAKE_BUILD_TYPE=Release -DBUILD_DEC=OFF -DBUILD_SHARED_LIBS=OFF .. && \
    make && \
    make install

RUN git -C srt pull 2> /dev/null || git clone --depth 1 https://github.com/Haivision/srt.git && \
    mkdir -p srt/build && \
    cd srt && \
    ./configure --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin" --disable-shared && \
    cmake -DCMAKE_INSTALL_PREFIX="$HOME/ffmpeg_build" -DENABLE_C_DEPS=ON -DENABLE_SHARED=OFF -DENABLE_STATIC=ON && \
    make && \
    make install && \
    ldconfig

WORKDIR $HOME/ffmpeg_sources
RUN git clone https://git.ffmpeg.org/ffmpeg.git
WORKDIR $HOME/ffmpeg_sources/ffmpeg
RUN git checkout n5.0
RUN git config --global user.email "hello@mccartney.info"
RUN git config --global user.name "FFmpeg Docker"

# Static source files option - now using git for NDI patching
#RUN wget -O ffmpeg-snapshot.tar.bz2 https://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
#RUN tar xjvf ffmpeg-snapshot.tar.bz2

WORKDIR $HOME/ffmpeg_sources

RUN if [ "$NDI_SUPPORT" = "true" ];\
    then \
        # Get NDI SDK and install it (https://framagit.org/tytan652/ffmpeg-ndi-patch/-/issues/1)
        wget -O "ndiSDK.tar.gz" "$NDI_SDK_URL" &&\
        tar -xf ndiSDK.tar.gz &&\
        sed -i 's/read -p "Type y or Y to agree: " REPLY if [ "$REPLY" != "y" ] && [ "$REPLY" != "Y" ]; then exit 1 fi/ /g' Install_NDI_SDK_v5_Linux.sh &&\
        chmod +x Install_NDI_SDK_v5_Linux.sh &&\
        ./Install_NDI_SDK_v5_Linux.sh && \
        # A Patch to readd NDI to FFmpeg on building. (https://framagit.org/tytan652/ffmpeg-ndi-patch)
        git clone https://framagit.org/tytan652/ffmpeg-ndi-patch.git &&\
        # Set the directory for the FFmpeg source
        cd ffmpeg &&\
        # Apply the patch for 5.x and later versions
        git am ../ffmpeg-ndi-patch/master_Revert-lavd-Remove-libndi_newtek.patch &&\
        # Add needed files
        cp ../ffmpeg-ndi-patch/libavdevice/libndi_newtek_* libavdevice/ ;\
    else \
       echo "Newtek NDI flag not set"; \
    fi

WORKDIR $HOME/ffmpeg_sources/ffmpeg

ENV PKG_CONFIG_PATH="$HOME/ffmpeg_build/lib/pkgconfig"
ENV PKG_CONFIG_PATH=$PKG_CONFIG_PATH:$HOME/ffmpeg_sources/srt

RUN ./configure \
        --prefix="$HOME/ffmpeg_build" \
        --pkg-config-flags="--static" \
        --extra-cflags="-I$HOME/ffmpeg_build/include -I$HOME/ffmpeg_sources/BMD_SDK/include" \
        --extra-ldflags="-L$HOME/ffmpeg_build/lib" \
        --extra-libs="-lpthread -lm" \
        --ld="g++" \
        --bindir="$HOME/bin" \
        --enable-gnutls \
        --enable-libass \
        --enable-libfdk-aac \
        --enable-libfreetype \
        --enable-libmp3lame \
        --enable-libopus \
        --enable-libdav1d \
        --enable-libvorbis \
        --enable-libvpx \
        --enable-libx264 \
        --enable-libx265 \
        --enable-gpl \
        --enable-nonfree \
 #       --enable-libndi_newtek \
        --enable-decklink \
        --enable-libsrt \
        --disable-libaom \
        --disable-libsvtav1

RUN make && \
    make install && \
    hash -r

#Install Node.js
WORKDIR $HOME
RUN wget -c https://deb.nodesource.com/setup_18.x | bash -
RUN apt -y install nodejs
RUN apt -y install npm

#Install Node.js API
WORKDIR $HOME/home/node/app
COPY . .
RUN npm install

CMD [ "sh", "-c", "npm run $NODE_ENV" ]