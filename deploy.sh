#!/bin/bash
# -----------------------------
# Deploy script for rekha-site
# -----------------------------

# ---------- CONFIG ----------
APP_NAME="rekha-site"
REMOTE_USER="rekhers"
REMOTE_HOST="160.153.190.72"
REMOTE_DIR="/home/$REMOTE_USER/$APP_NAME"
LOCAL_DIR="."                       # current folder
TAR_NAME="../$APP_NAME.tar.gz"      # create tarball outside folder to avoid self-archive

# ---------- BUILD ----------
echo "🔧 Installing dependencies..."
npm install

echo "🏗️ Building production version..."
npm run build

# ---------- CLEAN MAC FILES ----------
echo "🧹 Cleaning macOS metadata files..."
find $LOCAL_DIR -name "._*" -delete
find $LOCAL_DIR -name ".DS_Store" -delete

# ---------- PACKAGE ----------
echo "📦 Creating tarball outside the folder..."
rm -f $TAR_NAME   # remove old tarball if it exists
tar -czf $TAR_NAME -C $LOCAL_DIR .

# ---------- COPY TO SERVER ----------
echo "🚀 Copying tarball to server..."
scp $TAR_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# ---------- DEPLOY ON SERVER ----------
echo "💻 Deploying on VPS..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
  set -e
  cd $REMOTE_DIR
  echo "📂 Extracting files..."
  tar -xzf $TAR_NAME --strip-components=1
  echo "🛑 Stopping old PM2 process..."
  pm2 stop $APP_NAME || true
  pm2 delete $APP_NAME || true
  echo "▶️ Starting new PM2 pr
