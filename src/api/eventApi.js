import firebase from 'firebase/app';
import _ from 'lodash';

export function participate(eventId, userId, firstName, lastName) {
  return firebase.update(`participations/${eventId}/${userId}`, { userId, date: new Date(), firstName, lastName });
}

export function adminparticipate(eventId, user) {
  const userId = user.key;
  const { firstName, lastName } = user.value;
  return firebase.update(`participations/${eventId}/${userId}`, { userId, date: new Date(), firstName, lastName });
}

export function cancelParticipation(tournamentid, userid) {
  return firebase.remove(`participations/${tournamentid}/${userid}`, userid);
}

export function checkParticipation(userid, tournamentid, participations) {
  if (participations && !participations.isEmpty) {
    const alreadyParticipated = Boolean(_.get(participations, `${tournamentid}.${userid}`));
    return alreadyParticipated;
  }
  return false;
}

export function participantCount(tournamentid, participations) {
  if (participations) {
    let participantNumber = 0;
    Object.entries(participations).forEach((participationentry) => {
      if (participationentry[0] === tournamentid) {
        participantNumber = Object.entries(participationentry[1]).length;
      }
    });
    return parseInt(participantNumber, 10);
  }
  return 0;
}
