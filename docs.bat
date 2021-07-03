@echo off

rm -rf _site/
set cwd=%cd%


echo Generating
docfx

echo Deploying
REM Make sure the folder exists and is empty
REM ssh docs.tgrhavoc.co.uk "mkdir -p /sharedfolders/websites/docs.tgrhavoc.co.uk/livemap-interface/ && rm -rf /sharedfolders/websites/docs.tgrhavoc.co.uk/livemap-interface/*"
REM scp -r _site/* docs.tgrhavoc.co.uk:/sharedfolders/websites/docs.tgrhavoc.co.uk/livemap-interface/
xcopy /E /I _site %DOC_WEBSITE%\livemap-interface /Y

cd /D %DOC_WEBSITE%
git add livemap-interface\
git commit -m "Update livemap interface documentation"
git push

cd /D %cwd%


echo Done!
