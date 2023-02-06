const ifPersonAndChildsParentArePartners = 'MATCH (child: Person {id: $childId})\n' +
    'MATCH (futureParent: Person {id: $personId})\n' +
    'OPTIONAL MATCH (currentParent: Person)<-[:CHILD_OF]-(child)\n' +
    'RETURN CASE WHEN currentParent IS NOT NULL THEN EXISTS( (currentParent)-[:PARTNERS]-(futureParent) ) ELSE true END as ifParentsArePartners';
export default ifPersonAndChildsParentArePartners;