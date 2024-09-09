# Wastewater-Dasboard

## Dashboard

Install taxonium, etc. 
```
yarn run preinstall
```
Install dependencies
```
yarn
```
Run dashboard
```
yarn run dev
```

## Dashboard server
```
pip install -r requirements.txt
```
```
flask run
```
## Taxonium Backend
Start the taxonium-backend server with taxonium file on port 8080. The taxonium-jsonl file can be reitreived from [Taxonium].(https://hgdownload.soe.ucsc.edu/goldenPath/wuhCor1/UShER_SARS-CoV-2//)
```
node server.js --port 8080 --data_file updated_1_public-2023-04-10.all.masked.jsonl --config_json config_public.json
```
