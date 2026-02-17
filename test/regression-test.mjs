#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('component', DIR, async (ctx) => {
  let s = ctx.step('Create component diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/component/diagrams', { name: 'Test Component' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create component (WebServer)');
  let comp1Id;
  try {
    const res = await apiPost('/api/component/components', { diagramId, name: 'WebServer', x1: 50, y1: 50, x2: 200, y2: 130 });
    comp1Id = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create component (AuthService)');
  let comp2Id;
  try {
    const res = await apiPost('/api/component/components', { diagramId, name: 'AuthService', x1: 350, y1: 50, x2: 500, y2: 130 });
    comp2Id = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create artifact');
  let artId;
  try {
    const res = await apiPost('/api/component/artifacts', { diagramId, name: 'auth.jar', fileName: 'auth.jar', x1: 350, y1: 200, x2: 500, y2: 270 });
    artId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create dependency: WebServer → AuthService');
  try {
    await apiPost('/api/component/dependencies', { diagramId, sourceId: comp1Id, targetId: comp2Id });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create realization: Artifact → AuthService');
  try {
    await apiPost('/api/component/component-realizations', { diagramId, sourceId: artId, targetId: comp2Id });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export component image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/component/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
