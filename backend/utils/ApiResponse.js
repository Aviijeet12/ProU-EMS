class ApiResponse {
  constructor({ statusCode = 200, message = 'Success', data = null, meta = null }) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
    if (meta) {
      this.meta = meta;
    }
  }
}

export default ApiResponse;
