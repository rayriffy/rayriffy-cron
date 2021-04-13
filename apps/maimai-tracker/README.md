# maimai Tracker

This script is used for tracking my play progress, then sync and visualize them in AirTable

## Requirements

This script requires 4 environment variables **(PUT THOSE IN SECRETS!!!)**

- `SEGA_ID`: SEGA ID username
- `SEGA_PW`: SEGA ID password
- `AIRTABLE_API_KEY`: Your AirTable API Key
- `AIRTABLE_BASE_DATA`: JSON string contains base id of each type of data tracking consists of following
```json
{
  "score": "#BASE ID HERE#",
  "playData": "#BASE ID HERE#",
  "area": "#BASE ID HERE#",
  "title": "#BASE ID HERE#",
  "namePlate": "#BASE ID HERE#",
  "icon": "#BASE ID HERE#",
  "tourMember": "#BASE ID HERE#"
}

```

You also reuired to create your own AirTable base as well, copy all base from [demo](#Demo) into your own workspace as well.

## Demo

- [Score](https://airtable.com/shrCYcwIc4S2z1wOb)
- [Play data](https://airtable.com/shrIWvrsyMuWzvIWe)
- [Area](https://airtable.com/shrr9SQCzmYj4Sxyc)
- [Title](https://airtable.com/shrCYxwaG9sXCorzh)
- [Name plate](https://airtable.com/shrEmc3OngAOrbqfp)
- [Icon](https://airtable.com/shr7a2krlgm8uvOI8)
- [Tour member](https://airtable.com/shrS02nOhT0SvWWzt)
