import {Module} from '@nestjs/common';
import {GymManagementController} from './gym-management.controller';
import {GymManagementService} from './gym-management.service';

@Module({
  controllers: [GymManagementController],
  providers: [GymManagementService],
})
export class GymManagementModule {}
