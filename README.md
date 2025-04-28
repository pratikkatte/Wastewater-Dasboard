# Wastewater-Dasboard
** port forwarding is important while running without docker.

- without docker: forward :8080, 5173 ports
- with docker: forward :80 port

## Starting up the dashboard via Docker


### Edit the `.env` file

change the path to the taxonium jsonl file. 
```
HOST_FILE_PATH="./pruned_public-2023-12-25.all.masked.jsonl"
```

### Run the docker containers. 
```
docker compose --env-file .env up --build
```

## Starting Dashboard without Docker

### Before starting the dashboard

- Process the taxonium file.
    ```
    pip install taxoniumtools
    ```
    ```
    cd taxonium_component

    usher_to_taxonium -i <input_file>.pb -o <output_taxonium_name>.jsonl --name_internal_nodes -j config_public.json
    ```
- start taxonium backend
    ```
    cd taxonoium_backend
    yarn install
    node server.js --port 8080 --data_file <output_taxonium_name_path>.jsonl
    ```

### Running the Dashboard
```
cd dashboard
yarn preinstall && yarn
yarn run dev 

```
** dashboard running on http://localhost:5173


## Bam File Data Format


![alt text](image.png)

Main BAM File.

![alt text](image-1.png)

## Miscellaneous commands

- SAM File to BAM File:
  ```
  samtools view -Sb input.bam -o output.bam
  ```
- sorting and indexing BAM file
  ```
  samtools sort input.bam -o output.bam && samtools index output.bam
  ```
