cd backend
yarn build
cd ../frontend
yarn build
cd ..
cp -r frontend/dist backend/dist/public
scp -r  backend/dist/* nativeflow@s1.ct8.pl:domains/zapisy.wydarzenia.napwr.pl/public_nodejs/
ssh nativeflow:Czworaczki1997@s1.ct8.pl "cd domains/zapisy.wydarzenia.napwr.pl/public_nodejs/;npm install;devil www restart zapisy.wydarzenia.napwr.pl"

