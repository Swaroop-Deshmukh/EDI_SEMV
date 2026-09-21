// Find vendor pairs that participated in the same tender.
// This is a risk indicator for repeated co-bidding,
// not proof of collusion.

MATCH (v1:Vendor)<-[:SUBMITTED_BY]-(b1:Bid)<-[:HAS_BID]-(t:Tender)
      -[:HAS_BID]->(b2:Bid)-[:SUBMITTED_BY]->(v2:Vendor)
WHERE v1.vendor_id < v2.vendor_id
RETURN
    v1.name AS vendor_1,
    v2.name AS vendor_2,
    count(DISTINCT t) AS tenders_together
ORDER BY tenders_together DESC;