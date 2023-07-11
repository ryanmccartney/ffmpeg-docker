---
layout: page
title: VMAF
nav_order: 4
has_children: false
---

# VMAF Support

[VMAF](https://github.com/Netflix/vmaf) - Video Multi-Method Assessment Fusion is a [Netflix](https://github.com/Netflix) Open Source project for evaluating the quality of video files.

FFMPEG-Docker provides build instructions for VMAF by default, and exposes an API endpoint for processing files with VMAF and generating results.

Media files can be processes relative to the `media` directory and result exported to a `MY-VMAF-TEST.json` file.

## Endpoints

* `api/vmaf`

## Running a VMAF test

GET - `api/vmaf/file`

Request Body

```
{
    "input": {
        "filename": "test-file.mov"
    },
    "reference": {
        "filename": "reference-file.mov"
    },
    "output": "test-output.json",
    "model": "vmaf_v0.6.1.json"
}
```

## Underlying Command

Sending the above API command results in the following underlying command being run on the server is;

`ffmpeg -i /home/node/app/data/media/good-as-hell.mov -i /home/node/app/data/media/good-as-hell.mov -y -lavfi libvmaf=model_path=/ffmpeg_sources/vmaf/model/vmaf_v0.6.1.json:log_fmt=json:psnr=1:ssim=1:ms_ssim=1:log_path=/home/node/app/data/vmaf/test01.json -f null -`

## Generating Graphs from the outputs

In the example above the parameter `output` was set to `test-output.json`. This means that all of the results are saved in text to this file.

This can be directly downloaded as follows `http://172.26.182.69:3000/api/vmaf/results/download?filename=test-output.json`

A graph of the results can be generated here - `http://172.26.182.69:3000/html/chart.html?filename=test-output.json` using Chart.js.

Rememebr to change the filename query in the URL to the one set as the `output` parameter when running the test.

## Docker Build

```
# Add source and compile for Netflix VMAF support
RUN git -C libvmaf pull 2> /dev/null || git clone --depth 1 https://github.com/Netflix/vmaf.git && \
    cd ./vmaf/libvmaf && \
    apt -y install ninja-build meson && \
    meson build --buildtype release && \
    ninja -vC build && \
    ninja -vC build install
```

Adding VMAF support to FFMPEG Build configuration

```
RUN ./configure \
        ...
        --enable-libvmaf
```