INSTALLATION

npm install


DEVELOPMENT

npm run serve


PRODUCTION 

npm run build


TO INCREASE THE FS WATCHER COUNT

echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

