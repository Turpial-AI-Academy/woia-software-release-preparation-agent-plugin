# Release Preparation Standard

## Contract

Release preparation starts from one exact candidate that already carries the approval required by the caller's process.

```text
approved candidate
-> reproducible release plan
```

The output joins five decisions that must describe the same candidate:

```text
version
changes
artifact
recovery
promotion
```

A plan is not reproducible merely because its prose is clear. The material inputs and identity rules must be explicit enough that repeating preparation for the same candidate and same material inputs yields the same release decisions.

## Candidate identity

Prefer an immutable identifier already native to the product or repository, such as:

- Git commit SHA;
- content digest;
- immutable source revision;
- already-built artifact digest when the artifact itself is the candidate.

A branch name, floating tag, latest build, mutable environment, or human description is not sufficient by itself.

Record the approval evidence that applies to the exact candidate. Do not substitute historical approval from another revision.

## Candidate immutability

Release preparation should not silently rewrite the candidate it is preparing.

Source changes that alter version files, manifests, changelogs, migration content, build inputs, or other release bytes create a new candidate. When such a change is required after approval, return `NEEDS_NEW_CANDIDATE` and identify the affected upstream evidence.

External release metadata may be planned without changing the candidate when the release system supports that separation.

## Bounded reconciliation and evidence lifecycle

A healthy existing plan may be reconciled for local metadata or explanatory documentation outside the production candidate when its exact identity, valid approval, material inputs, and all five release decisions remain unchanged. Inspect the affected statement and canonical owner, amend the smallest coherent unit, and preserve unrelated valid decisions and records. Re-check candidate/approval binding, the five decision invariants, and reproducibility even on this path.

Independently inspect durable records of actual validation or observation and the authoritative approval source before reuse. Require exact candidate applicability, relevant inputs/environment, provenance, and current validity. Earlier phase prose, assumptions, and the schema's verified booleans are not proof of execution or approval. Obtain the required verification, or report BLOCKED when it cannot be established.

Classify reusable evidence, invalidated decisions/dependent proof, fresh validation required, and assumptions. Invalidate only demonstrated impacts; a changed candidate must receive refreshed upstream approval rather than inherit an earlier PASS. Keep reconciliation notes in the existing supporting report/receipt without adding fields to the closed `com.turpial.release-preparation-plan/v1` schema.

Use deeper preparation for a new plan/candidate, changed material inputs, public contracts, persistence/migrations, security/signing/trust boundaries, artifact/build changes, deployment/recovery/promotion risk, provider dependencies, contradictions, or missing durable proof. Load the detail for that concern. A document included in the release artifact changes candidate content and requires NEEDS_NEW_CANDIDATE if editing it is necessary after approval. Neither path grants publication or deployment authority.

## Reproducibility

Record the material inputs used to derive the plan, for example:

- exact candidate identity;
- version policy and previous-release baseline;
- comparison range or release-note source;
- package/build definition;
- target release channel/environment;
- recovery target and state compatibility;
- promotion policy and authorization boundary.

Avoid volatile timestamps, mutable `latest` references, unpinned dependencies, or unspecified operator choices as hidden decision inputs.

## Product proportionality

A release plan should fit the product.

- Web/service: immutable source or deployment artifact, target environment, promotion, health/smoke, rollback/redeploy.
- Desktop: installer/package identity, checksum/signing expectations when applicable, distribution channel, launch smoke, previous installer/recovery.
- CLI/library/package: package identity, registry/release channel, install/package smoke, deprecate/patch or previous-version recovery.
- Local tool: package/archive/manual distribution, install/start smoke, previous artifact.
- Documentation/standard: exact docs/schema/archive content, publication channel, link/schema/package smoke, previous published revision.

Do not invent application deployment for a documentation release or require a binary artifact when the product has none.

## Human boundaries

Planning is not authorization.

Release preparation must not silently:

- create or move a release tag;
- publish a package or release;
- deploy or promote production;
- replace an existing artifact;
- force-push or rewrite release history.

Record the authorization boundary and the command/procedure that an authorized operator or later capability would use.
