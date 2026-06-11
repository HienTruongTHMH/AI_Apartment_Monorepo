export function sanitizeUpdateData<T extends Record<string, any>>(data: T): Partial<T> {
  const sanitized: Partial<T> = {};
  
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      // Loại bỏ các trường undefined, null (nếu muốn chặt chẽ), hoặc chuỗi rỗng ""
      if (value !== undefined && value !== null && value !== '') {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}