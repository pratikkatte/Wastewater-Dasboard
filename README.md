# Wastewater-Dasboard
** port forwarding is important while running without docker.

- without docker: forward :8080, 5173 ports
- with docker: forward :80 port


### Run with docker. 

```
docker build -t taxonium-dashboard .
```
```
docker run \
  -v /storage2/pratik/usher-data/pruned_public-2023-12-25.all.masked.jsonl:/data/taxonium.jsonl -e NODE_MEMORY_LIMIT=6144 -e  /data/taxonium.jsonl \
  -p 80:80 \
  dashboard
```

## Run without Docker

### Before starting the dashboard

- Process the taxonium file.
    ```
    pip install taxoniumtools
    ```
    ```
    cd taxonium_component

    usher_to_taxonium -i <input_file>.pb -o <output_taxonium_name>.jsonl --name_internal_nodes -j config_public.json
    ```
- start taxonium backend: follow the instructions in taxonium_backend/README.md
- start frontend: follow the instructions in dashboard/README.md

** dashboard running on http://localhost:5173


## Bam File Data Format


![alt text](image.png)

Main BAM File.

![alt text](image-1.png)

