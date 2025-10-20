import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userProfileId = decoded.profile_id;
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export default authMiddleware;