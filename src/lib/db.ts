import { getMongoDb } from './mongodb';

// Global resilient fallback store
const memoryStore = {
  users: [
    {
      id: 'usr-tl-001',
      employee_id: 'TL001',
      username: 'rajkamal',
      ems_user_id: 'ems-tl-001',
      changehub_role: 'team_leader',
      display_name: 'Rajkamal Singh',
      email: 'rajkamal@pjsofonic.com',
      organization: 'PJSOFONIC Core Ecosystem',
      created_at: new Date().toISOString(),
    },
    {
      id: 'usr-cust-001',
      employee_id: 'CUST001',
      username: 'customer1',
      ems_user_id: 'ems-cust-001',
      changehub_role: 'customer',
      display_name: 'Sarah Chen (Client)',
      email: 'sarah.chen@apexfinancials.com',
      organization: 'Apex Global Financials',
      created_at: new Date().toISOString(),
    },
  ] as any[],
  change_requests: [] as any[],
  comments: [] as any[],
};

// Fallback in-memory query executor
function executeMemoryQuery(text: string, params: any[] = []): { rows: any[]; rowCount: number } {
  const sql = text.trim();

  // 1. SELECT users by employee_id
  if (sql.includes('FROM users WHERE UPPER(employee_id) = UPPER($1)') || sql.includes('FROM users WHERE employee_id = $1')) {
    const empId = params[0]?.toUpperCase();
    const user = memoryStore.users.find(u => u.employee_id?.toUpperCase() === empId);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 2. INSERT into users
  if (sql.startsWith('INSERT INTO users')) {
    const [employee_id, username, ems_user_id, changehub_role, display_name, organization] = params;
    const existingIndex = memoryStore.users.findIndex(u => u.employee_id?.toUpperCase() === employee_id?.toUpperCase());
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      employee_id,
      username,
      ems_user_id,
      changehub_role: changehub_role || 'customer',
      display_name: display_name || username,
      organization: organization || 'Apex Global Financials',
      created_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      memoryStore.users[existingIndex] = { ...memoryStore.users[existingIndex], ...newUser };
      return { rows: [memoryStore.users[existingIndex]], rowCount: 1 };
    }
    memoryStore.users.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // 3. UPDATE users
  if (sql.startsWith('UPDATE users')) {
    const empId = params[params.length - 1];
    const user = memoryStore.users.find(u => u.employee_id?.toUpperCase() === empId?.toUpperCase() || u.id === empId);
    if (user) {
      if (params.length > 2) {
        user.changehub_role = params[0] || user.changehub_role;
        user.display_name = params[2] || user.display_name;
      }
      return { rows: [user], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 4. SELECT count(*) FROM change_requests
  if (sql.includes('SELECT count(*) FROM change_requests')) {
    return { rows: [{ count: memoryStore.change_requests.length.toString() }], rowCount: 1 };
  }

  // 5. INSERT into change_requests
  if (sql.startsWith('INSERT INTO change_requests')) {
    const [
      ticket_number,
      title,
      description,
      category,
      priority,
      status,
      current_stage,
      submitted_by,
      client_name,
      target_delivery_date,
      sla_hours_remaining,
      sla_status,
      business_justification,
      scope_summary,
      tags,
    ] = params;

    const newCR = {
      id: `cr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ticket_number,
      title,
      description,
      category,
      priority,
      status,
      current_stage,
      submitted_by,
      client_name,
      assigned_lead: 'usr-tl-001',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      target_delivery_date: target_delivery_date ? new Date(target_delivery_date).toISOString() : new Date().toISOString(),
      sla_hours_remaining: sla_hours_remaining || 336,
      sla_status: sla_status || 'healthy',
      business_justification,
      scope_summary,
      tags: tags || [],
    };
    memoryStore.change_requests.unshift(newCR);
    return { rows: [newCR], rowCount: 1 };
  }

  // 6. SELECT change_requests
  if (sql.includes('FROM change_requests')) {
    if (params.length > 0 && (sql.includes('cr.id = $1') || sql.includes('cr.ticket_number = $1'))) {
      const match = memoryStore.change_requests.find(
        cr => cr.id === params[0] || cr.ticket_number === params[0]
      );
      return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
    }

    if (params.length > 0 && sql.includes('cr.submitted_by = $1')) {
      const filtered = memoryStore.change_requests.filter(cr => cr.submitted_by === params[0]);
      return { rows: filtered, rowCount: filtered.length };
    }

    return { rows: [...memoryStore.change_requests], rowCount: memoryStore.change_requests.length };
  }

  // 7. UPDATE change_requests
  if (sql.startsWith('UPDATE change_requests')) {
    const targetId = params[params.length - 1];
    const cr = memoryStore.change_requests.find(
      c => c.id === targetId || c.ticket_number === targetId
    );
    if (cr) {
      cr.updated_at = new Date().toISOString();
      for (const p of params) {
        if (typeof p === 'string' && ['submitted', 'tl_review', 'planning', 'development', 'documentation', 'workflow_chart', 'walkthrough', 'internal_review', 'customer_review', 'customer_approval', 'delivered'].includes(p)) {
          cr.current_stage = p;
        }
        if (typeof p === 'string' && ['in_progress', 'completed', 'pending_approval', 'rejected'].includes(p)) {
          cr.status = p;
        }
        if (typeof p === 'string' && p.startsWith('{') && p.includes('decision')) {
          try {
            cr.tl_approval = JSON.parse(p);
          } catch {}
        }
      }
      return { rows: [cr], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 8. DELETE
  if (sql.startsWith('DELETE FROM change_requests')) {
    memoryStore.change_requests = [];
    return { rows: [], rowCount: 0 };
  }
  if (sql.startsWith('DELETE FROM comments')) {
    memoryStore.comments = [];
    return { rows: [], rowCount: 0 };
  }

  return { rows: [], rowCount: 0 };
}

// Unified query router supporting MongoDB Atlas + Fallback Store
export async function query(text: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
  try {
    const db = await getMongoDb();
    if (!db) {
      return executeMemoryQuery(text, params);
    }

    const sql = text.trim();

    // 1. SELECT users
    if (sql.includes('FROM users WHERE UPPER(employee_id) = UPPER($1)') || sql.includes('FROM users WHERE employee_id = $1')) {
      const empId = params[0];
      const user = await db.collection('users').findOne({
        employee_id: { $regex: new RegExp(`^${empId}$`, 'i') },
      });
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // 2. INSERT into users
    if (sql.startsWith('INSERT INTO users')) {
      const [employee_id, username, ems_user_id, changehub_role, display_name, organization] = params;
      const newUser = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        employee_id,
        username,
        ems_user_id,
        changehub_role: changehub_role || 'customer',
        display_name: display_name || username,
        organization: organization || 'Apex Global Financials',
        created_at: new Date().toISOString(),
      };
      await db.collection('users').updateOne(
        { employee_id },
        { $set: newUser },
        { upsert: true }
      );
      return { rows: [newUser], rowCount: 1 };
    }

    // 3. SELECT count(*) FROM change_requests
    if (sql.includes('SELECT count(*) FROM change_requests')) {
      const count = await db.collection('change_requests').countDocuments();
      return { rows: [{ count: count.toString() }], rowCount: 1 };
    }

    // 4. INSERT into change_requests
    if (sql.startsWith('INSERT INTO change_requests')) {
      const [
        ticket_number,
        title,
        description,
        category,
        priority,
        status,
        current_stage,
        submitted_by,
        client_name,
        target_delivery_date,
        sla_hours_remaining,
        sla_status,
        business_justification,
        scope_summary,
        tags,
      ] = params;

      const newCR = {
        id: `cr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ticket_number,
        title,
        description,
        category,
        priority,
        status,
        current_stage,
        submitted_by,
        client_name,
        assigned_lead: 'usr-tl-001',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        target_delivery_date: target_delivery_date ? new Date(target_delivery_date).toISOString() : new Date().toISOString(),
        sla_hours_remaining: sla_hours_remaining || 336,
        sla_status: sla_status || 'healthy',
        business_justification,
        scope_summary,
        tags: tags || [],
      };
      await db.collection('change_requests').insertOne(newCR);
      return { rows: [newCR], rowCount: 1 };
    }

    // 5. SELECT change_requests
    if (sql.includes('FROM change_requests')) {
      if (params.length > 0 && (sql.includes('cr.id = $1') || sql.includes('cr.ticket_number = $1'))) {
        const item = await db.collection('change_requests').findOne({
          $or: [{ id: params[0] }, { ticket_number: params[0] }],
        });
        return { rows: item ? [item] : [], rowCount: item ? 1 : 0 };
      }

      if (params.length > 0 && sql.includes('cr.submitted_by = $1')) {
        const list = await db.collection('change_requests').find({ submitted_by: params[0] }).sort({ updated_at: -1 }).toArray();
        return { rows: list, rowCount: list.length };
      }

      const all = await db.collection('change_requests').find({}).sort({ updated_at: -1 }).toArray();
      return { rows: all, rowCount: all.length };
    }

    // 6. UPDATE change_requests
    if (sql.startsWith('UPDATE change_requests')) {
      const targetId = params[params.length - 1];
      const updates: any = { updated_at: new Date().toISOString() };
      for (const p of params) {
        if (typeof p === 'string' && ['submitted', 'tl_review', 'planning', 'development', 'documentation', 'workflow_chart', 'walkthrough', 'internal_review', 'customer_review', 'customer_approval', 'delivered'].includes(p)) {
          updates.current_stage = p;
        }
        if (typeof p === 'string' && ['in_progress', 'completed', 'pending_approval', 'rejected'].includes(p)) {
          updates.status = p;
        }
        if (typeof p === 'string' && p.startsWith('{') && p.includes('decision')) {
          try {
            updates.tl_approval = JSON.parse(p);
          } catch {}
        }
      }

      await db.collection('change_requests').updateOne(
        { $or: [{ id: targetId }, { ticket_number: targetId }] },
        { $set: updates }
      );
      const updatedItem = await db.collection('change_requests').findOne({
        $or: [{ id: targetId }, { ticket_number: targetId }],
      });
      return { rows: updatedItem ? [updatedItem] : [], rowCount: updatedItem ? 1 : 0 };
    }

    return executeMemoryQuery(text, params);
  } catch (err: any) {
    console.warn('[DB Router Warning] Using fallback store:', err.message);
    return executeMemoryQuery(text, params);
  }
}
