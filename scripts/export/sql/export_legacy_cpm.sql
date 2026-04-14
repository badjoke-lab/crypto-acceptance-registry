-- Export legacy CPM datasets into JSON arrays.
-- Run each query separately and write the result body to the matching file in data/inbox/.

-- 1) places.json
SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
FROM (
  SELECT
    id,
    name,
    country,
    city,
    website,
    about,
    "paymentNote"
  FROM places
  ORDER BY id
) t;

-- 2) payment_accepts.json
SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
FROM (
  SELECT
    place_id,
    asset,
    chain,
    method,
    processor,
    note
  FROM payment_accepts
  ORDER BY place_id, asset, chain, method
) t;

-- 3) socials.json
SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
FROM (
  SELECT
    place_id,
    platform,
    url,
    handle
  FROM socials
  ORDER BY place_id, platform
) t;

-- 4) verifications.json
SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
FROM (
  SELECT
    place_id,
    status,
    last_checked,
    last_verified
  FROM verifications
  ORDER BY place_id
) t;
