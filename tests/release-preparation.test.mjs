import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");
const skillPath = path.join(ROOT, "skills", "release-preparation", "SKILL.md");
const schemaPath = path.join(ROOT, "skills", "release-preparation", "assets", "release-preparation-plan.schema.json");

test("release-preparation schema preserves candidate, recovery, reproducibility and no-side-effect invariants", async () => {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "com.turpial.release-preparation-plan/v1");
  assert.equal(schema.properties.status.const, "RELEASE_PREPARATION_PASS");
  assert.equal(schema.properties.candidate.properties.immutable.const, true);
  assert.equal(schema.properties.artifact.properties.candidate_binding.const, "PLAN_CANDIDATE");
  for (const field of ["trigger_conditions","procedure","verification"]) assert.equal(schema.properties.recovery.properties[field].minItems, 1);
  assert.equal(schema.properties.reproducibility.properties.same_candidate_same_plan.const, true);
  assert.equal(schema.properties.reproducibility.properties.required_inputs.minItems, 5);
  assert.equal(schema.properties.reproducibility.properties.required_inputs.uniqueItems, true);
  for (const field of ["candidate_mutation_performed","tag_created","published","deployed"]) {
    assert.equal(schema.properties.boundaries.properties[field].const, false);
  }
});

test("the skill preserves the approved candidate and human promotion boundary", async () => {
  const skill = await readFile(skillPath, "utf8");
  assert.match(skill, /security-approved candidate/i);
  assert.match(skill, /NEEDS_NEW_CANDIDATE/);
  assert.match(skill, /same candidate identity/i);
  assert.match(skill, /Do not tag, publish, deploy, promote/i);
  assert.match(skill, /recovery/i);
  assert.match(skill, /authorization boundary/i);
});

test("bounded preparation reuses a healthy plan while preserving the candidate and five release decisions", async () => {
  const skill = await readFile(skillPath, "utf8");
  for (const obligation of [
    /bounded[\s\S]*(healthy|valid)[\s\S]*existing plan[\s\S]*(same|unchanged) exact candidate[\s\S]*material inputs/i,
    /metadata[\s\S]*documentation[\s\S]*outside[\s\S]*production candidate/i,
    /version[\s\S]*changes[\s\S]*artifact identity[\s\S]*recovery[\s\S]*promotion[\s\S]*unchanged/i,
    /(smallest|targeted)[\s\S]*unit[\s\S]*preserv\w*[\s\S]*(unrelated|unaffected)[\s\S]*evidence/i,
    /re-check[\s\S]*candidate identity[\s\S]*approval validity[\s\S]*five decision bindings[\s\S]*reproducibility/i,
  ]) assert.match(skill, obligation);
});

test("deep preparation retains new-candidate, contract, security, state and recovery triggers", async () => {
  const skill = await readFile(skillPath, "utf8");
  const triggers = skill.split(/\r?\n\r?\n/).find((paragraph) => /deep path/i.test(paragraph) && /new plan/i.test(paragraph)) ?? "";
  for (const trigger of [
    /new plan[\s\S]*candidate/i,
    /contradict\w*[\s\S]*baselines/i,
    /artifact[\s\S]*build-input/i,
    /API[\s\S]*event[\s\S]*schema/i,
    /persisted[\s\S]*migration/i,
    /auth[\s\S]*secrets[\s\S]*signing[\s\S]*trust/i,
    /deployment[\s\S]*recovery[\s\S]*promotion/i,
    /provider[\s\S]*dependencies/i,
    /changed material inputs[\s\S]*missing[\s\S]*durable[\s\S]*proof/i,
    /candidate content[\s\S]*NEEDS_NEW_CANDIDATE[\s\S]*upstream[\s\S]*approval/i,
  ]) assert.match(triggers, trigger);
});

test("plan-gate reuse requires independently inspected durable proof without widening the closed schema", async () => {
  const skill = await readFile(skillPath, "utf8");
  const standard = await readFile(path.join(ROOT, "skills", "release-preparation", "references", "RELEASE_PREPARATION_STANDARD.md"), "utf8");
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  for (const obligation of [
    /independent\w*[\s\S]*(owns|ownership)[\s\S]*gate/i,
    /durable evidence[\s\S]*actual validation[\s\S]*authoritative upstream approval[\s\S]*candidate[\s\S]*provenance[\s\S]*validity/i,
    /summaries[\s\S]*recollection[\s\S]*assumptions[\s\S]*booleans[\s\S]*not[\s\S]*evidence/i,
    /(execute|inspect)[\s\S]*relevant verification[\s\S]*independent\w*[\s\S]*BLOCKED/i,
    /reusable evidence[\s\S]*invalidated[\s\S]*fresh validation[\s\S]*assumptions/i,
    /invalidate only[\s\S]*affected[\s\S]*preserve unrelated/i,
  ]) assert.match(skill, obligation);
  assert.match(standard, /document[\s\S]*release artifact[\s\S]*changes candidate content[\s\S]*NEEDS_NEW_CANDIDATE/i);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.evidence.additionalProperties, false);
});
