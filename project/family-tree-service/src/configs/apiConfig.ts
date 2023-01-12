import {Express} from 'express';
import familyTree from '../routes/familyTree';

const apiConfig = (app: Express) => {
    app.use('/api/v1/family-tree', familyTree);
};

export default apiConfig;