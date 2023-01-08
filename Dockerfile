FROM ubuntu:lunar

#Get a download link here - https://www.blackmagicdesign.com/support/download/2438c76b9f734f69b4a914505e50a5ab/Linux
ARG DESKTOP_VIDEO_SDK_URL="https://sw.blackmagicdesign.com/DeckLink/v12.4.2/Blackmagic_DeckLink_SDK_12.4.2.zip"
ARG DECKLINK_SUPPORT="false"
ARG NDI_SUPPORT="false"

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

# Get Blackmagic Desktop Video Install Files (Link expires... You'll need to get a new one)
RUN if [ "$DECKLINK_SUPPORT" = "true" ];\
    then \
        wget -O "desktopvideoSDK.zip" "$DESKTOP_VIDEO_SDK_URL" &&\
        bsdtar -xf desktopvideoSDK.zip -s'|[^/]*/|./desktopvideoSDK/|' &&\
        cp -r ./desktopvideoSDK/Linux/ $HOME/ffmpeg_sources/BMD_SDK;\
    else \
       echo "Decklink flag not set"; \
    fi

RUN if [ "$NDI_SUPPORT" = "true" ];\
    then \
        # A Patch to readd NDI to FFmpeg on building. (https://framagit.org/tytan652/ffmpeg-ndi-patch)
        git clone https://framagit.org/tytan652/ffmpeg-ndi-patch.git &&\
        git clone https://git.ffmpeg.org/ffmpeg.git &&\
        cd  $HOME/ffmpeg_sources &&\
        # Checkout to 4.2 version or later
        git checkout n4.4 &&\
        # Apply the patch for 5.x and later versions
        git am ../ffmpeg-ndi-patch/master_Revert-lavd-Remove-libndi_newtek.patch &&\
        # Add needed files
        cp ../ffmpeg-ndi-patch/libavdevice/libndi_newtek_* libavdevice/;\
    else \
       echo "Newtek NDI flag not set"; \
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

RUN wget -O ffmpeg-snapshot.tar.bz2 https://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
RUN tar xjvf ffmpeg-snapshot.tar.bz2

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
#        --enable-libndi_newtek \
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