import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { LeaveService } from '../services/leave.service';
import { applyLeaveSchema, leaveApprovalSchema, leaveRejectionSchema } from '../validators/leave.validator';
import { sendSuccess } from '../utils/response';

export class LeaveController {
  static async getBalances(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const balances = await LeaveService.getBalances(req.user!.userId);
      return sendSuccess(res, 200, 'Leave balances retrieved', balances);
    } catch (error) {
      return next(error);
    }
  }

  static async applyLeave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = applyLeaveSchema.parse(req.body);
      const request = await LeaveService.applyLeave(req.user!.userId, validated);
      return sendSuccess(res, 201, 'Leave application submitted successfully', request);
    } catch (error) {
      return next(error);
    }
  }

  static async getOwnRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const requests = await LeaveService.getOwnLeaveRequests(req.user!.userId);
      return sendSuccess(res, 200, 'Leave requests retrieved', requests);
    } catch (error) {
      return next(error);
    }
  }

  static async getAllRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as any;
      const leaveType = req.query.leaveType as any;
      const requests = await LeaveService.getAllLeaveRequests({ status, leaveType });
      return sendSuccess(res, 200, 'All leave requests retrieved', requests);
    } catch (error) {
      return next(error);
    }
  }

  static async approve(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const validated = leaveApprovalSchema.parse(req.body);
      const updated = await LeaveService.approveLeave(id, req.user!.userId, validated.comment);
      return sendSuccess(res, 200, 'Leave request approved successfully', updated);
    } catch (error) {
      return next(error);
    }
  }

  static async reject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const validated = leaveRejectionSchema.parse(req.body);
      const updated = await LeaveService.rejectLeave(id, req.user!.userId, validated.comment);
      return sendSuccess(res, 200, 'Leave request rejected', updated);
    } catch (error) {
      return next(error);
    }
  }
}
