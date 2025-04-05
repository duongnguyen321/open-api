import { SetMetadata } from '@nestjs/common';

const Public = () => SetMetadata('isPublic', true);
export default Public;
