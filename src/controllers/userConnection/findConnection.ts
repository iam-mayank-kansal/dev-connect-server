import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import type { Request, Response } from "express";

async function findConnection(req: Request, res: Response) {
  try {
    const userId = req.user!._id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const user = await userModel.findById(userId).select("connections").lean();
    if (!user) {
      return res.status(404).json(failureTemplate(404, "User not found."));
    }

    const excludedIds = new Set([userId.toString()]);
    const { connections } = user;

    if (connections) {
      [
        ...(connections.connected || []),
        ...(connections.blocked || []),
        ...(connections.requestReceived || []),
        ...(connections.requestSent || []),
        ...(connections.ignored || []),
      ].forEach((id) => excludedIds.add(id.toString()));
    }

    const usersHavingCurrentUser = await userModel
      .find({
        $or: [
          { "connections.connected": userId },
          { "connections.blocked": userId },
          { "connections.requestReceived": userId },
          { "connections.requestSent": userId },
          { "connections.ignored": userId },
        ],
      })
      .select("_id");

    usersHavingCurrentUser.forEach((u) => excludedIds.add(u._id.toString()));

    const availableUsers = await userModel
      .find({ _id: { $nin: Array.from(excludedIds) } })
      .select("name designation email profilePicture ")
      .skip(skip)
      .limit(limit)
      .lean();

    const hasMore = availableUsers.length === limit;

    const message = "Available users retrieved successfully.";

    const responseData = {
      users: availableUsers,
      pagination: {
        currentPage: page,
        limit: limit,
        hasMore: hasMore,
      },
    };

    logger.info({
      message,
      userId,
      page,
      count: availableUsers.length,
    });

    return res.status(200).json(successTemplate(200, message, responseData));
  } catch (error: unknown) {
    const err = error as Error;
    logger.error({
      message: `Error in findConnection controller: ${err.message}`,
      stack: err.stack,
    });

    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default findConnection;
