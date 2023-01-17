import jwt from "jsonwebtoken";
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Request headers: ", req.headers);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("Token: ", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("Error verifying token: ", err);
        return res.sendStatus(403);
      }

      console.log("Decoded user: ", user);
      req.user = user;
      next();
    });
  } else {
    console.log("Authorization header not found in request headers.");
    res.sendStatus(401);
  }
};
export default authenticateJWT;
