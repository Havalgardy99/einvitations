import { useEffect, useState, type FormEvent } from "react";
import type { GuestbookEntry, InvitationTemplate, RSVP } from "../../types";
import { api } from "../../api/client";
import { apiUrl } from "../../api/base";

export function useInvitationCore(slug: string, config: InvitationTemplate) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [attendingCount, setAttendingCount] = useState(0);
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    isAttending: true,
    guestsCount: 1,
    dietaryRestrictions: "",
    favoriteSong: ""
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [comments, setComments] = useState<GuestbookEntry[]>([]);
  const [guestbookForm, setGuestbookForm] = useState({
    name: "",
    message: "",
    emoji: "❤️"
  });

  useEffect(() => {
    const target = new Date(config.countdownDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [config.countdownDate]);

  useEffect(() => {
    fetch(apiUrl(`/api/invitations/${slug}/rsvps`))
      .then((r) => (r.ok ? r.json() : []))
      .then((list: { name: string }[]) => setAttendingCount(list.length))
      .catch(() => {});
  }, [slug, rsvpSubmitted]);

  useEffect(() => {
    api.getGuestbook(slug).then(setComments).catch(() => setComments([]));
  }, [slug]);

  const handleRSVPSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;
    try {
      const entry = await api.submitRsvp(slug, {
        name: rsvpForm.name.trim(),
        isAttending: rsvpForm.isAttending,
        guestsCount: rsvpForm.isAttending ? rsvpForm.guestsCount : 0,
        dietaryRestrictions: rsvpForm.dietaryRestrictions.trim(),
        favoriteSong: rsvpForm.favoriteSong.trim()
      });
      if (entry.isAttending) setAttendingCount((c) => c + 1);
      setRsvpSubmitted(true);
      setTimeout(() => {
        setRsvpSubmitted(false);
        setRsvpForm({
          name: "",
          isAttending: true,
          guestsCount: 1,
          dietaryRestrictions: "",
          favoriteSong: ""
        });
      }, 2500);
    } catch {
      /* demo or offline */
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!guestbookForm.name.trim() || !guestbookForm.message.trim()) return;
    try {
      const entry = await api.submitGuestbook(slug, {
        name: guestbookForm.name.trim(),
        message: guestbookForm.message.trim(),
        emoji: guestbookForm.emoji
      });
      setComments([entry, ...comments]);
      setGuestbookForm({ name: "", message: "", emoji: "❤️" });
    } catch {
      /* demo */
    }
  };

  return {
    timeLeft,
    attendingCount,
    rsvpForm,
    setRsvpForm,
    rsvpSubmitted,
    handleRSVPSubmit,
    comments,
    guestbookForm,
    setGuestbookForm,
    handleCommentSubmit
  };
}
