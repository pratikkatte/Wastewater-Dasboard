#!/usr/bin/env python3
import json
import os
import sys

def main():
    if len(sys.argv) != 4:
        print("Usage: python projects.py <DIR> <TAXONIUM_FILE_PATH> <REF>")
        sys.exit(1)
    DIR = sys.argv[1]
    taxonium_file_path = sys.argv[2]
    ref = sys.argv[3]

    with open(ref+'.fai', 'r') as f:
        ref_data = f.read().split('\t')
    
    reference_name = ref_data[0]
    reference_start = 0
    reference_end = ref_data[1]

    path = './results/projects.json'

    if os.path.exists(path):
        with open(path) as f:
            data = json.load(f)
    else:
        data = {}

    data[DIR] = {
        'taxonium_file_path': os.path.basename(taxonium_file_path) if os.path.exists(taxonium_file_path) else '',
        'reference_name': reference_name,
        'start': reference_start,
        "end": reference_end,
        'ref_file': os.path.basename(ref),
        'taxonium_size': int(os.path.getsize(taxonium_file_path) / (1024 * 1024))
    }

    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    main()
