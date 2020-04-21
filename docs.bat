@echo off

rm -rf _site/

echo Generating
docfx

echo Deploying
REM Make sure the folder exists and is empty
ssh docs.tgrhavoc.co.uk "mkdir -p /sharedfolders/websites/docs.tgrhavoc.co.uk/livemap-interface/ && rm -rf /sharedfolders/websites/docs.tgrhavoc.co.uk/livemap-interface/*"
scp -r _site/* docs.tgrhavoc.co.uk:/sharedfolders/websites/docs.tgrhavoc.co.uk/livemap-interface/

echo Done!
