import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const FRONTEND_URL_SOCKET = process.env.FRONTEND_URL