import { Request } from 'express';

const extractTokenFromHeader = (req: Request): string | undefined => {
  console.log(req.headers.authorization);
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export default extractTokenFromHeader;
