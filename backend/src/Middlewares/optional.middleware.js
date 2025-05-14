import jwt from "jsonwebtoken";

export const optionalJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    req.user = null;
    return next();
  }
  console.log(token);
  const payload = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      req.user = err ? null : decoded;
      console.log(req.user);
      next();
    }
  );
};
