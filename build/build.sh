# build.sh for QSC Mobile
# Copyright (C) 2013 QSC Mobile Team
# Time-stamp: <2013-03-26 20:56:08 Zeno Zeng>

rm -r ../production
rm -r ../testing
rm -r ../production-cache-enabled
# mkdir
mkdir -p ../production/js
mkdir -p ../testing/js
# js
jake
cd ../js-build
find . -name "*-src*" -mtime -1 | xargs -i mv {} ../testing/js
rename 's/-src//' ../testing/js/*.js
find . -name "*-min*" -mtime -1 | xargs -i mv {} ../production/js
rename 's/-min//' ../production/js/*.js
# other files
cd ../src
# css
mkdir -p ../production/css
cp css/styles.css ../production/css/styles.css
mkdir -p ../testing/css
cp css/styles.css ../testing/css/styles.css
# image
cp -r img ../production/img
cp -r img ../testing/img
# cache enabled version
cp -r ../production ../production-cache-enabled
# main file
echo "<script>window.location.href='main.html';</script>" >> ../production/index.html
cp building.html ../testing/index.html
cp building.html ../production/main.html
cp building.html ../production-cache-enabled/index.html
# extra file for android
cp config.xml ../production/config.xml
cp md5.php ../production/md5.php
# add manifest
cd ../production-cache-enabled
sed -i -e "1s/<\!doctype html>/<\!doctype html><html manifest="cache.manifest">/" index.html
echo -e "CACHE MANIFEST\n#UnixTimeStamp:$(date +%s)" >> cache.manifest
echo -e "NETWORK:
http://m.myqsc.com/php-dev/
http://m.myqsc.com/php-stable/
http://m.myqsc.com/stable/
http://m.myqsc.com/dev/" >> cache.manifest
echo "CACHE:" >> cache.manifest
cd css
echo $(ls |sed 's/^/css\//g') >> ../cache.manifest.1
cd ../js
echo $(ls |sed 's/^/js\//g') >> ../cache.manifest.1
cd ../img
echo $(ls |sed 's/^/img\//g') >> ../cache.manifest.1
cd ..
sed -i -r -e 's/[ \t]+/\n/g' cache.manifest.1
cat cache.manifest.1 >> cache.manifest
rm cache.manifest.1
cd ..
rm -r js-build 
