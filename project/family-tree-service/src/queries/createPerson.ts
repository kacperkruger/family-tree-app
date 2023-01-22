const createPerson =
    'MERGE (user: User {userId: $userId})\n' +
    'CREATE (user)-[:OWNS]->(createdPerson :PersonResponse {id: randomUUID(), name: $name, surname: $surname, gender: $gender, dateOfBirth: date($dateOfBirth)})\n' +
    'RETURN createdPerson.id AS id, createdPerson.name AS name, createdPerson.surname AS surname, createdPerson.gender as gender, createdPerson.dateOfBirth AS dateOfBirth, collect(NULL) AS parents, collect(null) AS partners';

export default createPerson;