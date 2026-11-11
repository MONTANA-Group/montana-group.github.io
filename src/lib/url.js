const base = import.meta.env.BASE_URL.replace(/\/$/, '');
// u('/cars/x/') -> '/repo/cars/x/' ; u('cars/a.jpg') -> '/repo/cars/a.jpg'
export const u = (p = '/') => base + '/' + String(p).replace(/^\//, '');
