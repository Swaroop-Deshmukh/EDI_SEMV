// Find vendors that share the same recorded address.
// This is a risk indicator for further investigation,
// not proof of any improper relationship.

MATCH (v1:Vendor), (v2:Vendor)
WHERE v1.vendor_id < v2.vendor_id
  AND v1.address IS NOT NULL
  AND v1.address = v2.address
RETURN
    v1.name AS vendor_1,
    v2.name AS vendor_2,
    v1.address AS shared_address;