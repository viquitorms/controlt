import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      profile_id: decoded.profile_id
    };

    req.userId = decoded.id;

    return next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export default authMiddleware;