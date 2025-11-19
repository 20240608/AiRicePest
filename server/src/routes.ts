import type { Express } from 'express';
import type { DatabasePool } from './db.js';
import type multer from 'multer';

function splitToArray(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[\n；;、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function commaSeparated(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function registerRoutes(app: Express, db: DatabasePool, upload: multer.Multer) {
  // Auth
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body as { username: string; password: string };
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
    // Simplified: check user exists
    const [rows] = await db.query('SELECT id, username, email, role, created_at AS createdAt, last_login AS lastLogin FROM users WHERE username=? LIMIT 1', [username]);
    const users = rows as any[];
    if (users.length === 0) return res.status(401).json({ error: 'Invalid username or password' });
    res.json({ token: `mock-jwt-for-${username}`, user: users[0] });
  });

  app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body as { username: string; password: string; email?: string };
    if (!username || !password) return res.status(400).json({ error: 'Invalid username or password format' });
    try {
      await db.execute('INSERT INTO users (username, email, role) VALUES (?, ?, ?)', [username, email || `${username}@example.com`, 'user']);
      res.json({ success: true });
    } catch (e: any) {
      if (e?.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Username already exists' });
      res.status(500).json({ error: 'Failed to register' });
    }
  });

  // Profile
  app.get('/api/profile', async (_req, res) => {
    const [rows] = await db.query('SELECT id, username, email, role, created_at AS createdAt, last_login AS lastLogin FROM users ORDER BY id LIMIT 1');
    const users = rows as any[];
    if (users.length === 0) return res.status(404).json({ error: 'Not authenticated' });
    res.json(users[0]);
  });

  app.put('/api/profile', async (req, res) => {
    const { username, email } = req.body as { username?: string; email?: string };
    const [rows] = await db.query('SELECT id FROM users ORDER BY id LIMIT 1');
    const first = (rows as any[])[0];
    if (!first) return res.status(404).json({ error: 'No user' });
    await db.execute('UPDATE users SET username=COALESCE(?, username), email=COALESCE(?, email) WHERE id=?', [username ?? null, email ?? null, first.id]);
    const [rows2] = await db.query('SELECT id, username, email, role, created_at AS createdAt, last_login AS lastLogin FROM users WHERE id=?', [first.id]);
    res.json((rows2 as any[])[0]);
  });

  // Recognition (mocked)
  app.post('/api/recognize', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    res.json({
      id: `rec-${Date.now()}`,
      diseaseName: 'Rice Blast',
      confidence: 95.2,
      description: '...',
      cause: '...',
      solution: { title: 'Control Measures for Rice Blast', steps: ['Use resistant varieties.', 'Apply fungicides like Tricyclazole.', 'Manage nitrogen application.'] },
      imageUrl: '',
    });
  });

  // History
  app.get('/api/history', async (_req, res) => {
    const [rows] = await db.query('SELECT id, date, image_url AS imageUrl, disease_name AS diseaseName, confidence FROM history ORDER BY date DESC');
    res.json(rows);
  });

  app.get('/api/recognitions/:id', async (req, res) => {
    const id = req.params.id;
    const [rows] = await db.query(
      'SELECT id, disease_name AS diseaseName, confidence, description, cause, solution_title AS solutionTitle, solution_steps AS solutionSteps, image_url AS imageUrl FROM recognition_details WHERE id=?',
      [id],
    );
    const detail = (rows as any[])[0];
    if (!detail) return res.status(404).json({ error: 'Result not found' });
    res.json({
      id: detail.id,
      diseaseName: detail.diseaseName,
      confidence: detail.confidence,
      description: detail.description,
      cause: detail.cause,
      solution: { title: detail.solutionTitle, steps: JSON.parse(detail.solutionSteps || '[]') },
      imageUrl: detail.imageUrl,
    });
  });

  // Knowledge base
  app.get('/api/knowledge', async (_req, res) => {
    const [rows] = await db.query('SELECT * FROM knowledge_base ORDER BY category, pest_id');
    const items = (rows as any[]).map((r) => ({
      id: String(r.pest_id),
      category: r.category,
      name: r.disease_name,
      type: r.type_info,
      aliases: splitToArray(r.alias_names),
      keyFeatures: r.core_features,
      affectedParts: splitToArray(r.affected_parts),
      imageUrls: commaSeparated(r.symptom_images),
      pathogen: r.pathogen_source,
      conditions: r.occurrence_conditions,
      lifeCycle: r.generations_periods,
      transmission: r.transmission_routes,
      controls: {
        agricultural: splitToArray(r.agricultural_control),
        physical: splitToArray(r.physical_control),
        biological: splitToArray(r.biological_control),
        chemical: splitToArray(r.chemical_control),
      },
    }));
    res.json(items);
  });

  // Feedback
  app.post('/api/feedback', upload.array('images', 5), async (req, res) => {
    const { text, userId } = req.body as { text: string; userId?: string };
    if (!text) return res.status(400).json({ error: 'Missing text' });
    await db.execute('INSERT INTO feedbacks (user_id, username, text, image_urls, status) VALUES (?, ?, ?, ?, ?)', [
      userId || '1',
      'anonymous',
      text,
      JSON.stringify([]),
      'new',
    ]);
    res.json({ success: true });
  });

  // Admin
  app.get('/api/admin/stats', async (_req, res) => {
    const [[userCountRow]] = await db.query('SELECT COUNT(*) AS userCount FROM users');
    const [[feedbackCountRow]] = await db.query('SELECT COUNT(*) AS feedbackCount FROM feedbacks');
    const recognitionsPerDay = [
      { date: 'Mon', count: 20 },
      { date: 'Tue', count: 35 },
      { date: 'Wed', count: 15 },
      { date: 'Thu', count: 45 },
      { date: 'Fri', count: 25 },
      { date: 'Sat', count: 12 },
      { date: 'Sun', count: 5 },
    ];
    res.json({
      userCount: (userCountRow as any).userCount ?? 0,
      recognitionCount: 157,
      feedbackCount: (feedbackCountRow as any).feedbackCount ?? 0,
      recognitionsPerDay,
    });
  });

  app.get('/api/admin/users', async (_req, res) => {
    const [rows] = await db.query('SELECT id, username, email, role, created_at AS createdAt, last_login AS lastLogin FROM users ORDER BY id');
    res.json(rows);
  });

  app.put('/api/admin/users/:id', async (req, res) => {
    const id = req.params.id;
    const { username, email, role } = req.body as { username?: string; email?: string; role?: string };
    await db.execute('UPDATE users SET username=COALESCE(?, username), email=COALESCE(?, email), role=COALESCE(?, role) WHERE id=?', [
      username ?? null,
      email ?? null,
      role ?? null,
      id,
    ]);
    const [rows] = await db.query('SELECT id, username, email, role, created_at AS createdAt, last_login AS lastLogin FROM users WHERE id=?', [id]);
    res.json((rows as any[])[0]);
  });

  app.delete('/api/admin/users/:id', async (req, res) => {
    const id = req.params.id;
    await db.execute('DELETE FROM users WHERE id=?', [id]);
    res.json({ success: true });
  });

  app.get('/api/admin/feedbacks', async (_req, res) => {
    const [rows] = await db.query('SELECT id, user_id AS userId, username, text, image_urls AS imageUrls, status, created_at AS timestamp FROM feedbacks ORDER BY created_at DESC');
    const fx = (rows as any[]).map((f) => ({ ...f, imageUrls: JSON.parse(f.imageUrls || '[]') }));
    res.json(fx);
  });

  app.put('/api/admin/feedbacks/:id/status', async (req, res) => {
    const id = req.params.id;
    const { status } = req.body as { status: 'new' | 'in_review' | 'resolved' };
    await db.execute('UPDATE feedbacks SET status=? WHERE id=?', [status, id]);
    const [rows] = await db.query('SELECT id, user_id AS userId, username, text, image_urls AS imageUrls, status, created_at AS timestamp FROM feedbacks WHERE id=?', [id]);
    const f = (rows as any[])[0];
    if (!f) return res.status(404).json({ error: 'Not found' });
    res.json({ ...f, imageUrls: JSON.parse(f.imageUrls || '[]') });
  });
}


