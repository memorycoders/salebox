

# Creating

*Request URL*: https://production-qa.salesbox.com/appointment-v3.0/add?&enterpriseID=ed00b3e4-ecbe-4f01-9585-3ccc2dc693b7&timezone=%2B0200&token=01a90e0a-249b-4d8f-8e19-840908a4182d

*Request Method*: POST

```json
{
  "title": "Invitee test",
  "organisation": {
    "uuid": "7ff91029-1c92-4615-8740-1394d1c59aee"
  },
  "location": null,
  "contactList": [
    {
      "uuid": "e878b3cb-b33e-425f-b152-627b16df696a",
      "firstName": "Frida",
      "lastName": "Test"
    }
  ],
  "inviteeList": {
    "contactInviteeDTOList": [
      {
        "uuid": "e878b3cb-b33e-425f-b152-627b16df696a",
        "firstName": "Frida",
        "lastName": "Test"
      }
    ],
    "communicationInviteeDTOList": [
      {
        "value": "oxygen@trioxygen.io"
      }
    ]
  },
  "startDate": 1534924800000,
  "endDate": 1534926600000,
  "owner": {
    "uuid": "627a500e-c0e3-4779-a1cb-1ecf40c0cb8c"
  },
  "firstContactId": "e878b3cb-b33e-425f-b152-627b16df696a"
}
```
