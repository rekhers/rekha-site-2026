#!/bin/bash
# -----------------------------
# Reliable deploy script for rekha-site
# -----------------------------

# ---------- CONFIG ----------
APP_NAME="rekha-site"
REMOTE_USER="rekhers"
REMOTE_HOST="160.153.190.72"
REMOTE_DIR="/home/$REMOTE_USER/$APP_NAME"
LOCAL_DIR="."                       # current folder
TAR_NAME="rekha-site.tar.gz"
TAR_PATH="/tmp/$TAR_NAME"

# ---------- BUILD ----------
echo "🔧 Installing dependencies..."
if [ ! -d "node_modules" ]; then
  npm install
else
  echo "✅ node_modules already present — skipping npm install"
fi

echo "🏗️ Building production version..."
npm run build

# ---------- CLEAN MAC FILES ----------
echo "🧹 Cleaning macOS metadata files..."
find $LOCAL_DIR -name "._*" -delete
find $LOCAL_DIR -name ".DS_Store" -delete

# ---------- COPY TO SERVER ----------
echo "🚀 Syncing project files to server..."
rsync -avz --delete --progress \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude ".DS_Store" \
  --exclude "rekha-site.tar.gz" \
  package.json package-lock.json next.config.mjs \
  public src \
  $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# ---------- DEPLOY ON SERVER ----------
echo "💻 Deploying on VPS..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
  set -e
  cd $REMOTE_DIR
  echo "📦 Installing dependencies on server..."
  npm install
  echo "🏗️ Building production version on server..."
  npm run build
  echo "🧹 Cleaning PM2 process..."
  pm2 delete "$APP_NAME" || true
  echo "▶️ Starting PM2 process..."
  pm2 start npm --name "$APP_NAME" -- run start
  pm2 save
  echo "📋 PM2 status:"
  pm2 list
  echo "✅ Deployment complete!"
EOF
