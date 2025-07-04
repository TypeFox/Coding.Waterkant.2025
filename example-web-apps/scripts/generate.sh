#!/bin/bash

model_path="$1"
project_name="$2"

if [ -z "$model_path" ] || [ -z "$project_name" ]; then
    echo "Usage: $0 <models/my-model.swa> <project_name>"
    exit 1
fi

if [ ! -f "${model_path}" ]; then
    echo "Model file not found: ${model_path}"
    exit 1
fi

output_dir="output/${project_name}"

if [ -d "${output_dir}" ]; then
    echo "Output directory already exists: ${output_dir}"
    echo -n "Overwrite (y/n)?"
    read -n 1 -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "${output_dir}"
    else
        exit 1
    fi
    echo
else
    mkdir -p "${output_dir}" && echo "Output directory created: ${output_dir}"
fi

node ../packages/semiformal-web-apps/bin/cli.js parse "${model_path}" | node ../packages/generator-ai/out/cli.cjs "${output_dir}"
