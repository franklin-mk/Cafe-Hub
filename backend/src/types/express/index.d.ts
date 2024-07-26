//src/types/express/index.d.ts
import { IAdmin, ICustomer } from '../../interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: IAdmin | ICustomer;
    }
  }
}