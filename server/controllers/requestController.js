const pool = require("../utils/db");
const { sendResponse, sendError } = require("../utils/helper");
const messages = require("../utils/messages.js");

// Crear una nueva solicitud
const createRequest = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (userRole !== "CLIENT") {
      return sendError(res, messages.requests.notAuthorized);
    }

    if (!title) {
      return sendError(res, messages.requests.missingFields);
    }

    if (title.length < 5 || title.length > 100) {
      return sendError(res, messages.requests.invalidTitle);
    }

    const result = await pool.query(
      `INSERT INTO requests (title, status, client_id, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, title, status, client_id, assigned_to, response, created_at, updated_at`,
      [title, "pending", userId],
    );

    const request = result.rows[0];

    return sendResponse(res, messages.requests.createSuccess, { request });
  } catch (error) {
    console.error("Error creating request:", error);
    return sendError(res, messages.server.internalError);
  }
};

const getAllRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const {
      status,
      clientId,
      assignedTo,
      startDate,
      endDate,
      search,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    let query = `
      SELECT
        r.id, r.title, r.status, r.response,
        r.created_at, r.updated_at,
        r.client_id,
        c.name as client_name, c.lastname as client_lastname, c.email as client_email,
        r.assigned_to,
        s.name as support_name, s.lastname as support_lastname, s.email as support_email
      FROM requests r
      LEFT JOIN users c ON r.client_id = c.id
      LEFT JOIN users s ON r.assigned_to = s.id
    `;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (userRole === "CLIENT") {
      // CLIENT: Solo ve sus propias solicitudes
      conditions.push(`r.client_id = $${paramIndex}`);
      values.push(userId);
      paramIndex++;
    } else if (userRole === "SUPPORT") {
      // SUPPORT: Solo ve solicitudes asignadas a él
      conditions.push(`r.assigned_to = $${paramIndex}`);
      values.push(userId);
      paramIndex++;
    }
    // ADMIN: Ve todas (sin restricción base)

    // Filtro por ESTADO (disponible para todos los roles)
    if (status) {
      const validStatuses = ["pending", "in_progress", "resolved", "rejected"];
      if (validStatuses.includes(status)) {
        conditions.push(`r.status = $${paramIndex}`);
        values.push(status);
        paramIndex++;
      }
    }

    // Filtro por CLIENTE (solo ADMIN)
    if (clientId && userRole === "ADMIN") {
      conditions.push(`r.client_id = $${paramIndex}`);
      values.push(clientId);
      paramIndex++;
    }

    // Filtro por ASIGNADO (solo ADMIN)
    if (assignedTo && userRole === "ADMIN") {
      if (assignedTo === "unassigned") {
        // Solicitudes sin asignar
        conditions.push(`r.assigned_to IS NULL`);
      } else {
        conditions.push(`r.assigned_to = $${paramIndex}`);
        values.push(assignedTo);
        paramIndex++;
      }
    }

    // Filtro por FECHA DE INICIO (solo ADMIN)
    if (startDate && userRole === "ADMIN") {
      conditions.push(`r.created_at >= $${paramIndex}::date`);
      values.push(startDate);
      paramIndex++;
    }

    // Filtro por FECHA FIN (solo ADMIN)
    if (endDate && userRole === "ADMIN") {
      conditions.push(
        `r.created_at <= $${paramIndex}::date + INTERVAL '1 day'`,
      );
      values.push(endDate);
      paramIndex++;
    }

    // Filtro de BÚSQUEDA por título (solo ADMIN)
    if (search && userRole === "ADMIN") {
      conditions.push(`r.title ILIKE $${paramIndex}`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Agregar condiciones WHERE
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Validar y agregar ORDER BY
    const validSortFields = ["created_at", "updated_at", "status"];
    const validSortOrders = ["ASC", "DESC"];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    query += ` ORDER BY r.${safeSortBy} ${safeSortOrder}`;

    // Ejecutar query
    const result = await pool.query(query, values);

    return sendResponse(res, messages.requests.listSuccess, {
      requests: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error getting requests:", error);
    return sendError(res, messages.server.internalError);
  }
};

// Obtener una solicitud específica por ID

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await pool.query(
      `SELECT
        r.id, r.title, r.status, r.response,
        r.created_at, r.updated_at,
        r.client_id,
        c.name as client_name, c.lastname as client_lastname, c.email as client_email,
        r.assigned_to,
        s.name as support_name, s.lastname as support_lastname, s.email as support_email
      FROM requests r
      LEFT JOIN users c ON r.client_id = c.id
      LEFT JOIN users s ON r.assigned_to = s.id
      WHERE r.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return sendError(res, messages.requests.notFound);
    }

    const request = result.rows[0];

    // Verificar permisos
    if (userRole === "CLIENT" && request.client_id !== userId) {
      return sendError(res, messages.requests.notYourRequest);
    }

    if (userRole === "SUPPORT" && request.assigned_to !== userId) {
      return sendError(res, messages.requests.notAssignedToYou);
    }

    return sendResponse(res, messages.requests.getSuccess, { request });
  } catch (error) {
    console.error("Error getting request by id:", error);
    return sendError(res, messages.server.internalError);
  }
};

// Asignar solicitud a un usuario de soporte (Solo ADMIN)

const assignRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { supportId } = req.body;
    const userRole = req.user.role;

    // Solo ADMIN puede asignar
    if (userRole !== "ADMIN") {
      return sendError(res, messages.requests.onlyAdminCanAssign);
    }

    if (!supportId) {
      return sendError(res, messages.requests.missingFields);
    }

    // Verificar que la solicitud existe
    const requestResult = await pool.query(
      "SELECT * FROM requests WHERE id = $1",
      [id],
    );

    if (requestResult.rows.length === 0) {
      return sendError(res, messages.requests.notFound);
    }

    // Verificar que el usuario asignado tiene rol SUPPORT
    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND role = $2",
      [supportId, "SUPPORT"],
    );

    if (userResult.rows.length === 0) {
      return sendError(res, messages.requests.invalidAssignment);
    }

    await pool.query(
      `UPDATE requests
       SET assigned_to = $1, status = $2, updated_at = NOW()
       WHERE id = $3`,
      [supportId, "in_progress", id],
    );

    const result = await pool.query(
      `SELECT
        r.id, r.title, r.status, r.response,
        r.created_at, r.updated_at,
        r.client_id,
        c.name as client_name, c.lastname as client_lastname, c.email as client_email,
        r.assigned_to,
        s.name as support_name, s.lastname as support_lastname, s.email as support_email
      FROM requests r
      LEFT JOIN users c ON r.client_id = c.id
      LEFT JOIN users s ON r.assigned_to = s.id
      WHERE r.id = $1`,
      [id],
    );

    return sendResponse(res, messages.requests.assignSuccess, {
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Error assigning request:", error);
    return sendError(res, messages.server.internalError);
  }
};

// Actualizar estado y respuesta de la solicitud (Solo SUPPORT asignado)

const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (userRole !== "SUPPORT") {
      return sendError(res, messages.requests.onlySupportCanRespond);
    }

    // Validar campos
    if (!status || !response) {
      return sendError(res, messages.requests.missingFields);
    }

    // Validar estado
    const validStatuses = ["in_progress", "resolved", "rejected"];
    if (!validStatuses.includes(status)) {
      return sendError(res, messages.requests.invalidStatus);
    }

    if (response.length < 10) {
      return sendError(res, messages.requests.invalidResponse);
    }

    // Verificar que la solicitud existe
    const requestResult = await pool.query(
      "SELECT * FROM requests WHERE id = $1",
      [id],
    );

    if (requestResult.rows.length === 0) {
      return sendError(res, messages.requests.notFound);
    }

    const request = requestResult.rows[0];

    if (request.assigned_to !== userId) {
      return sendError(res, messages.requests.notAssignedToYou);
    }

    // Actualizar la solicitud
    await pool.query(
      `UPDATE requests
       SET status = $1, response = $2, updated_at = NOW()
       WHERE id = $3`,
      [status, response, id],
    );

    // Obtener la solicitud actualizada con todos los datos relacionados
    const result = await pool.query(
      `SELECT
        r.id, r.title, r.status, r.response,
        r.created_at, r.updated_at,
        r.client_id,
        c.name as client_name, c.lastname as client_lastname, c.email as client_email,
        r.assigned_to,
        s.name as support_name, s.lastname as support_lastname, s.email as support_email
      FROM requests r
      LEFT JOIN users c ON r.client_id = c.id
      LEFT JOIN users s ON r.assigned_to = s.id
      WHERE r.id = $1`,
      [id],
    );

    return sendResponse(res, messages.requests.responseSuccess, {
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Error responding to request:", error);
    return sendError(res, messages.server.internalError);
  }
};

//Obtener estadísticas completas de solicitudes (Solo ADMIN)

const getRequestStats = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Solo ADMIN puede ver estadísticas
    if (userRole !== "ADMIN") {
      return sendError(res, messages.requests.notAuthorized);
    }

    const totalResult = await pool.query(`
      SELECT COUNT(*) as total FROM requests
    `);

    const statusStats = await pool.query(`
      SELECT
        status,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM requests)), 2) as percentage
      FROM requests
      GROUP BY status
      ORDER BY count DESC
    `);

    // Solicitudes de hoy
    const todayStats = await pool.query(`
      SELECT COUNT(*) as count
      FROM requests
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    // Solicitudes de esta semana
    const weekStats = await pool.query(`
      SELECT COUNT(*) as count
      FROM requests
      WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)
    `);

    // Solicitudes de este mes
    const monthStats = await pool.query(`
      SELECT COUNT(*) as count
      FROM requests
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `);

    const monthlyTrends = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') as month,
        TO_CHAR(created_at, 'Mon YYYY') as month_label,
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM requests
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month, month_label
      ORDER BY month DESC
    `);

    const supportPerformance = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.lastname,
        u.email,
        COUNT(r.id) as total_assigned,
        COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN r.status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN r.status = 'in_progress' THEN 1 END) as in_progress,
        ROUND(
          (COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) * 100.0 /
          NULLIF(COUNT(r.id), 0)), 2
        ) as resolution_rate
      FROM users u
      LEFT JOIN requests r ON u.id = r.assigned_to
      WHERE u.role = 'SUPPORT'
      GROUP BY u.id, u.name, u.lastname, u.email
      ORDER BY total_assigned DESC
    `);

    const avgResolutionTime = await pool.query(`
      SELECT
        AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600) as avg_hours,
        MIN(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600) as min_hours,
        MAX(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600) as max_hours
      FROM requests
      WHERE status IN ('resolved', 'rejected')
    `);

    const unassignedStats = await pool.query(`
      SELECT COUNT(*) as count
      FROM requests
      WHERE assigned_to IS NULL
    `);

    const topClients = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.lastname,
        u.email,
        COUNT(r.id) as total_requests,
        COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved
      FROM users u
      INNER JOIN requests r ON u.id = r.client_id
      WHERE u.role = 'CLIENT'
      GROUP BY u.id, u.name, u.lastname, u.email
      ORDER BY total_requests DESC
      LIMIT 10
    `);

    const comparisonStats = await pool.query(`
      SELECT
        COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as current_month,
        COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
              AND created_at < DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as previous_month
      FROM requests
    `);

    const currentMonth = parseInt(comparisonStats.rows[0].current_month);
    const previousMonth = parseInt(comparisonStats.rows[0].previous_month);
    const growthPercentage =
      previousMonth > 0
        ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(2)
        : 0;

    const stats = {
      overview: {
        total: parseInt(totalResult.rows[0].total),
        today: parseInt(todayStats.rows[0].count),
        thisWeek: parseInt(weekStats.rows[0].count),
        thisMonth: parseInt(monthStats.rows[0].count),
        unassigned: parseInt(unassignedStats.rows[0].count),
        monthGrowth: parseFloat(growthPercentage),
      },
      byStatus: statusStats.rows.map((row) => ({
        status: row.status,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage),
      })),
      monthlyTrends: monthlyTrends.rows.map((row) => ({
        month: row.month,
        label: row.month_label,
        total: parseInt(row.total),
        pending: parseInt(row.pending),
        in_progress: parseInt(row.in_progress),
        resolved: parseInt(row.resolved),
        rejected: parseInt(row.rejected),
      })),
      supportPerformance: supportPerformance.rows.map((row) => ({
        id: row.id,
        name: `${row.name} ${row.lastname || ""}`.trim(),
        email: row.email,
        totalAssigned: parseInt(row.total_assigned),
        resolved: parseInt(row.resolved),
        rejected: parseInt(row.rejected),
        inProgress: parseInt(row.in_progress),
        resolutionRate: parseFloat(row.resolution_rate) || 0,
      })),
      resolutionTime: {
        averageHours: parseFloat(avgResolutionTime.rows[0].avg_hours) || 0,
        minHours: parseFloat(avgResolutionTime.rows[0].min_hours) || 0,
        maxHours: parseFloat(avgResolutionTime.rows[0].max_hours) || 0,
      },
      topClients: topClients.rows.map((row) => ({
        id: row.id,
        name: `${row.name} ${row.lastname || ""}`.trim(),
        email: row.email,
        totalRequests: parseInt(row.total_requests),
        pending: parseInt(row.pending),
        resolved: parseInt(row.resolved),
      })),
    };

    return sendResponse(res, messages.requests.listSuccess, { stats });
  } catch (error) {
    console.error("Error getting request stats:", error);
    return sendError(res, messages.server.internalError);
  }
};

// Eliminar una solicitud (Solo ADMIN)
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Solo ADMIN puede eliminar
    if (userRole !== "ADMIN") {
      return sendError(res, messages.requests.notAuthorized);
    }

    // Verificar que existe
    const checkResult = await pool.query(
      "SELECT * FROM requests WHERE id = $1",
      [id],
    );

    if (checkResult.rows.length === 0) {
      return sendError(res, messages.requests.notFound);
    }

    // Eliminar
    await pool.query("DELETE FROM requests WHERE id = $1", [id]);

    return sendResponse(res, messages.requests.deleteSuccess, {});
  } catch (error) {
    console.error("Error deleting request:", error);
    return sendError(res, messages.server.internalError);
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  assignRequest,
  respondToRequest,
  getRequestStats,
  deleteRequest,
};
