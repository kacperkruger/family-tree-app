import type { Person, PersonResponse } from "@/data/person";

const parsePersonResponse = (personResponse: PersonResponse): Person => {
  return {
    id: personResponse.id,
    name: personResponse.name,
    surname: personResponse.surname,
    dateOfBirth: personResponse.dateOfBirth,
    gender: personResponse.gender.toLowerCase(),
    pids: personResponse.partners,
    fid: personResponse.parents[0],
    mid: personResponse.parents[1],
    parents: personResponse.parents,
    optionalParents: personResponse.optionalParents,
  };
};

export default parsePersonResponse;
