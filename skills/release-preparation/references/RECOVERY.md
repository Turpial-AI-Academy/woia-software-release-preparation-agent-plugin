# Recovery

A release is not prepared until the operator knows what to do if promotion fails or the release proves defective.

## Required recovery fields

Record:

```text
trigger conditions
recovery target
procedure
data/state compatibility
verification after recovery
```

The recovery target should be immutable or otherwise unambiguous.

## Common recovery modes

### Roll back/promote previous known-good

Appropriate when the platform can safely switch back to a previous deployment or artifact.

### Restore previous distributed artifact

Appropriate for installers, binaries, static bundles, or documentation packages.

### Deprecate and patch

Common for package registries where deleting or replacing a published version is unsafe or forbidden.

### Restore state plus software

Needed when release risk includes persistent state, schemas, migrations, or data changes. The plan must address whether the prior software can read the post-release state.

### Forward fix

Use when reversal is unsafe or technically impossible. State that limitation explicitly and define the minimum forward recovery path and authorization required.

## Recovery is not optimism

"Redeploy the previous version" is incomplete if the plan does not identify which version/artifact, how promotion is reversed, and whether data/state remain compatible.

Do not claim rollback is safe merely because an older artifact exists.

## Validation

Before calling the plan prepared, verify that:

- the target exists or its creation is explicitly part of the authorized promotion workflow;
- operators have a concrete procedure;
- required credentials/permissions are known without embedding secrets;
- the plan covers persistent state compatibility when relevant;
- a small recovery verification is defined.
