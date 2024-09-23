import { AccessControl } from "accesscontrol";
const ac = new AccessControl();
ac.grant('user')
  .createOwn('photo') 
  .readOwn('photo')   
  .deleteOwn('photo');

ac.grant('admin')
  .extend('user') 
  .readAny('photo')  
  .deleteAny('photo'); 
function checkPermission(action, resource) {
    return (req, res, next) => {
      const role = req.user.role; 
      const permission = ac.can(role)[action](resource);
  
      if (permission.granted) {
        next(); 
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    };
  }
  export {checkPermission}