# Artifact and Promotion

## Artifact strategy

Classify the release artifact path as one of:

```text
PROMOTE_EXISTING
BUILD_ONCE_FROM_CANDIDATE
PLATFORM_REBUILD_FROM_PINNED_CANDIDATE
NO_BINARY_ARTIFACT
```

### PROMOTE_EXISTING

Use when an already-built immutable artifact is the release object. Record its digest/identity and prove it corresponds to the candidate.

### BUILD_ONCE_FROM_CANDIDATE

Use when release packaging is still required. Pin all source inputs to the approved candidate and define how the resulting artifact will be identified, such as checksum, digest, package version, or signed bundle identity.

### PLATFORM_REBUILD_FROM_PINNED_CANDIDATE

Use only when the target platform necessarily rebuilds. Record the exact source revision and material build inputs so the release does not drift to a different branch tip or environment.

### NO_BINARY_ARTIFACT

Use for products whose release object is the exact source/docs/schema revision or equivalent published content. Still define the release identity and publication target.

Do not validate one candidate and then intentionally promote unrelated rebuilt bytes.

## Promotion plan

Promotion describes the later authorized action; release preparation does not execute it.

Record:

- mechanism, such as Git tag plus Release, registry publish, deployment promotion, installer distribution, or docs publication;
- target channel/environment;
- exact artifact/source identity rule;
- authorization boundary;
- small post-promotion smoke or verification;
- any platform-specific preconditions.

A post-promotion smoke should be small and high-value. It should confirm the promoted release is usable, not rerun the entire pre-release suite.

Examples include:

- health endpoint;
- application/installer launch;
- CLI `--version`;
- package import/install;
- documentation/schema availability.

## Mutable systems

When the promotion system uses mutable labels such as `latest`, record the immutable digest/revision they must resolve to during promotion. Treat the label as a convenience pointer, not as release identity.
