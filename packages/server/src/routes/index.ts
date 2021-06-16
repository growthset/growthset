import { Router } from 'express';
import TestApiRouter from './TestApi';
import JwtRouter from './Jwt';


// Init router and path
const router = Router();

// Add sub-routes
console.log("registering testAPI");
router.use('/test', TestApiRouter);
router.use('/jwt', JwtRouter);

// Export the base-router
export default router;
