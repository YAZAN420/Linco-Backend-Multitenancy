import { DashboardReports } from 'src/dashboard/application/interfaces/dashboard-report-read-models';

export class DashboardReportsResponseDto {
  constructor(
    readonly learningEngagement: DashboardReports['learningEngagement'],
    readonly platformHealth: DashboardReports['platformHealth'],
    readonly reportCatalog: DashboardReports['reportCatalog'],
  ) {}
}
