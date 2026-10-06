import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");
const skillPath = path.join(ROOT, "skills", "release-preparation", "SKILL.md");
const schemaPath = path.join(ROOT, "skills", "release-preparation", "assets", "release-preparation-plan.schema.json");

// The portable plan is a closed domain contract. Check both the constraints and
// their required reachability without bringing authoring schema tooling here.
const requiredPlanFields = {
  "": ["schema", "status", "candidate", "version", "artifact", "changes", "recovery", "promotion", "reproducibility", "evidence", "boundaries"],
  candidate: ["identity", "security_approval_evidence", "immutable"],
  version: ["value", "basis"],
  artifact: ["strategy", "candidate_binding", "identity_rule"],
  changes: ["basis", "items", "compatibility_notes", "migration_notes"],
  recovery: ["trigger_conditions", "target", "procedure", "data_compatibility", "verification"],
  promotion: ["mechanism", "target", "authorization_boundary", "post_promotion_smoke"],
  reproducibility: ["same_candidate_same_plan", "required_inputs"],
  evidence: ["candidate_identity_verified", "security_approval_verified", "version_basis_verified", "change_set_verified", "artifact_rule_verified", "recovery_verified", "promotion_mechanism_verified"],
  boundaries: ["candidate_mutation_performed", "tag_created", "published", "deployed"],
};

function assertRequiredPlanContract(schema) {
  for (const [section, fields] of Object.entries(requiredPlanFields)) {
    const node = section ? schema.properties[section] : schema;
    assert.equal(node.type, "object", section || "plan");
    assert.equal(node.additionalProperties, false, section || "plan");
    assert.deepEqual(new Set(node.required), new Set(fields), `${section || "plan"} required fields`);
    assert.deepEqual(new Set(Object.keys(node.properties)), new Set(fields), `${section || "plan"} closed fields`);
  }
  const strings = ["candidate.identity", "candidate.security_approval_evidence", "version.value", "version.basis", "artifact.identity_rule", "changes.basis", "recovery.target", "recovery.data_compatibility", "promotion.mechanism", "promotion.target", "promotion.authorization_boundary"];
  const arrays = ["changes.items", "changes.compatibility_notes", "changes.migration_notes", "recovery.trigger_conditions", "recovery.procedure", "recovery.verification", "promotion.post_promotion_smoke", "reproducibility.required_inputs"];
  for (const fieldPath of strings) {
    const [section, field] = fieldPath.split(".");
    const constraint = schema.properties[section].properties[field];
    assert.equal(constraint.type, "string", fieldPath);
    assert.equal(constraint.minLength, 1, fieldPath);
  }
  for (const fieldPath of arrays) {
    const [section, field] = fieldPath.split(".");
    const constraint = schema.properties[section].properties[field];
    assert.equal(constraint.type, "array", fieldPath);
    assert.equal(constraint.items.type, "string", `${fieldPath} items`);
    assert.equal(constraint.items.minLength, 1, `${fieldPath} items`);
  }
}

test("every release decision and nested invariant is mandatory in the closed plan", async () => {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  assertRequiredPlanContract(schema);
  for (const [section, fields] of Object.entries(requiredPlanFields)) {
    for (const field of fields) {
      const omitted = structuredClone(schema);
      const node = section ? omitted.properties[section] : omitted;
      node.required = node.required.filter((name) => name !== field);
      assert.throws(() => assertRequiredPlanContract(omitted), assert.AssertionError, `${section}.${field} must stay required`);
    }
  }
});

test("release-preparation schema preserves candidate, recovery, reproducibility and no-side-effect invariants", async () => {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "com.turpial.release-preparation-plan/v1");
  assert.equal(schema.properties.status.const, "RELEASE_PREPARATION_PASS");
  assert.equal(schema.properties.candidate.properties.immutable.const, true);
  assert.equal(schema.properties.artifact.properties.candidate_binding.const, "PLAN_CANDIDATE");
  assert.deepEqual(schema.properties.artifact.properties.strategy.enum, ["PROMOTE_EXISTING", "BUILD_ONCE_FROM_CANDIDATE", "PLATFORM_REBUILD_FROM_PINNED_CANDIDATE", "NO_BINARY_ARTIFACT"]);
  for (const field of ["trigger_conditions","procedure","verification"]) assert.equal(schema.properties.recovery.properties[field].minItems, 1);
  assert.equal(schema.properties.reproducibility.properties.same_candidate_same_plan.const, true);
  assert.equal(schema.properties.reproducibility.properties.required_inputs.minItems, 5);
  assert.equal(schema.properties.reproducibility.properties.required_inputs.uniqueItems, true);
  for (const field of ["candidate_mutation_performed","tag_created","published","deployed"]) {
    assert.equal(schema.properties.boundaries.properties[field].const, false);
  }
  for (const field of requiredPlanFields.evidence) assert.equal(schema.properties.evidence.properties[field].const, true, field);
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
    /load[\s\S]*(?:when|for)[\s\S]*reuse[\s\S]*conformant plan/i,
  ]) assert.match(skill, obligation);
  assert.match(standard, /document[\s\S]*release artifact[\s\S]*changes candidate content[\s\S]*NEEDS_NEW_CANDIDATE/i);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.evidence.additionalProperties, false);
});
