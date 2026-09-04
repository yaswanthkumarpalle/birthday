# birthday

## Deployment storage

Set `BIRTHDAY_STORAGE_DIR` to a persistent disk directory in the hosting service. The app stores `wishes.json` and uploaded photos together inside that directory. Without this setting, a host restart can erase the wishes even when they are less than 24 hours old.

For Render:

1. Open the service's **Disks** settings and attach a persistent disk.
2. Set its mount path to `/var/data`.
3. Add the environment variable `BIRTHDAY_STORAGE_DIR=/var/data`.
4. Redeploy the service.

The 24-hour expiry is measured from the creation timestamp. A persistent disk is required so links survive service restarts during that period.