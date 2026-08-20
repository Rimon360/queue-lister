fetch(
  "https://oneboxtm.queue-it.net/spa-api/queue/oneboxtm/realmadridliga2627/b954e4e0-dabf-461d-8570-8211855cb5d4/status?cid=es-ES&l=Real+Madrid+Responsive-2022&t=https%3A%2F%2Ftickets.realmadrid.com%2Frealmadrid_futbol%2Fselect%2F2939723%3FviewCode%3DV_blockmap_view%26seid%3D4c67a6d9-b061-aa1b-afaf-b3ec89dbd735%26sets%3D1787242998766%26seid%3D0b61f242-8343-1e09-bfdb-b0dad6edecd9%26sets%3D1787243099687%26seid%3Dca8f40b7-b438-8560-ce19-58c61c877e2d%26sets%3D1787243231598%26seid%3D4e17176a-e214-d8dc-8781-449b26820bef%26sets%3D1787243257943&seid=9a554cc8-48a5-0894-a686-80bfcf11f94f&sets=1787243298430",
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
      Cookie: " Queue-it-oneboxtm____________realmadridliga2627=Qid=b954e4e0-dabf-461d-8570-8211855cb5d4&Cid=es-ES&f=0;queueitsoftblock_b954e4e0-dabf-461d-8570-8211855cb5d4=3bv6YFfoLwWYx/MLiRXGEUbjhOphAFlnYnRpHD3IQ3Y=;Queue-it-b954e4e0-dabf-461d-8570-8211855cb5d4=uifh=5pQUVmVv0SThSjK_CJnaQ0dpNzlRdWPbQmMYrAA23_U&WasRedirected=false&i=639228397985587408;Queue-it-visitorsession=GjJ4aESmrtzADa391kg78IPabke3jHwjmiutNecNnjMn6yMK7j7WfDS1iPvCyrq8R_amAB3JAzc04_LfJmGUF6HSnFfpu2m1uFUKAnY7TyOn06qr_Df06oalxDHR1pqi9qfgHNsbRPRHNsG8T5UUlKUrLqgxT4wV1GlNCmKW565dSywV_t560QhnzPSbvIJCdkVrlaAXKVL0dlbNcUGStqrR1IqiWsDgODTDCbxND6Xt2OCH3ppoJ0-739d4osqEDujMUiqH3oUZr-hKzN6tB-MALXrGNurLtqed2z34qwvou5D6X37ReEtCYmExtHDxZLCmuEut35IreA-zCruhx7Q3eWgWWyE3XW-Te0nfYFbL0U0ryr6j8-l-v9Y0nxjeJaAzLROKReufgXOY9PtCP3GeZs8W9X8;  ",
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
