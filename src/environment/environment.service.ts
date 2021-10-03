import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Environment } from './model/env.model';

@Injectable()
export class EnvironmentService {

    private readonly envConfig: any;

    constructor() {
        const envPath: string = `env/${process.env.NODE_ENV || 'development'}.env`;
        this.envConfig = dotenv.parse(fs.readFileSync(envPath));
    }

    env(): Environment {
        return this.envConfig;
    }

    mongo(): string {
        return this.envConfig.MONGO_LINK;
    }
}
