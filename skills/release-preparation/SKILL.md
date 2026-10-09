---
name: release-preparation
description: Prepare a software release from one exact approved candidate. Use when defining or validating release version, release changes, artifact identity, recovery or rollback, promotion mechanism, and reproducibility before publication or deployment.
license: MIT
compatibility: Works across software product types and release systems; the target repository must expose enough evidence to identify the approved candidate and its release path.
metadata:
  author: Turpial AI Academy
  version: "0.5.6"
---

# release-preparation

## Operating flow

```text
DISCOVER -> DECIDE -> PREPARE -> VALIDATE -> REPORT
```

## Purpose

Turn one security-approved candidate into a reproducible release preparation plan that binds version, release changes, artifact identity, recovery, and promotion mechanism to the same candidate without silently publishing, deploying, tagging, or mutating that candidate.

This capability is standalone. It adapts to the repository's real release model and does not require a particular orchestrator, package manager, cloud, registry, or CI provider.

## Non-negotiable rules

- Identify one exact candidate before making release decisions.
- Require evidence that the candidate is approved for release preparation. Do not reinterpret missing approval as approval.
- Treat the approved candidate as immutable for this phase. If a required version, changelog, manifest, migration, or other source change would alter it, return `NEEDS_NEW_CANDIDATE` instead of editing it silently.
- Bind version, change set, artifact rule, recovery, and promotion to the same candidate identity.
- Prefer one built artifact promoted through environments when the platform supports it. If the platform rebuilds, pin the rebuild to the exact candidate and record the identity rule.
- Use the repository's established versioning and release conventions when healthy. Do not impose SemVer, a release train, a registry, GitHub Releases, or another mechanism without evidence.
- Define recovery before promotion. Recovery may be rollback, redeploy of a known-good artifact, restore, deprecation plus patch, or an explicit forward-fix path when reversal is unsafe.
- Keep promotion as a plan. Do not tag, publish, deploy, promote, force-push, or change protected release state without explicit authorization.
- Do not claim reproducibility when the plan depends on unspecified mutable state, floating refs, undocumented manual choices, or an unidentified artifact.
- Report skipped, blocked, or unavailable evidence as such; never call it verified.

## Proportionate depth and evidence reuse

Use a bounded path only when a healthy existing plan and durable validation/approval records describe the same exact candidate and material inputs. The amendment must affect only local plan/report metadata or explanatory documentation outside the production candidate, leaving version, changes, artifact identity, recovery, and promotion decisions unchanged. Verify that the material is not packaged or deployed candidate content.

Inspect the authoritative plan and affected statement, load only its supporting inputs, and reconcile the smallest coherent unit. Preserve unrelated valid decisions and evidence. Re-check exact candidate identity, approval validity, the five decision bindings, and reproducibility from the recorded material inputs; do not repeat full release discovery or every derivation for an external wording correction.

Use the deep path for a new plan or candidate, uncertain or contradictory version/change baselines, artifact/build-input changes, public API/event/schema or persisted-state/migration changes, auth/secrets/signing/trust boundaries, deployment/recovery/promotion risk, cross-provider dependencies, changed material inputs, or missing durable required proof. Expand the affected context and reference. If candidate content must change, return NEEDS_NEW_CANDIDATE and refresh affected upstream approval/evidence through the normal process.

Release Preparation independently owns the plan gate. Inspect durable evidence of actual validation/observation and the authoritative upstream approval record, their exact candidate binding, relevant environment/inputs, provenance, and current validity before reuse. Earlier phase summaries, recollection, assumptions, and schema verification booleans are not execution or approval evidence. Execute or inspect the relevant verification when required proof cannot be independently established; missing required proof remains BLOCKED.

Distinguish reusable evidence, invalidated decisions/proof, fresh validation/observation required, and assumptions. Invalidate only the affected plan decisions and dependent evidence; preserve unrelated current records without automatically carrying approval to a changed candidate. Keep reuse/invalidation notes in an existing supporting report or receipt, outside the closed v1 plan schema. Report what was reused, revalidated, and remains uncertain. Preparation continues to plan promotion without executing it.

## 1. Discover

Load [RELEASE_PREPARATION_STANDARD.md](references/RELEASE_PREPARATION_STANDARD.md) for a new plan, candidate/approval questions, uncertain boundaries, or reproducibility decisions. Reuse a healthy existing plan and its inspected inputs for unaffected context.

