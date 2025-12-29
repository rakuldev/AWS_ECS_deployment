# Use official Python image
FROM python:3.11-slim

# Prevent Python from buffering logs
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies (needed for pandas/openpyxl sometimes)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (better layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy Excel file explicitly
COPY vocalbulary_tracker.xlsx /app/vocalbulary_tracker.xlsx

# Expose app port
EXPOSE 5000

# Run Gunicorn as PID 1 (CRITICAL for ECS)
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
