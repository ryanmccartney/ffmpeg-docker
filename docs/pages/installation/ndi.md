---
layout: page
title: Newtec NDI
parent: Installation
nav_order: 2
---

# NDI Support

`ffmpeg -i sushi-restaurant-loop.mp4 -vf format=rgb32 -c:v libndi_newtek -pix_fmt uyvy422 -f libndi_newtek "NDI Test Stream"`