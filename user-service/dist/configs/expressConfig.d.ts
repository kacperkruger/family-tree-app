import { Express } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: string;
        }
    }
}
declare const expressConfig: (app: Express) => void;
export default expressConfig;
//# sourceMappingURL=expressConfig.d.ts.map