# birthday

## Deployment storage

Set `BIRTHDAY_STORAGE_DIR` to a persistent disk directory in the hosting service. The app stores `wishes.json` and uploaded photos together inside that directory.

For Render, attach a persistent disk, use its mount path (for example `/var/data`) as `BIRTHDAY_STORAGE_DIR`, then redeploy.