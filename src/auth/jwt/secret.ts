import { EnvironmentService } from '../../environment/environment.service';
import { Environment } from '../../environment/model/env.model';

const environmentService = new EnvironmentService();
const env: Environment = environmentService.env();
const secret = env.JWT_SECRET;

export const jwtConstants = {
  secret,
};
