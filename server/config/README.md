# Configuration Files

To support independent releasable services, this folder contains static configuration as to not have to call other services for the data.

### Case Tabs

This holds a representation of what tabs should be shown on a case view dependant on the cases case type.

#### Schema

Viable types include: 
- ACTIONS
- DOCUMENTS
- EX_GRATIA
- PEOPLE
- SUMMARY
- TIMELINE

```json
{
  <<CASE_TYPE>>: [
    {
      "type": <<TYPE>>,
      "label": <<DISPLAY_NAME>>,
    }
  ]
}
```

> `EX_GRATIA` also requires the screen property that indicates what form is shown.
