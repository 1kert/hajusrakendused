#!/bin/bash

dotnet publish -c Release --sc
rsync -avzP bin/Release/net9.0/linux-x64/publish/ zone:/data01/virt124162/hajus
ssh zone "pm2 restart hajusrakendused"