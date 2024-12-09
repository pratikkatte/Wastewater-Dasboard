# Wastewater-Dasboard
** port forwarding is important while running from server. 
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
Start the taxonium-backend server with taxonium file on port 8080. The taxonium-jsonl file can be reitreived from [Taxonium](https://hgdownload.soe.ucsc.edu/goldenPath/wuhCor1/UShER_SARS-CoV-2//).
```
node server.js --port 8080 --data_file latest.jsonl --config_json config_public.json
```
## Bam File Data Format

### Header Section
- Each node that needs to be annotated in the tree is assigned a unique Read-Group(RG) ID.
  
  Example:
  <img width="1192" alt="image" src="https://github.com/user-attachments/assets/f25d1f02-4da4-444c-a9e0-0dfad49d05ed">

- Each read is assigned one or more than one group-IDs in the BAM File.
  
  Example:
  <img width="1184" alt="image" src="https://github.com/user-attachments/assets/833b971a-270d-4318-a952-481f6f40af4f">

- Custom Tag (EP): Equal Parsimony Parity Score (EPP) for each read.
  
  Example:
  <img width="1262" alt="image" src="https://github.com/user-attachments/assets/e9e5a555-7e06-4476-b605-8007d31d1771">

## Miscellaneous commands

- SAM File to BAM File:
  ```
  samtools view -Sb input.bam -o output.bam
  ```
- sorting and indexing BAM file
  ```
  samtools sort input.bam -o output.bam && samtools index output.bam
  ```
