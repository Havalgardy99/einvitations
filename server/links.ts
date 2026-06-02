export interface InvitationLinks {
  /** Full invitation with seal animation */
  main: string;
  /** RSVP + guestbook wishes on one page */
  guest: string;
}

/** Relative paths — frontend adds window.location.origin when copying */
export function buildLinks(slug: string): InvitationLinks {
  return {
    main: `/i/${slug}`,
    guest: `/i/${slug}/guest`
  };
}
