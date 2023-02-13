const findUsersWhoContainSurnamesWithDateOfBirth = 'MATCH (user: User)-[:OWNS]->(a:Person { dateOfBirth: $dateOfBirth })\n' +
    'WITH user, collect(a.surname) AS familyTreeSurnames\n' +
    'WHERE all(surname IN $listOfSurname WHERE surname IN familyTreeSurnames)\n' +
    'RETURN user.userId AS userId';

export default findUsersWhoContainSurnamesWithDateOfBirth;