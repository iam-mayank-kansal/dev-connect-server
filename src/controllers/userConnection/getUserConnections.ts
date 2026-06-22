import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import type { Request, Response } from "express";

async function getUserConnections(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const status = req.query.status as string | undefined;

    // Fetch user with populated connections
    const userConnections = await userModel
      .findById(userId)
      .select("connections")
      .populate(
        "connections.connected",
        "name designation email profilePicture"
      )
      .populate("connections.blocked", "name designation email profilePicture")
      .populate(
        "connections.requestReceived",
        "name designation email profilePicture"
      )
      .populate(
        "connections.requestSent",
        "name designation email profilePicture"
      )
      .populate("connections.ignored", "name designation email profilePicture")
      .lean();

    if (!userConnections) {
      return res.status(404).json(failureTemplate(404, "User not found."));
    }

    const allConnections = userConnections.connections || {};
    let filteredConnections: Record<string, any> = {};

    // ✅ Define valid statuses with mapping to DB field names
    const validStatuses: Record<string, string> = {
      connected: "connected",
      blocked: "blocked",
      requestreceived: "requestReceived",
      requestsent: "requestSent",
      ignored: "ignored",
    };

    if (status) {
      const normalizedStatus = status.toLowerCase();

      if (validStatuses[normalizedStatus]) {
        const dbField = validStatuses[normalizedStatus]!;
        filteredConnections[dbField] =
          allConnections[dbField as keyof typeof allConnections] || [];
      } else {
        return res
          .status(400)
          .json(failureTemplate(400, "Invalid connection status."));
      }
    } else {
      // If no status provided, return all connections
      filteredConnections = allConnections;
    }

    const message = "User connections retrieved successfully.";

    // Log success
    logger.info({
      message,
      userId,
      connectionsCount: Object.keys(filteredConnections).length,
    });

    return res
      .status(200)
      .json(successTemplate(200, message, filteredConnections));
  } catch (error: unknown) {
    const err = error as Error;
    logger.error({
      message: `Error in getUserConnections controller: ${err.message}`,
      stack: err.stack,
    });

    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default getUserConnections;
