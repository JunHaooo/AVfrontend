# Use official Python slim image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy only requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the RAG API code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Set environment variables (can be overridden in docker-compose)
ENV DEEPSEEK_API_KEY=""
ENV CHROMA_PERSIST_DIRECTORY=/app/chroma

# Run FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
