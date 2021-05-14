import firebase from "firebase/app";
import _ from "lodash";
import { User, Participation } from "../models/ReduxState";

export function participate(
  eventId: string,
  userId: string,
  firstName: string,
  lastName: string
) {
  return firebase.update(`participations/${eventId}/${userId}`, {
    userId,
    date: new Date(),
    firstName,
    lastName
  });
}

export function adminparticipate(
  eventId: string,
  user: { key: string; value: User } | undefined
) {
  if (!user) {
    return null;
  }
  const userId = user.key;
  const { firstName, lastName } = user.value;
  return firebase.update(`participations/${eventId}/${userId}`, {
    userId,
    date: new Date(),
    firstName,
    lastName
  });
}

export function cancelParticipation(tournamentid: string, userid: string) {
  return firebase.remove(`participations/${tournamentid}/${userid}`, userid);
}

export function checkParticipation(
  userid: string,
  tournamentid: string,
  participations: { [key: string]: Participation }
) {
  if (participations && !participations.isEmpty) {
    const alreadyParticipated = Boolean(
      _.get(participations, `${tournamentid}.${userid}`)
    );
    return alreadyParticipated;
  }
  return false;
}

export function participantCount(
  tournamentid: string,
  participations: { [key: string]: Participation }
) {
  if (participations) {
    let participantNumber = 0;
    Object.entries(participations).forEach(participationentry => {
      if (participationentry[0] === tournamentid) {
        participantNumber = Object.entries(participationentry[1]).length;
      }
    });
    return parseInt(`${participantNumber}`, 10);
  }
  return 0;
}
