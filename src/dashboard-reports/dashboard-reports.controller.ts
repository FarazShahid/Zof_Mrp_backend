import { Get, Query, UseInterceptors } from '@nestjs/common';
import { DashboardReportService } from './dashboard-report.service';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { CurrentUser } from '../auth/current-user.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CurrentUserData } from 'src/auth/auth.types';

@ControllerAuthProtector('Dashboard Reports', 'dashboard-reports')
@UseInterceptors(AuditInterceptor)
export class DashboardReportController {
  constructor(private readonly dashboardReportService: DashboardReportService) {}

  // 1. Dashboard Widgets APIs
  @Get('widgets')
  @ApiOperation({ summary: 'Get dashboard widgets data' })
  @ApiResponse({ status: 200, description: 'Dashboard widgets data retrieved successfully' })
  async getDashboardWidgets(@CurrentUser() currentUser: CurrentUserData) {
    const userId = currentUser.userId;
    return await this.dashboardReportService.getDashboardWidgets(userId);
  }

  // 2. Order Summary and Status APIs
  @Get('order-status-summary')
  @ApiOperation({ summary: 'Get order status summary' })
  @ApiResponse({ status: 200, description: 'Order status summary retrieved successfully' })
  async getOrderStatusSummary(@CurrentUser() currentUser: CurrentUserData) {
    const userId = currentUser.userId;
    return await this.dashboardReportService.getOrderStatusSummary(userId);
  }

  @Get('order-summary-by-month')
  @ApiOperation({ summary: 'Get order summary by month' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Year for the summary (default: current year)' })
  @ApiResponse({ status: 200, description: 'Order summary by month retrieved successfully' })
  async getOrderSummaryByMonth(
    @CurrentUser() currentUser: CurrentUserData,
    @Query('year') year?: string | number,
  ) {
    const userId = currentUser.userId;
    const targetYear = year ? parseInt(year.toString(), 10) : new Date().getFullYear();
    return await this.dashboardReportService.getOrderSummaryByMonth(userId, targetYear);
  }

  @Get('late-orders')
  @ApiOperation({ summary: 'Get late orders' })
  @ApiResponse({ status: 200, description: 'Late orders retrieved successfully' })
  async getLateOrders(@CurrentUser() currentUser: CurrentUserData) {
    const userId = currentUser.userId;
    return await this.dashboardReportService.getLateOrders(userId);
  }

  // 3. Top Clients API
  @Get('top-clients')
  @ApiOperation({ summary: 'Get top clients by order count' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of top clients to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Top clients retrieved successfully' })
  async getTopClients(
    @CurrentUser() currentUser: CurrentUserData,
    @Query('limit') limit?: string | number,
  ) {
    const userId = currentUser.userId;
    const limitCount = limit ? parseInt(limit.toString(), 10) : 10;
    return await this.dashboardReportService.getTopClients(userId, limitCount);
  }

  // 4. Shipments Dashboard APIs
  @Get('shipments-summary')
  @ApiOperation({ summary: 'Get shipments summary' })
  @ApiResponse({ status: 200, description: 'Shipments summary retrieved successfully' })
  async getShipmentsSummary(@CurrentUser() currentUser: CurrentUserData) {
    const userId = currentUser.userId;
    return await this.dashboardReportService.getShipmentsSummary(userId);
  }

  // 5. Stock Level Dashboard APIs
  @Get('stock-levels')
  @ApiOperation({ summary: 'Get stock levels summary' })
  @ApiResponse({ status: 200, description: 'Stock levels retrieved successfully' })
  async getStockLevels(@CurrentUser() currentUser: CurrentUserData) {
    const userId = currentUser.userId;
    return await this.dashboardReportService.getStockLevels(userId);
  }

  // 6. Top Products API
  @Get('top-products')
  @ApiOperation({ summary: 'Get top products by order count' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of top products to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Top products retrieved successfully' })
  async getTopProducts(
    @CurrentUser() currentUser: CurrentUserData,
    @Query('limit') limit?: string | number,
  ) {
    const userId = currentUser.userId;
    const limitCount = limit ? parseInt(limit.toString(), 10) : 10;
    return await this.dashboardReportService.getTopProducts(userId, limitCount);
  }
}
