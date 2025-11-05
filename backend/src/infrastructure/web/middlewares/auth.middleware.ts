import { Response, NextFunction, RequestHandler } from 'express'; // Request est retiré d'ici
import { verify } from 'jsonwebtoken';
import { config } from '../../config';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request.interface'; // Importer notre nouvelle interface

interface JwtPayload {
  userId: string;
  email: string;
}

// Notez que le type de `req` est maintenant `AuthenticatedRequest`
export const authMiddleware: RequestHandler = (req, res, next) => {
  const authReq = req as AuthenticatedRequest;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid.', success: false });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token, config.jwtSecret) as JwtPayload;
    
    // Remplir la propriété user sur la requête typée localement
    authReq.user = decoded; 
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.', success: false });
  }
};