Establish, as applicable:

- repository root, current branch/ref, exact commit or other immutable candidate identity, and dirty state;
- evidence of security/release approval for that candidate;
- product/release profile and intended distribution or deployment target;
- current version and versioning policy;
- previous published/known-good release baseline;
- packaging/build commands and whether the release promotes an existing artifact, builds once from the candidate, rebuilds from a pinned candidate, or has no binary artifact;
- release-note/change sources and compatibility or migration obligations;
- current release/promotion mechanism, required approvals, and post-promotion smoke;
- rollback, restore, redeploy, deprecate/patch, or forward-fix procedure;
- external state that can make a plan non-reproducible.

If the exact candidate or its approval cannot be established, return `BLOCKED`.

## 2. Decide

Load [VERSION_AND_CHANGES.md](references/VERSION_AND_CHANGES.md) when version or comparison basis changes or is unclear. Load [ARTIFACT_AND_PROMOTION.md](references/ARTIFACT_AND_PROMOTION.md) for artifact identity, build inputs, target, or promotion questions. Load [RECOVERY.md](references/RECOVERY.md) for changed state compatibility, recovery targets/procedures, or rollback uncertainty.

Decide five linked surfaces:

1. **Version** — determine the release version from the repository's declared policy and a stated baseline.
2. **Changes** — derive the release change set from an explicit previous-release or other stable comparison basis.
3. **Artifact** — define what will be promoted and how its identity is tied to the exact candidate.
4. **Recovery** — define trigger conditions, recovery target, procedure, and data/state compatibility.
5. **Promotion** — define mechanism, target, authorization boundary, and small post-promotion smoke.

Prefer evidence-backed preservation over redesigning a healthy release process.

## 3. Prepare

Produce a plan; do not execute promotion.

For a new successful plan or structure validation, load [release-preparation-plan.schema.json](assets/release-preparation-plan.schema.json). Reuse an existing conformant plan for bounded reconciliation. Keep the canonical plan free of volatile timestamps or environment-specific noise unless they are material inputs.

A successful plan must explicitly record:

```text
candidate identity
security approval evidence
version + version basis
change-set basis + release changes
artifact strategy + candidate binding
recovery triggers + target + procedure + data compatibility
promotion mechanism + target + authorization + smoke
reproducibility inputs
publication/deployment mutation boundaries
```

If preparation discovers that the approved candidate itself must change, stop and return `NEEDS_NEW_CANDIDATE`. The changed content must become a new candidate and be re-approved by the upstream process before release preparation resumes.

## 4. Validate

Validate the plan against the same exact candidate.

A `RELEASE_PREPARATION_PASS` requires:

- candidate identity is exact and unchanged;
- approval evidence refers to that candidate;
- version has an explicit reproducible basis;
- changes have an explicit comparison/source basis;
- artifact strategy points back to the same candidate;
- recovery is operationally described rather than merely named;
- promotion mechanism and authorization boundary are explicit;
- post-promotion smoke is defined when promotion can affect a running/installed consumer;
- all material inputs needed to reproduce the plan are listed;
- no candidate mutation, tag, publication, or deployment was performed by preparation.

Re-run the derivation mentally or mechanically from the recorded material inputs. If the same candidate plus the same material inputs could yield a materially different version, artifact rule, change set, recovery path, or promotion mechanism, the gate is not reproducible.

## 5. Report

Return one status:

```text
RELEASE_PREPARATION_PASS
NEEDS_NEW_CANDIDATE
BLOCKED
```

For `RELEASE_PREPARATION_PASS`, report the structured plan and any unverified operational assumptions.

For `NEEDS_NEW_CANDIDATE`, identify the exact source mutation required and which prior approval/evidence must be refreshed.

For `BLOCKED`, identify the missing evidence or unresolved decision without inventing a release policy.

Keep facts, decisions, assumptions, and remaining risks separate.

## Detailed references

- [Release Preparation Standard](references/RELEASE_PREPARATION_STANDARD.md)
- [Version and Changes](references/VERSION_AND_CHANGES.md)
- [Artifact and Promotion](references/ARTIFACT_AND_PROMOTION.md)
- [Recovery](references/RECOVERY.md)
- [Release Preparation Plan Schema](assets/release-preparation-plan.schema.json)
