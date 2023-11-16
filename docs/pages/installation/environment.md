---
layout: page
title: Environment Variables
parent: Installation
nav_order: 2
---

# Environment Variables

Docker image environment variables are given below

| Variable      | Default        | Required | Type    | Description                                                                        |
| ------------- | -------------- | -------- | ------- | ---------------------------------------------------------------------------------- |
| PORT          | 80             | No       | Integer | Port that the backend API runs on                                                  |
| HOST          | localhost      | No       | String  |                                                                                    |
| RATE_LIMIT    | 1000           | No       | Integer | The number of requests allowed per client to the API in a 5 minute windows         |
| NODE_ENV      | production     | No       | String  | Options are "production" or "development"                                          |
| WEB_GUI       | true           | No       | Boolean | Determines whether the API runs a simple frontend or not                           |
| AUTH_ENABLE   | false          | No       | Boolean | Use JWT auth for API                                                               |
| AUTH_USER     | admin          | No       | String  | Auth username for login                                                            |
| AUTH_PASSWORD | ffmp3gap1      | No       | String  | Auth password for login                                                            |
| AUTH_KEY      | averysecretkey | No       | String  | Private key for generating JWT tokens. Change this if you're using authentication  |
| MEDIA_PATH    | ./data/media   | No       | String  | Directory to keep media in. Useful to change if media is stored in a network share |
| QUEUE_SZIE    | 5              | No       | Integer | Number of FFMpeg processes that can run simultaneously                             |
| LOG_FOLDER    | logs           | No       | String  | Folder that logs are stored in                                                     |
| LOG_NAME      | ffmpeg         | No       | String  | Log file names                                                                     |
| LOG_LEVEL     | info           | No       | String  | Logging level "debug", "error", "info", "http" or "warning"                        |
