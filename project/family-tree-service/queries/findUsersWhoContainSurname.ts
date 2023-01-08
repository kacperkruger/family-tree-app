const findUsersWhoContainSurname = 'MATCH (user: User)-[:OWNS]->(a:Person)\n' +
    'WITH user, collect(a.surname) AS familyTreeSurnames\n' +
    'WHERE all(surname IN $listOfSurname WHERE surname IN familyTreeSurnames)\n' +
    'RETURN user.userId AS userId';

export default findUsersWhoContainSurname;