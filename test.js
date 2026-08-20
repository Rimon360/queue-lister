fetch(
  "https://oneboxtm.queue-it.net/spa-api/queue/oneboxtm/realmadridliga2627/82dab7bc-8330-4214-b246-25bb5ce5de08/status?cid=es-ES&l=Real+Madrid+Responsive-2022&t=https%3A%2F%2Ftickets.realmadrid.com%2Frealmadrid_futbol%2Fselect%2F2939723%3FviewCode%3DV_blockmap_view&enqueuetoken=eyJ0eXAiOiJRVDEiLCJlbmMiOiJBRVMyNTYiLCJpc3MiOjE3ODcyNTU2MjYzNDgsImV4cCI6MTc4NzI1NTg2NjM0OCwidGkiOiJhZGJjNTAyYy02YjAzLTQyM2UtYTJhMi04N2U2MzA1MGNkMjgiLCJjIjoib25lYm94dG0iLCJlIjoicmVhbG1hZHJpZGxpZ2EyNjI3IiwiaXAiOiIxNzAuMTAxLjEwOS4xMzUifQ.2H_EkxQ8ibevAfhCC82sNY6uAOUpM-fCQ7rEUjcudeTa0O8NPjXT80cXU7EzQPin.JKNewIkZL5T5ZZCHQC0NNYnuoVte0L6D66E1cf7ttNI&seid=b7beb969-0259-75ea-0f7c-34b48d5f5131&sets=1787255642790",
  {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.7",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua": '"Not=A?Brand";v="99", "Brave";v="151", "Chromium";v="151"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-requested-with": "XMLHttpRequest",
      Cookie: "queueitsoftblock_82dab7bc-8330-4214-b246-25bb5ce5de08=0ADoWqNYIu1sHbQ2/xd0uDFP65MmFHVyzt+72aigHU8=; ",
    },
    body: '{"targetUrl":"https://tickets.realmadrid.com/realmadrid_futbol/select/2939723?viewCode=V_blockmap_view&seid=4c67a6d9-b061-aa1b-afaf-b3ec89dbd735&sets=1787242998766&seid=0b61f242-8343-1e09-bfdb-b0dad6edecd9&sets=1787243099687&seid=ca8f40b7-b438-8560-ce19-58c61c877e2d&sets=1787243231598&seid=4e17176a-e214-d8dc-8781-449b26820bef&sets=1787243257943","customUrlParams":"","layoutVersion":180511331159,"layoutName":"Real Madrid Responsive-2022","isClientRedayToRedirect":true,"isBeforeOrIdle":false}',
    method: "POST",
    mode: "cors",
  },
)
  .then((r) => r.json())
  .then((result) => {
    console.log(result)
  })
  .catch((e) => {
    console.log(e)
  })
