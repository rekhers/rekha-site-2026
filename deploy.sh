#!/bin/bash

APP_NAME="rekha-site"
REMOTE_USER="rekhers"
REMOTE_HOST="160.153.190.72"
REMOTE_DIR="/home/$REMOTE_USER/$APP_NAME"
LOCAL_DIR="./$APP_NAME"
TAR_NAME="$APP_NAME.tar.gz"

# 1. Build locally
npm install
npm run build

# 2. Clean macOS files
find $LOCAL_DIR -name "._*" -delete

# 3. Package
tar -czf $TAR_NAME -C $LOCAL_DIR .

# 4. Copy to VPS
scp $TAR_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# 5. Deploy on VPS
ssh $REMOTE_USER@$REMOTE_HOST << EOF
cd $REMOTE_DIR
tar -xzf $TAR_NAME --strip-components=1
pm2 stop $APP_NAME || true
pm2 delete $APP_NAME || true
pm2 start npm --name "$APP_NAME" -- run start
pm2 save
EOF

echo "Deployment complete! https://rekhatenjarla.com"