# NexusBB Backend

This is the backend server for the NexusBB inventory management system. It provides a RESTful API to manage inventory, process CSV uploads, and calculate dashboard metrics.

## Prerequisites

- Node.js (v14 or later)
- npm

## Installation

1. Clone the repository.
2. Navigate to the `nexusbb-backend` directory:
   ```bash
   cd nexusbb-backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Server

1. To start the server, run the following command:
   ```bash
   node server.js
   ```
2. The server will start on port 3001 by default. You will see the message:
   ```
   Server is running on port 3001
   ```

## API Endpoints

### Inventory

- `GET /api/inventory/:warehouseId`
  - Retrieves all inventory items for a specific warehouse.
- `POST /api/inventory/upload`
  - Uploads a CSV file to update inventory data. The file should be sent as multipart/form-data with the key `file`.
  - CSV columns: `productCode`, `warehouseName`, `quantity`, `value`, `supplier`.

### Dashboard

- `GET /api/dashboard/metrics`
  - Returns key metrics for the dashboard, including total inventory value, the top product by quantity, and the top warehouse by value.
- `GET /api/dashboard/central-prediction`
  - Returns a list of purchase suggestions for the central warehouse based on a weighted average of stock in satellite warehouses.