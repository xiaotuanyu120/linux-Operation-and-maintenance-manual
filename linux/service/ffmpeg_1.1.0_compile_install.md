---
title: ffmpeg 1.1.0 compile install(centos)
date: 2017-08-08 09:19:00
categories: linux/service
tags: [ffmpeg]
---
### ffmpeg 1.1.0 compile install(centos)

---

### 1. centos6.5编译安装ffmpeg
[本文主要参照文档](https://trac.ffmpeg.org/wiki/CompilationGuide/Centos)
#### 1) 准备环境
``` bash
yum install autoconf automake bzip2 cmake freetype-devel gcc gcc-c++ git libtool make mercurial pkgconfig zlib-devel
mkdir -p /usr/local/ffmpeg/{src,bin}
```
> src用来储存编译文件，bin用来储存命令

#### 2) 安装nasm-2.13
之所以不采用文档中的yum源，是因为centos6中的glibc是2.12，而nasm-2.13依赖glibc-2.14，所以我们编译安装glibc-2.14和nasm-2.13
```
wget http://ftp.gnu.org/gnu/glibc/glibc-2.14.tar.gz
tar zxvf glibc-2.14.tar.gz
cd glibc-2.14
mkdir build
cd build
../configure --prefix=/usr/local/glibc-2.14
make -j4
make install
export LD_LIBRARY_PATH=/usr/local/glibc-2.14/lib

wget http://www.nasm.us/pub/nasm/releasebuilds/2.13.01/nasm-2.13.01.tar.gz
tar zxvf nasm-2.13.01.tar.gz
cd nasm-2.13.01
./configure --prefix=/usr
make
make install
```


#### 3) 安装yasm
``` bash
cd /usr/local/ffmpeg/src
curl -O http://www.tortall.net/projects/yasm/releases/yasm-1.3.0.tar.gz
tar xzvf yasm-1.3.0.tar.gz
cd yasm-1.3.0
./configure --prefix="/usr/local/ffmpeg/src" --bindir="/usr/local/ffmpeg/bin"
make
make install
```

#### 4) 安装libx264
``` bash
cd /usr/local/ffmpeg/src
git clone --depth 1 http://git.videolan.org/git/x264
cd x264
PKG_CONFIG_PATH="/usr/local/ffmpeg/src/lib/pkgconfig" ./configure --prefix="/usr/local/ffmpeg/src" --bindir="/usr/local/ffmpeg/bin" --enable-static
make
make install
```

#### 5) 安装libx265
``` bash
cd /usr/local/ffmpeg/src
hg clone https://bitbucket.org/multicoreware/x265
cd x265/build/linux
cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX="/usr/local/ffmpeg/src" -DENABLE_SHARED:bool=off ../../source
make
make install
```

#### 6) 安装libfdk_aac
``` bash
cd /usr/local/ffmpeg/src
git clone --depth 1 https://github.com/mstorsjo/fdk-aac
cd fdk-aac
autoreconf -fiv
./configure --prefix="/usr/local/ffmpeg/src" --disable-shared
make
make install
```

#### 7) 安装libmp3lame
``` bash
cd /usr/local/ffmpeg/src
curl -L -O http://downloads.sourceforge.net/project/lame/lame/3.99/lame-3.99.5.tar.gz
tar xzvf lame-3.99.5.tar.gz
cd lame-3.99.5
./configure --prefix="/usr/local/ffmpeg/src" --bindir="/usr/local/ffmpeg/bin" --disable-shared --enable-nasm
make
make install
```

#### 8) 安装libopus
``` bash
cd /usr/local/ffmpeg/src
curl -O https://archive.mozilla.org/pub/opus/opus-1.1.5.tar.gz
tar xzvf opus-1.1.5.tar.gz
cd opus-1.1.5
./configure --prefix="/usr/local/ffmpeg/src" --disable-shared
make
make install
```

#### 9) 安装libogg
``` bash
cd /usr/local/ffmpeg/src
wget http://downloads.xiph.org/releases/ogg/libogg-1.3.2.tar.gz
tar xzvf libogg-1.3.2.tar.gz
cd libogg-1.3.2
./configure --prefix="/usr/local/ffmpeg/src" --disable-shared
make
make install
```

#### 10) 安装libvorbis
``` bash
cd /usr/local/ffmpeg/src
wget http://downloads.xiph.org/releases/vorbis/libvorbis-1.3.4.tar.gz
tar xzvf libvorbis-1.3.4.tar.gz
cd libvorbis-1.3.4
./configure --prefix="/usr/local/ffmpeg/src" --with-ogg="/usr/local/ffmpeg/src" --disable-shared
make
make install
```

#### 11) 安装libvpx
``` bash
cd /usr/local/ffmpeg/src
git clone --depth 1 https://chromium.googlesource.com/webm/libvpx.git
cd libvpx
./configure --prefix="/usr/local/ffmpeg/src" --disable-examples --disable-unit-tests --enable-vp9-highbitdepth --as=yasm
PATH="/usr/local/ffmpeg/bin:$PATH" make
make install
```

#### 12) 安装ffmpeg
``` bash
cd /usr/local/ffmpeg/src
curl -O http://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
tar xjvf ffmpeg-snapshot.tar.bz2
cd ffmpeg
PKG_CONFIG_PATH="/usr/local/ffmpeg/src/lib/pkgconfig" ./configure --prefix="/usr/local/ffmpeg/src" \
  --extra-cflags="-I/usr/local/ffmpeg/src/include" --extra-ldflags="-L/usr/local/ffmpeg/src/lib -ldl" \
  --bindir="/usr/local/ffmpeg/bin" --pkg-config-flags="--static" \
  --enable-gpl \
  --enable-libfdk_aac \
  --enable-libfreetype \
  --enable-libmp3lame \
  --enable-libopus \
  --enable-libvorbis \
  --enable-libvpx \
  --enable-libx264 \
  --enable-libx265 \
  --enable-nonfree
make
make install
hash -r
```
