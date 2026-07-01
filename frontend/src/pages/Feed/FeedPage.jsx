import { useState, useEffect } from "react"
import { authClient } from "../../services/authentication"
import { getMyProfile } from "../../services/userProfile"

import NavBar from "../../components/NavBar"
import Recommendations from "../../components/Recommendations"
import EventFeedSection from "../../components/EventFeedSection"
import Footer from "../../components/Footer"

export function FeedPage() {
  const { data: session, isPending } = authClient.useSession()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setProfileLoading[false]
      return;
    }
    getMyProfile()
      .then(({ profile }) => {
        setProfile(profile)})
      .catch((err) => console.error(err))
      .finally(() => setProfileLoading(false))

  }, [isPending,session])

  if (isPending) return <p>Loading...</p>

  return (
    <>
      <NavBar />
      <div className="w-full h-fit bg-primary flex flex-col p-20 gap-5">
      <p className="text-5xl text-muted font-bold">EVENTS</p>
      <p className="text-2xl text-muted-foreground font-medium">Browse whats coming up, or follow artists for tailord picks.</p>
      </div>
      {session && !profileLoading && <Recommendations profile={profile} />}
      <EventFeedSection profile={profile} isLoggedIn={!!session} />
      <Footer />
    </>
  )
}