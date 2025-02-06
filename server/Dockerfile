# Use a lightweight Python image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements file to install dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your FastAPI code
COPY . .

# Expose port 5000 (FastAPI default port)
EXPOSE 8000

# Command to start the FastAPI app
CMD ["uvicorn", "interface:app", "--host", "0.0.0.0", "--port", "8000"]
