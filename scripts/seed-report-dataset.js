const https = require('https');
const base = process.env.SEED_API_URL || 'https://api.lincolms.me';
let demoId;
const accounts = [
  ['report.owner.20260812@example.com', 'Test@2026Owner'],
  ['report.member1.20260812@example.com', 'Test@2026Member1'],
  ['report.member2.20260812@example.com', 'Test@2026Member2'],
  ['report.member3.20260812@example.com', 'Test@2026Member3'],
  ['report.member4.20260812@example.com', 'Test@2026Member4'],
];

function request(method, path, body, token, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? '' : JSON.stringify(body);
    const req = https.request(base + path, {
      method,
      rejectUnauthorized: false,
      headers: {
        ...(data ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data) } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    }, res => {
      let text = '';
      res.on('data', chunk => text += chunk);
      res.on('end', () => {
        let json;
        try { json = JSON.parse(text); } catch { return reject(new Error(`${method} ${path}: ${res.statusCode} ${text}`)); }
        if (res.statusCode >= 400 || json.success === false) return reject(new Error(`${method} ${path}: ${res.statusCode} ${JSON.stringify(json)}`));
        resolve(json.data);
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  const users = [];
  for (const [email, password] of accounts) {
    const auth = await request('POST', '/authentication/sign-in', { email, password }, null, { 'x-client-type': 'mobile' });
    users.push({ email, password, id: auth.user.id, token: auth.accessToken });
  }
  const owner = users[0];
  const demos = await request('GET', '/demos?take=20', undefined, owner.token);
  let demo = demos.find(item => item.name === 'Linco Analytics Academy');
  if (!demo) {
    demo = await request('POST', '/demos', { name: 'Linco Analytics Academy', imagePath: 'https://placehold.co/600x400', signatureImagePath: 'https://placehold.co/800x200', description: 'A populated workspace for testing owner reports and learning analytics.' }, owner.token);
  }
  demoId = demo.id;
  const workspace = { 'x-demo-id': demoId };

  for (const user of users.slice(1)) {
    try {
      const invitation = await request('POST', '/invitations', { receiverId: user.id, role: user === users[1] ? 'ADMIN' : 'MEMBER' }, owner.token, workspace);
      await request('POST', `/invitations/${invitation.id}/accept`, undefined, user.token);
    } catch (error) {
      if (!String(error).match(/already|member|invitation/i)) throw error;
    }
  }

  const memberPage = await request('GET', '/members?take=20', undefined, owner.token, workspace);
  const members = memberPage;
  const byUserId = new Map(members.map(m => [m.user.id, m]));
  const ownerMember = byUserId.get(owner.id);
  const adminMember = byUserId.get(users[1].id);

  let departments = await request('GET', '/departments?take=20', undefined, owner.token, workspace);
  if (!departments.some(d => d.name === 'Engineering')) await request('POST', '/departments', { name: 'Engineering', managerId: ownerMember.id, description: 'Software engineering and platform delivery team.' }, owner.token, workspace);
  if (!departments.some(d => d.name === 'Customer Success')) await request('POST', '/departments', { name: 'Customer Success', managerId: adminMember.id, description: 'Customer onboarding, enablement, and support team.' }, owner.token, workspace);
  departments = await request('GET', '/departments?take=20', undefined, owner.token, workspace);

  for (const department of departments) {
    const managerUser = users.find(user => byUserId.get(user.id)?.id === department.managerId);
    const managerToken = managerUser?.token ?? owner.token;
    for (const member of members) {
      if (member.id === department.managerId) continue;
      try {
        await request('POST', '/departmentMembers', { demoMemberId: member.id, jobTitle: member.role === 'ADMIN' ? 'SENIOR' : 'JUNIOR' }, managerToken, { ...workspace, 'x-department-id': department.id });
      } catch (error) {
        if (!String(error).includes('already')) throw error;
      }
    }
  }

  const courseDefs = [
    ['NestJS Backend Engineering', 'PRIVATE', 149, true],
    ['Customer Success Foundations', 'PUBLIC', 0, true],
    ['PostgreSQL Analytics', 'PRIVATE', 99, false],
  ];
  const existingCourses = await request('GET', `/courses?take=50&demoId=${demoId}`, undefined, owner.token);
  const courses = [];
  for (const [title, visibility, price, publish] of courseDefs) {
    const existing = existingCourses.find(course => course.title === title);
    const course = existing || await request('POST', '/courses', { title, visibility, demoId, description: `${title} practical training course.`, imagePath: 'https://placehold.co/600x400', price }, owner.token);
    courses.push(course);
    if (course.sectionsCount >= 2) continue;
    const existingSections = await request('GET', `/courses/${course.id}/sections/cursor?take=20`, undefined, owner.token);
    for (let sectionOrder = 1; sectionOrder <= 2; sectionOrder++) {
      const sectionTitle = sectionOrder === 1 ? 'Core Concepts' : 'Applied Practice';
      let section = existingSections.find(item => item.title === sectionTitle);
      if (!section) {
        section = await request('POST', `/courses/${course.id}/sections`, { title: sectionTitle, order: sectionOrder }, owner.token);
        for (let lessonOrder = 1; lessonOrder <= 3; lessonOrder++) {
          await request('POST', `/sections/${section.id}/lessons`, { title: `Lesson ${lessonOrder}: ${title}`, order: lessonOrder, videoUrl: 'https://example.com/training-video.mp4', description: `Practical lesson ${lessonOrder} for ${title}.`, duration: 600 + lessonOrder * 180 }, owner.token);
        }
        await request('POST', `/sections/${section.id}/exams`, { title: `${section.title} Assessment`, durationMinutes: 30, numberOfQuestions: 3, passingScore: 70 }, owner.token);
      }
      for (let q = 1; q <= 3; q++) {
        await request('POST', `/sections/${section.id}/questionsBank`, { question: `${title} sample question ${q}?`, note: 'Generated report test question', choices: [{ text: 'Correct answer', isCorrect: true }, { text: 'Incorrect answer', isCorrect: false }] }, owner.token);
      }
    }
    if (publish && !course.isPublished) {
      try { await request('POST', `/courses/${course.id}/publish`, undefined, owner.token); }
      catch (error) { console.warn(`Course ${title} was saved as published, but AI indexing failed and was ignored.`); }
    }
  }

  const assets = await request('GET', '/assets?page=1&take=50', undefined, owner.token, workspace);
  for (const department of departments) {
    const managerUser = users.find(user => byUserId.get(user.id)?.id === department.managerId);
    for (const asset of assets) {
      if (!asset.course?.isPublished) continue;
      try {
        await request('POST', '/departmentCourses', { assetId: asset.id }, managerUser?.token ?? owner.token, { ...workspace, 'x-department-id': department.id });
      } catch (error) {
        if (!String(error).match(/already|assigned|exists|unique/i)) throw error;
      }
    }
  }

  for (let index = 1; index < users.length; index++) {
    try {
      await request('POST', '/inquiries', {
        subject: `Training support request ${index}`,
        message: `Test member ${index} needs guidance on the assigned learning path.`,
      }, users[index].token, workspace);
    } catch (error) {
      console.warn(`Inquiry creation for ${users[index].email} was skipped: ${error.message}`);
    }
  }
  console.log(JSON.stringify({ demoId, owner: { id: owner.id, email: owner.email, password: owner.password }, users: users.map(u => ({ id: u.id, email: u.email })), memberCount: members.length, departments: departments.map(d => ({ id: d.id, name: d.name })), courses: courses.map(c => ({ id: c.id, title: c.title })) }, null, 2));
})().catch(error => { console.error(error.stack || error); process.exit(1); });
