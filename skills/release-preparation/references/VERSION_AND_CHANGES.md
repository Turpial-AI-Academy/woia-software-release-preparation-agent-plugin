# Version and Changes

## Version

Use the repository's existing release/version contract when it is healthy.

Discover the canonical source of version identity, which may be:

- SemVer in manifests;
- CalVer;
- coordinated release train;
- product/build number;
- immutable revision with external release label;
- another repository-owned convention.

Do not impose SemVer merely because it is common.

A version decision needs:

```text
target version
versioning policy
previous release/baseline
reason the target follows from that policy
```

If the repository has conflicting version sources, do not guess which is canonical. Report the conflict.

If the required version change would mutate the already approved candidate, return `NEEDS_NEW_CANDIDATE`.

## Change set

Choose a stable comparison/source basis, such as:

```text
previous immutable release -> exact candidate
```

or another repository-defined release-note source.

Release changes should describe user/operator-relevant differences. They are not required to duplicate every commit message.

Where applicable, separate:

- features;
- fixes;
- behavior changes;
- compatibility changes;
- migrations;
- deprecations/removals;
- operational or security-relevant release notes.

Record compatibility and migration notes even when they are empty or not applicable, so recovery decisions do not silently ignore them.

## Reproducibility checks

A second preparer given the same candidate, same version policy, and same release baseline should select the same version and change basis.

Hard fail the reproducibility claim when selection depends on an unspecified branch tip, latest release discovered without pinning the result, or an undocumented manual choice.
